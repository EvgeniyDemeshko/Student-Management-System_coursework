import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupPerformanceSearchComponent } from './group-performance-search.component';

describe('GroupPerformanceSearchComponent', () => {
  let component: GroupPerformanceSearchComponent;
  let fixture: ComponentFixture<GroupPerformanceSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupPerformanceSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupPerformanceSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
