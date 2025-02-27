import { userHandlers } from './user';
import { authHandlers } from './auth';
import { imageHandlers } from './image';
import { calendarHandlers } from './calendar';
import { mentorHandlers } from './mentor';
// 导入其他处理器...

export const handlers = [
  ...userHandlers,
  ...authHandlers,
  ...imageHandlers,
  ...calendarHandlers,
  ...mentorHandlers,
  // 其他处理器...
]; 