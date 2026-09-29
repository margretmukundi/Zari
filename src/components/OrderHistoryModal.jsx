import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { X, History, FileText, CheckCircle2, ShoppingBag } from 'lucide-react';

export const OrderHistoryModal = ({ isOpen, onClose, onViewReceipt }) => {
  const { lang, t } = useLanguage();
  const { ordersHistory } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden relative my-8 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-gray-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-mpesa-green" />
            <h2 className="font-extrabold text-base">{t('historyTitle')}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {ordersHistory.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-gray-700">{t('noHistory')}</p>
            </div>
          ) : (
            ordersHistory.map((order, idx) => (
              <div
                key={idx}
                className="bg-gray-50 border border-gray-200/80 p-4 rounded-2xl space-y-3 hover:border-mpesa-green transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      {t('orderId')}: {order.id}
                    </span>
                    <h4 className="font-mono font-black text-sm text-mpesa-green">
                      M-PESA: {order.mpesaCode}
                    </h4>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{order.status}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-200/60">
                  <div>
                    <span>{order.date}</span>
                    <span className="mx-2">•</span>
                    <span>{order.items?.length || 1} Items</span>
                  </div>
                  <span className="font-black text-gray-900 text-sm">
                    KSh {order.amount?.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      onClose();
                      onViewReceipt(order);
                    }}
                    className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-800 flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5 text-mpesa-green" />
                    <span>{t('viewReceipt')}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
