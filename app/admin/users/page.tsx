'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  UserPlus,
  Users,
  School,
  GraduationCap,
  BookOpen
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 定义类型
interface Teacher {
  id: string;
  name: string;
  gender: string;
  age: number;
  subject: string;
  class: string;
  title: string;
  phone: string;
  email: string;
  status: string;
}

interface Student {
  id: string;
  name: string;
  gender: string;
  age: number;
  grade: string;
  class: string;
  studentId: string;
  guardian: string;
  phone: string;
  status: string;
}

// 模拟数据
const mockTeachers: Teacher[] = [
  {
    id: '1',
    name: '张老师',
    gender: '女',
    age: 35,
    subject: '物理',
    class: '高二(3)班',
    title: '高级教师',
    phone: '13800138000',
    email: 'zhang@school.com',
    status: '在职'
  },
  {
    id: '2',
    name: '李老师',
    gender: '男',
    age: 42,
    subject: '数学',
    class: '高一(2)班',
    title: '特级教师',
    phone: '13800138001',
    email: 'li@school.com',
    status: '在职'
  },
  {
    id: '3',
    name: '王老师',
    gender: '女',
    age: 28,
    subject: '语文',
    class: '高三(1)班',
    title: '一级教师',
    phone: '13800138002',
    email: 'wang@school.com',
    status: '在职'
  }
];

const mockStudents: Student[] = [
  {
    id: '1',
    name: '张三',
    gender: '男',
    age: 16,
    grade: '高二',
    class: '高二(3)班',
    studentId: '2022001',
    guardian: '张父',
    phone: '13900139000',
    status: '在读'
  },
  {
    id: '2',
    name: '李四',
    gender: '女',
    age: 15,
    grade: '高一',
    class: '高一(2)班',
    studentId: '2023001',
    guardian: '李母',
    phone: '13900139001',
    status: '在读'
  },
  {
    id: '3',
    name: '王五',
    gender: '男',
    age: 17,
    grade: '高三',
    class: '高三(1)班',
    studentId: '2021001',
    guardian: '王父',
    phone: '13900139002',
    status: '在读'
  }
];

