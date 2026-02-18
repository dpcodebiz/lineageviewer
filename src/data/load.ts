import type { Model } from "@/lib/schema";
import { type TxObject, txParsers } from "@/parsing/tx/types";
import { storeParserResult } from "@/parsing/types";
import {
  linkTablesWithFields,
  linkWarehousesWithTables,
  linkConditionsWithTransformations,
  resolveFieldTransformationRelations,
  getViewsTablesRelations,
  getMeasuresFieldsRelations,
} from "@/parsing";
import { computeWarehousesOrder } from "./utils";

import { unique } from "radash";
import { getProjectNames, getProject } from "@/projects/utils";

const LAST_OPENED_KEY = "last_opened_project";
const projects = (await getProjectNames()) as string[];
const default_project = projects[0] ?? undefined;
const defaultData =
  projects.length == 0 ? [] : await getProject(default_project);

export const getSelectedProject = () => localStorage.getItem(LAST_OPENED_KEY);

export const loadData = async (data?: TxObject[], project?: string) => {
  if (data !== undefined && project !== undefined) {
    localStorage.setItem(LAST_OPENED_KEY, project);
  } else {
    const lastOpenedProject = getSelectedProject();

    data =
      lastOpenedProject != null
        ? await getProject(lastOpenedProject)
        : defaultData;
  }

  // Type safety TODO check this
  data = data as TxObject[];

  // Loading model
  const model: Model = {
    relations: [],
    objects: {},
    fields: [],
    tables: [],
    warehouses: [],
    transformations: [],
    conditions: [],
  };
  const {
    relations,
    objects,
    fields,
    tables,
    warehouses,
    transformations,
    conditions,
  } = model;

  // Parsing all objects
  data?.forEach((obj) => {
    storeParserResult(txParsers[obj.type]?.(obj.data as never, objects), model);
  });

  // Linking
  linkTablesWithFields(fields, objects);
  linkWarehousesWithTables(warehouses, tables);
  linkConditionsWithTransformations(conditions, objects);
  relations.push(...getViewsTablesRelations(tables, warehouses));
  relations.push(...getMeasuresFieldsRelations(tables, fields, relations));

  // Sort all table fields
  tables.forEach((table) =>
    table.fields.sort((a, b) => a.name.localeCompare(b.name))
  );

  // Detecting field-field and transformation-field and converting them to field-transformation-field
  relations.splice(
    0,
    relations.length,
    ...resolveFieldTransformationRelations(relations, transformations)
  );

  // Removing duplicate relations
  relations.splice(
    0,
    relations.length,
    ...unique(relations, (r) => `${r.from_id}-${r.to_id}`)
  );

  // Post processing
  computeWarehousesOrder(warehouses);

  return { objects, fields, tables, warehouses, transformations, relations };
};
