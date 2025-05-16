import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Group, GroupInfo, LowGrade, StudentRanking,  } from '../../interfaces/index.interface';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-group-performance-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatTableModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardContent,
    MatCard
  ],
  templateUrl: './group-performance-search.component.html',
  styleUrls: ['./group-performance-search.component.scss'],
})
export class GroupPerformanceSearchComponent implements OnInit {
  form: FormGroup;
  groups: Group[] = [];
  rankingDataSource = new MatTableDataSource<StudentRanking>();
  lowGradesData: { subject_name: string; dataSource: MatTableDataSource<LowGrade> }[] = [];
  rankingColumns: string[] = ['full_name', 'average_grade'];
  lowGradesColumns: string[] = ['full_name', 'grade'];
  loading: boolean = false;
  filteredGroups: Observable<Group[]> = of([]);
  groupInfo: GroupInfo | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      group_name: [''],
      group_id: [null],
    });
  }

  ngOnInit() {
    this.filteredGroups = this.form.get('group_name')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        if (typeof value === 'string' && value.length >= 2) {
          console.log(`Searching for group name: ${value}`);
          return this.apiService.searchGroups(value);
        }
        return of([]);
      })
    );
  }

  displayGroup(group: Group | null): string {
    return group ? group.group_name : '';
  }

  onGroupSelected(event: any) {
    const group = event.option.value as Group;
     this.form.patchValue({
      group_name: group.group_name, // Встановлюємо рядок, а не об’єкт
      group_id: group.group_id,
    });
    this.loadReport(group.group_id);
  }

  onSubmit() {
    const groupId = this.form.get('group_id')?.value;
    if (groupId) {
      this.loadReport(groupId);
    } else {
      this.snackBar.open('Виберіть групу зі списку', 'Закрити', { duration: 3000 });
    }
  }

  loadReport(groupId: number) {
    this.loading = true;
    console.log('Fetching performance report for group_id:', groupId);
    this.apiService.getGroupPerformanceReport(groupId).subscribe({
      next: (response) => {
        console.log('Performance report loaded:', response);
        this.groupInfo = response.group_info;
        this.rankingDataSource.data = response.student_ranking;

        // Групуємо low_grades за дисциплінами
        const subjects = [...new Set(response.low_grades.map(item => item.subject_name))];
        this.lowGradesData = subjects.map(subject => ({
          subject_name: subject,
          dataSource: new MatTableDataSource(
            response.low_grades.filter(item => item.subject_name === subject)
          ),
        }));

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading performance report:', error);
        this.snackBar.open(
          error.status === 404
            ? 'Дані про успішність не знайдено'
            : 'Помилка завантаження звіту',
          'Закрити',
          { duration: 3000 }
        );
        this.groupInfo = null;
        this.rankingDataSource.data = [];
        this.lowGradesData = [];
        this.loading = false;
      },
    });
  }
    goBack() {
    this.router.navigate(['/']);
  }
}