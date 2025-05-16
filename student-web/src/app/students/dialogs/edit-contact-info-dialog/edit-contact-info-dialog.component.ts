import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { Student } from '../../../interfaces/index.interface';

@Component({
  selector: 'app-edit-contact-info-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogContent,
    MatDialogActions
  ],
  templateUrl: './edit-contact-info-dialog.component.html',
  styleUrls: ['./edit-contact-info-dialog.component.scss'],
})
export class EditContactInfoDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<EditContactInfoDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Student
  ) {
    this.form = this.fb.group({
      first_name: [data.first_name, [Validators.required]],
      last_name: [data.last_name, [Validators.required]],
      email: [data.email, [Validators.required, Validators.email]],
      phone_number: [data.phone_number],
      date_of_birth: [data.date_of_birth],
    });
  }

onSubmit() {
  if (this.form.valid) {
    console.log('Submitting form with data:', this.form.value);
    this.apiService.updateContactInfo(this.data.student_id, this.form.value).subscribe({
      next: (result) => {
        this.snackBar.open('Контактну інформацію оновлено', 'Закрити', { duration: 3000 });
        this.dialogRef.close(result);
      },
      error: (error) => {
        console.error('Error updating contact info:', error);
        this.snackBar.open('Помилка оновлення контактної інформації', 'Закрити', { duration: 3000 });
      },
    });
  }
}

  onCancel() {
    this.dialogRef.close();
  }
}