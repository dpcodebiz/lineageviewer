import type { Objects, Table } from "@/lib/schema";
import type { ParserResult } from "../types";
import { crash } from "@/lib/debug";

export interface TxViewDefinition {
  ViewDefinitionId: string;
  Definition: string;
}

export function parseTxViewDefinition(
  viewDefinition: TxViewDefinition,
  objects: Objects
): ParserResult {
  const view: Table = objects[viewDefinition.ViewDefinitionId] as Table;

  // console.log(view);

  // Should not happen
  if (view === undefined) {
    crash("Could not link view definition to view", viewDefinition, objects);
  }

  // Setting definition
  view.definition = viewDefinition.Definition;

  return {};
}
