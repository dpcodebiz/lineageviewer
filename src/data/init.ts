import { loadData } from "./load";
import { defaultSettings } from "./settings";
import { useDataStore } from "./state";

export const loadState = async () => {
  const { set } = useDataStore.getState();
  const { objects, tables, fields, warehouses, transformations, relations } =
    await loadData();

  // Set all data
  set({
    objects,
    tables,
    fields,
    warehouses,
    transformations,
    relations,
    relationsToggled: relations.filter(
      // By default show only table-table relations
      (r) =>
        (defaultSettings.mode === "tables"
          ? r.type != "table-table"
          : r.type != "field-field") && r.type != "warehouse-table"
    ),
    tablesToggled: [],
    settings: {
      ...defaultSettings,
      mode: "fields",
    },
  });
};
