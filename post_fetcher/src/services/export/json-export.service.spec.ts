import { TestBed } from '@angular/core/testing';

import { JsonExportService } from './json-export.service';

describe('CsvExportService', () => {
  let service: JsonExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
