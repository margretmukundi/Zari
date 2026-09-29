import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Star, ShoppingBag, Calendar, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';

export const ProductCard = ({ product, onViewDetails }) => {
  const { lang, t } = useLanguage();
  const { addToCart } = useCart();

  const isService = product.type === 'services';
  const name = product.name[lang] || product.name.en;
  const description = product.description[lang] || product.description.en;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Image & Type Badge Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span
            className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1 ${
              isService
                ? 'bg-emerald-800 text-white'
                : 'bg-mpesa-green text-white'
            }`}
          >
            {isService ? <ShieldCheck className="w-3 h-3" /> : <Tag className="w-3 h-3" />}
            {isService ? t('typeServices') : t('typeGoods')}
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-gray-800 flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>{product.rating}</span>
          <span className="text-gray-400 font-normal">({product.reviewsCount})</span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-bold text-gray-900 text-base line-clamp-1 group-hover:text-mpesa-green transition-colors">
            {name}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Specs List snippet */}
        {product.specs && (
          <div className="flex flex-wrap gap-1 text-[10px] text-gray-500">
            {product.specs.slice(0, 2).map((spec, idx) => (
              <span key={idx} className="bg-gray-100 px-2 py-0.5 rounded font-medium">
                • {spec}
              </span>
            ))}
          </div>
        )}

        {/* Price & Actions */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-gray-900">
                KSh {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  KSh {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-400 font-medium">
              {isService ? t('serviceNotice') : t('inStock')}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onViewDetails(product)}
              className="px-2.5 py-1.5 text-xs text-gray-600 hover:text-gray-900 font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('viewDetails')}
            </button>
            <button
              onClick={() => addToCart(product)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1 transition-all shadow-sm ${
                isService
                  ? 'bg-slate-900 hover:bg-slate-800'
                  : 'bg-mpesa-green hover:bg-mpesa-darkgreen'
              }`}
            >
              {isService ? (
                <>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{t('bookNow')}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{t('addToCart')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
