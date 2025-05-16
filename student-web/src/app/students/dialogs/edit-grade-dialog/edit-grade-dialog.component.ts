import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { Grade } from '../../../interfaces/index.interface';

@Component({
  selector: 'app-edit-grade-dialog',
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
  templateUrl: './edit-grade-dialog.component.html',
  styleUrls: ['./edit-grade-dialog.component.scss'],
})
export class EditGradeDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<EditGradeDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { grade: Grade }
  ) {
    this.form = this.fb.group({
      grade: [data.grade.grade, [Validators.required, Validators.min(0), Validators.max(100)]],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.apiService.updateGrade(this.data.grade.grade_id, { grade: this.form.value.grade }).subscribe({
        next: (result) => {
          this.snackBar.open('Оцінку оновлено', 'Закрити', { duration: 3000 });
          this.dialogRef.close(result);
        },
        error: () => {
          this.snackBar.open('Помилка оновлення оцінки', 'Закрити', { duration: 3000 });
        },
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}