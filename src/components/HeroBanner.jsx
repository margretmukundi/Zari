import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Heart, Smartphone, Shield, Truck, Globe } from 'lucide-react';

export const HeroBanner = ({ onSelectGoods, onSelectServices }) => {
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-rose-950 via-purple-950 to-slate-900 text-white py-12 px-4 sm:px-6 rounded-3xl shadow-xl my-6 container mx-auto border border-rose-900/50">
      {/* Background Graphic Accents */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-80 h-80 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        {/* Boutique Tag */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-semibold text-rose-200">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>{t('mpesaBadgeText')}</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight font-serif">
          {t('heroTitle')}
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-rose-100/90 max-w-2xl mx-auto leading-relaxed">
          {t('heroSubtitle')}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onSelectGoods}
            className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-rose-600/30 transform hover:-translate-y-0.5"
          >
            👗 {t('shopGoodsBtn')}
          </button>
          <button
            onClick={onSelectServices}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl text-sm transition-all backdrop-blur-sm transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            💄 {t('bookServiceBtn')}
          </button>
        </div>

        {/* Trust Badges Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10 text-xs text-rose-200/80 font-medium max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-1.5">
            <Globe className="w-4 h-4 text-emerald-300" />
            <span>Kiswahili ↔ English</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <Truck className="w-4 h-4 text-rose-300" />
            <span>Same-Day Delivery</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <Heart className="w-4 h-4 text-amber-300" />
            <span>100% Authentic Hair</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <Shield className="w-4 h-4 text-purple-300" />
            <span>Certified Stylists</span>
          </div>
        </div>
      </div>
    </div>
  );
};
