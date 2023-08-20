import { ClientTableKeys } from '../utils/client.interface';

export interface ITableColumn {
  name: string;
  rawKey: ITableSupportedKeys;
}

export interface ITableHeader {
  columns: ITableColumn[];
}

export interface ITableRow {
  id: string;
  cells: ITableCell[];
  children: ITableRow[];
  isCollapsed: boolean;
}

export interface ITableCell {
  id: string;
  value: string | number;

  /**
   * If the row has children and is collapsable,
   * this property is going to decide where
   * the collapse arrow is going to be shown in the
   * row.
   */
  showCollapseIndicator: boolean;
  shouldPad: boolean;
}

export interface ITableConfig {
  header: ITableHeader;
  rows: ITableRow[];
}

// Expand the Table Supported keys with the model defined
// keys when needed. This solution works with union types and
// it's also scalable.
export type ITableSupportedKeys = ClientTableKeys;
