import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { IClient } from '../utils/client.interface';
import { data } from 'src/api/mock/mock-data';

@Injectable({
  providedIn: 'root',
})
export class TableDataService {
	private mockData = data;

  getClients(): Observable<IClient[]> {
	return of(this.mockData);
  }
}
