// وسيط معالجة الأخطاء المركزي
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { config } from '../config';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: '❌ بيانات غير صالحة',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        status: 'error',
        message: '❌ هذا السجل موجود مسبقاً',
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        message: '❌ السجل المطلوب غير موجود',
      });
    }
  }

  if (config.nodeEnv === 'development') {
    console.error('❌ خطأ:', err);
    return res.status(500).json({
      status: 'error',
      message: err.message,
      stack: err.stack,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: '❌ حدث خطأ داخلي في الخادم',
  });
};

export const notFound = (_req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: '❌ المسار المطلوب غير موجود',
  });
};
