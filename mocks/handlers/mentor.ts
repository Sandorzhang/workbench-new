import { http, HttpResponse } from 'msw';
import { db } from '../db';

// 导师数据处理程序
export const mentorHandlers = [
  // 获取所有导师
  http.get('/api/mentors', () => {
    console.log('MSW: 接收到获取所有导师的请求');
    const mentors = db.mentor.getAll();
    console.log(`MSW: 返回 ${mentors.length} 个导师数据`);
    return HttpResponse.json(mentors);
  }),

  // 获取单个导师
  http.get('/api/mentors/:id', ({ params }) => {
    console.log(`MSW: 接收到获取导师(ID: ${params.id})的请求`);
    const { id } = params;
    const mentor = db.mentor.findFirst({
      where: {
        id: {
          equals: id as string,
        },
      },
    });

    if (!mentor) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(mentor);
  }),

  // 创建导师
  http.post('/api/mentors', async ({ request }) => {
    const newMentor = await request.json();
    const mentor = db.mentor.create(newMentor);
    return HttpResponse.json(mentor, { status: 201 });
  }),

  // 更新导师
  http.put('/api/mentors/:id', async ({ params, request }) => {
    const { id } = params;
    const updates = await request.json();
    
    const existingMentor = db.mentor.findFirst({
      where: {
        id: {
          equals: id as string,
        },
      },
    });

    if (!existingMentor) {
      return new HttpResponse(null, { status: 404 });
    }

    const updatedMentor = db.mentor.update({
      where: {
        id: {
          equals: id as string,
        },
      },
      data: updates,
    });

    return HttpResponse.json(updatedMentor);
  }),

  // 删除导师
  http.delete('/api/mentors/:id', ({ params }) => {
    const { id } = params;
    
    const existingMentor = db.mentor.findFirst({
      where: {
        id: {
          equals: id as string,
        },
      },
    });

    if (!existingMentor) {
      return new HttpResponse(null, { status: 404 });
    }

    db.mentor.delete({
      where: {
        id: {
          equals: id as string,
        },
      },
    });

    return new HttpResponse(null, { status: 204 });
  }),

  // 分配学生给导师
  http.post('/api/mentors/:mentorId/students/:studentId', ({ params }) => {
    const { mentorId, studentId } = params;
    
    const mentor = db.mentor.findFirst({
      where: {
        id: {
          equals: mentorId as string,
        },
      },
    });

    if (!mentor) {
      return new HttpResponse(null, { status: 404, statusText: 'Mentor not found' });
    }

    const student = db.student.findFirst({
      where: {
        id: {
          equals: studentId as string,
        },
      },
    });

    if (!student) {
      return new HttpResponse(null, { status: 404, statusText: 'Student not found' });
    }

    // 更新导师状态
    const updatedMentor = db.mentor.update({
      where: {
        id: {
          equals: mentorId as string,
        },
      },
      data: {
        isAssigned: true,
        students: [...(mentor.students || []), student],
      },
    });

    return HttpResponse.json(updatedMentor);
  }),

  // 从导师移除学生
  http.delete('/api/mentors/:mentorId/students/:studentId', ({ params }) => {
    const { mentorId, studentId } = params;
    
    const mentor = db.mentor.findFirst({
      where: {
        id: {
          equals: mentorId as string,
        },
      },
    });

    if (!mentor) {
      return new HttpResponse(null, { status: 404, statusText: 'Mentor not found' });
    }

    if (!mentor.students || mentor.students.length === 0) {
      return new HttpResponse(null, { status: 404, statusText: 'No students assigned to this mentor' });
    }

    // 移除学生
    const updatedStudents = mentor.students.filter(s => s.id !== studentId);
    
    // 更新导师状态
    const updatedMentor = db.mentor.update({
      where: {
        id: {
          equals: mentorId as string,
        },
      },
      data: {
        isAssigned: updatedStudents.length > 0,
        students: updatedStudents,
      },
    });

    return HttpResponse.json(updatedMentor);
  }),
]; 