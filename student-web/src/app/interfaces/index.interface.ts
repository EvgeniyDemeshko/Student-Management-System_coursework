export interface Department {
  department_id: number;
  department_name: string;
}

export interface Specialty {
  specialty_id: number;
  specialty_name: string;
  department_id: number;
}

export interface Group {
  group_id: number;
  group_name: string;
  department_id: number;
  specialty_id: number;
  teacher_id: number;
  year_of_creating: number;
}

export interface Teacher {
  teacher_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  department_id: number;
}

export interface Subject {
  subject_id: number;
  subject_name: string;
  credits: number;
  teacher_first_name?: string;
  teacher_last_name?: string;
}

export interface Student {
  student_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  date_of_birth?: string;
  group_id: number;
  group_name: string;
  specialty_id?: number;
  specialty_name?: string;
  department_id?: number;
  department_name?: string;
  teacher_id?: number;
  teacher_first_name?: string;
  teacher_last_name?: string;
  year_of_creating: number;
}

export interface Grade {
  grade_id: number;
  grade: number;
  student_id: number;
  subject_id: number;
  subject_name: string;
  credits: number;
  teacher_first_name?: string;
  teacher_last_name?: string;
}

export interface GroupInfo {
  group_id: number;
  group_name: string;
  department_name: string;
  specialty_name: string;
  student_count: number;
}

export interface StudentRanking {
  student_id: number;
  full_name: string;
  average_grade: number;
}

export interface LowGrade {
  subject_id: number;
  subject_name: string;
  student_id: number;
  full_name: string;
  grade: number;
}
