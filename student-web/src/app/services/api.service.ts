import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student, Grade, Department, Specialty, Group, Teacher, Subject, GroupInfo, StudentRanking, LowGrade } from '../interfaces/index.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Студенти
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/students`);
  }

  getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/students/${id}`);
  }

  addStudent(student: Partial<Student>): Observable<Student> {
    return this.http.post<Student>(`${this.apiUrl}/students`, student);
  }

  searchGroups(name: string): Observable<Group[]> {
    console.log(`Searching groups with name: ${name}`);
    return this.http.get<Group[]>(`${this.apiUrl}/reports/search-groups?name=${encodeURIComponent(name)}`);
  }

  getGroupPerformanceReport(groupId: number): Observable<{ group_info: GroupInfo; student_ranking: StudentRanking[]; low_grades: LowGrade[] }> {
    console.log(`Fetching performance report for group_id: ${groupId}`);
    return this.http.get<{ group_info: GroupInfo; student_ranking: StudentRanking[]; low_grades: LowGrade[] }>(
      `${this.apiUrl}/reports/group-performance/${groupId}`
    );
  }

  updateContactInfo(studentId: number, contactInfo: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    date_of_birth?: string;
  }): Observable<Student> {
    console.log(`Sending PATCH to /students/${studentId}/contact-info with data:`, contactInfo);
  return this.http.patch<Student>(`${this.apiUrl}/students/${studentId}/contact-info`, contactInfo);
}

  deleteStudent(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/students/${id}`);
  }

  // Оцінки
  getGradesByStudent(id: number): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.apiUrl}/grades/student/${id}`);
  }

  addGrade(grade: { grade: number; student_id: number; subject_id: number }): Observable<Grade> {
    return this.http.post<Grade>(`${this.apiUrl}/grades`, grade);
  }

  updateGrade(gradeId: number, grade: { grade: number }): Observable<Grade> {
    return this.http.patch<Grade>(`${this.apiUrl}/grades/${gradeId}`, grade);
  }

  deleteGrade(gradeId: number): Observable<Grade> {
    return this.http.delete<Grade>(`${this.apiUrl}/grades/${gradeId}`);
  }

  getSubjectsByDepartment(departmentId: number): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.apiUrl}/subjects?department_id=${departmentId}`);
  }
  // Залежні списки
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/departments`);
  }

  getSpecialties(departmentId?: number): Observable<Specialty[]> {
    const url = departmentId ? `${this.apiUrl}/specialties?department_id=${departmentId}` : `${this.apiUrl}/specialties`;
    return this.http.get<Specialty[]>(url);
  }

  getGroups(specialtyId?: number): Observable<Group[]> {
    const url = specialtyId ? `${this.apiUrl}/groups?specialty_id=${specialtyId}` : `${this.apiUrl}/groups`;
    return this.http.get<Group[]>(url);
  }

  getTeachers(departmentId?: number): Observable<Teacher[]> {
    const url = departmentId ? `${this.apiUrl}/teachers?department_id=${departmentId}` : `${this.apiUrl}/teachers`;
    return this.http.get<Teacher[]>(url);
  }

  getSubjects(teacherId?: number, departmentId?: number): Observable<Subject[]> {
    const url = teacherId && departmentId 
      ? `${this.apiUrl}/subjects?teacher_id=${teacherId}&department_id=${departmentId}`
      : `${this.apiUrl}/subjects`;
    return this.http.get<Subject[]>(url);
  }

  getDepartmentsByTeacher(teacherId: number): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/departments/by-teacher?teacher_id=${teacherId}`);
  }


  getDepartmentsTransfer(): Observable<Department[]> {
    console.log('Fetching departments');
    return this.http.get<Department[]>(`${this.apiUrl}/transfers/departments`);
  }

  getSpecialtiesTransfer(departmentId?: number): Observable<Specialty[]> {
    const url = departmentId
      ? `${this.apiUrl}/transfers/specialties?department_id=${departmentId}`
      : `${this.apiUrl}/transfers/specialties`;
    console.log(`Fetching specialties for department ID: ${departmentId || 'all'}`);
    return this.http.get<Specialty[]>(url);
  }

  getGroupsTransfer(specialtyId?: number): Observable<Group[]> {
    const url = specialtyId
      ? `${this.apiUrl}/transfers/groups?specialty_id=${specialtyId}`
      : `${this.apiUrl}/transfers/groups`;
    console.log(`Fetching groups for specialty ID: ${specialtyId || 'all'}`);
    return this.http.get<Group[]>(url);
  }

  transferStudent(studentId: number, groupId: number): Observable<Student> {
    console.log(`Transferring student ID: ${studentId} to group ID: ${groupId}`);
    return this.http.patch<Student>(`${this.apiUrl}/transfers/students/${studentId}`, { group_id: groupId });
  }
}