import type { TxObject } from "@/parsing/tx/types";
import {
  deleteFromIndexedDB,
  getFromIndexedDB,
  getKeysFromIndexedDB,
  saveToIndexedDB,
} from "./storage";

export interface Project {
  name: string;
  created_at: Date;
  data: TxObject[];
}

export interface TxXMLObject {
  type: string;
  data: Record<string, string>;
}

// proxy
export async function saveProject(name: string, value: unknown) {
  return await saveToIndexedDB(name, value);
}

// proxy
export async function getProject(name: string) {
  return ((await getFromIndexedDB(name)) as Project)?.data;
}

export async function getProjectNames() {
  return (await getKeysFromIndexedDB()) as string[];
}

export async function deleteProject(name: string) {
  return await deleteFromIndexedDB(name);
}

/** Reads a Timextender project file and converts it to a json object ready to be parsed by the system */
export function convertTxProjectData(xmlContent: string): TxXMLObject[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, "application/xml");

  const objects: TxXMLObject[] = [];

  function addElements(tagName: string) {
    const elements = xmlDoc.getElementsByTagName(tagName);

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const fields: Record<string, string> = {};

      for (let j = 0; j < el.children.length; j++) {
        const child = el.children[j];
        fields[child.tagName] = child.textContent || "";
      }

      objects.push({
        type: tagName,
        data: fields,
      });
    }
  }

  // Order is important
  addElements("DataSources");
  addElements("DataWarehouses");
  addElements("DataTables");
  addElements("DataFields");
  addElements("DataMovementRelations");
  addElements("DataWarehouseMappingTables");

  addElements("SemanticLayerModels");
  addElements("SemanticLayerTables");
  addElements("SemanticLayerFields");
  addElements("SemanticLayerMeasures");

  addElements("TableInserts");
  addElements("Transformations");
  addElements("Conditions");

  addElements("Views");
  addElements("ViewDefinitions");

  addElements("SqlServerConnections");

  addElements("LookupFields");
  addElements("SemanticLayerMeasureCustomScripts");

  return objects;
}
