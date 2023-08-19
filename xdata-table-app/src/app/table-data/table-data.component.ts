import { Component, OnDestroy, OnInit } from '@angular/core';
import { IClient } from '../utils/client.interface';
import { TableDataService } from './table-data.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-table-data',
    templateUrl: './table-data.component.html',
    styleUrls: ['./table-data.component.scss'],
})
export class TableDataComponent implements OnInit, OnDestroy {
    subscription!: Subscription;
    errorMessage = '';

    clients: IClient[] = [];

    constructor(private tableDataService: TableDataService) {}

    ngOnInit(): void {
        this.subscription = this.tableDataService.getClients().subscribe({
            next: clients => {
                this.clients = clients;
            }
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
