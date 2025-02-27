"use client";

import React from "react";
import { Mentor, Student } from "@lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";

interface MentorDetailProps {
  mentor: Mentor;
}

export function MentorDetail({ mentor }: MentorDetailProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={mentor.avatar} alt={mentor.name} />
            <AvatarFallback>{mentor.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{mentor.name}</CardTitle>
            <CardDescription>{mentor.title}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">个人简介</h3>
          <p className="text-sm text-muted-foreground">{mentor.bio}</p>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-2">联系方式</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">电子邮件</p>
              <p className="text-sm text-muted-foreground">{mentor.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium">电话</p>
              <p className="text-sm text-muted-foreground">{mentor.phone}</p>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-2">指导学生</h3>
          {mentor.students && mentor.students.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {mentor.students.map((student: Student, index: number) => (
                <Card key={student.id || index} className="overflow-hidden">
                  <div className="relative h-32 bg-muted">
                    {student.avatar ? (
                      <div className="absolute inset-0">
                        <img 
                          src={student.avatar} 
                          alt={student.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-muted-foreground">
                        {student.name.slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.grade}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-muted/20 rounded-lg">
              <p className="text-muted-foreground">该导师暂未管理任何学生</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 