'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Loader2, BookOpen, Users, Clipboard, FileText, Calendar, Settings, LogOut,
  Home, Bell, Search, Menu, X, ChevronRight, LayoutDashboard
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AppSidebar } from "@/components/app-sidebar";
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

// 应用类型定义
interface Application {
  id: string;
  name: string;
  description: string;
  icon: string;
  url: string;
  roles: string[];
}

// 图标映射 - 使用类型断言避免TypeScript错误
const iconComponents: Record<string, any> = {
  'book': BookOpen,
  'users': Users,
  'clipboard': Clipboard,
  'file': FileText,
  'calendar': Calendar,
  'settings': Settings,
};

// 卡片颜色映射
const colorMap: Record<string, string> = {
  'book': 'from-blue-500 to-blue-600',
  'users': 'from-green-500 to-green-600',
  'clipboard': 'from-amber-500 to-amber-600',
  'file': 'from-purple-500 to-purple-600',
  'calendar': 'from-rose-500 to-rose-600',
  'settings': 'from-gray-500 to-gray-600',
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  const [dataFetched, setDataFetched] = useState(false);
  
  // 简化的应用获取逻辑
  useEffect(() => {
    // 使用模拟数据，简化身份验证逻辑
    const mockApplications = [
      {
        id: '1',
        name: '师生信息管理',
        description: '管理教师和学生的基本信息',
        icon: 'users',
        url: '/admin/users',
        roles: ['管理员']
      },
      {
        id: '2',
        name: '课堂时光机',
        description: '记录和回放课堂教学过程，辅助教学分析',
        icon: 'book',
        url: '/classroom-timemachine',
        roles: ['教师']
      },
      {
        id: '3',
        name: '单元教学设计',
        description: '创建和管理单元教学设计方案',
        icon: 'file',
        url: '/unit-teaching-design',
        roles: ['教师']
      },
      {
        id: '4',
        name: '全员导师制',
        description: '浏览、管理和分配导师资源，促进师生共同成长',
        icon: 'users',
        url: '/mentor-hub',
        roles: ['教师', '管理员']
      }
    ];
    
    // 设置模拟数据
    setApplications(mockApplications);
    setIsLoading(false);
    
    /* 原身份验证和数据获取逻辑（已注释）
    // 避免在身份验证加载过程中执行任何操作
    if (authLoading) {
      return;
    }
    
    // 如果未认证，则重定向到登录页
    if (!isAuthenticated) {
      console.log('用户未认证，重定向到登录页');
      router.push('/login');
      return;
    }

    // 如果已认证且有token且尚未获取数据且不在加载中，则获取数据
    if (isAuthenticated && token && !dataFetched && !isLoading) {
      console.log('开始获取应用数据...');
      
      // 使用setTimeout避免状态更新冲突
      const timer = setTimeout(() => {
        const fetchData = async () => {
          setIsLoading(true);
          setError(null);
          
          try {
            console.log('正在请求应用数据，使用token:', token.substring(0, 5) + '...');
            const response = await fetch('/api/applications', {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            
            if (!response.ok) {
              // 特殊处理401未授权响应
              if (response.status === 401) {
                console.log('会话已过期，重定向到登录页');
                // 清除本地存储的token
                localStorage.removeItem('token');
                // 延迟重定向，避免状态更新冲突
                setTimeout(() => {
                  router.push('/login');
                }, 100);
                return;
              }
              throw new Error('获取应用列表失败');
            }
            
            const data = await response.json();
            console.log('成功获取应用数据:', data.length, '个应用');
            setApplications(data);
            setDataFetched(true);
          } catch (err: any) {
            console.error('获取应用数据失败:', err);
            setError(err.message || '获取应用列表时出错');
          } finally {
            setIsLoading(false);
          }
        };

        fetchData();
      }, 100); // 延迟100ms执行，避免和身份验证状态更新冲突
      
      return () => clearTimeout(timer);
    }
    */
  }, []);
  
  const handleAppClick = (url: string) => {
    router.push(url);
  };
  
  /* 原身份验证加载界面（已注释）
  // 如果身份验证加载中，显示加载界面
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-6 text-lg font-medium text-gray-700">正在加载工作台...</p>
        </div>
      </div>
    );
  }
  
  // 如果未认证，不显示任何内容（会被重定向）
  if (!isAuthenticated) {
    return null;
  }
  */
  
  // 使用新的布局
  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">工作台</h2>
          <p className="mt-1 text-sm text-gray-500">欢迎回来，{user?.name}。这是您的应用列表。</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center bg-gray-50 px-4 py-2 rounded-md">
          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-sm font-medium text-gray-700">{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>
      
      {/* 最近动态卡片 */}
      <div className="grid auto-rows-min gap-6 md:grid-cols-3 mb-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 h-full">
            <div className="flex items-center">
              <div className="bg-primary/10 p-3 rounded-full">
                <LayoutDashboard className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium">最近动态</h3>
                <p className="text-sm text-gray-500">查看您的最近活动和系统公告</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-3">
              <div className="flex items-start p-3 rounded-md bg-gray-50">
                <Bell className="h-5 w-5 text-amber-500 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium">系统公告</p>
                  <p className="text-xs text-gray-500 mt-1">平台将于本周六进行系统维护，请提前做好准备。</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 italic">暂无更多动态</p>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 h-full">
            <div className="flex items-center">
              <div className="bg-blue-50 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium">快速访问</h3>
                <p className="text-sm text-gray-500">常用功能入口</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="flex flex-col items-center justify-center h-20 p-2">
                <Settings className="h-6 w-6 mb-2" />
                <span className="text-xs">个人设置</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center justify-center h-20 p-2">
                <FileText className="h-6 w-6 mb-2" />
                <span className="text-xs">文档中心</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">我的应用</h3>
        <Badge variant="outline" className="px-3 py-1">
          {applications.length} 个应用
        </Badge>
      </div>
      
      {/* 应用列表 */}
      {applications.length === 0 && !isLoading ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-dashed border-gray-300">
          <div className="mx-auto w-16 h-16 bg-gray-100 flex items-center justify-center rounded-full mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">暂无可用应用</h3>
          <p className="text-gray-500 max-w-md mx-auto">您当前没有可用的应用程序。请联系管理员为您分配权限。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <div 
              key={app.id} 
              onClick={() => handleAppClick(app.url)}
              className="group cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 h-full flex flex-col">
                <div className={`h-3 w-full bg-gradient-to-r ${colorMap[app.icon] || 'from-gray-500 to-gray-600'}`}></div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 p-3 rounded-lg bg-gradient-to-br ${colorMap[app.icon] || 'from-gray-500 to-gray-600'} text-white`}>
                      {app.icon && iconComponents[app.icon as keyof typeof iconComponents] ? 
                        React.createElement(iconComponents[app.icon as keyof typeof iconComponents], { size: 24 })
                      : 
                        <span className="h-10 w-10 flex items-center justify-center text-2xl font-bold">
                          {app.name.charAt(0)}
                        </span>
                      }
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">{app.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{app.description}</p>
                      {app.roles && app.roles.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {app.roles.map((role, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 flex justify-end">
                    <Button 
                      variant="outline"
                      size="sm"
                      className="group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors flex items-center"
                    >
                      进入应用
                      <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 