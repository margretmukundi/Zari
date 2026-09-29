import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { X, Smartphone, CreditCard, MapPin, User } from 'lucide-react';

export const CheckoutModal = ({ isOpen, onClose, totalAmount, onInitiateSTKPush }) => {
  const { lang, t } = useLanguage();
  const { cart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState('stkpush');
  const [fullName, setFullName] = useState('Wanjiku Kamau');
  const [email, setEmail] = useState('wanjiku@example.com');
  const [phoneNumber, setPhoneNumber] = useState('0791781961');
  const [shippingAddress, setShippingAddress] = useState('Uganda Road, Eldoret CBD');
  const [serviceDate, setServiceDate] = useState('2026-10-05');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  if (!isOpen) return null;

  const hasServices = cart.some((item) => item.type === 'services');
  const hasGoods = cart.some((item) => item.type === 'goods');

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.length < 9 || cleaned.length > 12) {
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validatePhone(phoneNumber)) {
      setPhoneError('Please enter a valid Safaricom phone number (e.g., 0791781961 or 254791781961)');
      return;
    }
    setPhoneError('');

    setIsSubmitting(true);

    const orderPayload = {
      customer: { fullName, email, phoneNumber },
      delivery: { shippingAddress, serviceDate, notes },
      items: cart,
      totalAmount,
      paymentMethod,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onInitiateSTKPush(orderPayload);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative my-8 animate-in fade-in zoom-in duration-200 border border-rose-100">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-rose-950 to-slate-950 text-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-mpesa-green flex items-center justify-center font-black">
              M
            </div>
            <div>
              <h2 className="font-extrabold text-base">{t('checkoutHeader')}</h2>
              <p className="text-[11px] text-emerald-200">Safaricom M-PESA STK Push Live Gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-rose-600" />
              <span>{t('customerInfo')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('fullName')}</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t('fullNamePlaceholder')}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('email')}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* M-PESA Phone Number Field */}
            <div className="bg-emerald-50/70 border border-emerald-300 p-4 rounded-2xl space-y-1.5 shadow-sm">
              <label className="block text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-mpesa-green" />
                <span>{t('phoneNumber')} (Recipient Phone for STK Push) *</span>
              </label>
              <input
                type="text"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0791781961"
                className="w-full px-3.5 py-2.5 bg-white border border-emerald-400 rounded-xl text-base font-extrabold text-gray-900 focus:ring-2 focus:ring-mpesa-green transition-all tracking-wider"
              />
              {phoneError && <p className="text-xs font-semibold text-red-500">{phoneError}</p>}
              <p className="text-[11px] text-emerald-800 font-medium">
                An M-PESA STK payment prompt will be dispatched live to this handset via Safaricom Daraja API.
              </p>
            </div>
          </div>

          {/* Logistics & Service Details */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-600" />
              <span>{t('deliveryType')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hasGoods && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t('shippingAddress')}
                  </label>
                  <input
                    type="text"
                    required={hasGoods}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder={t('shippingAddressPlaceholder')}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
                  />
                </div>
              )}

              {hasServices && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t('serviceDate')}
                  </label>
                  <input
                    type="date"
                    required={hasServices}
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">{t('notes')}</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('notesPlaceholder')}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-mpesa-green" />
              <span>{t('paymentMethodTitle')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setPaymentMethod('stkpush')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'stkpush'
                    ? 'border-mpesa-green bg-emerald-50/50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-mpesa-green text-white font-bold text-xs flex items-center justify-center">
                      ✓
                    </span>
                    <h4 className="font-bold text-xs text-gray-900">{t('mpesaExpress')}</h4>
                  </div>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">{t('mpesaExpressDesc')}</p>
              </div>

              <div
                onClick={() => setPaymentMethod('paybill')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'paybill'
                    ? 'border-mpesa-green bg-emerald-50/50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gray-800 text-white font-bold text-xs flex items-center justify-center">
                      #
                    </span>
                    <h4 className="font-bold text-xs text-gray-900">{t('mpesaPaybill')}</h4>
                  </div>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">{t('mpesaPaybillDesc')}</p>
              </div>
            </div>

            {paymentMethod === 'paybill' && (
              <div className="p-4 bg-gray-900 text-white rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between border-b border-gray-800 pb-1.5">
                  <span className="text-gray-400">Business Paybill Shortcode</span>
                  <span className="font-mono font-bold text-mpesa-green">174379 / 522522</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-1.5">
                  <span className="text-gray-400">{t('accountNumber')}</span>
                  <span className="font-mono font-bold text-white">ZARI-ELDORET</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('tillNumber')}</span>
                  <span className="font-mono font-bold text-amber-400">987654</span>
                </div>
              </div>
            )}
          </div>

          {/* Total & Action */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 font-semibold">{t('totalAmount')}</span>
              <p className="text-2xl font-black text-mpesa-green">
                KSh {totalAmount.toLocaleString()}
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3.5 bg-mpesa-green hover:bg-mpesa-darkgreen disabled:opacity-50 text-white font-extrabold rounded-2xl text-xs sm:text-sm transition-all shadow-lg shadow-mpesa-green/30 flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'Connecting to M-PESA...'
                  : `Send STK Push to Phone (KSh ${totalAmount.toLocaleString()})`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
