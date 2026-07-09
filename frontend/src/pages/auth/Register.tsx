import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

const LEVELS = [
  { value: 'ONE_AS', label: 'السنة الأولى ثانوي' },
  { value: 'TWO_AS', label: 'السنة الثانية ثانوي' },
  { value: 'THREE_AS', label: 'السنة الثالثة ثانوي' },
];

const STREAMS = [
  { value: 'SCIENCE', label: 'علوم تجريبية' },
  { value: 'LITERATURE', label: 'آداب وفلسفة' },
  { value: 'TECHNICAL_MATH', label: 'تقني رياضي' },
  { value: 'MATH', label: 'رياضيات' },
  { value: 'FOREIGN_LANGUAGES', label: 'لغات أجنبية' },
  { value: 'MANAGEMENT', label: 'تسيير واقتصاد' },
];

const Register = () => {
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '',
    firstName: '', lastName: '', phone: '',
    role: 'STUDENT', level: 'ONE_AS', stream: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('❌ كلمة المرور غير متطابقة');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        stream: form.role === 'STUDENT' ? (form.stream || undefined) : undefined,
        level: form.role === 'STUDENT' ? form.level : undefined,
        studyHoursPerWeek: 10,
      };
      await register(payload);
      toast.success('✅ تم إنشاء الحساب بنجاح!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || '❌ فشل إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <GraduationCap className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">إنشاء حساب جديد</h1>
          <p className="text-gray-500 mt-2">انضم إلى مجتمع التعلم</p>
        </div>

        <div className="card">
          {/* Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                  {s}
                </div>
                <span className={`text-sm ${step >= s ? 'text-primary-600 font-medium' : 'text-gray-400'}`}>
                  {s === 1 ? 'المعلومات' : s === 2 ? 'التعليم' : 'التأكيد'}
                </span>
                {s < 3 && <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600" />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">الاسم</label>
                    <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className="input-field" placeholder="الاسم" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">اللقب</label>
                    <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className="input-field" placeholder="اللقب" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field" placeholder="أدخل بريدك الإلكتروني" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="input-field" placeholder="أدخل رقم هاتفك" />
                </div>
                <button type="button" onClick={() => setStep(2)} className="btn-primary w-full">التالي</button>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">نوع الحساب</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setForm({ ...form, role: 'STUDENT' })}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${form.role === 'STUDENT' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                      <GraduationCap className="w-6 h-6 mx-auto mb-1" />
                      <span>طالب</span>
                    </button>
                    <button type="button" onClick={() => setForm({ ...form, role: 'TEACHER' })}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${form.role === 'TEACHER' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                      <GraduationCap className="w-6 h-6 mx-auto mb-1" />
                      <span>أستاذ</span>
                    </button>
                  </div>
                </div>

                {form.role === 'STUDENT' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">المستوى الدراسي</label>
                      <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}
                        className="input-field" required>
                        {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">الشعبة</label>
                      <select value={form.stream} onChange={(e) => setForm({ ...form, stream: e.target.value })}
                        className="input-field">
                        <option value="">اختر الشعبة</option>
                        {STREAMS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                  </>
                )}

                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">السابق</button>
                  <button type="button" onClick={() => setStep(3)} className="btn-primary flex-1">التالي</button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div>
<label className="block text-sm font-medium mb-2">كلمة المرور</label>
                    <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="input-field" placeholder="8 أحرف على الأقل" required minLength={8} />
                    <p className="text-xs text-gray-500 mt-1">يجب أن تحتوي على حرف كبير ورقم</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">تأكيد كلمة المرور</label>
                  <input type="password" value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="input-field" placeholder="أعد إدخال كلمة المرور" required />
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(2)} className="btn-secondary flex-1">السابق</button>
                  <button type="submit" disabled={loading} className="btn-primary flex-1">
                    {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
                  </button>
                </div>
              </>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              لديك حساب بالفعل؟{' '}
              <Link to="/login" className="text-primary-600 font-medium hover:underline">تسجيل الدخول</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
