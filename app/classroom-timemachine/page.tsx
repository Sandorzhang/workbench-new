'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Loader2, BookOpen, Clock, Play, Pause, SkipBack, SkipForward, 
  Calendar, ChevronLeft, Video, Mic, LayoutDashboard
} from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 模拟课堂记录数据
const mockClassRecords = [
  {
    id: '1',
    title: '高中物理 - 牛顿第二定律',
    date: '2023-11-15',
    duration: '45分钟',
    teacher: '张老师',
    class: '高二(3)班',
    thumbnail: 'https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGh5c2ljc3xlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: '2',
    title: '初中数学 - 二次函数',
    date: '2023-11-10',
    duration: '40分钟',
    teacher: '张老师',
    class: '初三(2)班',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWF0aHxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: '3',
    title: '高中语文 - 红楼梦赏析',
    date: '2023-11-05',
    duration: '50分钟',
    teacher: '张老师',
    class: '高一(1)班',
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpbmVzZSUyMGxpdGVyYXR1cmV8ZW58MHx8MHx8fDA%3D',
  },
];

export default function ClassroomTimeMachinePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 处理URL参数
  useEffect(() => {
    const recordId = searchParams.get('recordId');
    if (recordId) {
      // 检查记录是否存在
      const recordExists = mockClassRecords.some(record => record.id === recordId);
      if (recordExists) {
        setSelectedRecord(recordId);
      } else {
        console.warn(`记录ID ${recordId} 不存在`);
      }
    }
    setIsLoading(false);
  }, [searchParams]);
  
  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };
  
  const handleBackToCalendar = () => {
    router.push('/calendar');
  };
  
  const handleSelectRecord = (id: string) => {
    setSelectedRecord(id);
    // 更新URL，但不触发页面刷新
    const url = new URL(window.location.href);
    url.searchParams.set('recordId', id);
    window.history.pushState({}, '', url);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  // 如果有选中的记录，显示记录详情
  if (selectedRecord) {
    const record = mockClassRecords.find(r => r.id === selectedRecord);
    
    if (!record) {
      return (
        <div className="max-w-7xl mx-auto py-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">未找到指定记录</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={handleBackToDashboard} variant="outline" size="sm">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              返回工作台
            </Button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{record.title}</h2>
            <p className="mt-1 text-sm text-gray-500">
              {record.class} | {record.date} | {record.duration}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleBackToDashboard}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              返回工作台
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleBackToCalendar}
            >
              <Calendar className="mr-2 h-4 w-4" />
              返回日历
            </Button>
          </div>
        </div>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">课堂时光机</h2>
                <p className="mt-1 text-sm text-gray-500">记录和回放课堂教学过程，辅助教学分析</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleBackToCalendar}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  返回日历
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleBackToDashboard}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  返回工作台
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedRecord(null);
                        // 移除URL参数
                        const url = new URL(window.location.href);
                        url.searchParams.delete('recordId');
                        window.history.pushState({}, '', url);
                      }}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      返回列表
                    </Button>
                  </div>
                  <Badge variant="outline" className="px-3 py-1">
                    {mockClassRecords.find(r => r.id === selectedRecord)?.duration}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">
                  {mockClassRecords.find(r => r.id === selectedRecord)?.title}
                </h3>
                
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="mr-4">{mockClassRecords.find(r => r.id === selectedRecord)?.date}</span>
                  <span className="mr-4">{mockClassRecords.find(r => r.id === selectedRecord)?.class}</span>
                  <span>{mockClassRecords.find(r => r.id === selectedRecord)?.teacher}</span>
                </div>
                
                <div className="aspect-video bg-gray-100 rounded-lg mb-6 overflow-hidden relative">
                  <img 
                    src={mockClassRecords.find(r => r.id === selectedRecord)?.thumbnail} 
                    alt="课堂视频" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Button size="lg" className="rounded-full w-16 h-16 flex items-center justify-center">
                      <Play className="h-8 w-8" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button size="sm">
                      <Play className="h-4 w-4 mr-1" />
                      播放
                    </Button>
                    <Button variant="outline" size="sm">
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Video className="h-4 w-4 mr-1" />
                      视频
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mic className="h-4 w-4 mr-1" />
                      音频
                    </Button>
                  </div>
                </div>
                
                <Tabs defaultValue="timeline">
                  <TabsList className="mb-4">
                    <TabsTrigger value="timeline">时间轴</TabsTrigger>
                    <TabsTrigger value="session">课堂环节还原</TabsTrigger>
                    <TabsTrigger value="knowledge">知识结构还原</TabsTrigger>
                    <TabsTrigger value="questions">问题链还原</TabsTrigger>
                    <TabsTrigger value="tasks">任务链还原</TabsTrigger>
                    <TabsTrigger value="analysis">教学分析</TabsTrigger>
                    <TabsTrigger value="notes">笔记</TabsTrigger>
                  </TabsList>
                  <TabsContent value="timeline">
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start">
                          <div className="bg-blue-100 text-blue-700 rounded-full p-2 mr-3">
                            <Clock className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium">00:05:23</span>
                              <Badge className="ml-2" variant="secondary">重点</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">讲解牛顿第二定律的公式推导</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start">
                          <div className="bg-blue-100 text-blue-700 rounded-full p-2 mr-3">
                            <Clock className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium">00:12:45</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">学生提问环节</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start">
                          <div className="bg-blue-100 text-blue-700 rounded-full p-2 mr-3">
                            <Clock className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium">00:25:10</span>
                              <Badge className="ml-2" variant="secondary">重点</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">实验演示与分析</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="session">
                    <div className="space-y-4">
                      <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <h4 className="text-lg font-medium mb-3">课堂环节还原</h4>
                        <p className="text-sm text-gray-600 mb-4">基于AI分析，自动识别并还原课堂教学的各个环节和流程</p>
                        
                        <div className="space-y-3">
                          <div className="p-3 bg-blue-50 rounded-md border-l-4 border-blue-500">
                            <div className="flex items-center">
                              <span className="font-medium text-blue-700">导入环节</span>
                              <Badge className="ml-2" variant="outline">00:00 - 05:30</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">通过回顾上节课内容，引入牛顿第二定律的概念</p>
                          </div>
                          
                          <div className="p-3 bg-green-50 rounded-md border-l-4 border-green-500">
                            <div className="flex items-center">
                              <span className="font-medium text-green-700">新课讲解</span>
                              <Badge className="ml-2" variant="outline">05:30 - 20:15</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">详细讲解牛顿第二定律的公式及其应用</p>
                          </div>
                          
                          <div className="p-3 bg-amber-50 rounded-md border-l-4 border-amber-500">
                            <div className="flex items-center">
                              <span className="font-medium text-amber-700">实验演示</span>
                              <Badge className="ml-2" variant="outline">20:15 - 30:45</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">通过小车加速实验验证牛顿第二定律</p>
                          </div>
                          
                          <div className="p-3 bg-purple-50 rounded-md border-l-4 border-purple-500">
                            <div className="flex items-center">
                              <span className="font-medium text-purple-700">学生练习</span>
                              <Badge className="ml-2" variant="outline">30:45 - 40:20</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">学生解决相关习题，教师巡视指导</p>
                          </div>
                          
                          <div className="p-3 bg-red-50 rounded-md border-l-4 border-red-500">
                            <div className="flex items-center">
                              <span className="font-medium text-red-700">总结归纳</span>
                              <Badge className="ml-2" variant="outline">40:20 - 45:00</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">归纳本节课重点内容，布置相关作业</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="knowledge">
                    <div className="space-y-4">
                      <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <h4 className="text-lg font-medium mb-3">知识结构还原</h4>
                        <p className="text-sm text-gray-600 mb-4">自动分析课堂内容，构建本节课的知识结构图谱</p>
                        
                        <div className="p-4 bg-gray-50 rounded-lg mb-4">
                          <div className="flex justify-center">
                            <div className="w-full max-w-2xl">
                              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center mb-4">
                                <span className="font-medium">牛顿第二定律</span>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                                  <span className="text-sm font-medium">力的概念</span>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                                  <span className="text-sm font-medium">质量的概念</span>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                                  <span className="text-sm font-medium">加速度的概念</span>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
                                  <span className="text-sm font-medium">F=ma公式推导</span>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
                                  <span className="text-sm font-medium">单位换算与分析</span>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-4">
                                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-center">
                                  <span className="text-sm font-medium">自由落体运动</span>
                                </div>
                                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-center">
                                  <span className="text-sm font-medium">斜面运动</span>
                                </div>
                                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-center">
                                  <span className="text-sm font-medium">连接体问题</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-500 italic">注：此知识结构图基于AI分析自动生成，可能需要教师进一步调整</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="questions">
                    <div className="space-y-4">
                      <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <h4 className="text-lg font-medium mb-3">问题链还原</h4>
                        <p className="text-sm text-gray-600 mb-4">记录并分析课堂中的问题链，展示教学问答的逻辑脉络</p>
                        
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>张</AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="ml-3 bg-blue-50 p-3 rounded-lg w-full">
                              <div className="flex items-center">
                                <span className="font-medium">张老师</span>
                                <Badge className="ml-2" variant="outline">06:12</Badge>
                              </div>
                              <p className="text-sm mt-1">牛顿第二定律告诉我们什么？</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start pl-8">
                            <div className="flex-shrink-0 mt-1">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>李</AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="ml-3 bg-gray-50 p-3 rounded-lg w-full">
                              <div className="flex items-center">
                                <span className="font-medium">李同学</span>
                                <Badge className="ml-2" variant="outline">06:25</Badge>
                              </div>
                              <p className="text-sm mt-1">物体的加速度与作用力成正比，与质量成反比。</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>张</AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="ml-3 bg-blue-50 p-3 rounded-lg w-full">
                              <div className="flex items-center">
                                <span className="font-medium">张老师</span>
                                <Badge className="ml-2" variant="outline">06:40</Badge>
                              </div>
                              <p className="text-sm mt-1">很好！那么，如果我们增加物体的质量，但保持作用力不变，加速度会如何变化？</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start pl-8">
                            <div className="flex-shrink-0 mt-1">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>王</AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="ml-3 bg-gray-50 p-3 rounded-lg w-full">
                              <div className="flex items-center">
                                <span className="font-medium">王同学</span>
                                <Badge className="ml-2" variant="outline">06:55</Badge>
                              </div>
                              <p className="text-sm mt-1">加速度会减小。</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>张</AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="ml-3 bg-blue-50 p-3 rounded-lg w-full">
                              <div className="flex items-center">
                                <span className="font-medium">张老师</span>
                                <Badge className="ml-2" variant="outline">07:10</Badge>
                              </div>
                              <p className="text-sm mt-1">正确！那么这个关系可以用数学公式如何表示？</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start pl-8">
                            <div className="flex-shrink-0 mt-1">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>赵</AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="ml-3 bg-gray-50 p-3 rounded-lg w-full">
                              <div className="flex items-center">
                                <span className="font-medium">赵同学</span>
                                <Badge className="ml-2" variant="outline">07:25</Badge>
                              </div>
                              <p className="text-sm mt-1">F=ma，所以a=F/m</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="tasks">
                    <div className="space-y-4">
                      <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <h4 className="text-lg font-medium mb-3">任务链还原</h4>
                        <p className="text-sm text-gray-600 mb-4">记录课堂中的任务分配与完成情况，展示教学活动的组织与实施</p>
                        
                        <div className="space-y-4">
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="bg-blue-100 text-blue-700 rounded-full p-2 mr-3">
                                  <span className="font-medium text-sm">1</span>
                                </div>
                                <span className="font-medium">预习任务</span>
                              </div>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">已完成</Badge>
                            </div>
                            <div className="mt-2 pl-10">
                              <p className="text-sm text-gray-600">阅读教材第三章第二节，了解牛顿第二定律的基本概念</p>
                              <p className="text-xs text-gray-500 mt-1">分配时间：上节课结束时</p>
                            </div>
                          </div>
                          
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="bg-blue-100 text-blue-700 rounded-full p-2 mr-3">
                                  <span className="font-medium text-sm">2</span>
                                </div>
                                <span className="font-medium">小组讨论</span>
                              </div>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">已完成</Badge>
                            </div>
                            <div className="mt-2 pl-10">
                              <p className="text-sm text-gray-600">讨论日常生活中牛顿第二定律的应用实例</p>
                              <p className="text-xs text-gray-500 mt-1">分配时间：课堂15:30，持续5分钟</p>
                            </div>
                          </div>
                          
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="bg-blue-100 text-blue-700 rounded-full p-2 mr-3">
                                  <span className="font-medium text-sm">3</span>
                                </div>
                                <span className="font-medium">实验操作</span>
                              </div>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">已完成</Badge>
                            </div>
                            <div className="mt-2 pl-10">
                              <p className="text-sm text-gray-600">使用小车和砝码验证牛顿第二定律</p>
                              <p className="text-xs text-gray-500 mt-1">分配时间：课堂25:10，持续10分钟</p>
                            </div>
                          </div>
                          
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="bg-blue-100 text-blue-700 rounded-full p-2 mr-3">
                                  <span className="font-medium text-sm">4</span>
                                </div>
                                <span className="font-medium">课堂练习</span>
                              </div>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">已完成</Badge>
                            </div>
                            <div className="mt-2 pl-10">
                              <p className="text-sm text-gray-600">完成习题册第25页的1-3题</p>
                              <p className="text-xs text-gray-500 mt-1">分配时间：课堂35:20，持续8分钟</p>
                            </div>
                          </div>
                          
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="bg-blue-100 text-blue-700 rounded-full p-2 mr-3">
                                  <span className="font-medium text-sm">5</span>
                                </div>
                                <span className="font-medium">课后作业</span>
                              </div>
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">进行中</Badge>
                            </div>
                            <div className="mt-2 pl-10">
                              <p className="text-sm text-gray-600">完成习题册第26-27页的习题，准备下节课的实验报告</p>
                              <p className="text-xs text-gray-500 mt-1">分配时间：课堂结束前，截止下节课</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="analysis">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">教学分析功能正在开发中...</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="notes">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">笔记功能正在开发中...</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // 否则显示记录列表
  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">课堂时光机</h2>
          <p className="mt-1 text-sm text-gray-500">回顾和评估课堂教学</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleBackToDashboard}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            返回工作台
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleBackToCalendar}
          >
            <Calendar className="mr-2 h-4 w-4" />
            查看日历
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockClassRecords.map((record) => (
          <Card 
            key={record.id}
            className={cn(
              "overflow-hidden cursor-pointer hover:shadow-md transition-shadow",
              selectedRecord === record.id && "ring-2 ring-primary"
            )}
            onClick={() => handleSelectRecord(record.id)}
          >
            <div className="relative h-40 w-full">
              <img 
                src={record.thumbnail}
                alt={record.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                <div className="absolute bottom-3 left-3 right-3">
                  <Badge className="mb-2">{record.class}</Badge>
                  <h3 className="text-lg font-semibold text-white">{record.title}</h3>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-500">{record.duration}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-500">{record.date}</span>
                </div>
              </div>
              <div className="mt-3 flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarFallback>{record.teacher.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{record.teacher}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 