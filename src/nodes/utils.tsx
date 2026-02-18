import TableNode from "./TableNode";
import TransformationNode from "./TransformationNode";
import WarehouseNode from "./WarehouseNode";
import {
  BadgeQuestionMark,
  Binary,
  Calendar,
  CalendarClock,
  CaseLower,
  DecimalsArrowRight,
  Hash,
} from "lucide-react";

export const getIconFromDataType = (datatype: string) => {
  const cleanDatatype = datatype.replace(/([0-9(),]|max)+/, "");
  switch (cleanDatatype) {
    case "bit":
      return <Binary />;
    case "int":
    case "smallint":
    case "bigint":
      return <Hash />;
    case "float":
    case "decimal":
      return <DecimalsArrowRight />;
    case "nvarchar":
    case "varchar":
      return <CaseLower className="w-5 h-5" />;
    case "date":
      return <Calendar className="w-5 h-5" strokeWidth={1.5} />;
    case "datetime":
      return <CalendarClock className="w-5 h-5" strokeWidth={1.5} />;
    default:
      return <BadgeQuestionMark />;
  }
};

export const flowNodeTypes = {
  table: TableNode,
  warehouse: WarehouseNode,
  transformation: TransformationNode,
};

export const clsx = (...cls: (string | undefined)[]) => cls.join(" ");
