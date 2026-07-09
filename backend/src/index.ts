// ===== الملف الرئيسي للخادم =====
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { config } from './config';
import routes from './routes';
import { errorHandler, notFound } from './middleware/error';
import { setupSocketIO } from './services/socket.service';

const app = express();
const httpServer = createServer(app);

// ===== إعداد Socket.io للدروس المباشرة =====
const io = new SocketServer(httpServer, {
  cors: {
    origin: config.frontendUrl,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

app.set('io', io);

// ===== Middleware عام =====
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ===== Rate Limiting =====
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: '❌ تم تجاوز الحد المسموح من الطلبات، حاول لاحقاً' },
});

app.use('/api/', limiter);

// ===== Auth Rate Limiting (أكثر تشدداً) =====
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: '❌ تم تجاوز الحد المسموح من محاولات الدخول' },
});

app.use('/api/v1/auth/login', authLimiter);

// ===== المسارات =====
app.use(`${config.apiPrefix}`, routes);

// ===== الصحة =====
app.get('/health', (_req, res) => {
  res.json({
    status: '✅ النظام يعمل',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ===== معالجة الأخطاء =====
app.use(notFound);
app.use(errorHandler);

// ===== إعداد Socket.io =====
setupSocketIO(io);

// ===== تشغيل الخادم =====
httpServer.listen(config.port, () => {
  console.log(`
╔══════════════════════════════════════════╗
║     🎓 منصة التعليم الثانوي - الجزائر    ║
║     الخادم يعمل على: http://localhost:${config.port}  ║
║     البيئة: ${config.nodeEnv.padEnd(30)}║
╚══════════════════════════════════════════╝
  `);
});

export { app, httpServer, io };
