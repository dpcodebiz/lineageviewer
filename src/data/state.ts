import type {
  Field,
  Objects,
  Relation,
  Table,
  Transformation,
  Warehouse,
} from "@/lib/schema";
import { create } from "zustand/react";
import { defaultSettings, type Settings } from "./settings";

export const useDataStore = create<DataStore>((set) => ({
  objects: {},
  tables: [],
  fields: [],
  warehouses: [],
  transformations: [],
  relations: [],
  relationsToggled: [],
  tablesToggled: [],
  settings: defaultSettings,
  setSettings: (settings: Settings) => set((state) => ({ ...state, settings })),
  set: (dataStore: DataStoreAttributes) =>
    set((state) => ({ ...state, ...dataStore })),
}));

type DataStoreAttributes = {
  objects: Objects;
  tables: Table[];
  fields: Field[];
  warehouses: Warehouse[];
  transformations: Transformation[];
  relations: Relation[];
  relationsToggled: Relation[];
  tablesToggled: Table[];
  settings: Settings;
};

type DataStore = DataStoreAttributes & {
  set: (_: DataStoreAttributes) => void;
  setSettings: (_: Settings) => void;
};
