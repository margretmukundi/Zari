import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight } from 'lucide-react';

export const CartDrawer = ({ isOpen, onClose, onProceedToCheckout }) => {
  const { lang, t } = useLanguage();
  const { cart, updateQuantity, removeFromCart, clearCart, cartSubtotal } = useCart();
  const [includeVat, setIncludeVat] = useState(true);

  if (!isOpen) return null;

  const vatAmount = includeVat ? Math.round(cartSubtotal * 0.16) : 0;
  const grandTotal = cartSubtotal + vatAmount;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 bg-gray-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-mpesa-green" />
              <h2 className="font-bold text-base">{t('cartTitle')}</h2>
              <span className="bg-mpesa-green text-white text-xs font-extrabold px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-gray-100">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-800 text-base">{t('emptyCartTitle')}</h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">{t('emptyCartSub')}</p>
              </div>
            ) : (
              cart.map((item) => {
                const name = item.name[lang] || item.name.en;
                const isService = item.type === 'services';

                return (
                  <div key={item.id} className="pt-4 flex gap-3 items-center">
                    <img
                      src={item.image}
                      alt={name}
                      className="w-16 h-16 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            isService ? 'bg-slate-100 text-slate-800' : 'bg-emerald-50 text-emerald-800'
                          }`}
                        >
                          {isService ? 'Service' : 'Good'}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-gray-900 truncate mt-0.5">{name}</h4>
                      <p className="text-xs font-black text-mpesa-green mt-1">
                        KSh {(item.price * item.quantity).toLocaleString()}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-gray-200 rounded-lg text-xs">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-bold text-gray-800">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                          title={t('itemRemoved')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>{t('subtotal')}</span>
                  <span className="font-bold text-gray-900">KSh {cartSubtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeVat}
                      onChange={(e) => setIncludeVat(e.target.checked)}
                      className="rounded text-mpesa-green focus:ring-mpesa-green"
                    />
                    <span>{t('taxVat')}</span>
                  </label>
                  <span className="font-semibold text-gray-700">KSh {vatAmount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
                  <span>{t('totalAmount')}</span>
                  <span className="text-mpesa-green text-base">KSh {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-mpesa-green flex-shrink-0" />
                <span>Instant Safaricom M-PESA STK Push Confirmation</span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout(grandTotal);
                }}
                className="w-full py-3 bg-mpesa-green hover:bg-mpesa-darkgreen text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-mpesa-green/20"
              >
                <span>{t('checkoutBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
