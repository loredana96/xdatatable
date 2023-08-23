import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { IClient } from '../utils/client.interface';
import { data } from 'src/api/mock/mock-data';
import {
  ITableCell,
  ITableColumn,
  ITableConfig,
  ITableHeader,
  ITableRow,
} from '../utils/table-config';

@Injectable({
  providedIn: 'root',
})
export class TableDataService {
  private mockData = data;

  getClients(): Observable<IClient[]> {
    return of(this.mockData);
  }

  adaptIClientToTableConfig(clients: IClient[]): ITableConfig {
    // Step 1: Extract columns based on available keys (ITableSupportedKeys)
    const tableColumns: ITableColumn[] = [
      {
        name: 'Name',
        rawKey: 'name',
      },
      {
        name: 'Type',
        rawKey: 'type',
      },
      {
        name: 'Email',
        rawKey: 'email',
      },
      {
        name: 'Phone Number',
        rawKey: 'phoneNo',
      },
      {
        name: 'Company Name',
        rawKey: 'companyName',
      },
      {
        name: 'Address',
        rawKey: 'address',
      },
    ];

    // Step 2: build the table header
    const tableHeader: ITableHeader = {
      columns: tableColumns,
      isSelected: false,
      shouldDeleteMultiple: false,
    };

    // Step 3: Build the rows.
    // 3.1: for each client, we need to create a row.
    // 3.1.1: for each table column, we need to extract the value for the "rawKey" property out of the client model and build a cell with it
    // 3.2. build the row using the cells built at 3.1.1 and return the row.
    const buildRow = (client: IClient, level: number): ITableRow => {
      const cells: ITableCell[] = tableColumns.map((tc) => {
        return {
          id: uuidv4(),
          value: client[tc.rawKey],
          showCollapseIndicator:
            tc.rawKey === 'name' && client.children.length > 0,
          shouldPad: tc.rawKey === 'name',
        };
      });
      const row: ITableRow = {
        id: uuidv4(),
        cells: cells,
        children: client.children.map((childClient) =>
          buildRow(childClient, level + 1)
        ),
        isCollapsed: true,
        isSelected: false,
        level,
        deleteAction: true,
        editAction: level === 0 ? true : false,
      };
      return row;
    };

    const rows: ITableRow[] = clients.map((client) => buildRow(client, 0));

    // Step 4: Build the final table config
    const tableConfig: ITableConfig = {
      rows: rows,
      header: tableHeader,
    };
    return tableConfig;
  }

  findRow(id: string, rows: ITableRow[]): ITableRow | undefined {
    for (const r of rows) {
      if (r.id === id) {
        return r;
      }
      const foundInChild = this.findRow(id, r.children);
      if (foundInChild) {
        return foundInChild;
      }
    }
    return undefined;
  }

  mutateRowInTableConfig(
    mutatedRow: ITableRow,
    originalTableConfig: ITableConfig
  ): ITableConfig {
    const mutateRows = (
      mutatedRow: ITableRow,
      rows: ITableRow[]
    ): ITableRow[] => {
      return rows.map((r) => {
        if (r.id === mutatedRow.id) {
          return mutatedRow;
        } else {
          return {
            ...r,
            children: mutateRows(mutatedRow, r.children),
          };
        }
      });
    };
    const mutatedTableConfig: ITableConfig = {
      header: originalTableConfig.header,
      rows: mutateRows(mutatedRow, originalTableConfig.rows),
    };

    return mutatedTableConfig;
  }

  toggleCollapsedStatus(id: string, tableConfig: ITableConfig): ITableConfig {
    let rowToMutate = this.findRow(id, tableConfig.rows);
    if (rowToMutate) {
      rowToMutate.isCollapsed = !rowToMutate.isCollapsed;
    } else {
      console.error('Fatal error, could not find row with id.');
    }
    const mutatedConfig = this.mutateRowInTableConfig(
      rowToMutate!,
      tableConfig
    );
    return mutatedConfig;
  }

  selectAll(isSelected: boolean, rows: ITableRow[]): ITableRow[] {
    return rows.map((row) => {
      return {
        ...row,
        isSelected,
        children: this.selectAll(isSelected, row.children),
      };
    });
  }

  checkIfAllRowsSelected(rows: ITableRow[]): boolean {
    let checkedAllRows = true;

    for (const row of rows) {
      if (!row.isSelected) {
        checkedAllRows = false;
        break; // Exit the loop, no need to continue checking
      }

      // Recursively check child rows if they exist
      if (row.children) {
        checkedAllRows = this.checkIfAllRowsSelected(row.children);
        if (!checkedAllRows) {
          break; // Exit the loop if any child row is not selected
        }
      }
    }
    return checkedAllRows;
  }

  checkIfAtLeastOneRowSelected(rows: ITableRow[]): boolean {
    for (const row of rows) {
      if (row.isSelected) {
        return true;
      }

      if (row.children) {
        if (this.checkIfAtLeastOneRowSelected(row.children)) {
          return true;
        }
      }
    }

    return false;
  }

  searchRecursively(value: string, rows: ITableRow[]): ITableRow[] {
    let matchedRows: ITableRow[] = [];

    for (const row of rows) {
      if (
        row.cells[0].value
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase())
      ) {
        matchedRows.push(row);
      }

      const matchedChildren = this.searchRecursively(value, row.children);
      matchedRows.push(...matchedChildren);
    }
    if (value.length === 0) {
      matchedRows = [];
    }
    return matchedRows;
  }

  searchRows(
    value: string,
    tableConfig: ITableConfig
  ): Observable<ITableConfig> {
    const searchedRows = this.searchRecursively(value, tableConfig.rows);
    const searchedTableConfig: ITableConfig = {
      ...tableConfig,
      rows: searchedRows,
    };
    return of(searchedTableConfig);
  }
}
