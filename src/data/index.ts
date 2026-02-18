import { useDataStore } from "./state";
import type { Edge } from "@xyflow/react";
import type {
  Field,
  Objects,
  Relation,
  Table,
  Transformation,
} from "@/lib/schema";
import { v4 } from "uuid";
import type { ZNode } from "@/viewer/utils";
// import { crash } from "@/lib/debug";

export const getEdges = () => {
  const { settings, tables, fields, relations, objects } =
    useDataStore.getState();

  const { lineageRelations } = getLineage(
    settings.mode,
    (settings.mode === "tables" ? tables : fields).filter((e) =>
      settings.selection.includes(e.id)
    ) as Table[] | Field[],
    objects,
    relations
  );
  lineageRelations.push(
    ...(lineageRelations
      .filter((r) => r.type === "field-transformation")
      .map((r) => ({
        id: v4(),
        from_id: r.to_id,
        to_id: (objects[r.to_id] as Transformation).field_id,
        type: "transformation-field",
      })) as Relation[])
  );

  return lineageRelations
    .filter((relation) => {
      return settings.mode === "tables"
        ? relation.type === "table-table"
        : true;
    })
    .map((relation) => ({
      id: relation.id,
      source:
        relation.type === "field-field" ||
        relation.type === "field-transformation"
          ? (objects[relation.from_id] as Field)?.table_id
          : relation.from_id,
      target:
        relation.type === "field-field" ||
        relation.type === "transformation-field"
          ? (objects[relation.to_id] as Field)?.table_id
          : relation.to_id,
      sourceHandle: `${relation.from_id}-s`,
      targetHandle: `${relation.to_id}-t`,
      ...((relation.type === "field-field" ||
        relation.type === "field-transformation" ||
        relation.type === "transformation-field") && {
        style: {
          strokeWidth:
            objects[relation.from_id].name != objects[relation.to_id].name
              ? 2
              : 1,
          stroke:
            settings.highlight != undefined
              ? settings.highlight == relation.from_id ||
                settings.highlight == relation.to_id
                ? "#2563eb"
                : "#ddd"
              : objects[relation.from_id].name != objects[relation.to_id].name
              ? "#2563eb"
              : "#888", // insert here
        },
      }),
      //   objects[relation.from_id].name != objects[relation.to_id].name
      //     ? { style: { strokeWidth: 2, stroke: "red" } }
      //     : {})
    })) as Edge[];
};

type ExploreMode = "upstream" | "downstream";

export function getLineage(
  mode: "tables" | "fields",
  selection: Table[] | Field[],
  objects: Objects,
  relations: Relation[]
) {
  const lineageMethod = mode === "tables" ? getTablesLineage : getFieldsLineage;

  return lineageMethod(
    //@ts-expect-error TODO fix this type error
    mode === "tables" ? (selection as Table[]) : (selection as Field[]),
    objects,
    relations
  );
}

export function getTablesLineage(
  selected_tables: Table[],
  objects: Objects,
  relations: Relation[]
) {
  const tablesToExplore: [Table, ExploreMode | "both"][] = selected_tables.map(
    (table) => [table, "both"]
  );

  const lineage: (Table | Transformation)[] = [];
  const lineageIds: string[] = [];
  const lineageRelations: Relation[] = [];
  const transformations = false;

  function addToLineage(table: Table | Transformation) {
    lineage.push(table);
    lineageIds.push(table.id);

    if (table.type != "table") return;

    lineageIds.push(...(table as Table).fields.map((field) => field.id));
  }

  function getIdsForTraversal(table: Table): string[] {
    return [table.id, ...table.fields.map((f) => f.id)];
  }

  while (tablesToExplore.length > 0) {
    const [currentTable, mode] = tablesToExplore.shift() as [
      Table,
      ExploreMode | "both"
    ];
    const currentIds = getIdsForTraversal(currentTable);

    if (!lineageIds.includes(currentTable!.id)) {
      addToLineage(currentTable!);
    }

    const relationsConnected = relations.filter((relation) => {
      if (!transformations && relation.type !== "table-table") return false;

      if (mode === "both") {
        return (
          currentIds.includes(relation.to_id) ||
          currentIds.includes(relation.from_id)
        );
      } else if (mode === "upstream") {
        return currentIds.includes(relation.to_id); // only look at parents
      } else if (mode === "downstream") {
        return currentIds.includes(relation.from_id); // only look at children
      }

      return false;
    });

    // console.log(relationsConnected);

    for (const relation of relationsConnected) {
      switch (relation.type) {
        case "table-table": {
          const from_obj = objects[relation.from_id] as Table;
          const to_obj = objects[relation.to_id] as Table;

          if (
            relation.to_id === currentTable.id &&
            !lineageIds.includes(from_obj.id)
          ) {
            addToLineage(from_obj);
            tablesToExplore.push([from_obj, "upstream"]);
          }
          if (
            relation.from_id === currentTable.id &&
            !lineageIds.includes(to_obj.id)
          ) {
            addToLineage(to_obj);
            tablesToExplore.push([to_obj, "downstream"]);
          }
          if (!lineageIds.includes(relation.id)) {
            lineageIds.push(relation.id);
            lineageRelations.push(relation);
          }

          break;
        }
        case "field-transformation": {
          const from_obj = objects[relation.from_id] as Field;
          const to_obj = objects[relation.to_id] as Transformation;

          // upstream: transformation -> field -> table
          if (mode !== "downstream" && currentIds.includes(relation.to_id)) {
            if (!lineageIds.includes(from_obj.table_id)) {
              addToLineage(from_obj.table!);
              tablesToExplore.push([from_obj.table!, "upstream"]);
            }
          }

          // downstream: table/field -> transformation
          if (mode !== "upstream" && currentIds.includes(relation.from_id)) {
            if (!lineageIds.includes(to_obj.id)) {
              addToLineage(to_obj);
              // you might also want to explore further downstream from this transformation
              // if transformations can produce new tables/fields
            }
          }
          if (!lineageIds.includes(relation.id)) {
            lineageIds.push(relation.id);
            lineageRelations.push(relation);
          }

          break;
        }
        case "field-field": {
          const from_obj = objects[relation.from_id] as Field;
          const to_obj = objects[relation.to_id] as Field;

          if (from_obj == undefined || to_obj == undefined) {
            // crash("object is null", [from_obj, to_obj]);
            continue;
          }

          // upstream
          if (mode !== "downstream" && currentIds.includes(relation.to_id)) {
            if (!lineageIds.includes(from_obj.table_id)) {
              addToLineage(from_obj.table!);
              tablesToExplore.push([from_obj.table!, "upstream"]);
            }
          }

          // downstream
          if (mode !== "upstream" && currentIds.includes(relation.from_id)) {
            if (!lineageIds.includes(to_obj.table_id)) {
              addToLineage(to_obj.table!);
              tablesToExplore.push([to_obj.table!, "downstream"]);
            }
          }

          if (!lineageIds.includes(relation.id)) {
            lineageIds.push(relation.id);
            lineageRelations.push(relation);
          }
        }
      }
    }
  }

  return { lineage, lineageRelations };
}

