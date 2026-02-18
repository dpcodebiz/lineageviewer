export type Settings = {
  selection: string[]; // Either list of table ids or field ids
  search: string;
  highlight: string | undefined;
  mode: "tables" | "fields";
  transformations: boolean;
};

export const defaultSettings: Settings = {
  selection: [],
  search: "",
  highlight: undefined,
  mode: "tables",
  transformations: false,
};

export type Styles = {
  [index: string]: string;
};
