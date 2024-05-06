import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReportPageComponent } from './list-report-page.component';

describe('ListReportPageComponent', () => {
  let component: ListReportPageComponent;
  let fixture: ComponentFixture<ListReportPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListReportPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListReportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
