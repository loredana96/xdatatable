import { TestBed } from '@angular/core/testing';
import { ResizeColumnDirective } from './resize-column.directive';

describe('ResizeColumnDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResizeColumnDirective],
    });
  });

  it('should create an instance', () => {
    const directive = TestBed.inject(ResizeColumnDirective);
    expect(directive).toBeTruthy();
  });
});
