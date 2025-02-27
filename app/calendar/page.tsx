'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Plus, 
  Users,
  Loader2
} from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { MswInitializer } from '@/components/MswInitializer';

// 日历事件类型
interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  type: string;
  description: string;
  participants: string[];
}

// 获取当前月份的天数
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

// 获取当前月份的第一天是星期几
const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

// 获取月份名称
const getMonthName = (month: number) => {
  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];
  return monthNames[month];
};

// 事件类型对应的颜色和图标
const eventTypeConfig: Record<string, { color: string, bgColor: string }> = {
  'meeting': { color: 'text-blue-600', bgColor: 'bg-blue-100' },
  'class': { color: 'text-green-600', bgColor: 'bg-green-100' },
  'exam': { color: 'text-red-600', bgColor: 'bg-red-100' },
  'activity': { color: 'text-purple-600', bgColor: 'bg-purple-100' },
  'holiday': { color: 'text-amber-600', bgColor: 'bg-amber-100' },
  'classroom-impression': { color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
};

export default function CalendarPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  
  // 日历状态
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  
  // 获取当前年月
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  // 数据获取逻辑 - 移除认证检查
  useEffect(() => {
    console.log('获取日历事件数据...');
    
    // 模拟数据加载
    setIsLoading(true);
    setTimeout(() => {
      setEvents(mockEvents);
      setIsLoading(false);
    }, 800);
  }, []);
  
  // 日历导航
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };
  
  // 获取当前月的日历数据
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
  
  // 生成日历网格
  const calendarDays = [];
  
  // 添加上个月的剩余天数
  const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1);
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push({
      day: prevMonthDays - firstDayOfMonth + i + 1,
      isCurrentMonth: false,
      date: new Date(currentYear, currentMonth - 1, prevMonthDays - firstDayOfMonth + i + 1)
    });
  }
  
  // 添加当前月的天数
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(currentYear, currentMonth, i)
    });
  }
  
  // 添加下个月的天数以填充网格
  const remainingDays = 42 - calendarDays.length; // 6行7列 = 42个格子
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(currentYear, currentMonth + 1, i)
    });
  }
  
  // 检查日期是否是今天
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  // 检查日期是否被选中
  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };
  
  // 获取指定日期的事件
  const getEventsForDate = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return events.filter(event => event.date === formattedDate);
  };
  
  // 检查日期是否有事件
  const hasEvents = (date: Date) => {
    return getEventsForDate(date).length > 0;
  };
  
  // 处理日期点击
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };
  
  // 获取选中日期的事件
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  
  // 格式化日期显示
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    });
  };
  
  // 处理事件点击
  const handleEventClick = (event: CalendarEvent) => {
    if (event.type === 'classroom-impression') {
      // 提取课堂记录ID（假设存储在description字段中）
      const recordId = event.description.split('recordId:')[1]?.trim();
      if (recordId) {
        router.push(`/classroom-timemachine?recordId=${recordId}`);
      } else {
        router.push('/classroom-timemachine');
      }
    }
  };
  
  // 模拟日历事件数据
  const mockEvents: CalendarEvent[] = [
    {
      id: '1',
      title: '教师会议',
      date: '2023-10-15',
      startTime: '09:00',
      endTime: '10:30',
      location: '会议室A',
      type: 'meeting',
      description: '讨论本学期教学计划和学生评估方法',
      participants: ['王校长', '李主任', '张老师', '刘老师']
    },
    {
      id: '2',
      title: '数学课',
      date: '2023-10-16',
      startTime: '08:00',
      endTime: '09:40',
      location: '教室301',
      type: 'class',
      description: '几何证明方法讲解与练习',
      participants: ['高一(3)班']
    },
    {
      id: '3',
      title: '期中考试',
      date: '2023-10-20',
      startTime: '08:00',
      endTime: '11:30',
      location: '考场1-10',
      type: 'exam',
      description: '语文、数学、英语三科考试',
      participants: ['高一年级全体学生']
    },
    {
      id: '4',
      title: '校园文化节',
      date: '2023-10-25',
      startTime: '13:00',
      endTime: '17:00',
      location: '学校操场',
      type: 'activity',
      description: '包括文艺表演、游戏活动和美食展示',
      participants: ['全校师生']
    },
    {
      id: '5',
      title: '国庆假期',
      date: '2023-10-01',
      startTime: '00:00',
      endTime: '23:59',
      location: '',
      type: 'holiday',
      description: '国庆节假期，学校放假',
      participants: []
    },
    // 添加课堂印象事件
    {
      id: '6',
      title: '物理课课堂印象',
      date: '2023-10-18',
      startTime: '10:00',
      endTime: '11:40',
      location: '教室305',
      type: 'classroom-impression',
      description: '电磁感应原理讲解与实验 recordId:1',
      participants: ['高二(2)班']
    },
    {
      id: '7',
      title: '语文课课堂印象',
      date: '2023-10-19',
      startTime: '08:00',
      endTime: '09:40',
      location: '教室203',
      type: 'classroom-impression',
      description: '古代诗词赏析与写作技巧 recordId:2',
      participants: ['高一(5)班']
    },
    {
      id: '8',
      title: '化学课课堂印象',
      date: '2023-10-22',
      startTime: '14:00',
      endTime: '15:40',
      location: '实验室2',
      type: 'classroom-impression',
      description: '有机化学反应实验与观察 recordId:3',
      participants: ['高三(1)班']
    }
  ];
  
  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">我的日历</h2>
          <p className="mt-1 text-sm text-gray-500">管理您的课程、会议和学校活动</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            今天
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="default" size="sm" className="ml-2">
            <Plus className="h-4 w-4 mr-1" />
            添加事件
          </Button>
        </div>
      </div>
      
      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 日历视图 */}
        <div className="md:col-span-2">
          <Card className="shadow-sm border border-gray-100">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {getMonthName(currentMonth)} {currentYear}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {events.length} 个事件
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* 星期标题 */}
              <div className="grid grid-cols-7 mb-2">
                {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
                  <div 
                    key={index} 
                    className="text-center py-2 text-sm font-medium text-gray-500"
                  >
                    {day}
                  </div>
                ))}
              </div>
              
              {/* 日历网格 */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <div 
                    key={index}
                    onClick={() => handleDateClick(day.date)}
                    className={cn(
                      "h-24 p-1 border rounded-md relative cursor-pointer transition-colors",
                      day.isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-400",
                      isToday(day.date) && "border-primary",
                      isSelected(day.date) && "ring-2 ring-primary ring-offset-1",
                      !day.isCurrentMonth && "hover:bg-gray-100",
                      day.isCurrentMonth && "hover:bg-gray-50"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <span className={cn(
                        "text-sm font-medium",
                        isToday(day.date) && "bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center"
                      )}>
                        {day.day}
                      </span>
                      {hasEvents(day.date) && (
                        <Badge variant="outline" className="text-[10px] px-1 py-0">
                          {getEventsForDate(day.date).length}
                        </Badge>
                      )}
                    </div>
                    
                    {/* 事件指示器 */}
                    <div className="mt-1 space-y-1 overflow-hidden max-h-16">
                      {getEventsForDate(day.date).slice(0, 2).map((event, eventIndex) => (
                        <div 
                          key={eventIndex}
                          className={cn(
                            "text-[10px] px-1 py-0.5 rounded truncate",
                            eventTypeConfig[event.type]?.bgColor || "bg-gray-100",
                            eventTypeConfig[event.type]?.color || "text-gray-600"
                          )}
                        >
                          {event.title}
                        </div>
                      ))}
                      {getEventsForDate(day.date).length > 2 && (
                        <div className="text-[10px] text-gray-500 pl-1">
                          +{getEventsForDate(day.date).length - 2} 更多
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* 事件列表 */}
        <div className="md:col-span-1">
          <Card className="h-full shadow-sm border border-gray-100">
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate ? formatDate(selectedDate) : '今日事件'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : selectedDateEvents.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className="border rounded-lg p-3 hover:shadow-sm transition-shadow cursor-pointer"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{event.title}</h4>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{event.startTime} - {event.endTime}</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{event.location}</span>
                            </div>
                          )}
                          {event.participants && event.participants.length > 0 && (
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <Users className="h-3 w-3 mr-1" />
                              <span>{event.participants.join(', ')}</span>
                            </div>
                          )}
                        </div>
                        <Badge className={cn(
                          "ml-2",
                          eventTypeConfig[event.type]?.bgColor || "bg-gray-100",
                          eventTypeConfig[event.type]?.color || "text-gray-600"
                        )}>
                          {event.type === 'meeting' && '会议'}
                          {event.type === 'class' && '课程'}
                          {event.type === 'exam' && '考试'}
                          {event.type === 'activity' && '活动'}
                          {event.type === 'holiday' && '假期'}
                          {event.type === 'classroom-impression' && '课堂印象'}
                          {!['meeting', 'class', 'exam', 'activity', 'holiday', 'classroom-impression'].includes(event.type) && event.type}
                        </Badge>
                      </div>
                      {event.description && (
                        <p className="mt-2 text-sm text-gray-600">
                          {event.type === 'classroom-impression' 
                            ? event.description.split('recordId:')[0].trim() 
                            : event.description}
                        </p>
                      )}
                      {event.type === 'classroom-impression' && (
                        <div className="mt-2">
                          <Button variant="outline" size="sm">
                            查看课堂时光机
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <CalendarIcon className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    {selectedDate ? '该日期没有安排事件' : '今天没有安排事件'}
                  </p>
                  <Button variant="outline" size="sm" className="mt-4">
                    <Plus className="h-4 w-4 mr-1" />
                    添加事件
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}