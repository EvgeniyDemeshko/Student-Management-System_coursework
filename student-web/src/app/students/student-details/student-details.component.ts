import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule, MatTableDataSource, MatTable } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { DialogService } from '../../services/dialog.service';
import { Student, Grade } from '../../interfaces/index.interface';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatIcon
  ],
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.scss'],
})
export class StudentDetailsComponent implements OnInit {
  student: Student | null = null;
  gradesDataSource = new MatTableDataSource<Grade>();
  displayedColumns: string[] = ['subject_name', 'credits', 'grade', 'teacher', 'actions'];
  loading: boolean = true;

  @ViewChild(MatTable) table: MatTable<Grade> | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    console.log('Displayed columns:', this.displayedColumns);
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.snackBar.open('Невалідний ідентифікатор студента', 'Закрити', { duration: 3000 });
      this.router.navigate(['/']);
      return;
    }
    this.loadStudent(id);
    this.loadGrades(id);
  }

  loadStudent(id: number) {
    this.apiService.getStudent(id).subscribe({
      next: (student) => {
        this.student = student;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Помилка завантаження деталей студента', 'Закрити', { duration: 3000 });
        this.loading = false;
        this.router.navigate(['/']);
      },
    });
  }

  loadGrades(id: number) {
    this.apiService.getGradesByStudent(id).subscribe({
      next: (grades) => {
        this.gradesDataSource.data = grades;
        if (this.table) {
          this.table.renderRows();
        }
      },
      error: () => {
        this.snackBar.open('Помилка завантаження оцінок', 'Закрити', { duration: 3000 });
      },
    });
  }

  calculateCourse(): number {
    if (!this.student || !this.student.year_of_creating) return 1;
    const currentYear = new Date().getFullYear();
    return Math.min(currentYear - this.student.year_of_creating + 1, 6);
  }

  editContactInfo() {
    if (this.student) {
      console.log('Opening EditContactInfoDialog with student:', this.student);
      this.dialogService.openEditContactInfoDialog(this.student).then((result) => {
        if (result) {
          this.loadStudent(this.student!.student_id);
          this.snackBar.open('Контактну інформацію оновлено', 'Закрити', { duration: 3000 });
        }
      });
    }
  }

    transferStudent() {
    if (this.student) {
      console.log('Opening TransferStudentDialog with student:', this.student);
      this.dialogService.openTransferStudentDialog(this.student).then((result) => {
        if (result) {
          console.log('Reloading student after transfer');
          this.loadStudent(this.student!.student_id);
          this.snackBar.open('Студента переведено', 'Закрити', { duration: 3000 });
        }
      });
    }
  }

  addGrade() {
    if (!this.student || !this.student.student_id) {
      this.snackBar.open('Дані студента недоступні', 'Закрити', { duration: 3000 });
      return;
    }
    console.log('Opening AddGradeDialog with student_id:', this.student.student_id);
    this.dialogService.openAddGradeDialog(this.student.student_id).then((result) => {
      if (result) {
        this.loadGrades(this.student!.student_id);
        this.snackBar.open('Оцінку додано', 'Закрити', { duration: 3000 });
      }
    });
  }

  editGrade(grade: Grade) {
    this.dialogService.openEditGradeDialog(grade).then((result: any) => {
      if (result) {
        this.loadGrades(this.student!.student_id);
        this.snackBar.open('Оцінку оновлено', 'Закрити', { duration: 3000 });
      }
    });
  }

  deleteGrade(grade: Grade) {
    if (confirm(`Ви впевнені, що хочете видалити оцінку за предмет "${grade.subject_name}" (${grade.grade})?`)) {
      this.apiService.deleteGrade(grade.grade_id).subscribe({
        next: () => {
          this.loadGrades(this.student!.student_id);
          this.snackBar.open('Оцінку видалено', 'Закрити', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open(
            error.status === 404 ? 'Оцінку не знайдено' : 'Помилка видалення оцінки',
            'Закрити',
            { duration: 3000 }
          );
        },
      });
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}