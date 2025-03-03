"use client"

import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
  Settings,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavUserAuth({
  user,
  onLogout,
}: {
  user?: {
    name: string
    email: string
    avatar: string
    role: string
  }
  onLogout?: () => Promise<void>
}) {
  const { isMobile } = useSidebar()
  
  // 默认用户信息（当未提供用户时使用）
  const defaultUser = {
    name: '张老师',
    email: 'teacher@school.edu',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    role: 'teacher'
  };
  
  // 使用提供的用户或默认用户
  const currentUser = user || defaultUser;
  
  // 用户角色显示文本
  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      'admin': '管理员',
      'teacher': '教师',
    };
    
    return roleMap[role] || role;
  };
  
  // 默认登出处理函数
  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    } else {
      console.log('登出功能已禁用');
      // 可以添加提示信息
      alert('当前处于演示模式，登出功能已禁用');
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="rounded-lg">{currentUser.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{currentUser.name}</span>
                <span className="truncate text-xs">{currentUser.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback className="rounded-lg">{currentUser.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{currentUser.name}</span>
                  <span className="truncate text-xs">{currentUser.email}</span>
                  <Badge variant="outline" className="mt-1 text-[10px] py-0 w-fit">
                    {getRoleDisplay(currentUser.role)}
                  </Badge>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              个人设置
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer hover:bg-red-50 focus:bg-red-50">
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
} 