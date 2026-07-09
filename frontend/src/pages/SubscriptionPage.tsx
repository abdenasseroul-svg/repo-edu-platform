import { useQuery, useMutation } from '@tanstack/react-query';
import { paymentApi } from '../services/api';
import { CreditCard, Check, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const SubscriptionPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: () => paymentApi.getPlans(),
  });

  const subscribeMutation = useMutation({
    mutationFn: (planId: string) => paymentApi.subscribe({ planId, paymentMethod: 'CARD' }),
    onSuccess: () => toast.success('✅ تم الاشتراك بنجاح!'),
    onError: (err: any) => toast.error(err.response?.data?.message || '❌ فشل الاشتراك'),
  });

  const { data: subscriptions } = useQuery({
    queryKey: ['my-subscriptions'],
    queryFn: () => paymentApi.getSubscriptions(),
  });

  const activeSub = subscriptions?.data?.subscriptions?.find((s: any) => s.status === 'ACTIVE');

  if (isLoading) return <div className="grid md:grid-cols-3 gap-8">{[...Array(3)].map((_, i) => <div key={i} className="h-96 skeleton" />)}</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <CreditCard className="w-12 h-12 text-primary-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">خطط الأسعار</h1>
        <p className="text-gray-500">اختر الباقة المناسبة لاحتياجاتك</p>
      </div>

      {activeSub && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 text-center">
          <p className="text-green-600 font-bold text-lg">✅ لديك اشتراك نشط في باقة {activeSub.plan?.nameAr}</p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {data?.data?.plans?.map((plan: any) => (
          <div key={plan.id} className={`card relative ${plan.isPopular ? 'ring-2 ring-primary-500 scale-105' : ''}`}>
            {plan.isPopular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-600 text-white text-sm rounded-full">الأكثر مبيعاً</span>
            )}
            <h3 className="text-xl font-bold mb-2">{plan.nameAr}</h3>
            <p className="text-gray-500 text-sm mb-4">{plan.nameFr}</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">{plan.price.toLocaleString()}</span>
              <span className="text-gray-500 mr-1">د.ج / {plan.duration > 30 ? 'سنوياً' : 'شهرياً'}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features?.map((f: string, i: number) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => subscribeMutation.mutate(plan.id)}
              disabled={!!activeSub || subscribeMutation.isPending}
              className={`w-full ${plan.isPopular ? 'btn-primary' : 'btn-secondary'} text-center`}>
              {subscribeMutation.isPending ? 'جاري...' : activeSub ? 'مشترك' : 'اشترك الآن'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPage;
