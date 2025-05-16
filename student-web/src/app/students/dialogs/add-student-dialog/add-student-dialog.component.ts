import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '../../../services/api.service';
import { Department, Specialty, Group, Student } from '../../../interfaces/index.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-student-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './add-student-dialog.component.html',
  styleUrls: ['./add-student-dialog.component.scss'],
})
export class AddStudentDialogComponent implements OnInit {
  form: FormGroup;
  departments: Department[] = [];
  specialties: Specialty[] = [];
  groups: Group[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<AddStudentDialogComponent>
  ) {
    this.form = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: [''],
      date_of_birth: [''],
      department_id: [null, Validators.required],
      specialty_id: [{ value: null, disabled: true }, Validators.required],
      group_id: [{ value: null, disabled: true }, Validators.required],
    });
  }

  ngOnInit() {
    this.apiService.getDepartments().subscribe((departments) => {
      this.departments = departments;
    });

    this.form.get('department_id')?.valueChanges.subscribe((departmentId) => {
      this.form.get('specialty_id')?.reset();
      this.form.get('group_id')?.reset();
      this.specialties = [];
      this.groups = [];
      if (departmentId) {
        this.form.get('specialty_id')?.enable();
        this.apiService.getSpecialties(departmentId).subscribe((specialties) => {
          this.specialties = specialties;
        });
      } else {
        this.form.get('specialty_id')?.disable();
      }
    });

    this.form.get('specialty_id')?.valueChanges.subscribe((specialtyId) => {
      this.form.get('group_id')?.reset();
      this.groups = [];
      if (specialtyId) {
        this.form.get('group_id')?.enable();
        this.apiService.getGroups(specialtyId).subscribe((groups) => {
          this.groups = groups;
        });
      } else {
        this.form.get('group_id')?.disable();
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const student: Partial<Student> = this.form.value;
      this.apiService.addStudent(student).subscribe((result) => {
        this.dialogRef.close(result);
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}