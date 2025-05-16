import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { Department, Subject } from '../../../interfaces/index.interface';

@Component({
  selector: 'app-add-grade-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogContent,
    MatDialogActions
  ],
  templateUrl: './add-grade.component.html',
  styleUrls: ['./add-grade.component.scss'],
})
export class AddGradeComponent implements OnInit {
form: FormGroup;
  departments: Department[] = [];
  subjects: Subject[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<AddGradeComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { student_id: number } | null // Додано | null
  ) {
    const studentId = data?.student_id ?? null; // Захист від null
    if (!studentId) {
      this.snackBar.open('Ідентифікатор студента відсутній', 'Закрити', { duration: 3000 });
      this.dialogRef.close();
    }
    this.form = this.fb.group({
      department_id: [null, Validators.required],
      subject_id: [{ value: null, disabled: true }, Validators.required],
      grade: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      student_id: [studentId, Validators.required],
    });
  }

  ngOnInit() {
    this.apiService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
      },
      error: () => {
        this.snackBar.open('Помилка завантаження факультетів', 'Закрити', { duration: 3000 });
      },
    });

    this.form.get('department_id')?.valueChanges.subscribe((departmentId) => {
      this.form.get('subject_id')?.reset();
      this.subjects = [];
      if (departmentId) {
        this.form.get('subject_id')?.enable();
        this.apiService.getSubjectsByDepartment(departmentId).subscribe({
          next: (subjects) => {
            this.subjects = subjects;
          },
          error: () => {
            this.snackBar.open('Помилка завантаження предметів', 'Закрити', { duration: 3000 });
          },
        });
      } else {
        this.form.get('subject_id')?.disable();
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const grade: { grade: number; student_id: number; subject_id: number } = {
        student_id: this.form.value.student_id,
        subject_id: this.form.value.subject_id,
        grade: this.form.value.grade,
      };
      this.apiService.addGrade(grade).subscribe({
        next: (result) => {
          this.snackBar.open('Оцінку додано', 'Закрити', { duration: 3000 });
          this.dialogRef.close(result);
        },
        error: () => {
          this.snackBar.open('Помилка додавання оцінки', 'Закрити', { duration: 3000 });
        },
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}