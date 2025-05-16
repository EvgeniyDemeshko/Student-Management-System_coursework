import { Routes } from '@angular/router';
import { StudentListComponent } from '../app/students/student-list/student-list.component';
import { StudentDetailsComponent } from '../app/students/student-details/student-details.component';
import { GroupPerformanceSearchComponent } from './students/group-performance-search/group-performance-search.component';
/*import { UniversityReportComponent } from '../report/components/university-report/university-report.component';*/

export const routes: Routes = [
  { path: '', component: StudentListComponent },
  { path: 'students/:id', component: StudentDetailsComponent },
  { path: 'reports/group-performance-search', component: GroupPerformanceSearchComponent },
  { path: '**', redirectTo: '' },
];