import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Search, Globe, History, Heart } from 'lucide-react';

export const Navbar = ({
  searchQuery,
  setSearchQuery,
  activeTypeFilter,
  setActiveTypeFilter,
  onFilterSelect,
  onOpenCart,
  onOpenOrders,
}) => {
  const { lang, toggleLanguage, t } = useLanguage();
  const { cartItemCount } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-sm">
      {/* Main Navbar */}
      <div className="container mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-purple-600 to-rose-400 flex items-center justify-center text-white font-black font-serif text-xl shadow-md shadow-rose-600/20">
            Z
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none font-serif">
                Zari<span className="text-rose-600">Boutique</span>
              </h1>
            </div>
            <p className="text-[11px] text-gray-500 font-medium">{t('brandSubtitle')}</p>
          </div>
        </div>

        {/* Live Search Bar */}
        <div className="flex-1 max-w-xl mx-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-8 py-2 bg-rose-50/50 border border-rose-200 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700 font-bold"
                title="Clear Search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-gray-700 transition-colors shadow-sm"
            title="Switch Language / Badili Lugha"
          >
            <Globe className="w-4 h-4 text-rose-600" />
            <span>{lang === 'en' ? '🇺🇸 English' : '🇰🇪 Kiswahili'}</span>
            <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.5 rounded font-bold uppercase">
              {lang === 'en' ? 'SW' : 'EN'}
            </span>
          </button>

          {/* Orders Button */}
          <button
            onClick={onOpenOrders}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors"
          >
            <History className="w-4 h-4 text-gray-500" />
            <span className="hidden sm:inline">{t('myOrders')}</span>
          </button>

          {/* Cart Drawer Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-full text-xs transition-all shadow-md shadow-rose-600/20"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">{t('cart')}</span>
            {cartItemCount > 0 && (
              <span className="bg-white text-rose-600 font-bold text-[11px] rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Subnav Filter Tabs */}
      <div className="bg-rose-50/40 border-t border-rose-100 px-4 py-2">
        <div className="container mx-auto flex items-center justify-between overflow-x-auto text-xs gap-2 no-scrollbar">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTypeFilter('all');
                onFilterSelect?.();
              }}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${
                activeTypeFilter === 'all'
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {t('typeAll')}
            </button>
            <button
              onClick={() => {
                setActiveTypeFilter('goods');
                onFilterSelect?.();
              }}
              className={`px-3.5 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition-all ${
                activeTypeFilter === 'goods'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-white" />
              {t('typeGoods')}
            </button>
            <button
              onClick={() => {
                setActiveTypeFilter('services');
                onFilterSelect?.();
              }}
              className={`px-3.5 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition-all ${
                activeTypeFilter === 'services'
                  ? 'bg-purple-800 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
              {t('typeServices')}
            </button>
          </div>
          <div className="text-[11px] text-rose-800 font-semibold hidden md:block">
            📍 Eldoret City • Safaricom Daraja API Sandbox Ready
          </div>
        </div>
      </div>
    </header>
  );
};
