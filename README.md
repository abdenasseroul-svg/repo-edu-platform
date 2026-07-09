# 🎓 المنصة التعليمية - الثانوي الجزائري

منصة تعليمية إلكترونية متكاملة للطور الثانوي في الجزائر، تخدم جميع المستويات (1AS, 2AS, 3AS) وجميع الشعب.

## 🚀 التقنيات المستخدمة

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (تصميم عصري)
- Framer Motion (أنيميشن)
- React Query (إدارة البيانات)
- Zustand (إدارة الحالة)
- React Router v6 (التوجيه)
- Socket.io Client (الدروس المباشرة)
- Recharts / Chart.js (الرسوم البيانية)
- React Hook Form + Zod (التحقق من البيانات)

### Backend
- Node.js + Express + TypeScript
- Prisma ORM (قاعدة البيانات)
- PostgreSQL (قاعدة البيانات الرئيسية)
- Redis (التخزين المؤقت)
- Socket.io (Real-time)
- JWT + Passport (المصادقة)
- Helmet + Rate Limiting (الأمان)
- Nodemailer (البريد الإلكتروني)

### DevOps
- Docker + Docker Compose
- Nginx (وكيل عكسي)
- ESLint + Prettier

## 📁 هيكل المشروع

```
edu-platform/
├── prisma/                    # قاعدة البيانات
│   ├── schema.prisma          # الملف الرئيسي
│   ├── generators/
│   └── models/                # نماذج Prisma
│       ├── core/              # المستخدمين والأدوار
│       ├── education/         # المحتوى التعليمي
│       ├── assessment/        # التقييم والاختبارات
│       ├── ai/                # الذكاء الاصطناعي
│       ├── live/              # الدروس المباشرة
│       ├── payments/          # المدفوعات
│       ├── social/            # التواصل الاجتماعي
│       ├── analytics/         # التحليلات
│       ├── security/          # الأمان
│       └── system/            # النظام
├── backend/                   # خادم API
│   └── src/
│       ├── config/            # الإعدادات
│       ├── controllers/       # المتحكمات
│       ├── routes/            # المسارات
│       ├── middleware/        # الوسائط
│       ├── services/          # الخدمات
│       ├── utils/             # الأدوات
│       └── database/          # قاعدة البيانات
├── frontend/                  # واجهة المستخدم
│   └── src/
│       ├── components/        # المكونات
│       ├── pages/             # الصفحات
│       ├── hooks/             # الخطافات
│       ├── context/           # السياق
│       ├── services/          # الخدمات
│       ├── types/             # الأنواع
│       └── utils/             # الأدوات
└── docker/                    # Docker
```

## 🎯 الميزات الرئيسية

### 👨‍🎓 للطلاب
- ✅ تسجيل حساب مع تحديد المستوى والشعبة
- ✅ اختبار تحديد مستوى ذكي
- ✅ خطة تعليمية مخصصة بالذكاء الاصطناعي
- ✅ دروس تفاعلية (فيديو، PDF، Flashcards)
- ✅ تمارين QCM مع تصحيح فوري
- ✅ دروس مباشرة مع أساتذة (WebRTC)
- ✅ سبورة تفاعلية ودردشة
- ✅ تقارير أداء وتحليلات
- ✅ شهادات إتمام

### 👨‍🏫 للأساتذة
- ✅ لوحة تحكم خاصة
- ✅ إدارة الطلاب والمجموعات
- ✅ إنشاء تمارين مخصصة
- ✅ جدولة دروس مباشرة
- ✅ تصحيح يدوي + AI
- ✅ تقارير PDF

### 👨‍💼 للإدارة
- ✅ إدارة المستخدمين والأساتذة
- ✅ إدارة المحتوى التعليمي
- ✅ بنك أسئلة مركزي
- ✅ إدارة الاشتراكات والباقات
- ✅ تقارير مالية وتحليلات
- ✅ إعدادات المنصة
- ✅ سجلات النظام

## 🚀 بدء التشغيل

### المتطلبات
- Node.js 20+
- PostgreSQL 16+
- Redis 7+

### التثبيت المحلي

```bash
# 1. نسخ المتغيرات البيئية
cp backend/.env.example backend/.env

# 2. تثبيت الاعتماديات
cd backend && npm install
cd ../frontend && npm install

# 3. إعداد قاعدة البيانات
cd ../backend
npx prisma generate --schema=../prisma/schema.prisma
npx prisma db push --schema=../prisma/schema.prisma

# 4. تشغيل التطبيق
npm run dev  # Backend على port 4000
# في terminal آخر
cd ../frontend && npm run dev  # Frontend على port 5173
```

### التشغيل عبر Docker

```bash
docker-compose up -d
```

## 📊 النماذج الرئيسية

### Core
- `User` - المستخدمون (طالب/أستاذ/أدمن)
- `Student` - بيانات الطالب
- `Teacher` - بيانات الأستاذ
- `Organization` - المؤسسات
- `ClassGroup` - المجموعات الدراسية

### Education
- `Subject` - المواد الدراسية
- `Chapter` - الفصول
- `Lesson` - الدروس
- `Resource` - المصادر التعليمية

### Assessment
- `Question` - الأسئلة
- `Quiz` - الاختبارات
- `Assignment` - التمارين
- `Submission` - إجابات الطلاب

### AI
- `AIChat` - الدردشة الذكية
- `AIRecommendation` - التوصيات
- `AIAnalysis` - التحليلات

### Live
- `LiveClass` - الدروس المباشرة
- `Whiteboard` - السبورة التفاعلية
- `Recording` - التسجيلات

## 🔒 الأمان

- تشفير SSL/TLS
- JWT + Refresh Tokens
- Rate Limiting
- Helmet security headers
- SQL Injection protection
- XSS protection
- CORS configuration
- Input validation (Zod)

## 📝 الترخيص

MIT License

## 🤝 المساهمة

نرحب بمساهماتكم! يرجى قراءة [CONTRIBUTING.md](CONTRIBUTING.md) للمزيد من المعلومات.