export default function AdminUsersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('teachers');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<Teacher | Student | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    age: '',
    subject: '',
    grade: '',
    class: '',
    title: '',
    studentId: '',
    phone: '',
    email: '',
    guardian: '',
  });
  
  // 搜索功能
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const filteredData = React.useMemo(() => {
    const data = activeTab === 'teachers' ? mockTeachers : mockStudents;
    if (!searchQuery) return data;
    
    return data.filter((item) => {
      const searchStr = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchStr) ||
        item.class.toLowerCase().includes(searchStr) ||
        (activeTab === 'teachers' && 'subject' in item ? 
          item.subject.toLowerCase().includes(searchStr) :
          'grade' in item && item.grade.toLowerCase().includes(searchStr))
      );
    });
  }, [activeTab, searchQuery]) as (Teacher | Student)[];
  
  // 导出功能
  const handleExport = () => {
    const data = activeTab === 'teachers' ? mockTeachers : mockStudents;
    const headers = activeTab === 'teachers' ? 
      ['姓名', '性别', '年龄', '学科', '班级', '职称', '联系电话', '邮箱', '状态'] :
      ['姓名', '性别', '年龄', '年级', '班级', '学号', '监护人', '联系电话', '状态'];
    
    const csvContent = [
      headers.join(','),
      ...data.map(item => {
        if (activeTab === 'teachers' && 'subject' in item) {
          return [
            item.name,
            item.gender,
            item.age,
            item.subject,
            item.class,
            item.title,
            item.phone,
            item.email,
            item.status
          ].join(',');
        } else if ('grade' in item) {
          return [
            item.name,
            item.gender,
            item.age,
            item.grade,
            item.class,
            item.studentId,
            item.guardian,
            item.phone,
            item.status
          ].join(',');
        }
        return '';
      })
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${activeTab === 'teachers' ? '教师' : '学生'}信息表.csv`;
    link.click();
  };
  
  // 导入功能
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const csvData = event.target?.result as string;
          // 这里处理CSV数据，实际项目中需要调用API上传
          console.log('导入的CSV数据:', csvData);
          toast.success('数据导入成功');
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };
  
  // 添加/编辑功能
  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      gender: '',
      age: '',
      subject: '',
      grade: '',
      class: '',
      title: '',
      studentId: '',
      phone: '',
      email: '',
      guardian: '',
    });
    setShowAddDialog(true);
  };
  
  const handleEdit = (id: string) => {
    const user = activeTab === 'teachers' 
      ? mockTeachers.find(t => t.id === id)
      : mockStudents.find(s => s.id === id);
      
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        gender: user.gender,
        age: String(user.age),
        subject: 'subject' in user ? user.subject : '',
        grade: 'grade' in user ? user.grade : '',
        class: user.class,
        title: 'title' in user ? user.title : '',
        studentId: 'studentId' in user ? user.studentId : '',
        phone: user.phone,
        email: 'email' in user ? user.email : '',
        guardian: 'guardian' in user ? user.guardian : '',
      });
      setShowAddDialog(true);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里处理表单提交，实际项目中需要调用API
    console.log('提交的表单数据:', formData);
    toast.success(`${editingUser ? '修改' : '添加'}成功`);
    setShowAddDialog(false);
  };
  
  // 删除功能
  const handleDelete = (id: string) => {
    setDeleteUserId(id);
    setShowDeleteDialog(true);
  };
  
  const confirmDelete = () => {
    if (deleteUserId) {
      // 这里处理删除，实际项目中需要调用API
      console.log('删除用户:', deleteUserId);
      toast.success('删除成功');
      setShowDeleteDialog(false);
      setDeleteUserId(null);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">师生信息管理</h2>
          <p className="mt-1 text-sm text-gray-500">管理教师和学生的基本信息</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" />
            导出
          </Button>
          <Button variant="outline" size="sm" onClick={handleImport}>
            <Upload className="h-4 w-4 mr-1" />
            导入
          </Button>
          <Button variant="default" size="sm" onClick={handleAdd}>
            <UserPlus className="h-4 w-4 mr-1" />
            添加
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="搜索..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs defaultValue="teachers" className="flex-1" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="teachers">教师管理</TabsTrigger>
              <TabsTrigger value="students">学生管理</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {activeTab === 'teachers' ? '教师列表' : '学生列表'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeTab === 'teachers' ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>姓名</TableHead>
                    <TableHead>性别</TableHead>
                    <TableHead>年龄</TableHead>
                    <TableHead>学科</TableHead>
                    <TableHead>班级</TableHead>
                    <TableHead>职称</TableHead>
                    <TableHead>联系电话</TableHead>
                    <TableHead>邮箱</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(filteredData as Teacher[]).map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell>{teacher.name}</TableCell>
                      <TableCell>{teacher.gender}</TableCell>
                      <TableCell>{teacher.age}</TableCell>
                      <TableCell>{teacher.subject}</TableCell>
                      <TableCell>{teacher.class}</TableCell>
                      <TableCell>{teacher.title}</TableCell>
                      <TableCell>{teacher.phone}</TableCell>
                      <TableCell>{teacher.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {teacher.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(teacher.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(teacher.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>姓名</TableHead>
                    <TableHead>性别</TableHead>
                    <TableHead>年龄</TableHead>
                    <TableHead>年级</TableHead>
                    <TableHead>班级</TableHead>
                    <TableHead>学号</TableHead>
                    <TableHead>监护人</TableHead>
                    <TableHead>联系电话</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(filteredData as Student[]).map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.gender}</TableCell>
                      <TableCell>{student.age}</TableCell>
                      <TableCell>{student.grade}</TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>{student.guardian}</TableCell>
                      <TableCell>{student.phone}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(student.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(student.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* 添加/编辑对话框 */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? '编辑' : '添加'}{activeTab === 'teachers' ? '教师' : '学生'}
            </DialogTitle>
            <DialogDescription>
              请填写{activeTab === 'teachers' ? '教师' : '学生'}的基本信息。
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">姓名</label>
                  <Input
                    placeholder="请输入姓名"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">性别</label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择性别" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="男">男</SelectItem>
                      <SelectItem value="女">女</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">年龄</label>
                  <Input
                    type="number"
                    placeholder="请输入年龄"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {activeTab === 'teachers' ? '学科' : '年级'}
                  </label>
                  <Input
                    placeholder={`请输入${activeTab === 'teachers' ? '学科' : '年级'}`}
                    value={activeTab === 'teachers' ? formData.subject : formData.grade}
                    onChange={(e) => setFormData({
                      ...formData,
                      [activeTab === 'teachers' ? 'subject' : 'grade']: e.target.value
                    })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">班级</label>
                  <Input
                    placeholder="请输入班级"
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {activeTab === 'teachers' ? '职称' : '学号'}
                  </label>
                  <Input
                    placeholder={`请输入${activeTab === 'teachers' ? '职称' : '学号'}`}
                    value={activeTab === 'teachers' ? formData.title : formData.studentId}
                    onChange={(e) => setFormData({
                      ...formData,
                      [activeTab === 'teachers' ? 'title' : 'studentId']: e.target.value
                    })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">联系电话</label>
                  <Input
                    placeholder="请输入联系电话"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {activeTab === 'teachers' ? '邮箱' : '监护人'}
                  </label>
                  <Input
                    placeholder={`请输入${activeTab === 'teachers' ? '邮箱' : '监护人'}`}
                    value={activeTab === 'teachers' ? formData.email : formData.guardian}
                    onChange={(e) => setFormData({
                      ...formData,
                      [activeTab === 'teachers' ? 'email' : 'guardian']: e.target.value
                    })}
                    required
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setShowAddDialog(false)}>
                取消
              </Button>
              <Button type="submit">确认</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* 删除确认对话框 */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              您确定要删除这条记录吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 