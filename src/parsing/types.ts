import { crash } from "@/lib/debug";
import type {
  Condition,
  Field,
  Model,
  Relation,
  Table,
  Transformation,
  Warehouse,
} from "@/lib/schema";

export type ParserResult = {
  warehouses?: Warehouse[];
  tables?: Table[];
  fields?: Field[];
  relations?: Relation[];
  conditions?: Condition[];
  transformations?: Transformation[];
};

export function storeParserResult(result: ParserResult, model: Model) {
  Object.keys(result).forEach((key) => {
    if (result[key as keyof ParserResult] == undefined) {
      crash("result[key] is undefined", [result[key as keyof ParserResult]]);
      return;
    }

    model[key as keyof ParserResult].push(
      ...(result[key as keyof ParserResult] as never[])
    );
  });
}
