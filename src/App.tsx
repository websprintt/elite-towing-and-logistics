import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, MessageSquare, MapPin, Truck, ShieldCheck, Star, Clock, 
  ArrowRight, Menu, X, ChevronDown, CheckCircle, Check, 
  Award, Navigation, ThumbsUp, HelpCircle, ChevronRight, Search, Zap, Globe, Car, CheckSquare,
  Home, Map, DollarSign, Lock, Handshake, Settings, AlertTriangle
} from 'lucide-react';

import { Language, RegionSEO } from './types';
import { REVIEWS, SERVICES, REGIONS, FAQS, TRANS } from './data';
import QuoteEstimator from './components/QuoteEstimator';
import JunkCarEstimator from './components/JunkCarEstimator';
import { hydrateSecureHref, getDecodedValue, ENCODED_EMAIL } from './utils/security';

export default function App() {
  const [lang, setLang] = useState<Language>('en'); // Default to English initially
  const [currentTab, setCurrentTab] = useState<'home' | 'services' | 'junk-cars' | 'areas' | 'reviews_tab'>('home');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('lehigh-acres');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // States for FAQs Search & Accordions
  const [faqSearch, setFaqSearch] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  // WhatsApp helper popup bubble simulation
  const [showWAbubble, setShowWAbubble] = useState(false);
  
  // Custom Reviews filters
  const [reviewFilter, setReviewFilter] = useState<'all' | 'speed' | 'pricing' | 'professional' | 'bilingual'>('all');

  // Trigger WhatsApp popup after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWAbubble(true);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  const t = TRANS[lang];

  // Pick current region object safely
  const currentRegion = REGIONS.find(r => r.id === selectedRegionId) || REGIONS[0];

  const handleRegionClick = (regionId: string) => {
    setSelectedRegionId(regionId);
    setCurrentTab('areas');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const handleTabChange = (tab: 'home' | 'services' | 'junk-cars' | 'areas' | 'reviews_tab') => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const filteredReviews = reviewFilter === 'all' 
    ? REVIEWS 
    : REVIEWS.filter(r => r.tag === reviewFilter);

  const filteredFaqs = FAQS.filter(f => {
    const term = faqSearch.toLowerCase();
    const q = lang === 'en' ? f.question_en.toLowerCase() : f.question_es.toLowerCase();
    const a = lang === 'en' ? f.answer_en.toLowerCase() : f.answer_es.toLowerCase();
    return q.includes(term) || a.includes(term);
  });

  // Highlight icon mapped correctly
  const renderServiceIcon = (iconName: string) => {
    const p = { className: "h-6 w-6" };
    switch (iconName) {
      case 'Truck': return <Truck {...p} />;
      case 'Wrench': return <ShieldCheck {...p} />; // using shield representing roadside assistance
      case 'DollarSign': return <Star {...p} />; // using star representing cash for junk cars
      case 'ShieldCheck': return <Award {...p} />;
      default: return <Truck {...p} />;
    }
  };

  // Google review rating block
  const ratingStars = (count: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`h-4.5 w-4.5 ${i < count ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 transition-colors duration-200 antialiased font-sans dark">
      
      {/* 24/7 Urgência Alert Top Bar */}
      <div className="bg-slate-900 border-b border-slate-800 text-white text-xs py-2 px-4 select-none relative z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <span className="font-bold uppercase text-amber-500">{t.nav_open}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:flex items-center gap-1 text-slate-400">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>{lang === 'en' ? 'Average S. Florida response: 15-20 mins' : 'Llegada promedio en el S. de Florida: 15-20 mins'}</span>
            </span>
            <button 
              onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
              aria-label={lang === 'en' ? 'Switch interface language to Spanish' : 'Cambiar idioma de interfaz a Inglés'}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold px-2.5 py-1 rounded uppercase border border-slate-750 transition cursor-pointer text-[10px] min-h-[44px]"
            >
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              {lang === 'en' ? 'Español' : 'English'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Glassmorphism Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-md transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          
          {/* Brand Logo Identity */}
          <div className="flex items-center cursor-pointer select-none" onClick={() => handleTabChange('home')}>
            <img 
              src="https://raw.githubusercontent.com/websprintt/elite-towing-and-logistics/a6ab822771169e4d45eaa2a8c6ff09ae7fd0bd36/img/logo-sin-fondo.png" 
              alt="Elite Towing & Logistics" 
              className="h-12 sm:h-14 md:h-16 w-auto object-contain transition-transform duration-200 active:scale-95"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Desktop Navigation Router Links */}
          <nav className="hidden lg:flex items-center gap-7">
            <button 
              onClick={() => handleTabChange('home')}
              aria-label={lang === 'en' ? 'View Home page' : 'Ver página principal'}
              className={`hover:text-amber-400 py-2.5 px-1.5 transition cursor-pointer text-[11px] font-bold uppercase tracking-wider min-h-[44px] flex items-center ${currentTab === 'home' ? 'text-amber-500 border-b border-amber-500' : 'text-slate-200'}`}
            >
              {t.home}
            </button>
            <button 
              onClick={() => handleTabChange('services')}
              aria-label={lang === 'en' ? 'View Towing and Transport Services' : 'Ver servicios de grúa y transporte'}
              className={`hover:text-amber-400 py-2.5 px-1.5 transition cursor-pointer text-[11px] font-bold uppercase tracking-wider min-h-[44px] flex items-center ${currentTab === 'services' ? 'text-amber-500 border-b border-amber-500' : 'text-slate-200'}`}
            >
              {t.services}
            </button>
            <button 
              onClick={() => handleTabChange('junk-cars')}
              aria-label={lang === 'en' ? 'View Cash for Junk Cars page' : 'Ver página de efectivo por autos chatarra'}
              className={`hover:text-amber-400 py-2.5 px-1.5 transition cursor-pointer text-[11px] font-bold uppercase tracking-wider min-h-[44px] flex items-center ${currentTab === 'junk-cars' ? 'text-amber-500 border-b border-amber-500' : 'text-slate-200'}`}
            >
              {lang === 'en' ? 'Cash for Junk' : 'Comprar Chatarra'}
            </button>

            {/* Service Areas Dropdown Navigation */}
            <div className="relative group py-1">
              <button 
                onClick={() => handleTabChange('areas')}
                aria-label={lang === 'en' ? 'Open service area locations menu' : 'Abrir menú de zonas de servicio'}
                className={`flex items-center gap-1.5 hover:text-amber-400 transition cursor-pointer text-[11px] font-bold uppercase tracking-wider min-h-[44px] ${currentTab === 'areas' ? 'text-amber-500' : 'text-slate-200'}`}
              >
                <span>{t.areas}</span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-slate-900 border border-slate-800 rounded-lg py-2.5 w-52 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                {REGIONS.map(reg => (
                  <button
                    key={reg.id}
                    onClick={() => handleRegionClick(reg.id)}
                    aria-label={lang === 'en' ? `Directly view towing in ${reg.name}` : `Ver detalles de grúa en ${reg.name}`}
                    className="w-full text-left px-4 py-2 text-[10px] uppercase tracking-wider font-bold hover:bg-slate-800 text-slate-300 hover:text-amber-400 transition min-h-[44px] flex items-center"
                  >
                    {reg.name}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => handleTabChange('reviews_tab')}
              aria-label={lang === 'en' ? 'View verified customer feedback reviews' : 'Ver opiniones verificadas de clientes'}
              className={`hover:text-amber-400 py-2.5 px-1.5 transition cursor-pointer text-[11px] font-bold uppercase tracking-wider min-h-[44px] flex items-center ${currentTab === 'reviews_tab' ? 'text-amber-500 border-b border-amber-500' : 'text-slate-200'}`}
            >
              {t.reviews}
            </button>
          </nav>

          {/* Right action controls including Language Toggle and Phone CTA */}
          <div className="flex items-center gap-3">
            {/* Header Language Toggler Button */}
            <button 
              onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
              aria-label={lang === 'en' ? 'Switch browser language to Spanish' : 'Cambiar idioma del navegador a Inglés'}
              className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 hover:text-amber-400 border border-slate-700/60 text-white font-extrabold py-2 px-3 sm:px-4 rounded-full shadow-md transition duration-150 text-xs sm:text-sm cursor-pointer min-h-[44px]"
              title={lang === 'en' ? 'Switch to Spanish' : 'Cambiar a Inglés'}
            >
              <Globe className="h-4 w-4 text-amber-500 animate-pulse" />
              <span>{lang === 'en' ? 'ESP' : 'ENG'}</span>
            </button>

            {/* Desktop Right Phone CTA button */}
            <div className="hidden sm:flex items-center">
              <a 
                href="#" 
                onPointerOver={(e) => hydrateSecureHref(e, 'tel')}
                onFocus={(e) => hydrateSecureHref(e, 'tel')}
                onTouchStart={(e) => hydrateSecureHref(e, 'tel')}
                onClick={(e) => hydrateSecureHref(e, 'tel')}
                aria-label={lang === 'en' ? 'Call Elite Towing & Logistics dispatch' : 'Llamar al servicio de grúa de Elite'}
                className="flex items-center justify-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 px-5 rounded-full shadow-lg transition duration-150 font-mono text-sm cursor-pointer min-h-[44px]"
              >
                <Phone className="h-4 w-4" />
                (786) 910-7239
              </a>
            </div>

            {/* Mobile responsive hamburger clicker */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={lang === 'en' ? 'Toggle mobile navigation menu' : 'Alternar menú de navegación móvil'}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-800 transition text-slate-200 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-slate-900 border-t border-slate-800 overflow-hidden font-semibold"
            >
              <div className="p-4 flex flex-col gap-3.5 text-slate-200">
                <button 
                  onClick={() => handleTabChange('home')}
                  aria-label={lang === 'en' ? 'Go to Home page' : 'Ir a la página de inicio'}
                  className={`flex items-center gap-2.5 text-left p-2.5 rounded-lg hover:bg-slate-800 min-h-[44px] ${currentTab === 'home' ? 'text-amber-500 bg-slate-800' : ''}`}
                >
                  <Home className="h-4 w-4" />
                  <span>{t.home}</span>
                </button>
                <button 
                  onClick={() => handleTabChange('services')}
                  aria-label={lang === 'en' ? 'Go to Towing Services' : 'Ver servicios de grúa'}
                  className={`flex items-center gap-2.5 text-left p-2.5 rounded-lg hover:bg-slate-800 min-h-[44px] ${currentTab === 'services' ? 'text-amber-500 bg-slate-800' : ''}`}
                >
                  <Truck className="h-4 w-4" />
                  <span>{t.services}</span>
                </button>
                <button 
                  onClick={() => handleTabChange('junk-cars')}
                  aria-label={lang === 'en' ? 'Go to Cash For Junk Cars' : 'Ir a compra de autos chatarra'}
                  className={`flex items-center gap-2.5 text-left p-2.5 rounded-lg hover:bg-slate-800 min-h-[44px] ${currentTab === 'junk-cars' ? 'text-amber-500 bg-slate-800' : ''}`}
                >
                  <Car className="h-4 w-4" />
                  <span>{lang === 'en' ? 'Cash for Junk Cars' : 'Efectivo por Autos Chatarra'}</span>
                </button>
                
                {/* Mobile specific localized area links */}
                <div className="p-2 border-l-2 border-slate-800 pl-4 space-y-1">
                  <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{t.areas}</span>
                  </span>
                  {REGIONS.map(reg => (
                    <button
                      key={reg.id}
                      onClick={() => handleRegionClick(reg.id)}
                      aria-label={lang === 'en' ? `View towing in ${reg.name}` : `Ver servicio de grúas en ${reg.name}`}
                      className={`flex items-center gap-1.5 w-full text-left py-2.5 px-1 text-xs min-h-[44px] ${selectedRegionId === reg.id && currentTab === 'areas' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
                    >
                      <Map className="h-3 w-3" />
                      <span>Towing {reg.name}</span>
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => handleTabChange('reviews_tab')}
                  aria-label={lang === 'en' ? 'Go to Reviews tab' : 'Ir a la pestaña de opiniones'}
                  className={`flex items-center gap-2.5 text-left p-2.5 rounded-lg hover:bg-slate-800 min-h-[44px] ${currentTab === 'reviews_tab' ? 'text-amber-500 bg-slate-800' : ''}`}
                >
                  <Star className="h-4 w-4" />
                  <span>{t.reviews}</span>
                </button>

                <div className="pt-2 border-t border-slate-800">
                  <a 
                    href="#" 
                    onPointerOver={(e) => hydrateSecureHref(e, 'tel')}
                    onFocus={(e) => hydrateSecureHref(e, 'tel')}
                    onTouchStart={(e) => hydrateSecureHref(e, 'tel')}
                    onClick={(e) => hydrateSecureHref(e, 'tel')}
                    aria-label={lang === 'en' ? 'Call Elite Towing & Logistics dispatch line' : 'Llamar a la línea de grúas de Elite'}
                    className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold py-3 px-4 rounded-lg uppercase shadow-sm text-xs tracking-wider cursor-pointer min-h-[44px]"
                  >
                    <Phone className="h-4 w-4" />
                    {t.nav_phone}
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Header Area or Localized Landing Area depending on Router */}
      <AnimatePresence mode="wait">
        <motion.main
          key={currentTab + '-' + selectedRegionId}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
        >
          {/* 1. RENDER HOME VIEW */}
          {currentTab === 'home' && (
            <>
              {/* HERO SECTION */}
              <section className="relative overflow-hidden bg-slate-900 text-white py-16 lg:py-24">
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl"></div>
                
                <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                  
                  {/* Hero Left Content Column */}
                  <div className="lg:col-span-7 space-y-6">
                    <span className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-500 px-3 py-1 rounded-full font-mono font-bold text-xs uppercase tracking-wider">
                      <Zap className="h-3.5 w-3.5" />
                      {t.tagline}
                    </span>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight uppercase font-sans">
                      {t.hero_title_part1}{' '}
                      <span className="text-amber-500 block lg:inline text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">
                        {t.hero_title_part2}
                      </span>
                    </h1>

                    <p className="text-base sm:text-lg text-slate-350 max-w-xl">
                      {t.hero_sub}
                    </p>

                    {/* Highly-visible local Trust badges */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                      <div className="bg-slate-950/40 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
                        <span className="p-1.5 bg-amber-500/15 text-amber-500 rounded-lg flex items-center justify-center">
                          <Check className="h-4 w-4" />
                        </span>
                        <span className="text-xs font-bold leading-tight">{t.badge_247}</span>
                      </div>
                      <div className="bg-slate-950/40 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
                        <span className="p-1.5 bg-amber-500/15 text-amber-500 rounded-lg flex items-center justify-center">
                          <Star className="h-4 w-4 fill-amber-500" />
                        </span>
                        <span className="text-xs font-bold leading-tight">{t.badge_rated}</span>
                      </div>
                      <div className="bg-slate-950/40 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
                        <span className="p-1.5 bg-amber-500/15 text-amber-500 rounded-lg flex items-center justify-center">
                          <MessageSquare className="h-4 w-4" />
                        </span>
                        <span className="text-xs font-bold leading-tight">{t.badge_bilingual}</span>
                      </div>
                      <div className="bg-slate-950/40 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
                        <span className="p-1.5 bg-amber-500/15 text-amber-500 rounded-lg flex items-center justify-center">
                          <Zap className="h-4 w-4 text-amber-500" />
                        </span>
                        <span className="text-xs font-bold leading-tight">{t.badge_speed}</span>
                      </div>
                    </div>

                    {/* Primary large Action buttons */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
                      <a 
                        href="#" 
                        onPointerOver={(e) => hydrateSecureHref(e, 'tel')}
                        onFocus={(e) => hydrateSecureHref(e, 'tel')}
                        onTouchStart={(e) => hydrateSecureHref(e, 'tel')}
                        onClick={(e) => hydrateSecureHref(e, 'tel')}
                        aria-label={lang === 'en' ? 'Call Elite Towing dispatch immediately' : 'Llamar a grúa de Elite de inmediato'}
                        className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold py-3.5 px-6 rounded-lg flex items-center justify-center gap-2.5 text-center transition duration-150 shadow-md uppercase tracking-wider text-sm cursor-pointer min-h-[44px]"
                      >
                        <Phone className="h-4 w-4" />
                        {t.cta_call_now}
                      </a>
                      
                      <a 
                        href="#" 
                        onPointerOver={(e) => hydrateSecureHref(e, 'whatsapp', `Hi Elite Towing! I'm stranded and need assistance asap. Can you help me?`)}
                        onFocus={(e) => hydrateSecureHref(e, 'whatsapp', `Hi Elite Towing! I'm stranded and need assistance asap. Can you help me?`)}
                        onTouchStart={(e) => hydrateSecureHref(e, 'whatsapp', `Hi Elite Towing! I'm stranded and need assistance asap. Can you help me?`)}
                        onClick={(e) => hydrateSecureHref(e, 'whatsapp', `Hi Elite Towing! I'm stranded and need assistance asap. Can you help me?`)}
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label={lang === 'en' ? 'Contact Elite Towing over WhatsApp' : 'Contactar a Elite por WhatsApp'}
                        className="bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold py-3.5 px-6 rounded-lg flex items-center justify-center gap-2.5 text-center transition duration-150 cursor-pointer shadow-md tracking-wide text-sm min-h-[44px]"
                      >
                        <MessageSquare className="h-4 w-4 text-white fill-white" />
                        <span>{t.cta_get_quote}</span>
                      </a>
                    </div>
                  </div>

                  {/* Hero Right Column showing generated real tow truck background */}
                  <div className="lg:col-span-5 relative">
                    <div className="relative rounded-xl overflow-hidden shadow-md border-2 border-slate-800 bg-slate-950 aspect-[4/3] group">
                      <img 
                        src="/src/assets/images/tow_truck_hero_16_9_1779351995179.png" 
                        alt="Elite Towing S. Florida flatbed heavy rescue car trailer truck"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                      
                      {/* Interactive Live dispatch counter overlay */}
                      <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 border border-slate-800 backdrop-blur-md p-4 rounded-lg flex items-center justify-between shadow">
                        <div className="flex items-center gap-3">
                          <span className="flex h-2.5 w-2.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                          </span>
                          <div>
                            <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                              {lang === 'en' ? 'Active Dispatchers' : 'Despachadores Activos'}
                            </span>
                            <span className="block text-xs font-bold text-white">
                              7 {lang === 'en' ? 'Drivers Stationed Locally' : 'Grúas en patrullaje activo'}
                            </span>
                          </div>
                        </div>
                        <Truck className="h-4.5 w-4.5 text-amber-500" />
                      </div>
                    </div>
                  </div>

                </div>
              </section>

              {/* INTEGRATED INSTANT CRO TOOLS (ONLINE QUOTE ESTIMATOR) */}
              <section className="py-12 md:py-16 bg-white dark:bg-slate-950">
                <div className="max-w-4xl mx-auto px-4">
                  <QuoteEstimator lang={lang} />
                </div>
              </section>

              {/* WHY CHOOSE US CARDS */}
              <section className="py-16 bg-slate-100 dark:bg-slate-900/40">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                  <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-white">
                      {t.why_title}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
                      {t.why_sub}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Card 1 */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/60 dark:border-slate-800/65 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-150">
                      <div className="inline-flex items-center justify-center p-3.5 bg-amber-500/10 text-amber-500 dark:text-amber-400 rounded-xl mb-4">
                        <Truck className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                        {t.why1_title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {t.why1_desc}
                      </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/60 dark:border-slate-800/65 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-150">
                      <div className="inline-flex items-center justify-center p-3.5 bg-amber-500/10 text-amber-500 dark:text-amber-400 rounded-xl mb-4">
                        <DollarSign className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                        {t.why2_title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {t.why2_desc}
                      </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/60 dark:border-slate-800/65 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-150">
                      <div className="inline-flex items-center justify-center p-3.5 bg-amber-500/10 text-amber-500 dark:text-amber-400 rounded-xl mb-4">
                        <Lock className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                        {t.why3_title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {t.why3_desc}
                      </p>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/60 dark:border-slate-800/65 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-150">
                      <div className="inline-flex items-center justify-center p-3.5 bg-amber-500/10 text-amber-500 dark:text-amber-400 rounded-xl mb-4">
                        <Globe className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                        {t.why4_title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {t.why4_desc}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* THREE CORE SERVICES GRID */}
              <section className="py-16 bg-white dark:bg-slate-950">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                  
                  <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-black uppercase text-slate-900 dark:text-white">
                      {t.services_title}
                    </h2>
                    <p className="text-slate-550 dark:text-slate-400 mt-2 text-sm sm:text-base">
                      {t.services_sub}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {SERVICES.slice(0, 4).map((serv) => (
                      <div 
                        key={serv.id}
                        className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-800/80 p-6 md:p-8 hover:shadow-md transition duration-150 grid grid-cols-1 md:grid-cols-12 gap-6 relative overflow-hidden"
                      >
                        <div className="md:col-span-8 space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl">
                              {renderServiceIcon(serv.iconName)}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                              {lang === 'en' ? serv.title_en : serv.title_es}
                            </h3>
                          </div>

                          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            {lang === 'en' ? serv.desc_en : serv.desc_es}
                          </p>

                          <div className="space-y-1.5 pt-2">
                            {(lang === 'en' ? serv.features_en : serv.features_es).map((feat, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                <span className="text-emerald-500 font-bold">✓</span>
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-4 flex items-center gap-3">
                            <a 
                              href="#"
                              onPointerOver={(e) => hydrateSecureHref(e, 'tel')}
                              onFocus={(e) => hydrateSecureHref(e, 'tel')}
                              onTouchStart={(e) => hydrateSecureHref(e, 'tel')}
                              onClick={(e) => hydrateSecureHref(e, 'tel')}
                              aria-label={lang === 'en' ? 'Dispatch tow truck operator now' : 'Despachar operador de grúa'}
                              className="bg-slate-950 hover:bg-slate-850 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 px-5 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-1.5 shadow-md cursor-pointer min-h-[44px]"
                            >
                              <Phone className="h-4 w-4" />
                              {lang === 'en' ? 'Dispatch Now' : 'Despachar Grúa'}
                            </a>
                            <button
                              onClick={() => {
                                if (serv.id === 'junk-car-buyers') handleTabChange('junk-cars');
                                else if (serv.id === 'equipment-transport') handleTabChange('services');
                                else handleTabChange('services');
                              }}
                              aria-label={lang === 'en' ? `View pricing for ${serv.title_en}` : `Ver precios de ${serv.title_es}`}
                              className="text-slate-900 dark:text-slate-200 hover:text-amber-500 font-bold text-xs flex items-center gap-1 cursor-pointer min-h-[44px] px-2"
                            >
                              {lang === 'en' ? 'View Pricing' : 'Ver Precios'}
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Visual sidebar helper inside card */}
                        <div className="md:col-span-4 bg-white dark:bg-slate-950 rounded-2xl p-5 border border-slate-100 dark:border-slate-850 flex flex-col gap-4 hover:border-amber-500 transition shadow-sm">
                          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-2.5">
                            <span className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                              <Clock className="h-3.5 w-3.5 text-amber-500" />
                              <span>{lang === 'en' ? 'Live Status' : 'Estado en Vivo'}</span>
                            </span>
                            <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              {lang === 'en' ? 'Active' : 'Activo'}
                            </span>
                          </div>

                          <div className="space-y-3 flex-grow">
                            <div className="space-y-1 block">
                              <span className="block text-[9px] font-extrabold text-slate-400 dark:text-slate-550 uppercase tracking-widest">
                                {lang === 'en' ? 'Response Standard' : 'Estándar de Respuesta'}
                              </span>
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-mono">
                                {lang === 'en' ? serv.time_en : serv.time_es}
                              </p>
                            </div>

                            <div className="space-y-1 block">
                              <span className="block text-[9px] font-extrabold text-slate-400 dark:text-slate-550 uppercase tracking-widest">
                                {lang === 'en' ? 'Availability' : 'Disponibilidad'}
                              </span>
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                {lang === 'en' ? '24 Hours / 7 Days a week' : '24 Horas / 7 Días a la semana'}
                              </p>
                            </div>

                            <div className="space-y-1 block">
                              <span className="block text-[9px] font-extrabold text-slate-400 dark:text-slate-550 uppercase tracking-widest">
                                {lang === 'en' ? 'Coverage Area' : 'Área de Cobertura'}
                              </span>
                              <p className="text-xs font-extrabold text-amber-500 uppercase">
                                {lang === 'en' ? 'South Florida Fleet' : 'Flota Sur de Florida'}
                              </p>
                            </div>
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850/80 text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-auto">
                            <ShieldCheck className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                            <span>{lang === 'en' ? 'GPS Dispatched Units' : 'Unidades vía Satélite GPS'}</span>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              </section>

              {/* JUNK CAR CASH OFFER GENERATOR LINK BLOCK */}
              <section className="py-16 bg-slate-100 dark:bg-indigo-950/10">
                <div className="max-w-4xl mx-auto px-4">
                  <div className="text-center max-w-2xl mx-auto mb-8">
                    <span className="text-green-500 text-4xl block mb-2">💵</span>
                    <h2 className="text-3xl font-black uppercase text-slate-900 dark:text-white">
                      {lang === 'en' ? 'Cash For Scrap Car Removal' : 'Compramos autos viejos para chatarra'}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {lang === 'en' 
                        ? 'Ready to clean your yard and receive on-the-spot cash? Use our instant appraisal tool.'
                        : '¿Quiere despejar su estacionamiento y cobrar efectivo en el acto? Pruebe nuestro tasador digital.'}
                    </p>
                  </div>
                  <JunkCarEstimator lang={lang} />
                </div>
              </section>

              {/* SOCIAL PROOF / REVIEWS SECTION */}
              <section className="py-16 bg-white dark:bg-slate-950">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                  
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-black uppercase text-slate-900 dark:text-white">
                        {t.reviews_title}
                      </h2>
                      <p className="text-sm text-slate-550 dark:text-slate-400 mt-1">
                        {t.reviews_sub}
                      </p>
                    </div>

                    {/* Google ratings summary badge */}
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 p-4 rounded-2xl flex items-center gap-4 flex-shrink-0">
                      <div className="text-center">
                        <span className="block text-2xl font-black text-slate-900 dark:text-white">4.9</span>
                        <span className="block text-[9px] uppercase font-bold text-slate-400">Google Rating</span>
                      </div>
                      <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
                      <div>
                        <div className="flex gap-0.5">{ratingStars(5)}</div>
                        <span className="block text-[10px] text-green-500 font-bold mt-1">✓ 100% verified drivers</span>
                      </div>
                    </div>
                  </div>

                  {/* Trust filters */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {['all', 'speed', 'pricing', 'professional', 'bilingual'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setReviewFilter(f as any)}
                        aria-label={lang === 'en' ? `Filter customer reviews by ${f}` : `Filtrar opiniones de clientes por ${f}`}
                        className={`text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer capitalize min-h-[44px] flex items-center justify-center ${
                          reviewFilter === f 
                            ? 'bg-amber-500 text-slate-950 font-black shadow' 
                            : 'bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {f === 'all' ? (lang === 'en' ? 'All Reviews' : 'Ver Todo') : f}
                      </button>
                    ))}
                  </div>

                  {/* Review Cards block - Slow infinite horizontal scrolling carrusel */}
                  <div className="relative w-full overflow-hidden py-4 select-none">
                    {/* Left and Right Fade Overlays for elegant blending */}
                    <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-[#0A0B0D] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-[#0A0B0D] to-transparent z-10 pointer-events-none" />

                    <div className="animate-marquee flex flex-row gap-6">
                      {/* First set of reviews */}
                      <div className="flex flex-row gap-6 shrink-0">
                        {filteredReviews.map((rev) => (
                          <div 
                            key={rev.id} 
                            className="bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-900 dark:text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:border-amber-500 transition duration-150 w-[290px] md:w-[360px] shrink-0"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <span className="font-extrabold text-sm">{rev.author}</span>
                                <div className="flex gap-0.5">{ratingStars(rev.rating)}</div>
                              </div>
                              
                              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed mb-4">
                                "{lang === 'en' ? rev.text_en : rev.text_es}"
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-400">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-amber-500" />
                                {lang === 'en' ? rev.location_en : rev.location_es}
                              </span>
                              <span>{rev.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Identical cloned set for seamless infinite wrapping */}
                      <div className="flex flex-row gap-6 shrink-0" aria-hidden="true">
                        {filteredReviews.map((rev) => (
                          <div 
                            key={`dup-${rev.id}`} 
                            className="bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-900 dark:text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:border-amber-500 transition duration-150 w-[290px] md:w-[360px] shrink-0"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <span className="font-extrabold text-sm">{rev.author}</span>
                                <div className="flex gap-0.5">{ratingStars(rev.rating)}</div>
                              </div>
                              
                              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed mb-4">
                                "{lang === 'en' ? rev.text_en : rev.text_es}"
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-400">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-amber-500" />
                                {lang === 'en' ? rev.location_en : rev.location_es}
                              </span>
                              <span>{rev.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Centered reviews redirect buttons */}
                  <div className="text-center mt-10">
                    <button 
                      onClick={() => handleTabChange('reviews_tab')}
                      aria-label={t.revs_btn}
                      className="inline-flex items-center gap-2 bg-slate-950 dark:bg-slate-900 hover:bg-slate-850 dark:hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition cursor-pointer min-h-[44px]"
                    >
                      <span>{t.revs_btn}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>

                </div>
              </section>

              {/* INTERACTIVE TOWING COVERAGE AREAS */}
              <section className="py-16 bg-slate-100 dark:bg-slate-900/40">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                  
                  <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col items-center">
                    <h2 className="text-3xl md:text-4xl font-black uppercase text-slate-900 dark:text-white text-center">
                      {t.areas_title}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl text-center">
                      {t.areas_sub}
                    </p>
                  </div>

                  {/* Selected region grid options */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left block - Area selector drawer */}
                    <div className="lg:col-span-5 space-y-3.5">
                      <span className="block text-xs font-bold uppercase tracking-widest text-slate-400">
                        {t.selector_lbl}
                      </span>
                      
                      {REGIONS.map((reg) => (
                        <button
                          key={reg.id}
                          onClick={() => setSelectedRegionId(reg.id)}
                          aria-label={lang === 'en' ? `Select ${reg.name} region` : `Seleccionar región de ${reg.name}`}
                          className={`w-full text-left p-4 rounded-2xl border transition duration-150 flex items-center justify-between cursor-pointer min-h-[44px] ${
                            selectedRegionId === reg.id 
                              ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-md transform translate-x-1.5' 
                              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-850 text-slate-800 dark:text-slate-200 hover:border-amber-400'
                          }`}
                        >
                          <div>
                            <span className="block font-black text-sm">{reg.name}</span>
                            <span className="flex items-center gap-1 text-[10px] uppercase font-mono tracking-wide mt-1 opacity-80">
                              <Zap className="h-3 w-3 text-amber-500" />
                              <span>{lang === 'en' ? 'Response: ' : 'Llegada: '}{lang === 'en' ? reg.dispatchTime_en : reg.dispatchTime_es}</span>
                            </span>
                          </div>
                          <ChevronRight className={`h-5 w-5 ${selectedRegionId === reg.id ? 'text-slate-950' : 'text-slate-400'}`} />
                        </button>
                      ))}
                    </div>

                    {/* Right block - active region landing overview card */}
                    <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-sm">
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-1 mb-1">
                              <MapPin className="h-3 w-3 text-amber-500" />
                              LOCALIZED SEO HUB
                            </span>
                            <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase leading-tight">
                              towing {currentRegion.name}
                            </h3>
                          </div>
                          
                          <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 bg-green-500 text-green-700 dark:text-green-400 rounded-full text-xs font-bold flex items-center gap-1.5 flex-shrink-0 animate-pulse">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            {lang === 'en' ? 'Trucks Stationed' : 'Grúas Listas en zona'}
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {lang === 'en' ? currentRegion.desc_en : currentRegion.desc_es}
                        </p>

                        {/* ZIP code badge listings (Highly optimized local SEO validation tokens) */}
                        <div className="bg-slate-50 dark:bg-slate-950/40 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-850/60 font-mono">
                          <span className="block text-[10px] font-black uppercase text-slate-400 mb-2.5">
                            📌 {t.seo_zipcodes}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {currentRegion.zipCodes.map((zip) => (
                              <span key={zip} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                {zip}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Immediate local call action inside area card */}
                        <div className="pt-4 flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => handleRegionClick(currentRegion.id)}
                            aria-label={lang === 'en' ? `Open specialized page for ${currentRegion.name}` : `Ver detalles especializados para ${currentRegion.name}`}
                            className="flex-1 bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-600 text-white dark:text-slate-950 font-black py-3 px-4 rounded-xl text-xs text-center uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
                          >
                            <span>🚗 {lang === 'en' ? 'Open Local Area Page' : 'Ver Guía de Zona'}</span>
                            <ArrowRight className="h-4 w-4" />
                          </button>
                          
                          <a
                            href="#"
                            onPointerOver={(e) => hydrateSecureHref(e, 'tel')}
                            onFocus={(e) => hydrateSecureHref(e, 'tel')}
                            onTouchStart={(e) => hydrateSecureHref(e, 'tel')}
                            onClick={(e) => hydrateSecureHref(e, 'tel')}
                            aria-label={lang === 'en' ? 'Call local South Florida tow truck operator' : 'Llamar al operador local de grúas'}
                            className="bg-slate-100 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold px-4 py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 hover:border-amber-500 transition cursor-pointer min-h-[44px]"
                          >
                            <Phone className="h-4 w-4 text-amber-500" />
                            {lang === 'en' ? 'Call Local Operator' : 'Llamar Operador Local'}
                          </a>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </section>

              {/* ABOUT THE COMPANY (HUMAN DIALOGUE WITH PHOTO) */}
              <section className="py-16 bg-white dark:bg-slate-950">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Image Column */}
                    <div className="lg:col-span-5 relative">
                      <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 shadow-md group">
                        <img 
                          src="/src/assets/images/towing_team_trust_1779352138201.png" 
                          alt="Leonardo Elite Towing family team owner and dispatcher truck"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                      </div>
                      
                      {/* Signed trust counter banner */}
                      <div className="absolute -bottom-6 -right-3 bg-amber-500 text-slate-950 p-4.5 rounded-2xl rounded-tr-none shadow-xl border border-amber-600 flex items-center gap-3">
                        <Handshake className="h-7 w-7 text-slate-950" />
                        <div>
                          <span className="block text-xs uppercase font-extrabold tracking-wider text-slate-900">Elite Promise</span>
                          <span className="block text-[11px] font-mono font-bold">{lang === 'en' ? 'Polite & Damage-Free' : 'Servicio Amable sin Daños'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Copys Column */}
                    <div className="lg:col-span-7 space-y-6">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-500 font-mono">
                        <Award className="h-4.5 w-4.5" />
                        {lang === 'en' ? 'FAMILY OWNED & OPERATED' : 'PROPIEDAD FAMILIAR LOCAL'}
                      </span>
                      
                      <h2 className="text-3xl md:text-4xl font-black uppercase text-slate-900 dark:text-white leading-tight">
                        {t.about_title}
                      </h2>

                      <p className="text-xs sm:text-sm text-slate-550 dark:text-slate-400 leading-relaxed font-sans">
                        {t.about_text1}
                      </p>

                      <p className="text-xs sm:text-sm text-slate-550 dark:text-slate-400 leading-relaxed font-sans">
                        {t.about_text2}
                      </p>

                      {/* Owner bio credentials */}
                      <div className="pt-4 flex items-center gap-4">
                        <div className="h-11 w-11 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-900 dark:text-white uppercase font-serif text-sm border-2 border-amber-500">
                          L
                        </div>
                        <div>
                          <span className="block font-black text-sm text-slate-900 dark:text-white">Leonardo</span>
                          <span className="block text-[10px] text-slate-400 font-mono font-bold uppercase">{t.owner_badge}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </section>

              {/* LOCAL SCHEMATIZED FAQS SECTION ON HOME */}
              <section className="py-16 bg-slate-100 dark:bg-slate-900/40">
                <div className="max-w-4xl mx-auto px-4">
                  <div className="text-center max-w-3xl mx-auto mb-10">
                    <h2 className="text-3xl font-black uppercase text-slate-900 dark:text-white">
                      {t.faq_title}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {t.faq_sub}
                    </p>
                  </div>

                  {/* FAQS search capability */}
                  <div className="relative mb-6">
                    <input
                      type="text"
                      placeholder={lang === 'en' ? 'Search FAQs...' : 'Buscar preguntas...'}
                      value={faqSearch}
                      onChange={(e) => setFaqSearch(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 pl-12 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  </div>

                  {/* Beautiful accordion cards */}
                  <div className="space-y-3">
                    {filteredFaqs.map((item) => (
                      <div 
                        key={item.id}
                        className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850/80 rounded-xl overflow-hidden shadow-sm"
                      >
                        <button
                          onClick={() => setOpenFaqId(openFaqId === item.id ? null : item.id)}
                          aria-expanded={openFaqId === item.id}
                          aria-label={lang === 'en' ? `${item.question_en} - Toggle details` : `${item.question_es} - Alternar respuesta`}
                          className="w-full text-left p-4.5 flex items-center justify-between gap-4 cursor-pointer font-bold text-slate-900 dark:text-white transition hover:bg-slate-50 dark:hover:bg-slate-850 text-sm md:text-base min-h-[44px]"
                        >
                          <span className="flex items-center gap-2">
                            <HelpCircle className="h-4.5 w-4.5 text-amber-500 flex-shrink-0" />
                            {lang === 'en' ? item.question_en : item.question_es}
                          </span>
                          <span className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 transition">
                            {openFaqId === item.id ? <X className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </span>
                        </button>

                        <AnimatePresence initial={false}>
                          {openFaqId === item.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-slate-100 dark:border-slate-850"
                            >
                              <p className="p-4.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-950/20">
                                {lang === 'en' ? item.answer_en : item.answer_es}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                    {filteredFaqs.length === 0 && (
                      <p className="text-center text-xs text-slate-400 py-6">{lang === 'en' ? 'No matching questions found.' : 'No se encontraron preguntas coincidentes.'}</p>
                    )}
                  </div>
                </div>
              </section>
            </>
          )}

          {/* 2. RENDER THE DETAILED TOWING & TRANSPORT SERVICES PAGE (SEO) */}
          {currentTab === 'services' && (
            <div className="py-12 md:py-16 max-w-7xl mx-auto px-4 md:px-8">
              <div className="text-center max-w-4xl mx-auto mb-12">
                <span className="text-amber-500 font-mono text-xs font-bold uppercase tracking-widest block mb-1">
                  🌐 {lang === 'en' ? 'AUTO TRANSPORT SERVICES' : 'SERVICIOS DE GRÚAS Y TRANSPORTE'}
                </span>
                <h1 className="text-3xl md:text-5xl font-black uppercase text-slate-900 dark:text-white leading-tight">
                  {lang === 'en' ? 'Towing & Equipment Shipping Specialists' : 'Grúas Rígidas de Plataforma y Arrastre'}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
                  {lang === 'en' 
                    ? 'Get instant pricing, certified tow drivers, and damage-free guarantees on every South Florida route.'
                    : 'Obtenga precios honestos, choferes certificados y garantía total de traslado en cada ruta.'}
                </p>
              </div>

              {/* Comprehensive list detail cards with customized grids */}
              <div className="space-y-12">
                {SERVICES.map((serv, index) => (
                  <div 
                    key={serv.id}
                    className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                      index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                    }`}
                  >
                    
                    {/* Texts Column */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="p-3 bg-amber-500 text-slate-950 rounded-2xl">
                          {renderServiceIcon(serv.iconName)}
                        </span>
                        <div>
                          <span className="text-[10px] font-mono tracking-widest text-emerald-500 font-bold uppercase">
                            ✓ {lang === 'en' ? 'Fully Dispatched' : 'Listo para Salida'}
                          </span>
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase">
                            {lang === 'en' ? serv.title_en : serv.title_es}
                          </h3>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
                        {lang === 'en' ? serv.desc_en : serv.desc_es}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                        {(lang === 'en' ? serv.features_en : serv.features_es).map((f, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                            <CheckSquare className="h-4.5 w-4.5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>

                      {/* Direct CTA layout */}
                      <div className="pt-4 flex flex-wrap gap-3">
                        <a
                          href="#"
                          onPointerOver={(e) => hydrateSecureHref(e, 'tel')}
                          onFocus={(e) => hydrateSecureHref(e, 'tel')}
                          onTouchStart={(e) => hydrateSecureHref(e, 'tel')}
                          onClick={(e) => hydrateSecureHref(e, 'tel')}
                          aria-label={lang === 'en' ? `Call Elite Towing dispatch for ${serv.title_en}` : `Llamar a operadores Elite por el servicio de ${serv.title_es}`}
                          className="bg-amber-500 text-slate-950 hover:bg-amber-600 font-black py-3 px-6 rounded-xl text-xs uppercase flex items-center justify-center gap-1.5 shadow cursor-pointer min-h-[44px]"
                        >
                          <Phone className="h-4 w-4" />
                          {lang === 'en' ? 'Call Now / Get Tow' : 'Llamar Operador'}
                        </a>
                        <a
                          href="#"
                          onPointerOver={(e) => hydrateSecureHref(e, 'whatsapp', `Hi Elite Towing! I'm inquiring about the service: ${lang === 'en' ? serv.title_en : serv.title_es}`)}
                          onFocus={(e) => hydrateSecureHref(e, 'whatsapp', `Hi Elite Towing! I'm inquiring about the service: ${lang === 'en' ? serv.title_en : serv.title_es}`)}
                          onTouchStart={(e) => hydrateSecureHref(e, 'whatsapp', `Hi Elite Towing! I'm inquiring about the service: ${lang === 'en' ? serv.title_en : serv.title_es}`)}
                          onClick={(e) => hydrateSecureHref(e, 'whatsapp', `Hi Elite Towing! I'm inquiring about the service: ${lang === 'en' ? serv.title_en : serv.title_es}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={lang === 'en' ? `Inquire about ${serv.title_en} on WhatsApp` : `Consultar por ${serv.title_es} en WhatsApp`}
                          className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold px-4 py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
                        >
                          <MessageSquare className="h-4 w-4 text-green-500" />
                          {lang === 'en' ? 'WhatsApp Chat' : 'Chat de WhatsApp'}
                        </a>
                      </div>
                    </div>

                    {/* Specifications table card on the right for SEO value */}
                    <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 inline-block w-full">
                      <span className="block text-xs font-bold uppercase text-slate-400 mb-4 tracking-wider">
                        📋 {lang === 'en' ? 'Service Parameters' : 'Ficha Técnica de Ruta'}
                      </span>

                      <div className="space-y-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        <div className="flex justify-between py-1.5 border-b border-dashed border-slate-200 dark:border-slate-800">
                          <span>{lang === 'en' ? 'Service availability' : 'Disponibilidad'}</span>
                          <span className="font-bold text-green-500">24/7/365</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-dashed border-slate-200 dark:border-slate-800">
                          <span>{lang === 'en' ? 'Estimated arrival' : 'Arribo promedio'}</span>
                          <span className="font-bold text-slate-900 dark:text-white">{lang === 'en' ? serv.time_en : serv.time_es}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-dashed border-slate-200 dark:border-slate-800">
                          <span>{lang === 'en' ? 'Licensed & Insured' : 'Seguro comercial'}</span>
                          <span className="font-bold text-slate-900 dark:text-white">{lang === 'en' ? 'Up to $1 Million USD' : 'Hasta $1 Millón USD'}</span>
                        </div>
                        <div className="flex justify-between py-1.5">
                          <span>{lang === 'en' ? 'Operator certification' : 'Operadores'}</span>
                          <span className="font-bold text-slate-900 dark:text-white">WreckMaster® Certified</span>
                        </div>
                      </div>

                    </div>

                  </div>
                ))}
              </div>

              {/* Static Estimate Calculator box inside service tab too */}
              <div className="mt-16 max-w-3xl mx-auto">
                <QuoteEstimator lang={lang} />
              </div>

            </div>
          )}

          {/* 3. CASH FOR JUNK CARS PAGE (lead potential generator) */}
          {currentTab === 'junk-cars' && (
            <div className="py-12 md:py-16 max-w-7xl mx-auto px-4 md:px-8">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="text-green-500 font-mono text-xs font-bold uppercase tracking-widest block mb-1">
                  💵 {lang === 'en' ? 'SCRAP CAR BUYERS' : 'COMPRADORES DE CARROS CHATARRA'}
                </span>
                <h1 className="text-3xl md:text-5xl font-black uppercase text-slate-900 dark:text-white leading-tight">
                  {lang === 'en' ? 'Get Instant Cash for Scrap or Junk Cars' : 'Efectivo por Autos Viejos o Sin Título'}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
                  {lang === 'en' 
                    ? 'No title? Damaged? Post-accident salvage? We pay top-dollar, pick up same-day, and offer free tow removal.'
                    : '¿Chocado? ¿Dañado? Pagamos el máximo valor del mercado, retiramos el mismo día y la grúa es 100% gratis.'}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left side: Interactive cash quotation generator */}
                <div className="lg:col-span-7">
                  <JunkCarEstimator lang={lang} />
                </div>

                {/* Right side: High CRO arguments explaining the process */}
                <div className="lg:col-span-5 space-y-6">
                  
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 space-y-5">
                    <h3 className="text-lg font-extrabold uppercase tracking-tight text-slate-900 dark:text-white">
                      {lang === 'en' ? 'How does the process work?' : '¿Cómo funciona nuestro proceso?'}
                    </h3>

                    {/* Steps list */}
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="h-8 w-8 rounded-full bg-amber-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                          1
                        </div>
                        <div>
                          <span className="block font-bold text-sm text-slate-900 dark:text-white">
                            {lang === 'en' ? 'Submit Info or Call' : 'Escriba o Llame'}
                          </span>
                          <span className="block text-xs text-slate-500 dark:text-slate-400">
                            {lang === 'en' ? 'Provide car brand, year, and overall mechanical state.' : 'Indique marca, año y estado general de carrocería.'}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="h-8 w-8 rounded-full bg-amber-500 text-slate-950 font-mono font-black text-xs flex items-center justify-center flex-shrink-0">
                          2
                        </div>
                        <div>
                          <span className="block font-bold text-sm text-slate-900 dark:text-white">
                            {lang === 'en' ? 'Receive Instant Cash Proposal' : 'Obtenga su Oferta de Pago'}
                          </span>
                          <span className="block text-xs text-slate-500 dark:text-slate-400">
                            {lang === 'en' ? 'We lock in a fair price range and guarantee immediate payouts.' : 'Aseguramos un precio justo de inmediato por su vehículo salvamento.'}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="h-8 w-8 rounded-full bg-amber-500 text-slate-950 font-mono font-black text-xs flex items-center justify-center flex-shrink-0">
                          3
                        </div>
                        <div>
                          <span className="block font-bold text-sm text-slate-900 dark:text-white">
                            {lang === 'en' ? 'Free Towing & Spot Cash' : 'Retiro Gratis y Cobro al Instante'}
                          </span>
                          <span className="block text-xs text-slate-500 dark:text-slate-400">
                            {lang === 'en' ? 'We dispatch a flatbed, load the vehicle for free, pay cash, and handle transfer documentation.' : 'Enviamos la grúa, le pagamos de inmediato y cargamos el carro viejo gratis.'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <a 
                        href="#"
                        onPointerOver={(e) => hydrateSecureHref(e, 'tel')}
                        onFocus={(e) => hydrateSecureHref(e, 'tel')}
                        onTouchStart={(e) => hydrateSecureHref(e, 'tel')}
                        onClick={(e) => hydrateSecureHref(e, 'tel')}
                        aria-label={lang === 'en' ? 'Call Elite Towing & Logistics to sell car' : 'Llamar a grúas Elite para vender un carro chatarra'}
                        className="w-full inline-flex items-center justify-center gap-2 bg-slate-950 dark:bg-amber-500 hover:bg-slate-850 dark:hover:bg-amber-600 text-white dark:text-slate-950 font-black py-3.5 px-4 rounded-xl text-center text-xs uppercase cursor-pointer min-h-[44px]"
                      >
                        <Phone className="h-3.5 w-3.5 animate-pulse" />
                        <span>{lang === 'en' ? 'Sell Car Directly: (786) 910-7239' : 'Vender mi carro por teléfono: (786) 910-7239'}</span>
                      </a>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* 4. LOCALIZED REGIONAL SEO LANDING VIEWS */}
          {currentTab === 'areas' && (
            <div className="py-12 md:py-16 max-w-7xl mx-auto px-4 md:px-8 space-y-12">
              
              {/* Region selection bar */}
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm text-center">
                <span className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-405 text-slate-400 mb-3 text-center">
                  <MapPin className="h-3.5 w-3.5 text-amber-500" />
                  {lang === 'en' ? 'Select Local Florida SEO Region' : 'Seleccionar Región de Florida para ver detalles SEO'}
                </span>
                <div className="flex flex-wrap justify-center gap-2">
                  {REGIONS.map((reg) => (
                    <button
                      key={reg.id}
                      onClick={() => setSelectedRegionId(reg.id)}
                      aria-label={lang === 'en' ? `Show towing dispatch details in ${reg.name}` : `Mostrar detalles de grúas en ${reg.name}`}
                      className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg transition cursor-pointer min-h-[44px] justify-center ${
                        selectedRegionId === reg.id
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 hover:border-amber-400 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Map className="h-3.5 w-3.5" />
                      {reg.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Core local landing view */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left side: local text and specialized FAQ */}
                <div className="lg:col-span-7 space-y-6">
                  
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 space-y-4 shadow-sm">
                    <span className="inline-flex items-center gap-1.5 text-xs text-amber-505 text-amber-500 font-bold uppercase tracking-widest font-mono">
                      <MapPin className="h-4.5 w-4.5" />
                      {lang === 'en' ? 'LOCAL EMERGENCY ASSISTANCE' : 'AUXILIO MECÁNICO LOCAL'}
                    </span>

                    <h1 className="text-3xl md:text-4xl font-extrabold uppercase text-slate-900 dark:text-white leading-tight">
                      {lang === 'en' ? currentRegion.title_en : currentRegion.title_es}
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                      {lang === 'en' ? currentRegion.desc_en : currentRegion.desc_es}
                    </p>

                    <div className="pt-4 flex flex-col sm:flex-row gap-3">
                      <a
                        href="#"
                        onPointerOver={(e) => hydrateSecureHref(e, 'tel')}
                        onFocus={(e) => hydrateSecureHref(e, 'tel')}
                        onTouchStart={(e) => hydrateSecureHref(e, 'tel')}
                        onClick={(e) => hydrateSecureHref(e, 'tel')}
                        aria-label={lang === 'en' ? `Call Elite Towing dispatch in ${currentRegion.name}` : `Llamar a grúa Elite en ${currentRegion.name}`}
                        className="bg-amber-500 text-slate-950 hover:bg-amber-600 font-bold px-5 py-3 rounded-lg uppercase text-xs text-center flex items-center justify-center gap-1.5 shadow cursor-pointer min-h-[44px]"
                      >
                        <Phone className="h-4.5 w-4.5" />
                        {lang === 'en' ? 'Call Now / Get Dispatched' : 'Llamar Grúa de canal inmediato'}
                      </a>
                      <a
                        href="#"
                        onPointerOver={(e) => hydrateSecureHref(e, 'whatsapp', `Hi Elite Towing! I'm stranded in ${currentRegion.name}. Can you dispatch a driver?`)}
                        onFocus={(e) => hydrateSecureHref(e, 'whatsapp', `Hi Elite Towing! I'm stranded in ${currentRegion.name}. Can you dispatch a driver?`)}
                        onTouchStart={(e) => hydrateSecureHref(e, 'whatsapp', `Hi Elite Towing! I'm stranded in ${currentRegion.name}. Can you dispatch a driver?`)}
                        onClick={(e) => hydrateSecureHref(e, 'whatsapp', `Hi Elite Towing! I'm stranded in ${currentRegion.name}. Can you dispatch a driver?`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={lang === 'en' ? `Contact Elite Towing for dispatch in ${currentRegion.name} via WhatsApp` : `Contactar a grúa Elite en ${currentRegion.name} por WhatsApp`}
                        className="bg-slate-950 border border-slate-800 text-slate-100 font-bold px-4 py-3 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
                      >
                        <MessageSquare className="h-4.5 w-4.5 text-green-500" />
                        {lang === 'en' ? 'WhatsApp Quote' : 'Solicitud WhatsApp'}
                      </a>
                    </div>
                  </div>

                  {/* Local landmarks & references */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 space-y-4 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-amber-500" />
                      {t.seo_landmarks} — {currentRegion.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {lang === 'en'
                        ? 'Our drivers are strategically stationed off these local routes and high-traffic areas for rapid emergency access:'
                        : 'Nuestros operadores patrullan permanentemente estas zonas neurálgicas de tránsito:'}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {(lang === 'en' ? currentRegion.landmarks_en : currentRegion.landmarks_es).map((land, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                          <MapPin className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                          <span>{land}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Local FAQs */}
                  <div className="space-y-3.5">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase px-2 flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-amber-500" />
                      {lang === 'en' ? 'Local Area FAQs' : 'Preguntas comunes en la zona'}
                    </h3>
                    {(lang === 'en' ? currentRegion.customFaq_en : currentRegion.customFaq_es).map((faq, i) => (
                      <div key={i} className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-2xl space-y-2 shadow-sm">
                        <span className="block font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                          Q: {faq.q}
                        </span>
                        <span className="block text-xs text-slate-500 dark:text-slate-400 leading-relaxed pl-4 border-l border-amber-500">
                          A: {faq.a}
                        </span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Right side: local maps, active zips & response time */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Local Dispatch statistics box */}
                  <div className="bg-slate-900 text-white rounded-xl p-6 md:p-8 border border-slate-800 space-y-5">
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-500 font-mono tracking-widest uppercase mb-1">
                      <Zap className="h-3.5 w-3.5 text-amber-500" />
                      {t.seo_dispatch_title}
                    </span>

                    <div className="space-y-3.5">
                      <div>
                        <span className="block text-slate-400 text-xs">
                          {lang === 'en' ? 'Target response time:' : 'Tiempos de arribo:'}
                        </span>
                        <span className="block text-xl font-bold text-white font-mono flex items-center gap-1.5">
                          <Clock className="h-5 w-5 text-amber-500 inline" />
                          {lang === 'en' ? currentRegion.dispatchTime_en : currentRegion.dispatchTime_es}
                        </span>
                      </div>

                      <div>
                        <span className="block text-slate-400 text-xs">
                          {lang === 'en' ? 'Active drivers in region:' : 'Operadores listos:'}
                        </span>
                        <span className="block text-sm font-bold text-slate-100">
                          🚘 3 {lang === 'en' ? 'Trucks stationed dynamically' : 'grúas patrullando localmente'}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-800">
                        <span className="block text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                          <span>●</span> {lang === 'en' ? 'Dispatch lines open 24 Hours' : 'Líneas de soporte abiertas las 24 horas'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Florida Vector Dispatch Mock Map */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                      🗺 {t.seo_map_title}
                    </span>
                    
                    {/* SVG Interactive Map */}
                    <div className="aspect-[4/3] bg-slate-50 dark:bg-slate-950 rounded-lg relative overflow-hidden border border-slate-150 dark:border-slate-850 shadow-inner flex items-center justify-center">
                      <svg viewBox="0 0 400 300" className="w-full h-full text-slate-200 dark:text-zinc-800 fill-current">
                        {/* Simulated coastline and boundaries of Florida */}
                        <path d="M 120 40 Q 150 70 170 110 T 260 210 T 320 280 C 290 290 190 290 140 250 T 80 150 Z" className="text-slate-200 dark:text-slate-850" />
                        
                        {/* Simulated road highways */}
                        <path d="M 140 40 L 140 250 M 140 110 L 300 210" fill="none" className="stroke-slate-300 dark:stroke-slate-800" strokeWidth="2.5" />
                        <path d="M 80 150 L 320 150" fill="none" className="stroke-slate-300 dark:stroke-slate-800" strokeWidth="1.5" strokeDasharray="4" />
                        
                        {/* Interactive Markers */}
                        {REGIONS.map((reg, idx) => {
                          const xOffset = 110 + idx * 45;
                          const yOffset = 80 + idx * 40;
                          const active = reg.id === selectedRegionId;
                          return (
                            <g key={reg.id} className="cursor-pointer" onClick={() => setSelectedRegionId(reg.id)}>
                              <circle cx={xOffset} cy={yOffset} r={active ? "8" : "4.5"} className={active ? "fill-amber-500 animate-pulse" : "fill-slate-400 dark:fill-slate-600 hover:fill-amber-400"} />
                              {active && <circle cx={xOffset} cy={yOffset} r="16" fill="none" className="stroke-amber-500/40 animate-ping" strokeWidth="1" />}
                              <text x={xOffset + 10} y={yOffset + 4} className={`text-[10px] font-sans font-bold ${active ? 'fill-slate-900 dark:fill-white font-black' : 'fill-slate-400 dark:fill-slate-500'}`}>{reg.name}</text>
                            </g>
                          );
                        })}
                      </svg>
                      
                      {/* Active marker stats floating inside map */}
                      <div className="absolute top-2 left-2 bg-slate-900/95 backdrop-blur border border-slate-800 p-2 rounded-xl text-[9px] text-white">
                        <span className="flex items-center gap-1 font-semibold">
                          <MapPin className="h-2.5 w-2.5 text-amber-500" />
                          <span>Dispatch Node Active:</span>
                        </span>
                        <span className="block text-amber-500 font-bold uppercase">{currentRegion.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* ZIP collection lists */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-6 rounded-2xl shadow-sm text-center">
                    <span className="text-[10px] tracking-wider font-extrabold uppercase text-slate-400 block mb-2">{t.seo_zipcodes}</span>
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {currentRegion.zipCodes.map((zip) => (
                        <span key={zip} className="bg-slate-100 dark:bg-slate-950 font-mono text-[9px] font-bold px-2 py-1 rounded text-slate-500 dark:text-slate-400 border border-slate-200/40 dark:border-slate-800/40">{zip}</span>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* Instant calculation block for the regional hub too */}
              <div className="max-w-4xl mx-auto pt-8">
                <QuoteEstimator lang={lang} />
              </div>

            </div>
          )}

          {/* 5. DEDICATED REVIEWS TESTIMONIALS TAB */}
          {currentTab === 'reviews_tab' && (
            <div className="py-12 md:py-16 max-w-7xl mx-auto px-4 md:px-8 space-y-12">
              <div className="text-center max-w-3xl mx-auto">
                <span className="flex items-center justify-center gap-1.5 text-amber-500 font-mono text-xs font-bold uppercase tracking-widest block mb-1">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  <span>{lang === 'en' ? 'COMMUNITY TRUSTED' : 'CONFIANZA DE LA COMUNIDAD'}</span>
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-white leading-tight">
                  {lang === 'en' ? 'Stories from Satisfied Stranded Drivers' : 'Opiniones de Conductores Satisfechos'}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
                  {lang === 'en' 
                    ? 'Read real, unedited reviews from South Florida drivers who chose Elite Towing for emergency roadside assistance.'
                    : 'Verifique testimonios reales de conductores que recibieron ayuda rápida, amable y con total respeto.'}
                </p>
              </div>

              {/* Reviews Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {REVIEWS.map((rev) => (
                  <div 
                    key={rev.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm space-y-4 flex flex-col justify-between hover:border-amber-500 transition duration-150"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{rev.author}</span>
                        <div className="flex gap-0.5">{ratingStars(rev.rating)}</div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 italic leading-relaxed pt-2">
                        "{lang === 'en' ? rev.text_en : rev.text_es}"
                      </p>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-805 pt-3 flex items-center justify-between text-[11px] font-semibold text-slate-400 font-mono">
                      <span className="flex items-center gap-1 text-xs">
                        <MapPin className="h-3.5 w-3.5 text-amber-500" />
                        {lang === 'en' ? rev.location_en : rev.location_es}
                      </span>
                      <span>{rev.date}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Embedded citation badge from Google & Yelp */}
              <div className="bg-slate-100 dark:bg-slate-900/60 p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center max-w-2xl mx-auto space-y-4">
                <span className="block text-xs font-mono font-bold text-amber-500 uppercase">
                  ✓ 100% VERIFIED TESTIMONIALS
                </span>
                <p className="text-xs text-slate-500 leading-relaxed font-sans max-w-xl mx-auto">
                  {lang === 'en'
                    ? 'All reviews displayed above correspond to actual towing dispatches performed in Florida. We do not edit, modify, or pay for reviews. Honest work is our best advertising.'
                    : 'Todas las calificaciones corresponden a servicios reales de grúa realizados en Florida. No pagamos ni alteramos las opiniones de nuestra clientela. El trabajo honesto es nuestra mejor publicidad.'}
                </p>
                <div className="pt-2">
                  <span className="inline-block bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-800 dark:text-slate-200">
                    4.9 / 5.0 Google Rating (80+ Verified Reviews)
                  </span>
                </div>
              </div>

            </div>
          )}
        </motion.main>
      </AnimatePresence>

      {/* FINAL AGGRESIVE CTA BLOCK (BOTTOM PREFOOTER BANNER) */}
      <section className="bg-slate-950 text-white py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-4xl mx-auto px-4 space-y-6 relative z-10">
          <span className="bg-amber-500 text-slate-950 font-black text-[10px] tracking-widest px-3 py-1.5 rounded-full uppercase inline-flex items-center gap-1.5 shadow">
            <AlertTriangle className="h-3.5 w-3.5" />
            24/7 EMERGENCY DISPATCH CENTER
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-white leading-tight">
            {t.final_title}
          </h2>

          <p className="text-slate-450 dark:text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
            {t.final_subtitle}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-xl mx-auto pt-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center gap-2">
              <Phone className="h-4 w-4 text-amber-500" />
              <span>Fast Dispatch</span>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center gap-2">
              <Truck className="h-4 w-4 text-amber-500" />
              <span>Reliable Cars</span>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center gap-2">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span>4.9 Rated</span>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center gap-2">
              <Lock className="h-4 w-4 text-amber-500" />
              <span>No Damage</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 pt-4">
            <a 
              href="#"
              onPointerOver={(e) => hydrateSecureHref(e, 'tel')}
              onFocus={(e) => hydrateSecureHref(e, 'tel')}
              onTouchStart={(e) => hydrateSecureHref(e, 'tel')}
              onClick={(e) => hydrateSecureHref(e, 'tel')}
              aria-label={lang === 'en' ? 'Call live operator 24/7' : 'Llamar al operador de grúas 24/7'}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4.5 px-8 rounded-xl text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer min-h-[44px]"
            >
              <Phone className="h-5 w-5 animate-pulse" />
              {t.final_phone_cta}
            </a>

            <a 
              href="#"
              onPointerOver={(e) => hydrateSecureHref(e, 'whatsapp', `Hi Elite Towing! I'm stranded and need assistance asap. Can you dispatch a driver?`)}
              onFocus={(e) => hydrateSecureHref(e, 'whatsapp', `Hi Elite Towing! I'm stranded and need assistance asap. Can you dispatch a driver?`)}
              onTouchStart={(e) => hydrateSecureHref(e, 'whatsapp', `Hi Elite Towing! I'm stranded and need assistance asap. Can you dispatch a driver?`)}
              onClick={(e) => hydrateSecureHref(e, 'whatsapp', `Hi Elite Towing! I'm stranded and need assistance asap. Can you dispatch a driver?`)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={lang === 'en' ? 'Request dispatch estimate on WhatsApp' : 'Solicitar presupuesto de grúa vía WhatsApp'}
              className="bg-slate-900 border border-slate-800 text-white font-bold py-4.5 px-6 rounded-xl text-sm flex items-center justify-center gap-1.5 hover:border-amber-500 transition cursor-pointer min-h-[44px]"
            >
              <MessageSquare className="h-4.5 w-4.5 text-green-500" />
              {lang === 'en' ? 'Get Direct Estimate' : 'Cotizar por WhatsApp'}
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-850 py-12 px-4 md:px-8 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo Brand column */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img 
                src="https://raw.githubusercontent.com/websprintt/elite-towing-and-logistics/a6ab822771169e4d45eaa2a8c6ff09ae7fd0bd36/img/logo-sin-fondo.png" 
                alt="Elite Towing & Logistics" 
                className="h-12 w-auto object-contain select-none"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              {lang === 'en' 
                ? 'Providing fast flatbed towing, heavy equipment transport, and immediate scrap car disposal daily across S. Florida.'
                : 'Proporcionando soluciones rápidas e íntegras de grúas, transporte pesado y extracción de chatarra en todo el sur de Florida.'}
            </p>
            <span className="block text-green-500 font-mono font-bold text-[10px] uppercase">
              {t.nav_open}
            </span>
          </div>

          {/* Quick Tab Links column */}
          <div className="space-y-3">
            <span className="block text-xs font-bold text-white uppercase tracking-wider">
              {lang === 'en' ? 'Quick Directory' : 'Explorar Directorio'}
            </span>
            <div className="flex flex-col gap-2 font-semibold">
              <button 
                onClick={() => handleTabChange('home')} 
                aria-label={lang === 'en' ? 'Go to Home page' : 'Ir al Inicio'}
                className="flex items-center gap-1.5 hover:text-amber-400 text-left cursor-pointer text-[11px] min-h-[44px] py-1"
              >
                <Home className="h-3 w-3 text-slate-400" />
                <span>{t.home}</span>
              </button>
              <button 
                onClick={() => handleTabChange('services')} 
                aria-label={lang === 'en' ? 'Navigate to Towing and Transport Services' : 'Ir a Servicios de Grúa'}
                className="flex items-center gap-1.5 hover:text-amber-400 text-left cursor-pointer text-[11px] min-h-[44px] py-1"
              >
                <Truck className="h-3 w-3 text-slate-400" />
                <span>{t.services}</span>
              </button>
              <button 
                onClick={() => handleTabChange('junk-cars')} 
                aria-label={lang === 'en' ? 'Navigate to Cash for Junk Cars' : 'Ir a Compra de Autos Chatarra'}
                className="flex items-center gap-1.5 hover:text-amber-400 text-left cursor-pointer text-[11px] min-h-[44px] py-1"
              >
                <Car className="h-3 w-3 text-slate-400" />
                <span>Cash for Junk Cars</span>
              </button>
              <button 
                onClick={() => handleTabChange('reviews_tab')} 
                aria-label={lang === 'en' ? 'View verified motorist reviews' : 'Ver opiniones verificadas de conductores'}
                className="flex items-center gap-1.5 hover:text-amber-400 text-left cursor-pointer text-[11px] min-h-[44px] py-1"
              >
                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                <span>Verified Customer Review List</span>
              </button>
            </div>
          </div>

          {/* Service Area links column */}
          <div className="space-y-3">
            <span className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
              <MapPin className="h-3.5 w-3.5 text-amber-500" />
              <span>{lang === 'en' ? 'Service Area Pages' : 'Páginas de Zonas (Local SEO)'}</span>
            </span>
            <div className="grid grid-cols-2 gap-2 font-semibold">
              {REGIONS.map(reg => (
                <button 
                  key={reg.id} 
                  onClick={() => handleRegionClick(reg.id)}
                  aria-label={lang === 'en' ? `View towing directory in ${reg.name}` : `Ver directorio de grúas en ${reg.name}`}
                  className="flex items-center gap-1 hover:text-amber-400 text-left text-[11px] cursor-pointer min-h-[44px] py-1"
                >
                  <Map className="h-3 w-3 text-slate-500" />
                  <span>{reg.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Direct Address/Contact Block column */}
          <div className="space-y-3.5">
            <span className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
              <Phone className="h-3.5 w-3.5 text-amber-500" />
              <span>{lang === 'en' ? 'Contact Dispatch' : 'Llamada Directa'}</span>
            </span>
            <div className="space-y-2">
              <a 
                href="#"
                onPointerOver={(e) => hydrateSecureHref(e, 'tel')} 
                onFocus={(e) => hydrateSecureHref(e, 'tel')} 
                onTouchStart={(e) => hydrateSecureHref(e, 'tel')} 
                onClick={(e) => hydrateSecureHref(e, 'tel')}
                aria-label={lang === 'en' ? 'Call Elite Towing dispatch main line' : 'Llamar a la línea principal de grúas Elite'}
                className="block text-base font-bold text-white hover:text-amber-400 font-mono cursor-pointer min-h-[44px] flex items-center"
              >
                (786) 910-7239
              </a>
              <span className="block text-slate-350">
                {lang === 'en' ? 'Email: ' : 'Correo: '}
                <a 
                  href="#" 
                  onPointerOver={(e) => hydrateSecureHref(e, 'email')}
                  onFocus={(e) => hydrateSecureHref(e, 'email')}
                  onTouchStart={(e) => hydrateSecureHref(e, 'email')}
                  onClick={(e) => hydrateSecureHref(e, 'email')}
                  aria-label={lang === 'en' ? 'Send email to Elite Towing' : 'Enviar correo electrónico a Elite Towing'}
                  className="hover:text-amber-400 underline transition cursor-pointer inline-block py-1 min-h-[44px]"
                >
                  {getDecodedValue(ENCODED_EMAIL)}
                </a>
              </span>
              <span className="block text-slate-350">{t.footer_hours}: <span className="text-amber-500 font-bold">{t.footer_hours_val}</span></span>
              <span className="block text-slate-350">Se Habla Español • English Dispatched</span>
            </div>
          </div>

        </div>

        {/* Legal disclosure notes */}
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 leading-snug">
          <p className="text-[10px]">
            &copy; {new Date().getFullYear()} Elite Towing &amp; Logistics. {t.all_rights} <br className="sm:hidden" />
            Designed for Maximum Optimization &amp; SEO Local Conversions.
          </p>
          <div className="flex gap-4 text-[10px] font-semibold text-slate-400 uppercase">
            <span>Licensed &amp; Insured No. S-FT82798</span>
          </div>
        </div>
      </footer>

      {/* FLOAT STICKY BOTTOM BUTTONS ON MOBILE VIEWER */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-slate-800 backdrop-blur-md p-3 grid grid-cols-2 gap-3 shadow-xl">
        <a 
          href="#"
          onPointerOver={(e) => hydrateSecureHref(e, 'tel')}
          onFocus={(e) => hydrateSecureHref(e, 'tel')}
          onTouchStart={(e) => hydrateSecureHref(e, 'tel')}
          onClick={(e) => hydrateSecureHref(e, 'tel')}
          aria-label={lang === 'en' ? 'Call Elite Towing dispatch immediately 24/7' : 'Llamar al servicio de grúas Elite 24/7'}
          className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold py-3.5 rounded-lg uppercase text-[11px] tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer min-h-[44px]"
        >
          <Phone className="h-4 w-4 text-slate-950" />
          {lang === 'en' ? 'Call Now 24/7' : 'Llamar Grúa 24/7'}
        </a>
        <a 
          href="#"
          onPointerOver={(e) => hydrateSecureHref(e, 'whatsapp', `Hi Elite Towing! I'm stranded and need immediate help!`)}
          onFocus={(e) => hydrateSecureHref(e, 'whatsapp', `Hi Elite Towing! I'm stranded and need immediate help!`)}
          onTouchStart={(e) => hydrateSecureHref(e, 'whatsapp', `Hi Elite Towing! I'm stranded and need immediate help!`)}
          onClick={(e) => hydrateSecureHref(e, 'whatsapp', `Hi Elite Towing! I'm stranded and need immediate help!`)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={lang === 'en' ? 'Send instant dispatch request via WhatsApp' : 'Enviar solicitud de grúa instantánea por WhatsApp'}
          className="bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold py-3.5 rounded-lg uppercase text-[11px] tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer min-h-[44px]"
        >
          <MessageSquare className="h-4 w-4 text-white" />
          WhatsApp Dispatch
        </a>
      </div>

      {/* FLOATING WHATSAPP CHAT DISPATCHER BUBBLE SIMULATION ON THE RIGHT FOR EXTREME CRO */}
      <div className="fixed bottom-20 lg:bottom-5 right-5 z-40 flex flex-col items-end gap-3">
        <AnimatePresence>
          {showWAbubble && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="hidden lg:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4.5 rounded-xl w-72 shadow-2xl text-slate-900 dark:text-white relative"
            >
              {/* Close bubble header */}
              <button 
                onClick={() => setShowWAbubble(false)}
                aria-label={lang === 'en' ? 'Close chat bubble' : 'Cerrar burbuja de chat'}
                className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-200 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>

              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-850 pb-3 mb-2.5">
                <div className="h-9 w-9 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white relative text-sm uppercase">
                  L
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></span>
                </div>
                <div>
                  <span className="block font-bold text-xs text-slate-900 dark:text-white">Leonardo</span>
                  <span className="block text-[9px] uppercase font-mono text-emerald-500 font-bold">{lang === 'en' ? 'Dispatch Manager' : 'Jefe de Operaciones'}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed italic mb-3.5">
                {lang === 'en' 
                  ? '“Hi there! Need flatbed towing or roadside assistance? Send me your location, we will provide a quick rate instantly.”'
                  : '“¡Hola! ¿Necesita remolque o auxilio bilingüe de inmediato? Escríbame su ubicación para estimación directa.”'}
              </p>

              {/* Instant predefined WhatsApp conversion router button */}
              <a 
                href="#"
                onPointerOver={(e) => hydrateSecureHref(e, 'whatsapp', `Hi Leonardo! I'm looking at your website and need a quick towing quote please!`)}
                onFocus={(e) => hydrateSecureHref(e, 'whatsapp', `Hi Leonardo! I'm looking at your website and need a quick towing quote please!`)}
                onTouchStart={(e) => hydrateSecureHref(e, 'whatsapp', `Hi Leonardo! I'm looking at your website and need a quick towing quote please!`)}
                onClick={(e) => {
                  hydrateSecureHref(e, 'whatsapp', `Hi Leonardo! I'm looking at your website and need a quick towing quote please!`);
                  setShowWAbubble(false);
                }}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={lang === 'en' ? 'Start WhatsApp chat with Leonardo' : 'Iniciar chat por WhatsApp con Leonardo'}
                className="w-full inline-flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-3 rounded-lg text-xs cursor-pointer min-h-[44px]"
              >
                <MessageSquare className="h-4 w-4" />
                {lang === 'en' ? 'Start WhatsApp Chat' : 'Iniciar chat por WhatsApp'}
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile-only direct WhatsApp launch link (No bubble layout to clutter the screen) */}
        <a 
          href="#"
          onPointerOver={(e) => hydrateSecureHref(e, 'whatsapp', lang === 'en' ? `Hi Leonardo! I need a quick towing quote for my vehicle please!` : `¡Hola Leonardo! Necesito una cotización de grúa rápida por favor.`)}
          onFocus={(e) => hydrateSecureHref(e, 'whatsapp', lang === 'en' ? `Hi Leonardo! I need a quick towing quote for my vehicle please!` : `¡Hola Leonardo! Necesito una cotización de grúa rápida por favor.`)}
          onTouchStart={(e) => hydrateSecureHref(e, 'whatsapp', lang === 'en' ? `Hi Leonardo! I need a quick towing quote for my vehicle please!` : `¡Hola Leonardo! Necesito una cotización de grúa rápida por favor.`)}
          onClick={(e) => hydrateSecureHref(e, 'whatsapp', lang === 'en' ? `Hi Leonardo! I need a quick towing quote for my vehicle please!` : `¡Hola Leonardo! Necesito una cotización de grúa rápida por favor.`)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={lang === 'en' ? 'Send direct WhatsApp message' : 'Enviar mensaje directo por WhatsApp'}
          className="lg:hidden h-14 w-14 bg-emerald-600 active:bg-emerald-700 rounded-full text-white shadow-xl flex items-center justify-center relative scale-100 cursor-pointer"
        >
          <MessageSquare className="h-6 w-6 fill-current text-white" />
          <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-red-600 rounded-full border-2 border-slate-900 text-[9px] font-bold font-mono text-white flex items-center justify-center select-none">1</span>
        </a>

        {/* Desktop-only bubble toggle button */}
        <button 
          onClick={() => setShowWAbubble(!showWAbubble)}
          aria-label={lang === 'en' ? 'Toggle WhatsApp chat assistance bubble' : 'Activar burbuja de asistencia de WhatsApp'}
          className="hidden lg:flex h-14 w-14 bg-emerald-600 hover:bg-emerald-700 rounded-full text-white shadow-xl items-center justify-center relative transition duration-150 scale-100 cursor-pointer"
        >
          <MessageSquare className="h-6 w-6 fill-current text-white" />
          <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-red-600 rounded-full border-2 border-slate-900 text-[9px] font-bold font-mono text-white flex items-center justify-center select-none">1</span>
        </button>
      </div>

    </div>
  );
}
