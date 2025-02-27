'use client';

import React, { useEffect, useState } from 'react';
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from '@/components/ui/separator';
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
import { usePathname } from 'next/navigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

// 页面标题映射
const pageTitleMap: Record<string, { title: string, parent?: { title: string, path: string } }> = {
  '/dashboard': { title: '工作台' },
  '/classroom-timemachine': { 
    title: '课堂时光机',
    parent: { title: '工作台', path: '/dashboard' }
  },
  '/unit-teaching-design': {
    title: '单元教学设计',
    parent: { title: '工作台', path: '/dashboard' }
  },
  '/mentor-hub': {
    title: '全员导师制',
    parent: { title: '工作台', path: '/dashboard' }
  },
  '/calendar': {
    title: '我的日历'
  },
  '/admin/users': {
    title: '师生信息管理',
    parent: { title: '工作台', path: '/dashboard' }
  }
};

// 从cookie中获取侧边栏状态
function getSidebarStateFromCookie() {
  if (typeof document === 'undefined') return undefined;
  
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith('sidebar_state=')) {
      const value = cookie.substring('sidebar_state='.length);
      return value === 'true';
    }
  }
  return undefined;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const [sidebarState, setSidebarState] = useState<boolean | undefined>(undefined);
  
  // 在客户端加载时读取cookie
  useEffect(() => {
    setSidebarState(getSidebarStateFromCookie());
  }, []);
  
  // 登录页不使用此布局
  if (pathname === '/login') {
    return <>{children}</>;
  }
  
  const pageInfo = pageTitleMap[pathname] || { title: '页面' };
  
  return (
    <SidebarProvider defaultOpen={sidebarState === undefined ? true : sidebarState}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {pageInfo.parent && (
                  <>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href={pageInfo.parent.path}>
                        {pageInfo.parent.title}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </>
                )}
                <BreadcrumbItem>
                  <BreadcrumbPage>{pageInfo.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 