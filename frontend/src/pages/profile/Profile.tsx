import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { authApi } from '../../services/api';
import { User, Mail, Phone, Calendar, Shield, Award } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });

  const handleSave = async () => {
    try {
      const { data } = await authApi.updateProfile(form);
      updateUser(data.user);
      setEditing(false);
      toast.success('✅ تم تحديث الملف الشخصي');
    } catch {
      toast.error('❌ فشل التحديث');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="card text-center">
        <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </div>
        <h1 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h1>
        <p className="text-gray-500">{user?.email}</p>
        <div className="flex justify-center gap-4 mt-4">
          <span className="px-4 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-full text-sm">
            {user?.role === 'STUDENT' ? 'طالب' : user?.role === 'TEACHER' ? 'أستاذ' : 'مدير'}
          </span>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold mb-4">المعلومات الشخصية</h2>
        <div className="space-y-4">
          {editing ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">الاسم</label>
                  <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">اللقب</label>
                  <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
              </div>
              <div className="flex gap-3">
                <button onClick={handleSave} className="btn-primary">حفظ</button>
                <button onClick={() => setEditing(false)} className="btn-secondary">إلغاء</button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                <Mail className="w-5 h-5 text-gray-400" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                <Phone className="w-5 h-5 text-gray-400" />
                <span>{user?.phone || 'غير محدد'}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span>تاريخ التسجيل: {new Date(user?.createdAt || '').toLocaleDateString('ar-DZ')}</span>
              </div>
              <button onClick={() => setEditing(true)} className="btn-primary">تعديل الملف الشخصي</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
