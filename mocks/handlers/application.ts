import { http, HttpResponse } from 'msw';
import { db } from '../db';

export const applicationHandlers = [
  // 获取所有应用
  http.get('/api/applications', () => {
    console.log('📝 GET /api/applications - 请求应用列表');
    
    try {
      const applications = db.application.getAll();
      console.log(`✅ GET /api/applications - 成功返回 ${applications.length} 个应用`);
      return HttpResponse.json(applications);
    } catch (error) {
      console.error('❌ GET /api/applications - 获取应用列表失败:', error);
      return new HttpResponse(
        JSON.stringify({ error: '获取应用列表失败' }), 
        { status: 500 }
      );
    }
  }),

  // 获取单个应用
  http.get('/api/applications/:id', ({ params }) => {
    const { id } = params;
    console.log(`📝 GET /api/applications/${id} - 请求单个应用`);
    
    try {
      const application = db.application.findFirst({
        where: {
          id: {
            equals: id as string,
          },
        },
      });

      if (!application) {
        console.log(`❌ GET /api/applications/${id} - 未找到应用`);
        return new HttpResponse(null, { status: 404 });
      }

      console.log(`✅ GET /api/applications/${id} - 成功返回应用: ${application.name}`);
      return HttpResponse.json(application);
    } catch (error) {
      console.error(`❌ GET /api/applications/${id} - 获取应用失败:`, error);
      return new HttpResponse(
        JSON.stringify({ error: '获取应用失败' }), 
        { status: 500 }
      );
    }
  }),
]; 