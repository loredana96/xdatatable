import { Component, OnDestroy, OnInit } from '@angular/core';
import { IClient } from '../utils/client.interface';
import { TableDataService } from './table-data.service';
import { Subscription, map } from 'rxjs';
import { ITableConfig, ITableRow } from './table-config';

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
}
