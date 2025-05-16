import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { DialogService } from '../../services/dialog.service';
import { Student } from '../../interfaces/index.interface';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    RouterModule,
    FormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss'],
})
export class StudentListComponent implements AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['full_name', 'group_name', 'course', 'specialty_name', 'department_name', 'actions'];
  searchText: string = '';
  dataSource = new MatTableDataSource<Student>([]);
  loading: boolean = true;
  private navigationSubscription: Subscription;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private apiService: ApiService,
    private dialogService: DialogService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.navigationSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadStudents();
    });

    this.dataSource.filterPredicate = (data: Student, filter: string) => {
      const searchStr = (
        `${data.first_name} ${data.last_name}`.toLowerCase() +
        data.group_name.toLowerCase() +
        this.calculateCourse(data).toString() +
        (data.specialty_name ?? '').toLowerCase() +
        (data.department_name ?? '').toLowerCase()
      );
      return searchStr.includes(filter.toLowerCase());
    };
  }

  ngAfterViewInit(): void {
    this.loadStudents();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  loadStudents(): void {
    this.loading = true;
    this.apiService.getStudents().subscribe({
      next: (students: Student[]) => {
        this.dataSource.data = students || [];
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        this.snackBar.open('Помилка завантаження студентів', 'Закрити', { duration: 3000 });
      }
    });
  }

  searchStudents(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  calculateCourse(student: Student): number {
    const currentYear = new Date().getFullYear();
    const yearOfCreating = student.year_of_creating || currentYear;
    return Math.min(currentYear - yearOfCreating + 1, 6);
  }

  viewDetails(studentId: number): void {
    this.router.navigate(['/students', studentId]);
  }

  deleteStudent(studentId: number): void {
    if (confirm('Ви впевнені, що хочете відрахувати студента?')) {
      this.apiService.deleteStudent(studentId).subscribe({
        next: () => {
          this.loadStudents();
          this.snackBar.open('Студента успішно відраховано', 'Закрити', { duration: 3000 });
        },
        error: (err) => {
          this.snackBar.open('Помилка видалення студента', 'Закрити', { duration: 3000 });
        }
      });
    }
  }

  openStudentDialog(): void {
    this.dialogService.openAddStudentDialog().then((result) => {
      if (result) {
        this.loadStudents();
        this.snackBar.open('Студента успішно додано', 'Закрити', { duration: 3000 });
      }
    });
  }

  navigateToReport() {
    this.router.navigate(['/reports/group-performance-search']);
  }
}