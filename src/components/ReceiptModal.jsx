import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, Printer, CheckCircle2 } from 'lucide-react';

export const ReceiptModal = ({ isOpen, receiptData, onClose }) => {
  const { lang, t } = useLanguage();

  if (!isOpen || !receiptData) return null;

  const { mpesaCode, totalAmount, customer, items, date } = receiptData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden relative my-8 animate-in zoom-in-95 duration-200 border border-gray-100">
        {/* Header Bar */}
        <div className="bg-mpesa-green text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-white">
              ✓
            </div>
            <div>
              <h2 className="font-extrabold text-base">{t('receiptTitle')}</h2>
              <p className="text-[11px] text-emerald-100">{t('receiptSub')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Printable Content */}
        <div className="p-6 space-y-6 print:p-0">
          {/* Top Receipt Badge */}
          <div className="text-center space-y-1 pb-4 border-b border-gray-100">
            <h3 className="font-black text-xl text-gray-900 tracking-tight font-serif">ZariBoutique Eldoret</h3>
            <p className="text-xs text-gray-500 font-medium">Official Fashion & Glam Voucher</p>
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-mpesa-green border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('statusCompleted')}</span>
            </div>
          </div>

          {/* M-PESA Particulars */}
          <div className="bg-gray-50 p-4 rounded-2xl space-y-2 text-xs border border-gray-200/80">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-semibold">{t('txCode')}:</span>
              <span className="font-mono font-black text-mpesa-green text-sm">{mpesaCode || 'RJK98412A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-semibold">{t('txDate')}:</span>
              <span className="font-medium text-gray-800">{date || new Date().toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-semibold">{t('phoneNumber')}:</span>
              <span className="font-bold text-gray-800">{customer?.phoneNumber || '254712345678'}</span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[10px] text-gray-400">
              {t('customerDetails')}
            </h4>
            <p className="font-bold text-gray-800">{customer?.fullName || 'Wanjiku Kamau'}</p>
            <p className="text-gray-500">{customer?.email || 'wanjiku@example.com'}</p>
          </div>

          {/* Items Purchased List */}
          <div className="space-y-2">
            <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[10px] text-gray-400">
              {t('itemsPurchased')}
            </h4>
            <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100 text-xs">
              {items?.map((item, idx) => {
                const name = item.name[lang] || item.name.en;
                return (
                  <div key={idx} className="p-3 flex justify-between items-center bg-gray-50/50">
                    <div>
                      <p className="font-bold text-gray-900">{name}</p>
                      <p className="text-[10px] text-gray-500">
                        {item.type === 'services' ? 'Glam Service' : 'Boutique Goods'} × {item.quantity || 1}
                      </p>
                    </div>
                    <span className="font-extrabold text-gray-900">
                      KSh {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Total Payable */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-200 text-sm">
            <span className="font-black text-gray-900">{t('totalAmount')}</span>
            <span className="font-black text-2xl text-mpesa-green">
              KSh {totalAmount?.toLocaleString()}
            </span>
          </div>

          {/* Footer Note */}
          <div className="text-center space-y-1 pt-2">
            <p className="text-xs font-semibold text-gray-700">{t('thankYouMsg')}</p>
            <p className="text-[10px] text-gray-400">For support email orders@zariboutique.co.ke</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            {t('closeBtn')}
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>{t('printReceipt')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
