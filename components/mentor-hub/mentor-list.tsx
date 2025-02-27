"use client";

import React from "react";
import { Mentor } from "@lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { AvatarGroup } from "../ui/avatar-group";

interface MentorListProps {
  mentors: Mentor[];
  onSelectMentor: (mentor: Mentor) => void;
}

export function MentorList({ mentors, onSelectMentor }: MentorListProps) {
  return (
    <div className="w-full">
      {mentors.length === 0 ? (
        <div className="text-center py-10">暂无导师数据</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">序号</TableHead>
              <TableHead className="w-[180px]">导师信息</TableHead>
              <TableHead>管理学生</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mentors.map((mentor, index) => (
              <TableRow key={mentor.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={mentor.avatar} alt={mentor.name} />
                      <AvatarFallback>{mentor.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{mentor.name}</div>
                      <div className="text-sm text-muted-foreground">{mentor.title}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {mentor.students && mentor.students.length > 0 ? (
                    <div className="flex items-center">
                      <AvatarGroup>
                        {mentor.students.map((student, i) => (
                          <Avatar key={student.id || i} className="border-2 border-background">
                            <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback>{student.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                        ))}
                      </AvatarGroup>
                      <span className="ml-2 text-sm text-muted-foreground">
                        {mentor.students.length} 名学生
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">暂无管理学生</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" onClick={() => onSelectMentor(mentor)}>
                    查看详情
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
} 