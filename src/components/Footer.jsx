import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Phone, Mail, Globe, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  const { lang, toggleLanguage, t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-gray-400 text-xs border-t border-rose-950/80 pt-12 pb-8 mt-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-sm font-serif">
              Z
            </div>
            <h3 className="text-white text-lg font-black tracking-tight font-serif">
              Zari<span className="text-rose-500">Boutique</span>
            </h3>
          </div>
          <p className="leading-relaxed text-gray-400">{t('footerDesc')}</p>
          <div className="flex items-center gap-2 text-rose-400 font-semibold pt-1">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Bilingual Kiswahili ↔ English E-Commerce Platform</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">
            {t('quickLinks')}
          </h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-rose-400 transition-colors">Dresses & Ankara</a></li>
            <li><a href="#" className="hover:text-rose-400 transition-colors">Stiletto Heels & Sandals</a></li>
            <li><a href="#" className="hover:text-rose-400 transition-colors">Virgin Hair & Wigs</a></li>
            <li><a href="#" className="hover:text-rose-400 transition-colors">Lipstick & Makeup Sets</a></li>
            <li><a href="#" className="hover:text-rose-400 transition-colors">Glam Hairstyling Services</a></li>
          </ul>
        </div>

        {/* Customer Support */}
        <div className="space-y-3">
          <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">
            {t('customerSupport')}
          </h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>{t('eldoretOffice')}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>{t('helpline')}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>orders@zariboutique.co.ke</span>
            </li>
          </ul>
        </div>

        {/* Language Selection Footer widget */}
        <div className="space-y-3">
          <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">
            {t('language')} / Badili Lugha
          </h4>
          <p className="text-gray-400 text-xs">
            Toggle between English and Kiswahili for effortless boutique shopping.
          </p>
          <button
            onClick={toggleLanguage}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-between border border-slate-800 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-rose-500" />
              <span>{lang === 'en' ? 'English (US)' : 'Kiswahili (KE)'}</span>
            </div>
            <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded font-bold uppercase">
              {lang === 'en' ? 'SW' : 'EN'}
            </span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
        <div className="space-y-1">
          <p>© 2026 ZariBoutique Eldoret. {t('allRightsReserved')}</p>
          <p className="text-rose-400 font-semibold text-xs">
            Project Created by <span className="text-white font-bold underline decoration-rose-500">Margret Mukundi and Immaculate Kimani</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-rose-950 text-rose-300 border border-rose-800 px-3 py-1 rounded font-semibold flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kiswahili ↔ English Dual Language Mode</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
