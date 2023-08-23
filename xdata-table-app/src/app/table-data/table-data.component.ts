import { Component, OnDestroy, OnInit } from '@angular/core';
import { IClient } from '../utils/client.interface';
import { TableDataService } from './table-data.service';
import {
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  map,
} from 'rxjs';
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

  /** This table config is the UNFILTERED original set of data. */
  originalTableConfig?: ITableConfig;
  tableConfig?: ITableConfig;
  expandableIconClass: string = '';
  allRowsSelected?: boolean;
  searchKeyword: string = '';
  private searchInputChanged = new Subject<string>();

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
          this.originalTableConfig = this.tableConfig;
          console.log(this.tableConfig);
        },
      });

    this.searchInputChanged
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.searchDebounceHandler(value);
      });
  }

  searchDebounceHandler(value: string) {
    if (!this.originalTableConfig) {
      return;
    }

    if (value.length === 0) {
      this.tableConfig = this.originalTableConfig;
    } else {
      this.tableDataService
        .searchRows(value, this.originalTableConfig!)
        .subscribe((tableConfig) => {
          this.tableConfig = tableConfig;
        });
    }
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
      return 'bi bi-arrow-right-short'; // the class for icon used while row is collapsed
    } else {
      return 'bi bi-arrow-down-short'; // the class used for the icon while row is expanded
    }
  }

  selectRow(row: ITableRow) {
    row.isSelected = !row.isSelected;
    this.allRowsSelected = this.tableDataService.checkIfAllRowsSelected(
      this.tableConfig!.rows
    );
    this.atLeastOneCheckboxIsSelected();
  }

  selectAllRows(event: any) {
    const selected = event.target.checked;
    if (!this.tableConfig) return;
    const rows = this.tableDataService.selectAll(
      selected,
      this.tableConfig.rows ?? []
    );
    this.tableConfig.rows = rows;
    this.atLeastOneCheckboxIsSelected();
  }

  atLeastOneCheckboxIsSelected(): boolean {
    if (!this.tableConfig) return false;
    const atLeastOneRowSelected =
      this.tableDataService.checkIfAtLeastOneRowSelected(this.tableConfig.rows);
    return atLeastOneRowSelected;
  }

  onInputChange(event: any): void {
    const searchKeyword = event.target.value;
    this.searchInputChanged.next(searchKeyword);
  }
}
