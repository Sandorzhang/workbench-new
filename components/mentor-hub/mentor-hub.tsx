"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { MentorList } from "./mentor-list";
import { MentorDetail } from "./mentor-detail";
import { Button } from "../ui/button";
import { Mentor } from "@lib/types";
import { Loader2 } from "lucide-react";

export function MentorHub() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log(`尝试获取导师数据... (尝试: ${retryCount + 1})`);
        const response = await fetch('/api/mentors');
        
        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          console.error(`获取导师数据失败 (状态: ${response.status}):`, errorText);
          throw new Error(`获取导师数据失败 (${response.status}): ${errorText}`);
        }
        
        const data = await response.json();
        console.log('成功获取导师数据:', data);
        setMentors(data);
      } catch (err) {
        console.error('导师数据获取错误:', err);
        setError(`获取导师数据失败: ${err instanceof Error ? err.message : '未知错误'}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentors();
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prevCount => prevCount + 1);
  };

  const handleSelectMentor = (mentor: Mentor) => {
    setSelectedMentor(mentor);
  };

  const handleBackToList = () => {
    setSelectedMentor(null);
  };

  return (
    <Card className="shadow-sm border border-gray-100">
      <CardContent className="p-0">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start bg-muted/30 px-4 pt-4 border-b border-gray-100">
            <TabsTrigger value="all" className="rounded-t-lg rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary">全部导师</TabsTrigger>
            <TabsTrigger value="with-students" className="rounded-t-lg rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary">有学生</TabsTrigger>
            <TabsTrigger value="without-students" className="rounded-t-lg rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary">无学生</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="p-4 pt-6">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-red-500 py-10 text-center">
                <p>{error}</p>
                <Button 
                  variant="outline" 
                  onClick={handleRetry} 
                  className="mt-4"
                >
                  重试
                </Button>
              </div>
            ) : selectedMentor ? (
              <div>
                <Button variant="outline" onClick={handleBackToList} className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                  返回列表
                </Button>
                <MentorDetail mentor={selectedMentor} />
              </div>
            ) : (
              <MentorList mentors={mentors} onSelectMentor={handleSelectMentor} />
            )}
          </TabsContent>
          
          <TabsContent value="with-students" className="p-4 pt-6">
            {!selectedMentor && !isLoading && !error && (
              <MentorList 
                mentors={mentors.filter(mentor => mentor.students && mentor.students.length > 0)} 
                onSelectMentor={handleSelectMentor}
              />
            )}
          </TabsContent>
          
          <TabsContent value="without-students" className="p-4 pt-6">
            {!selectedMentor && !isLoading && !error && (
              <MentorList 
                mentors={mentors.filter(mentor => !mentor.students || mentor.students.length === 0)} 
                onSelectMentor={handleSelectMentor}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 