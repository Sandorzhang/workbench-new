// 学生类型定义
export interface Student {
  id: string;
  name: string;
  grade: string;
  avatar?: string;
}

// 导师类型定义
export interface Mentor {
  id: string;
  name: string;
  title: string;
  avatar?: string;
  bio: string;
  specialties: string[];
  isAssigned: boolean;
  email: string;
  phone: string;
  students?: Student[];
} 