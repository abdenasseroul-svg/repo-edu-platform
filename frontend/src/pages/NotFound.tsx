import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <h1 className="text-9xl font-bold text-primary-600">404</h1>
      <p className="text-2xl text-gray-600 dark:text-gray-400 mt-4">الصفحة غير موجودة</p>
      <Link to="/" className="btn-primary inline-block mt-8">العودة للرئيسية</Link>
    </div>
  </div>
);
export default NotFound;
