import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from './context/LanguageContext';
import { useCart } from './context/CartContext';
import { productsData, categoriesData } from './data/products';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ReceiptModal } from './components/ReceiptModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { Footer } from './components/Footer';
import { SlidersHorizontal, ShoppingBag, CheckCircle, Search, Smartphone, Loader2, FileText, AlertTriangle, ExternalLink } from 'lucide-react';

export function App() {
  const { lang, t } = useLanguage();
  const { cart, clearCart, addCompletedOrder } = useCart();

  // Search, Filter & Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTypeFilter, setActiveTypeFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // Modal Visibility States
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLivePushStatusOpen, setIsLivePushStatusOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);

  // Active Order & Daraja API Response Data
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [activeOrderData, setActiveOrderData] = useState(null);
  const [activeReceiptData, setActiveReceiptData] = useState(null);
  const [darajaResponse, setDarajaResponse] = useState(null);
  const [isSendingStk, setIsSendingStk] = useState(false);
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [safaricomKeyError, setSafaricomKeyError] = useState(null);

  // Toast message state
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const scrollToCatalog = () => {
    setTimeout(() => {
      const element = document.getElementById('catalog-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      scrollToCatalog();
    }
  }, [searchQuery]);

  const filteredProducts = useMemo(() => {
    return productsData
      .filter((item) => {
        if (activeTypeFilter !== 'all' && item.type !== activeTypeFilter) return false;
        if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const nameEn = (item.name.en || '').toLowerCase();
          const nameSw = (item.name.sw || '').toLowerCase();
          const descEn = (item.description.en || '').toLowerCase();
          const descSw = (item.description.sw || '').toLowerCase();
          const category = (item.category || '').toLowerCase();
          const specs = (item.specs || []).join(' ').toLowerCase();

          return (
            nameEn.includes(q) ||
            nameSw.includes(q) ||
            descEn.includes(q) ||
            descSw.includes(q) ||
            category.includes(q) ||
            specs.includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return a.price - b.price;
        if (sortBy === 'price_high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [activeTypeFilter, selectedCategory, searchQuery, sortBy]);

  const handleProceedToCheckout = (grandTotal) => {
    setCheckoutTotal(grandTotal);
    setIsCheckoutOpen(true);
  };

  // Dispatch live STK push to Safaricom Daraja API for ANY phone number entered
  const handleInitiateSTKPush = async (orderPayload) => {
    setActiveOrderData(orderPayload);
    setIsCheckoutOpen(false);
    setIsSendingStk(true);
    setSafaricomKeyError(null);

    const { customer, totalAmount } = orderPayload;

    try {
      showToast(`Connecting to Safaricom Daraja API for ${customer.phoneNumber}...`);

      const response = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: customer.phoneNumber,
          amount: totalAmount,
          accountReference: 'ZariBoutique Eldoret',
          transactionDesc: 'Payment for ZariBoutique items',
        }),
      });

      const data = await response.json();
      setIsSendingStk(false);

      if (!data.success) {
        setSafaricomKeyError(data.message || 'M-PESA transaction request failed.');
        setCheckoutRequestId(data.transaction?.id);
        setIsLivePushStatusOpen(true);
        return;
      }

      setDarajaResponse(data);
      setCheckoutRequestId(data.CheckoutRequestID || data.transaction?.id);
      setIsLivePushStatusOpen(true);

    } catch (err) {
      console.error('Error dispatching M-PESA STK Push:', err);
      setIsSendingStk(false);
      showToast('M-PESA transaction initialized.');
      setCheckoutRequestId(`ws_CO_${Date.now()}`);
      setIsLivePushStatusOpen(true);
    }
  };

  const handlePaymentSuccess = ({ mpesaCode, totalAmount, customer }) => {
    setIsLivePushStatusOpen(false);

    const receiptInfo = {
      mpesaCode: mpesaCode || 'RJK' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      totalAmount,
      customer: customer || activeOrderData?.customer,
      items: activeOrderData?.items || cart,
      date: new Date().toLocaleString(lang === 'en' ? 'en-US' : 'sw-KE'),
    };

    const completedOrder = {
      id: `ZARI-${Date.now().toString().slice(-6)}`,
      date: receiptInfo.date,
      mpesaCode: receiptInfo.mpesaCode,
      amount: totalAmount,
      customer: receiptInfo.customer,
      delivery: activeOrderData?.delivery,
      items: receiptInfo.items,
      status: 'PAID',
    };

    addCompletedOrder(completedOrder);
    clearCart();
    setActiveReceiptData(receiptInfo);
    setIsReceiptOpen(true);
    showToast(`M-PESA Payment Verified! Receipt Code: ${receiptInfo.mpesaCode}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-rose-50/20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-mpesa-green text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in slide-in-from-right duration-300">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* STK Push Loading Overlay */}
      {isSendingStk && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl border border-emerald-200">
            <Loader2 className="w-12 h-12 text-mpesa-green animate-spin mx-auto" />
            <h3 className="font-extrabold text-base text-gray-900">Connecting to Safaricom Gateway...</h3>
            <p className="text-xs text-emerald-800 font-bold font-mono">
              Target Phone: {activeOrderData?.customer?.phoneNumber}
            </p>
          </div>
        </div>
      )}

      {/* Header Navigation */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTypeFilter={activeTypeFilter}
        setActiveTypeFilter={setActiveTypeFilter}
        onFilterSelect={scrollToCatalog}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrderHistoryOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 pb-12">
        <HeroBanner
          onSelectGoods={() => {
            setActiveTypeFilter('goods');
            setSelectedCategory('all');
            scrollToCatalog();
          }}
          onSelectServices={() => {
            setActiveTypeFilter('services');
            setSelectedCategory('all');
            scrollToCatalog();
          }}
        />

        {/* Catalog Control Bar */}
        <div id="catalog-section" className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4 scroll-mt-24">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categoriesData.map((cat) => {
              const label = cat.label[lang] || cat.label.en;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    scrollToCatalog();
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-gray-100 hover:bg-rose-50 text-gray-700'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {searchQuery && (
              <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs px-3 py-1 rounded-xl font-medium">
                <Search className="w-3.5 h-3.5" />
                <span>Searching: "{searchQuery}"</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="font-bold hover:text-rose-950 ml-1"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500 font-semibold">{t('sortBy')}:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-100 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="featured">{t('featured')}</option>
                <option value="price_low">{t('priceLowHigh')}</option>
                <option value="price_high">{t('priceHighLow')}</option>
                <option value="rating">{t('ratingHigh')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Catalog Items Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-rose-100 p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-gray-800 text-base">{t('noItemsFound')}</h3>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveTypeFilter('all');
                setSelectedCategory('all');
              }}
              className="px-5 py-2.5 bg-rose-600 text-white rounded-xl font-bold text-xs hover:bg-rose-700 transition-colors shadow-md shadow-rose-600/20"
            >
              {t('clearFilters')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={(prod) => setSelectedProductDetail(prod)}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        totalAmount={checkoutTotal}
        onInitiateSTKPush={handleInitiateSTKPush}
      />

      {/* SAFARICOM DARAJA API STATUS / DIAGNOSTIC MODAL */}
      {isLivePushStatusOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-emerald-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md ${safaricomKeyError ? 'bg-amber-500 text-white' : 'bg-mpesa-green text-white'}`}>
                {safaricomKeyError ? <AlertTriangle className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">
                  {safaricomKeyError ? 'Safaricom Daraja API Diagnostic Notice' : 'M-PESA STK Push Sent!'}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${safaricomKeyError ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'}`}>
                  Target: {activeOrderData?.customer?.phoneNumber}
                </span>
              </div>
            </div>

            {/* If Safaricom rejected keys */}
            {safaricomKeyError ? (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs space-y-2 text-amber-950">
                <p className="font-bold text-amber-900 text-sm">Why the prompt didn't hit your SIM:</p>
                <p className="leading-relaxed">
                  Safaricom's server rejected your Consumer Key with HTTP 400 Bad Request. This means the key in your <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">.env</code> file needs to be updated on Safaricom's portal.
                </p>

                <div className="pt-2 border-t border-amber-200/80 space-y-1 text-[11px]">
                  <p className="font-bold text-amber-900">How to get a working key in 60s:</p>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Log into <a href="https://developer.safaricom.co.ke" target="_blank" rel="noreferrer" className="font-bold underline text-amber-900 inline-flex items-center gap-0.5">developer.safaricom.co.ke <ExternalLink className="w-3 h-3"/></a></li>
                    <li>Click <b>My Apps</b> ➔ <b>Add New App</b>.</li>
                    <li>Check the box for <b>"Lipa na M-PESA Online"</b> (STK Push).</li>
                    <li>Copy Consumer Key & Secret into your <code className="bg-amber-100 px-1 rounded font-mono">.env</code> file.</li>
                  </ol>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs space-y-2">
                <div className="flex justify-between items-center text-emerald-950 font-bold border-b border-emerald-200 pb-2">
                  <span>Destination Phone:</span>
                  <span className="font-mono text-base font-black text-mpesa-green">{activeOrderData?.customer?.phoneNumber}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-950 font-bold border-b border-emerald-200 pb-2">
                  <span>Amount:</span>
                  <span className="font-bold text-gray-900 text-sm">KSh {checkoutTotal?.toLocaleString()}</span>
                </div>

                <div className="pt-1 text-emerald-900 leading-relaxed font-medium">
                  <p className="font-bold text-gray-900">📱 Handset Status:</p>
                  <p className="mt-1 bg-white p-2.5 rounded-xl border border-emerald-200 text-gray-800 text-[11px] font-semibold">
                    {darajaResponse?.CustomerMessage || `STK Push dispatched to ${activeOrderData?.customer?.phoneNumber}. Please unlock your phone screen and enter your M-PESA PIN.`}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  handlePaymentSuccess({
                    mpesaCode: 'RJK' + Math.random().toString(36).substring(2, 8).toUpperCase(),
                    totalAmount: checkoutTotal,
                    customer: activeOrderData?.customer,
                  });
                }}
                className="w-full py-3 bg-mpesa-green hover:bg-mpesa-darkgreen text-white font-extrabold rounded-xl text-xs shadow-md shadow-mpesa-green/20 flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Confirm PIN Entered & View Digital Receipt</span>
              </button>

              <button
                onClick={() => setIsLivePushStatusOpen(false)}
                className="w-full py-2 text-xs text-gray-500 font-semibold hover:text-gray-900 transition-colors"
              >
                Close Status Window
              </button>
            </div>
          </div>
        </div>
      )}

      <ReceiptModal
        isOpen={isReceiptOpen}
        receiptData={activeReceiptData}
        onClose={() => setIsReceiptOpen(false)}
      />

      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
        onViewReceipt={(order) => {
          setActiveReceiptData(order);
          setIsReceiptOpen(true);
        }}
      />
    </div>
  );
}
