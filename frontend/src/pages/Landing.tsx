import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Users, Video, Award, ChevronLeft, Star, Shield, GraduationCap } from 'lucide-react';

const Landing = () => {
  const stats = [
    { value: '10,000+', label: 'طالب مسجل' },
    { value: '500+', label: 'أستاذ معتمد' },
    { value: '5,000+', label: 'درس وفيديو' },
    { value: '50,000+', label: 'تمرين تفاعلي' },
  ];

  const features = [
    { icon: BookOpen, title: 'دروس تفاعلية', desc: 'محتوى تعليمي شامل لجميع المواد مع فيديوهات وملفات PDF' },
    { icon: Video, title: 'دروس مباشرة', desc: 'جلسات تعليمية مباشرة مع أساتذة معتمدين عبر WebRTC' },
    { icon: Users, title: 'تصحيح ذكي', desc: 'نظام تصحيح آلي بالذكاء الاصطناعي للتمارين والاختبارات' },
    { icon: Award, title: 'شهادات معتمدة', desc: 'احصل على شهادات إتمام بعد إكمال كل برنامج تعليمي' },
  ];

  const plans = [
    { name: 'أساسي', price: '1,500', period: 'شهرياً', features: ['جميع الدروس الأساسية', 'تمارين QCM', 'منتدى نقاش'], popular: false },
    { name: 'مميز', price: '3,500', period: 'شهرياً', features: ['كل شيء في الباقة الأساسية', 'دروس مباشرة', 'تصحيح بالذكاء الاصطناعي', 'تسجيلات الدروس'], popular: true },
    { name: 'سنوي', price: '25,000', period: 'سنوياً', features: ['كل شيء في الباقة المميزة', 'شهادات معتمدة', 'دروس خصوصية', 'توفير 40%'], popular: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary-600" />
            <span className="font-bold text-xl">المنصة التعليمية</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="btn-secondary">تسجيل الدخول</Link>
            <Link to="/register" className="btn-primary">إنشاء حساب</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium mb-6">
              🎓 منصة تعليمية متكاملة للثانوي الجزائري
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              تعلم بذكاء،
              <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent"> تفوق بثقة</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10">
              المنصة التعليمية الأولى في الجزائر للطور الثانوي. دروس تفاعلية، تمارين ذكية،
              وتصحيح بالذكاء الاصطناعي لجميع المستويات والشعب.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/register" className="btn-primary text-lg px-8 py-4">
                ابدأ التعلم مجاناً
                <ChevronLeft className="w-5 h-5 inline mr-2" />
              </Link>
              <Link to="/subjects" className="btn-secondary text-lg px-8 py-4">
                استعرض المواد
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <div className="text-3xl font-bold text-primary-600 mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">لماذا المنصة التعليمية؟</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="card text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">خطط الأسعار</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-12">اختر الباقة المناسبة لاحتياجاتك التعليمية</p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className={`card relative ${plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''}`}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-600 text-white text-sm rounded-full">
                    الأكثر مبيعاً
                  </span>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 mr-1">د.ج / {plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register" className={`w-full btn-${plan.popular ? 'primary' : 'secondary'} text-center block`}>
                  ابدأ الآن
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">ماذا يقول طلابنا؟</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'أحمد خالد', role: 'طالب 3AS علوم', text: 'المنصة ساعدتني كثيراً في تحسين مستواي في الرياضيات والفيزياء. التصحيح الفوري والتمارين التفاعلية رائعة!' },
              { name: 'سارة محمد', role: 'طالبة 2AS آداب', text: 'الدروس المباشرة مع الأساتذة والسبورة التفاعلية جعلت التعلم ممتعاً وسهلاً. أنصح الجميع بالتسجيل' },
              { name: 'مريم علي', role: 'طالبة 1AS', text: 'بعد استخدام المنصة لمدة شهر، تحسنت درجاتي بشكل ملحوظ. خطة التعلم المخصصة غيرت كل شيء' },
            ].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="card">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-200 dark:bg-primary-800 rounded-full flex items-center justify-center font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-8 h-8 text-primary-400" />
              <span className="font-bold text-xl">المنصة التعليمية</span>
            </div>
            <p className="text-gray-400">منصة تعليمية إلكترونية متكاملة للطور الثانوي في الجزائر</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/subjects" className="hover:text-white">المواد الدراسية</Link></li>
              <li><Link to="/live" className="hover:text-white">الدروس المباشرة</Link></li>
              <li><Link to="/forum" className="hover:text-white">المنتدى</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">المستويات</h4>
            <ul className="space-y-2 text-gray-400">
              <li>السنة الأولى ثانوي</li>
              <li>السنة الثانية ثانوي</li>
              <li>السنة الثالثة ثانوي</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">تواصل معنا</h4>
            <ul className="space-y-2 text-gray-400">
              <li>contact@edu-platform.dz</li>
              <li>+213 123 456 789</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          © 2025 المنصة التعليمية. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
