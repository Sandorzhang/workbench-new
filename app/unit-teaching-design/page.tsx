'use client';

import React, { useState } from 'react';
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Search, Plus, Filter, 
  SlidersHorizontal, Download, Upload,
  LayoutDashboard, ChevronLeft, ChevronRight,
  Clock, Users, GraduationCap, CalendarDays
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// 模拟单元教学设计数据
const mockUnitDesign = {
  id: '1',
  title: '诗词鉴赏专题',
  subject: '初中语文',
  unit: '第一单元',
  description: '包含《静夜思》、《望岳》等经典诗词的教学设计',
  lessons: [
    {
      id: '1',
      title: '《静夜思》赏析',
      duration: '45分钟',
      grade: '初中一年级',
      targetClass: '1班',
      teacher: '张老师',
      date: '2024-03-20',
      objectives: [
        '理解诗歌的意境和情感',
        '掌握诗歌的写作特点',
        '学会鉴赏诗歌的方法'
      ],
      keyPoints: [
        '月光意象的运用',
        '思乡情感的表达',
        '诗歌的语言特色'
      ],
      activities: [
        '课前预习诗歌',
        '课堂朗读感悟',
        '小组讨论分析',
        '课后延伸练习'
      ]
    },
    {
      id: '2',
      title: '《望岳》赏析',
      duration: '45分钟',
      grade: '初中一年级',
      targetClass: '1班',
      teacher: '张老师',
      date: '2024-03-22',
      objectives: [
        '理解诗人的爱国情怀',
        '分析诗歌的表现手法',
        '感受诗歌的气势磅礴'
      ],
      keyPoints: [
        '夸张手法的运用',
        '比喻手法的分析',
        '诗歌的结构特点'
      ],
      activities: [
        '观看泰山图片',
        '诗歌朗读品味',
        '分组探讨交流',
        '写作练习'
      ]
    }
  ]
};

// 添加更多的模拟数据来展示不同状态的设计
const mockDesigns = [
  {
    id: '1',
    title: '诗词鉴赏专题',
    subject: '初中语文',
    unit: '第一单元',
    description: '包含《静夜思》、《望岳》等经典诗词的教学设计',
    status: 'published',
    lastModified: '2024-03-15',
    progress: 100,
    lessons: mockUnitDesign.lessons
  },
  {
    id: '2',
    title: '数学函数专题',
    subject: '初中数学',
    unit: '第三单元',
    description: '一次函数、二次函数的概念与应用',
    status: 'draft',
    lastModified: '2024-03-18',
    progress: 60,
    lessons: []
  },
  {
    id: '3',
    title: '物理力学专题',
    subject: '初中物理',
    unit: '第二单元',
    description: '牛顿运动定律及其应用',
    status: 'archived',
    lastModified: '2024-03-10',
    progress: 100,
    lessons: []
  }
];

interface TeachingPlanCarouselProps {
  isOpen: boolean;
  onClose: () => void;
  design: typeof mockDesigns[0];
}

