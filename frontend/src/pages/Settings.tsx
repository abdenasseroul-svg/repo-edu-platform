import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Globe, Bell, Shield } from 'lucide-react';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">الإعدادات</h1>

      <div className="card">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Sun className="w-5 h-5" />
          المظهر
        </h2>
        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            <span>الوضع {theme === 'dark' ? 'المظلم' : 'الفاتح'}</span>
          </div>
          <button onClick={toggleTheme} className={`relative w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-primary-600' : 'bg-gray-300'}`}>
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          اللغة
        </h2>
        <select className="input-field">
          <option value="ar">العربية</option>
          <option value="fr">Français</option>
        </select>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          الإشعارات
        </h2>
        <div className="space-y-4">
          {[
            { label: 'إشعارات الدروس المباشرة' },
            { label: 'إشعارات التمارين' },
            { label: 'إشعارات المنتدى' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <span>{item.label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