export function getFieldsLineage(
  selected_fields: Field[],
  objects: Objects,
  relations: Relation[]
) {
  // queue starts with fields, not tables
  const fieldsToExplore: [Field, ExploreMode | "both"][] = selected_fields.map(
    (field) => [field, "both"]
  );

  const lineage: (Table | Field | Transformation)[] = [];
  const lineageIds: string[] = [];
  const lineageRelations: Relation[] = [];

  function addToLineage(obj: Table | Field | Transformation) {
    lineage.push(obj);
    lineageIds.push(obj.id);

    // if it’s a field, make sure its parent table is in lineage too
    //@ts-expect-error TODO fix this type error later
    if (obj.type === "field" && !lineageIds.includes(obj.table_id)) {
      //@ts-expect-error TODO
      lineage.push(obj.table!);
      //@ts-expect-error TODO
      lineageIds.push(obj.table_id);
    }
  }

  while (fieldsToExplore.length > 0) {
    const [currentField, mode] = fieldsToExplore.shift() as [
      Field,
      ExploreMode | "both"
    ];

    if (!lineageIds.includes(currentField.id)) {
      addToLineage(currentField);
    }

    const relationsConnected = relations.filter((relation) => {
      if (mode === "both") {
        return (
          relation.from_id === currentField.id ||
          relation.to_id === currentField.id
        );
      } else if (mode === "upstream") {
        return relation.to_id === currentField.id;
      } else if (mode === "downstream") {
        return relation.from_id === currentField.id;
      }
      return false;
    });

    for (const relation of relationsConnected) {
      switch (relation.type) {
        case "field-field": {
          const from_obj = objects[relation.from_id] as Field;
          const to_obj = objects[relation.to_id] as Field;

          // upstream
          if (mode !== "downstream" && relation.to_id === currentField.id) {
            if (!lineageIds.includes(from_obj.id)) {
              addToLineage(from_obj);
              fieldsToExplore.push([from_obj, "upstream"]);
            }
          }

          // downstream
          if (mode !== "upstream" && relation.from_id === currentField.id) {
            if (!lineageIds.includes(to_obj.id)) {
              addToLineage(to_obj);
              fieldsToExplore.push([to_obj, "downstream"]);
            }
          }

          break;
        }

        case "field-transformation": {
          const from_obj = objects[relation.from_id] as Field;
          const to_obj = objects[relation.to_id] as Transformation;

          // upstream: transformation -> field
          if (mode !== "downstream" && relation.to_id === currentField.id) {
            if (!lineageIds.includes(from_obj.id)) {
              addToLineage(from_obj);
              fieldsToExplore.push([from_obj, "upstream"]);
            }
          }

          // downstream: field -> transformation
          if (mode !== "upstream" && relation.from_id === currentField.id) {
            if (!lineageIds.includes(to_obj.id)) {
              addToLineage(to_obj);
              // ⚠️ decide if you also want to enqueue "downstream" from this transformation
            }
          }

          break;
        }

        // table-table relations don’t matter if you’re strictly at field level
      }

      // always add relation itself
      if (!lineageIds.includes(relation.id)) {
        lineageIds.push(relation.id);
        lineageRelations.push(relation);
      }
    }
  }

  return { lineage, lineageRelations };
}

export const getNodes = () => {
  const { settings, tables, fields, relations, objects } =
    useDataStore.getState();
  const selection = (settings.mode === "tables" ? tables : fields).filter((e) =>
    settings.selection.includes(e.id)
  ) as Table[] | Field[];

  const { lineage } = getLineage(settings.mode, selection, objects, relations);

  tables.forEach((table) => {
    table.fieldsShown =
      settings.mode === "tables"
        ? []
        : table.fields.filter(
            (field) => lineage.findIndex((e) => e.id == field.id) != -1
          );
  });

  return lineage
    .filter((e) => e.type != "field")
    .map((node) => ({
      id: node.id,
      position: { x: 0, y: 0 },
      data: { ...node, visible: true },
      type: node.type,
    })) as ZNode[];
};
