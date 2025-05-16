import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { Department, Specialty, Group, Student } from '../../../interfaces/index.interface';

@Component({
  selector: 'app-transfer-student-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogContent,
    MatDialogActions
  ],
  templateUrl: './transfer-student-dialog.component.html',
  styleUrls: ['./transfer-student-dialog.component.scss'],
})
export class TransferStudentDialogComponent {
  form: FormGroup;
  departments: Department[] = [];
  specialties: Specialty[] = [];
  groups: Group[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<TransferStudentDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Student
  ) {
    console.log('TransferStudentDialog initialized with student:', data);
    this.form = this.fb.group({
      department_id: [null, Validators.required],
      specialty_id: [{ value: null, disabled: true }, Validators.required],
      group_id: [{ value: null, disabled: true }, Validators.required],
    });

    this.loadDepartments();
    this.form.get('department_id')?.valueChanges.subscribe((departmentId) => {
      this.form.get('specialty_id')?.reset();
      this.form.get('group_id')?.reset();
      this.form.get('specialty_id')?.enable();
      this.form.get('group_id')?.disable();
      this.specialties = [];
      this.groups = [];
      if (departmentId) {
        this.loadSpecialties(departmentId);
      }
    });
    this.form.get('specialty_id')?.valueChanges.subscribe((specialtyId) => {
      this.form.get('group_id')?.reset();
      this.form.get('group_id')?.enable();
      this.groups = [];
      if (specialtyId) {
        this.loadGroups(specialtyId);
      }
    });
  }

  loadDepartments() {
    this.apiService.getDepartments().subscribe({
      next: (departments) => {
        console.log('Departments loaded:', departments);
        this.departments = departments;
      },
      error: () => {
        this.snackBar.open('Помилка завантаження факультетів', 'Закрити', { duration: 3000 });
      },
    });
  }

  loadSpecialties(departmentId: number) {
    this.apiService.getSpecialties(departmentId).subscribe({
      next: (specialties) => {
        console.log('Specialties loaded:', specialties);
        this.specialties = specialties;
      },
      error: () => {
        this.snackBar.open('Помилка завантаження спеціальностей', 'Закрити', { duration: 3000 });
      },
    });
  }

  loadGroups(specialtyId: number) {
    this.apiService.getGroups(specialtyId).subscribe({
      next: (groups) => {
        console.log('Groups loaded:', groups);
        this.groups = groups;
      },
      error: () => {
        this.snackBar.open('Помилка завантаження груп', 'Закрити', { duration: 3000 });
      },
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const groupId = this.form.get('group_id')?.value;
      console.log('Submitting transfer with group_id:', groupId);
      this.apiService.transferStudent(this.data.student_id, groupId).subscribe({
        next: (result) => {
          console.log('Student transferred:', result);
          this.snackBar.open('Студента переведено', 'Закрити', { duration: 3000 });
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error transferring student:', error);
          this.snackBar.open('Помилка переведення студента', 'Закрити', { duration: 3000 });
        },
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}