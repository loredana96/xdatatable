import { Component, OnDestroy, OnInit } from '@angular/core';
import { IClient } from '../utils/client.interface';
import { TableDataService } from './table-data.service';
import { Subscription, map } from 'rxjs';
import { ITableConfig, ITableRow } from '../utils/table-config';

@Component({
  selector: 'app-table-data',
  templateUrl: './table-data.component.html',
  styleUrls: ['./table-data.component.scss'],
})
export class TableDataComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  errorMessage = '';

  clients: IClient[] = [];
  tableConfig?: ITableConfig;
  expandableIconClass: string = '';
  allRowsSelected?: boolean;

  constructor(private tableDataService: TableDataService) {}

  ngOnInit(): void {
    this.subscription = this.tableDataService
      .getClients()
      .pipe(
        map((clients) =>
          this.tableDataService.adaptIClientToTableConfig(clients)
        )
      )
      .subscribe({
        next: (tableConfig) => {
          this.tableConfig = tableConfig;
          console.log(this.tableConfig);
        },
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  paddingNestedLevel(size: number) {
    return `${size}px`;
  }

  clickedRow(id: string) {
    this.tableConfig = this.tableDataService.toggleCollapsedStatus(
      id,
      this.tableConfig!
    );
  }

  getIconForExpandableRow(tableRow: ITableRow): string {
    if (tableRow.isCollapsed) {
      return 'bi bi-arrow-right-short';
    } else {
      return 'bi bi-arrow-down-short';
    }
  }

  selectRow(row: ITableRow) {
    row.isSelected = !row.isSelected;
    this.allRowsSelected = this.tableDataService.checkIfAllRowsSelected(
      this.tableConfig!.rows
    );
    this.showDeleteMultipleButton();
  }

  selectAllRows(event: any) {
    const selected = event.target.checked;
    if (!this.tableConfig) return;
    const rows = this.tableDataService.selectAll(
      selected,
      this.tableConfig.rows ?? []
    );
    this.tableConfig.rows = rows;
    this.showDeleteMultipleButton();
  }

  showDeleteMultipleButton(): boolean {
    if (!this.tableConfig) return false;
    const atLeastOneRowSelected =
      this.tableDataService.checkIfAtLeastOneRowSelected(this.tableConfig.rows);
    return atLeastOneRowSelected;
  }
}
