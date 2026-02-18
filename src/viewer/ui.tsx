import { useDataStore } from "@/data/state";
import type { Table, Warehouse } from "@/lib/schema";
import {
  Eye,
  FolderIcon,
  List,
  Plus,
  Search,
  Settings,
  Table as TableIcon,
} from "lucide-react";
import { components, type DropdownIndicatorProps } from "react-select";
import AsyncSelect from "react-select/async";
// import { debounce } from "radash";
import { useMemo, useState } from "react";
import { ProjectsModal } from "@/projects/ProjectsModal";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  redrawCallback: () => void;
};

const DropdownIndicator = (
  props: DropdownIndicatorProps<{ label: string; value: string }, true>
) => {
  return (
    <components.DropdownIndicator {...props}>
      <Search />
    </components.DropdownIndicator>
  );
};

const getFilterSelectOptions = (
  mode: "tables" | "fields",
  warehousesOrTables: Warehouse[] | Table[]
) => {
  if (mode === "fields") {
    return (warehousesOrTables as Table[])
      .map((table) => ({
        label: `${table.name} (${table.warehouse?.name})`,
        options: table.fields.map((table) => ({
          label: table.name,
          value: table.id,
        })),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  return (warehousesOrTables as Warehouse[]).map((warehouse) => ({
    label: warehouse.name,
    options: warehouse.tables.map((table) => ({
      label: table.name,
      value: table.id,
    })),
  }));
};

export default function UI(props: Props) {
  const { warehouses, tables, fields, setSettings, settings } = useDataStore(
    (state) => state
  );
  const [isProjectsModalOpen, setProjectsModalOpen] = useState(false);

  const [, setSearch] = useState("");
  // const onFind = debounce({ delay: 500 }, (e) =>
  //   setSettings({ ...settings, search: e.target.value })
  // );
  const filterSelectOptions = useMemo(
    () =>
      getFilterSelectOptions(
        settings.mode,
        settings.mode === "tables" ? warehouses : tables
      ),
    [settings.mode, tables, warehouses]
  );

  return (
    <>
      <ProjectsModal
        isOpen={isProjectsModalOpen}
        onClose={() => setProjectsModalOpen(false)}
      />
      <div className="ui print:hidden">
        <div className="flex flex-row gap-4 place-content-end w-full p-1">
          {/* <div className="flex flex-row gap-2 place-content-center">
            <label htmlFor="search-box" className="my-auto">
              Find:{" "}
            </label>
            <input
              id="search-box"
              className="bg-white shadow rounded-full p-2 px-4"
              type="text"
              onChange={onFind}
            />
          </div> */}

          <ButtonGroup>
            <Button
              onClick={() => {
                setSettings({
                  ...settings,
                  mode: "tables",
                });
                props.redrawCallback();
              }}
              variant={settings.mode === "tables" ? "default" : "outline"}
            >
              <TableIcon size={18} /> Tables
            </Button>
            <Button
              onClick={() => {
                setSettings({
                  ...settings,
                  mode: "fields",
                });
                props.redrawCallback();
              }}
              variant={settings.mode === "fields" ? "default" : "outline"}
            >
              <List size={18} /> Fields
            </Button>
          </ButtonGroup>

          <Button onClick={() => setProjectsModalOpen(true)}>
            <FolderIcon /> Projects
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Settings />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Nodes</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={settings.transformations}
                  onCheckedChange={(checked) => {
                    setSettings({
                      ...settings,
                      transformations: checked,
                    });
                    props.redrawCallback();
                  }}
                >
                  <Eye />
                  Detailed view
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <button
            className="button"
            onClick={() => {
              setSettings({
                ...settings,
                selection: [...new Set(tables.map((table) => table.id))],
              });
              props.redrawCallback();
            }}
          >
            Reset
          </button> */}
        </div>
        <div className="container">
          <AsyncSelect
            defaultValue={filterSelectOptions
              .flatMap((o) => o.options)
              .filter(
                (o) => settings.selection?.findIndex((e) => e === o.value) != -1
              )}
            value={filterSelectOptions
              .flatMap((o) => o.options)
              .filter(
                (o) => settings.selection?.findIndex((e) => e === o.value) != -1
              )}
            isMulti
            defaultOptions={filterSelectOptions
              .map((option) => ({
                label: option.label,
                options: option.options,
              }))
              .slice(0, 100)}
            loadOptions={async (inputValue: string) => {
              const searched = await filterSelectOptions
                .map((option) => ({
                  label: option.label,
                  options: option.options.filter(
                    (o2) =>
                      o2.label
                        .toLowerCase()
                        .includes(inputValue.toLowerCase()) ||
                      option.label
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                  ),
                }))
                .filter((option) => option.options.length != 0);
              return searched.slice(0, 50);
            }}
            onInputChange={(newValue: string) => {
              setSearch(newValue);
            }}
            onChange={(selected) => {
              setSettings({
                ...settings,
                selection: selected
                  .map(
                    (v) =>
                      (settings.mode === "tables" ? tables : fields).find(
                        (t) => t.id === v.value
                      )?.id
                  )
                  .filter((t) => t != undefined),
              });
              props.redrawCallback();
            }}
            className="select"
            styles={{
              control: () => ({}),
              multiValueLabel: () => ({}),
              multiValue: () => ({}),
              multiValueRemove: () => ({}),
              option: () => ({}),
              menuList: () => ({}),
              menu: () => ({}),
            }}
            classNames={{
              //   option: () => "bg-black",
              multiValueRemove: () =>
                "rounded-lg cursor-pointer hover:bg-gray-200 transition-colors h-5 my-auto px-0.5 flex flex-col justify-center",
              multiValueLabel: () =>
                "text-sm px-3 py-0.5 rounded-2xl content-center",
              multiValue: () =>
                "bg-transparent flex flex-row content-center relative",
              option: () => "text-sm hover:bg-gray-100 px-4 py-0.5",
              menu: () => "rounded-xl shadow bg-white mt-4",
              menuList: () => "overflow-scroll h-max max-h-256 rounded-xl",
              //   menuList: () => "bg-blue-200",
              container: () => "rounded space-2",
              control: () =>
                "rounded-xl focus:rounded-xl shadow bg-white flex flex-row px-1",
              noOptionsMessage: () =>
                "bg-white absolute left-0 right-0 rounded-xl",
            }}
            components={{ DropdownIndicator, CrossIcon: () => <Plus /> }}
          />
        </div>
      </div>
    </>
  );
}