const TeachingPlanCarousel = ({ isOpen, onClose, design }: TeachingPlanCarouselProps) => {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const nextLesson = () => {
    setDirection(1);
    setCurrentLesson((prev) => 
      prev === design.lessons.length - 1 ? prev : prev + 1
    );
  };

  const previousLesson = () => {
    setDirection(-1);
    setCurrentLesson((prev) => prev === 0 ? prev : prev - 1);
  };

  if (!isOpen) return null;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      y: direction > 0 ? '-20%' : '20%',
      opacity: 0,
      scale: 0.9,
      rotateZ: direction > 0 ? 10 : -10
    }),
    center: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      rotateZ: 0,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      y: direction < 0 ? '-20%' : '20%',
      opacity: 0,
      scale: 0.9,
      rotateZ: direction < 0 ? 10 : -10,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    })
  };

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div 
        className="relative h-full ml-[var(--sidebar-width)]"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div 
          className="h-full flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <div className="relative w-full max-w-6xl px-20">
            {/* 左侧切换按钮 */}
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                previousLesson();
              }}
              disabled={currentLesson === 0}
              className={cn(
                "absolute -left-4 top-1/2 -translate-y-1/2 rounded-full z-50",
                "bg-white border-0 hover:bg-gray-100",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "w-12 h-12 shadow-lg"
              )}
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </Button>

            {/* 右侧切换按钮 */}
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                nextLesson();
              }}
              disabled={currentLesson === design.lessons.length - 1}
              className={cn(
                "absolute -right-4 top-1/2 -translate-y-1/2 rounded-full z-50",
                "bg-white border-0 hover:bg-gray-100",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "w-12 h-12 shadow-lg"
              )}
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </Button>

            {/* 课时指示器 */}
            <div className="absolute -top-12 right-0 z-50">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-white text-sm">
                  第 {currentLesson + 1} / {design.lessons.length} 课时
                </span>
              </div>
            </div>

            <div className="overflow-hidden perspective-1000">
              <AnimatePresence
                initial={false}
                custom={direction}
                mode="wait"
              >
                <motion.div
                  key={currentLesson}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="bg-white rounded-lg shadow-2xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    transformOrigin: direction > 0 ? "0% 50%" : "100% 50%"
                  }}
                >
                  <div className="p-6 border-b">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center text-xl font-semibold">
                        {currentLesson + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold">
                          {design.lessons[currentLesson].title}
                        </h3>
                        <div className="flex items-center space-x-6 mt-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 mr-2" />
                            {design.lessons[currentLesson].duration}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="h-4 w-4 mr-2" />
                            {design.lessons[currentLesson].targetClass}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <GraduationCap className="h-4 w-4 mr-2" />
                            {design.lessons[currentLesson].grade}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <CalendarDays className="h-4 w-4 mr-2" />
                            {design.lessons[currentLesson].date}
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-primary/10 text-primary">
                        {design.lessons[currentLesson].teacher}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6 grid grid-cols-3 gap-6">
                    <div className="bg-primary/5 rounded-lg p-4 h-[500px] overflow-y-auto">
                      <h4 className="font-medium mb-4 flex items-center text-primary sticky top-0 bg-primary/5 py-2">
                        <span className="bg-primary/10 rounded-full p-1 mr-2">
                          <BookOpen className="h-4 w-4" />
                        </span>
                        教学目标
                      </h4>
                      <div className="space-y-3">
                        {design.lessons[currentLesson].objectives.map((objective, index) => (
                          <div
                            key={index}
                            className="flex items-start"
                          >
                            <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-sm">{objective}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 h-[500px] overflow-y-auto">
                      <h4 className="font-medium mb-4 flex items-center text-blue-600 sticky top-0 bg-blue-50 py-2">
                        <span className="bg-blue-100 rounded-full p-1 mr-2">
                          <BookOpen className="h-4 w-4" />
                        </span>
                        教学重点
                      </h4>
                      <div className="space-y-3">
                        {design.lessons[currentLesson].keyPoints.map((point, index) => (
                          <div
                            key={index}
                            className="flex items-start"
                          >
                            <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-sm">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 h-[500px] overflow-y-auto">
                      <h4 className="font-medium mb-4 flex items-center text-green-600 sticky top-0 bg-green-50 py-2">
                        <span className="bg-green-100 rounded-full p-1 mr-2">
                          <BookOpen className="h-4 w-4" />
                        </span>
                        教学活动
                      </h4>
                      <div className="space-y-3">
                        {design.lessons[currentLesson].activities.map((activity, index) => (
                          <div
                            key={index}
                            className="p-3 bg-white rounded-lg border border-green-100 text-sm flex items-start"
                          >
                            <span className="bg-green-100 text-green-600 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 shrink-0">
                              {index + 1}
                            </span>
                            {activity}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function UnitTeachingDesignPage() {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [selectedDesign, setSelectedDesign] = useState<typeof mockDesigns[0] | null>(null);

  const nextLesson = () => {
    setCurrentLesson((prev) => 
      prev === mockUnitDesign.lessons.length - 1 ? prev : prev + 1
    );
  };

  const previousLesson = () => {
    setCurrentLesson((prev) => prev === 0 ? prev : prev - 1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-50 text-green-700 border-green-200">已发布</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">草稿</Badge>;
      case 'archived':
        return <Badge className="bg-gray-50 text-gray-700 border-gray-200">已归档</Badge>;
      default:
        return null;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">单元教学设计</h2>
          <p className="mt-1 text-sm text-gray-500">管理和创建单元教学设计方案</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = '/dashboard'}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            返回工作台
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            新建设计
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 space-x-0 md:space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索单元教学设计..."
                  className="pl-10 w-full md:max-w-[400px]"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="border-dashed">
                <Filter className="mr-2 h-4 w-4" />
                筛选
              </Button>
              <Button variant="outline" size="sm" className="border-dashed">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                排序
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button variant="outline" size="sm" className="border-dashed">
                <Upload className="mr-2 h-4 w-4" />
                导入
              </Button>
              <Button variant="outline" size="sm" className="border-dashed">
                <Download className="mr-2 h-4 w-4" />
                导出
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="bg-muted/5 p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-white">全部设计</TabsTrigger>
              <TabsTrigger value="draft" className="data-[state=active]:bg-white">草稿箱</TabsTrigger>
              <TabsTrigger value="published" className="data-[state=active]:bg-white">已发布</TabsTrigger>
              <TabsTrigger value="archived" className="data-[state=active]:bg-white">已归档</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockDesigns.map((design) => (
                  <Card 
                    key={design.id}
                    className="group border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
                    onClick={() => setSelectedDesign(design)}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="space-y-1">
                        <CardTitle className="text-sm font-medium">
                          {design.subject} - {design.unit}
                        </CardTitle>
                        {getStatusBadge(design.status)}
                      </div>
                      <BookOpen className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="text-xl font-bold group-hover:text-primary transition-colors">
                            {design.title}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {design.description}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">完成进度</span>
                            <span className="font-medium">{design.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getProgressColor(design.progress)} transition-all duration-300`}
                              style={{ width: `${design.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            最后修改：{design.lastModified}
                          </span>
                          <Button variant="ghost" size="sm" className="hover:bg-primary/5">
                            查看详情 →
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="draft" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* 草稿箱内容 */}
              </div>
            </TabsContent>
            <TabsContent value="published" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* 已发布内容 */}
              </div>
            </TabsContent>
            <TabsContent value="archived" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* 已归档内容 */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <TeachingPlanCarousel
        isOpen={selectedDesign !== null}
        onClose={() => setSelectedDesign(null)}
        design={selectedDesign!}
      />
    </div>
  );
} 