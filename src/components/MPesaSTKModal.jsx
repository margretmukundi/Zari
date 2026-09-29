import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Smartphone, CheckCircle, XCircle, Loader2, FileText } from 'lucide-react';

export const MPesaSTKModal = ({ isOpen, orderData, onClose, onPaymentSuccess }) => {
  const { lang, t } = useLanguage();
  const { clearCart, addCompletedOrder } = useCart();

  const [pinInput, setPinInput] = useState('');
  const [stkStatus, setStkStatus] = useState('waiting');
  const [transactionCode, setTransactionCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStkStatus('waiting');
      setPinInput('');
      setErrorMessage('');
      setTransactionCode('');
    }
  }, [isOpen]);

  if (!isOpen || !orderData) return null;

  const { customer, totalAmount } = orderData;

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let res = 'R';
    for (let i = 0; i < 9; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };

  const handleSimulatePin = (pinValue = '1234') => {
    setStkStatus('processing');

    setTimeout(() => {
      const txCode = generateCode();
      setTransactionCode(txCode);
      setStkStatus('success');

      const completedOrder = {
        id: `ZARI-${Date.now().toString().slice(-6)}`,
        date: new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'sw-KE', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        mpesaCode: txCode,
        amount: totalAmount,
        customer,
        delivery: orderData.delivery,
        items: orderData.items,
        status: 'PAID',
      };

      addCompletedOrder(completedOrder);
      clearCart();
    }, 1200);
  };

  const handleSimulateCancel = () => {
    setStkStatus('cancelled');
    setErrorMessage('Request cancelled by user on handset (Code 1032).');
  };

  const handleSimulateFailed = () => {
    setStkStatus('failed');
    setErrorMessage('The balance is insufficient for the transaction (Code 1).');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border-4 border-gray-800">
        {/* Handset Top Bar */}
        <div className="bg-gray-900 text-white py-2 px-6 flex justify-center items-center">
          <div className="w-16 h-1.5 bg-gray-700 rounded-full" />
        </div>

        {/* Safaricom M-PESA Header */}
        <div className="bg-mpesa-green text-white p-4 text-center relative">
          <div className="flex items-center justify-center gap-2 font-black text-lg">
            <Smartphone className="w-5 h-5" />
            <span>M-PESA Express</span>
          </div>
          <p className="text-[10px] text-emerald-100 uppercase tracking-widest mt-0.5">
            Safaricom SIM Toolkit
          </p>
        </div>

        {/* Dynamic Status View */}
        <div className="p-6 space-y-5">
          {stkStatus === 'waiting' && (
            <div className="space-y-4">
              <div className="bg-gray-100 border border-gray-200 rounded-2xl p-4 text-xs font-semibold text-gray-800 space-y-2 shadow-inner">
                <div className="flex items-center justify-between text-[11px] text-gray-500 font-bold">
                  <span>M-PESA PROMPT</span>
                  <span>{customer?.phoneNumber}</span>
                </div>
                <p className="text-gray-900 leading-snug">
                  Do you want to pay <span className="font-bold text-mpesa-green">KSh {totalAmount?.toLocaleString()}</span> to <span className="font-bold">ZariBoutique</span> for Order?
                </p>
                <div className="pt-2 border-t border-gray-200">
                  <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">
                    Enter 4-Digit M-PESA PIN:
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="••••"
                    className="w-full text-center tracking-widest text-lg font-bold py-1.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-mpesa-green focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
                <Loader2 className="w-4 h-4 text-mpesa-green animate-spin" />
                <span>{t('stkStatusWaiting')}</span>
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-[10px] text-center uppercase tracking-wider font-bold text-gray-400">
                  {t('stkEnterPinSim')}
                </p>
                <button
                  onClick={() => handleSimulatePin(pinInput || '1234')}
                  className="w-full py-2.5 bg-mpesa-green hover:bg-mpesa-darkgreen text-white font-bold rounded-xl text-xs transition-colors shadow"
                >
                  ✓ {t('simSuccessBtn')}
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleSimulateCancel}
                    className="py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-[11px] transition-colors"
                  >
                    ✕ {t('simCancelBtn')}
                  </button>
                  <button
                    onClick={handleSimulateFailed}
                    className="py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-xl text-[11px] transition-colors"
                  >
                    ⚠ {t('simFailBtn')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {stkStatus === 'processing' && (
            <div className="text-center py-8 space-y-3">
              <Loader2 className="w-12 h-12 text-mpesa-green animate-spin mx-auto" />
              <h4 className="font-bold text-sm text-gray-800">Verifying PIN with Safaricom...</h4>
              <p className="text-xs text-gray-500">Communicating with M-PESA Core Engine...</p>
            </div>
          )}

          {stkStatus === 'success' && (
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 bg-emerald-100 text-mpesa-green rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-black text-lg text-gray-900">{t('stkSuccessTitle')}</h3>
                <p className="text-xs text-gray-600 mt-1">{t('stkSuccessMsg', { code: transactionCode })}</p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-[11px] text-emerald-900 font-mono text-left space-y-1">
                <p className="font-bold text-emerald-800">M-PESA CONFIRMATION SMS:</p>
                <p>
                  {transactionCode} Confirmed. KSh {totalAmount?.toLocaleString()} sent to ZariBoutique on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}. New M-PESA balance is KSh 14,850.
                </p>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={() => {
                    onPaymentSuccess({ mpesaCode: transactionCode, totalAmount, customer });
                  }}
                  className="w-full py-3 bg-mpesa-green hover:bg-mpesa-darkgreen text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md"
                >
                  <FileText className="w-4 h-4" />
                  <span>{t('viewReceipt')}</span>
                </button>
              </div>
            </div>
          )}

          {(stkStatus === 'cancelled' || stkStatus === 'failed') && (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-black text-base text-gray-900">{t('stkFailedTitle')}</h3>
                <p className="text-xs text-red-600 font-medium mt-1">{errorMessage}</p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl text-xs transition-colors"
              >
                {t('closeBtn')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
