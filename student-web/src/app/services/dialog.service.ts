import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddStudentDialogComponent } from '../students/dialogs/add-student-dialog/add-student-dialog.component';
import { AddGradeComponent } from '../students/dialogs/add-grade/add-grade.component';
import { EditStudentComponent } from '../students/dialogs/edit-student/edit-student.component';
import { EditGradeDialogComponent } from '../students/dialogs/edit-grade-dialog/edit-grade-dialog.component';
import { Student, Grade } from '../interfaces/index.interface';
import { EditContactInfoDialogComponent } from '../students/dialogs/edit-contact-info-dialog/edit-contact-info-dialog.component';
import { TransferStudentDialogComponent } from '../students/dialogs/transfer-student-dialog/transfer-student-dialog.component';

@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openAddStudentDialog(): Promise<Student | undefined> {
    return this.dialog
      .open(AddStudentDialogComponent, { width: '400px' })
      .afterClosed()
      .toPromise();
  }

  openAddGradeDialog(studentId: number): Promise<Grade | undefined> {
    console.log('DialogService: Opening dialog with student_id:', studentId);
    return this.dialog
      .open(AddGradeComponent, { width: '400px', data: { student_id: studentId } })
      .afterClosed()
      .toPromise();
  }

  openEditStudentDialog(student: Student): Promise<Student | undefined> {
    return this.dialog
      .open(EditStudentComponent, { width: '400px', data: student })
      .afterClosed()
      .toPromise();
  }

  openEditContactInfoDialog(student: Student): Promise<Student | undefined> {
    console.log('DialogService: Opening EditContactInfoDialog with student:', student);
    return this.dialog
      .open(EditContactInfoDialogComponent, { width: '400px', data: student })
      .afterClosed()
      .toPromise();
  }

  openEditGradeDialog(grade: Grade): Promise<Grade | undefined> {
    console.log('DialogService: Opening EditGradeDialog with grade:', grade);
    return this.dialog
      .open(EditGradeDialogComponent, { width: '400px', data: { grade } })
      .afterClosed()
      .toPromise();
  }
    openTransferStudentDialog(student: Student): Promise<Student | undefined> {
    console.log('DialogService: Opening TransferStudentDialog with student:', student);
    return this.dialog
      .open(TransferStudentDialogComponent, { width: '400px', data: student })
      .afterClosed()
      .toPromise();
  }
}