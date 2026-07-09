import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen, PlayCircle, MessageSquare, CreditCard,
  BarChart3, Users, Settings, GraduationCap, X, User,
  LayoutDashboard, FileQuestion, Video, MessageCircle, Award
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const studentLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'لوحة التحكم' },
    { to: '/subjects', icon: BookOpen, label: 'المواد الدراسية' },
    { to: '/live', icon: Video, label: 'الدروس المباشرة' },
    { to: '/recordings', icon: PlayCircle, label: 'التسجيلات' },
    { to: '/forum', icon: MessageCircle, label: 'المنتدى' },
    { to: '/subscriptions', icon: CreditCard, label: 'الاشتراكات' },
    { to: '/profile', icon: User, label: 'الملف الشخصي' },
  ];

  const teacherLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'لوحة التحكم' },
    { to: '/live', icon: Video, label: 'الدروس المباشرة' },
    { to: '/subjects', icon: BookOpen, label: 'المواد' },
    { to: '/questions', icon: FileQuestion, label: 'بنك الأسئلة' },
    { to: '/forum', icon: MessageCircle, label: 'المنتدى' },
    { to: '/profile', icon: User, label: 'الملف الشخصي' },
  ];

  const adminLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'لوحة التحكم' },
    { to: '/subjects', icon: BookOpen, label: 'المحتوى' },
    { to: '/admin/users', icon: Users, label: 'المستخدمين' },
    { to: '/admin/settings', icon: Settings, label: 'الإعدادات' },
    { to: '/subscriptions', icon: CreditCard, label: 'الاشتراكات' },
  ];

  const links = user?.role === 'TEACHER' ? teacherLinks :
                user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? adminLinks :
                studentLinks;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary-500" />
            <span className="font-bold text-lg">المنصة التعليمية</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-64px)]">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500">
            <Award className="w-4 h-4" />
            <span>{user?.role === 'STUDENT' ? 'طالب' : user?.role === 'TEACHER' ? 'أستاذ' : 'مدير'}</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
