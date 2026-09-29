import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { X, Star, CheckCircle, ShieldCheck, ShoppingBag, Calendar, Truck } from 'lucide-react';

export const ProductDetailModal = ({ product, onClose }) => {
  const { lang, t } = useLanguage();
  const { addToCart } = useCart();

  if (!product) return null;

  const isService = product.type === 'services';
  const name = product.name[lang] || product.name.en;
  const description = product.description[lang] || product.description.en;

  const handleAddToCart = () => {
    addToCart(product);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-gray-500 hover:text-gray-900 rounded-full p-2 border border-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image */}
          <div className="relative aspect-square md:aspect-auto bg-gray-100">
            <img
              src={product.image}
              alt={name}
              className="w-full h-full object-cover"
            />
            <span
              className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-white shadow-md ${
                isService ? 'bg-slate-900' : 'bg-mpesa-green'
              }`}
            >
              {isService ? t('typeServices') : t('typeGoods')}
            </span>
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{product.rating}</span>
                <span className="text-gray-400 font-normal">({product.reviewsCount} {t('rating')})</span>
              </div>

              <h2 className="text-xl font-black text-gray-900 leading-snug">{name}</h2>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-mpesa-green">
                  KSh {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    KSh {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-600 leading-relaxed border-t border-b border-gray-100 py-3">
                {description}
              </p>

              {/* Specifications / Included */}
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                  {isService ? 'Service Highlights' : 'Product Specifications'}
                </h4>
                <ul className="space-y-1.5">
                  {product.specs?.map((spec, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                      <CheckCircle className="w-4 h-4 text-mpesa-green flex-shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* M-PESA & Action */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl text-xs text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-mpesa-green flex-shrink-0" />
                <span>Pay instantly via Safaricom M-PESA STK push upon checkout.</span>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-md ${
                  isService
                    ? 'bg-slate-900 hover:bg-slate-800'
                    : 'bg-mpesa-green hover:bg-mpesa-darkgreen'
                }`}
              >
                {isService ? (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>{t('bookNow')} (KSh {product.price.toLocaleString()})</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t('addToCart')} (KSh {product.price.toLocaleString()})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
