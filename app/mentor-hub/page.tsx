"use client";

import React from "react";
import { MentorHub } from "@/components/mentor-hub/mentor-hub";
import { Users } from "lucide-react";

export default function MentorHubPage() {
  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">全员导师管理系统</h2>
          <p className="mt-1 text-sm text-gray-500">浏览、管理和分配导师资源</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-full">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <span className="text-sm font-medium text-gray-700">导师资源管理</span>
        </div>
      </div>
      
      <MentorHub />
    </div>
  );
} 