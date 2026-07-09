// خدمة Socket.io للدروس المباشرة والدردشة الفورية
import { Server as SocketServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  role?: string;
}

export const setupSocketIO = (io: SocketServer) => {
  // وسيط المصادقة
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    if (!token) {
      return next(new Error('❌ لم يتم توفير رمز الدخول'));
    }

    try {
      const decoded = jwt.verify(token as string, config.jwt.secret) as any;
      socket.userId = decoded.userId;
      socket.role = decoded.role;
      next();
    } catch (error) {
      next(new Error('❌ رمز الدخول غير صالح'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`✅ مستخدم متصل: ${socket.userId} (${socket.role})`);

    // الانضمام لغرفة درس مباشر
    socket.on('join:class', (classId: string) => {
      socket.join(`class:${classId}`);
      io.to(`class:${classId}`).emit('user:joined', {
        userId: socket.userId,
        role: socket.role,
      });
    });

    // مغادرة غرفة درس مباشر
    socket.on('leave:class', (classId: string) => {
      socket.leave(`class:${classId}`);
      io.to(`class:${classId}`).emit('user:left', {
        userId: socket.userId,
      });
    });

    // إرسال رسالة دردشة
    socket.on('chat:message', (data: { classId: string; content: string }) => {
      io.to(`class:${data.classId}`).emit('chat:message', {
        userId: socket.userId,
        content: data.content,
        timestamp: new Date(),
      });
    });

    // رفع اليد
    socket.on('hand:raise', (classId: string) => {
      io.to(`class:${classId}`).emit('hand:raised', {
        userId: socket.userId,
      });
    });

    // تحديث السبورة التفاعلية
    socket.on('whiteboard:update', (data: { classId: string; data: any }) => {
      socket.to(`class:${data.classId}`).emit('whiteboard:update', data.data);
    });

    // إشارات WebRTC
    socket.on('webrtc:offer', (data: { targetId: string; offer: any }) => {
      io.to(data.targetId).emit('webrtc:offer', {
        senderId: socket.userId,
        offer: data.offer,
      });
    });

    socket.on('webrtc:answer', (data: { targetId: string; answer: any }) => {
      io.to(data.targetId).emit('webrtc:answer', {
        senderId: socket.userId,
        answer: data.answer,
      });
    });

    socket.on('webrtc:ice-candidate', (data: { targetId: string; candidate: any }) => {
      io.to(data.targetId).emit('webrtc:ice-candidate', {
        senderId: socket.userId,
        candidate: data.candidate,
      });
    });

    // قطع الاتصال
    socket.on('disconnect', () => {
      console.log(`❌ مستخدم غير متصل: ${socket.userId}`);
    });
  });
};
