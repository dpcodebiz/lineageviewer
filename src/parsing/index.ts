import { crash } from "@/lib/debug";
import type {
  Condition,
  Field,
  Objects,
  Relation,
  Table,
  Transformation,
  Warehouse,
} from "@/lib/schema";
import { v4 } from "uuid";

/**
 * Iterates over tables and links all fields
 * @param tables
 * @param fields
 * @returns
 */
export const linkTablesWithFields = (fields: Field[], objects: Objects) => {
  for (const field of fields) {
    const table = objects[field.table_id] as Table;

    if (table == undefined) {
      crash("can't find table with given table_id", [field, objects]);
    }

    // Linking
    field.table = table;
    table.fields.push(field);
  }
};

/**
 * Links all warehouses with appropriate tables with 2 possible cases
 * @param warehouses
 * @param tables
 * @returns
 */
export const linkWarehousesWithTables = (
  warehouses: Warehouse[],
  tables: Table[]
) => {
  warehouses.forEach((w) => {
    // Getting all tables linked to this warehouse through the connection
    const warehouseTables = tables
      .filter((t) => t.warehouse_id === w.id)
      .map((t) => {
        t.warehouse_id = w.id;
        t.warehouse = w;
        return t;
      });

    w.tables = warehouseTables;
  });
};

/**
 * Detects field-field relations for which a transformation occurs in-between and replaces them
 * with field-transformation relations.
 * @param fields
 * @param transformations
 */
export function resolveFieldTransformationRelations(
  relations: Relation[],
  transformations: Transformation[]
) {
  const relationsToReplace = relations.filter(
    (relation) =>
      relation.type === "field-field" &&
      transformations.findIndex(
        (transformation) => transformation.field_id === relation.to_id
      ) != -1
  );
  const relationIdsToRemove = relationsToReplace.map((relation) => relation.id);
  relations = relations.filter(
    (relation) => !relationIdsToRemove.includes(relation.id)
  );

  // Adding all field-transformation relations
  relationsToReplace.forEach((relation) => {
    transformations
      .filter((transformation) => transformation.field_id === relation.to_id)
      .forEach((transformation) => {
        relations.push({
          ...relation,
          to_id: transformation.id,
          type: "field-transformation",
        });
      });
  });

  return relations;
}

export function linkConditionsWithTransformations(
  conditions: Condition[],
  objects: Objects
) {
  conditions.forEach((condition) => {
    const transformation = objects[
      condition.transformation_id
    ] as Transformation;

    /**
     * This will happen for conditions on lookups in TX. It is not handled for now
     */
    if (transformation == undefined) {
      //   crash("can't find transformation", [condition, objects]);
      return;
    }

    condition.transformation = transformation;
    transformation?.conditions?.push(condition);
  });
}

export function getViewsTablesRelations(
  tables: Table[],
  warehouses: Warehouse[]
) {
  const relations: Relation[] = [];

  for (const tableOrView of tables) {
    if (tableOrView.definition === undefined || tableOrView.definition === "")
      continue;
    const view = tableOrView;

    const regexWithWarehouse =
      /(?:(?:LEFT JOIN )|(?:from ))\[(\w+)\]\.\[(\w+)\]/gi;
    const regexWithoutWarehouse = /(?:(?:LEFT JOIN )|(?:from ))\[?(\w+)\]?/gi;
    const matches = [
      ...view.definition.matchAll(regexWithWarehouse),
      ...view.definition.matchAll(regexWithoutWarehouse),
    ];

    // console.log(view, matches);

    const r = matches
      .map((v) => {
        const warehouse_name = v.length === 3 ? v[1] : view.warehouse?.name;
        const table_name = v.length === 3 ? v[2] : v[1];

        const warehouse = warehouses.find(
          (warehouse) => warehouse.name == warehouse_name
        );
        const table = warehouse?.tables.find(
          (table) => table.name === table_name
        );

        if (!table) return;

        // if (view.name === "V_D_DATE_MONTH")
        //   console.log(
        //     view.fields
        //       .map((viewField) => [
        //         viewField,
        //         table.fields.find(
        //           (sourceField) => sourceField.name === viewField.name
        //         ),
        //       ])
        //       .filter((e) => e[1] != undefined)
        //   );

        return [
          {
            id: v4(),
            from_id: table.id,
            to_id: view.id,
            name: "",
            data: undefined,
            type: "table-table",
          },
          ...view.fields
            .map((viewField) => [
              viewField,
              table.fields.find(
                (sourceField) => sourceField.name === viewField.name
              ),
            ])
            .filter((e) => e[1] != undefined)
            .map(([viewField, sourceField]) => ({
              id: v4(),
              from_id: sourceField?.id,
              to_id: viewField?.id,
              name: "",
              data: undefined,
              type: "field-field",
            })),
        ] as Relation[];
      })
      .filter((r) => r != undefined);

    relations.push(...r.flat());
  }

  return relations;
}

export function getMeasuresFieldsRelations(
  tables: Table[],
  fields: Field[],
  relations: Relation[]
) {
  return [];
  const outputRelations: Relation[] = [];

  for (const fieldOrMeasure of fields) {
    if (fieldOrMeasure.script === "") continue;

    //
    const measure = fieldOrMeasure;
    const table = measure.table;
    const sourceTables = relations
      .filter((r) => r.type === "table-table" && r.to_id === table?.id)
      .map((r) => tables.find((t) => t.id === r.from_id))
      .filter((t) => t != undefined);

    // Getting fields in measure definition
    const regexFields = /\[(\w+)\]/gi;
    const matches = [...measure.script.matchAll(regexFields)];

    const r = matches
      .map((v) => {
        const fieldName = v[1];
        const sourceFields = sourceTables
          .map((t) => t.fields.find((f) => f.name === fieldName))
          .filter((e) => e != undefined);
        const sourceField = sourceFields[0];
        console.log(sourceTables, table);

        if (!sourceField) return;

        return {
          id: v4(),
          from_id: sourceField.id,
          to_id: measure.id,
          name: "",
          data: undefined,
          type: "field-field",
        } as Relation;
      })
      .filter((r) => r != undefined);

    // console.log(measure, table, sourceTables, matches, r);

    continue;

    outputRelations.push(...r);
  }

  return outputRelations;
}
