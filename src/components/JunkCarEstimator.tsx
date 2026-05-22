import { useState, FormEvent } from 'react';
import { DollarSign, Trash2, Send, HelpCircle, AlertTriangle, Car, Settings, Wrench, FileText, CheckCircle, RefreshCw } from 'lucide-react';
import { Language } from '../types';
import { TRANS } from '../data';
import { hydrateSecureHref } from '../utils/security';

interface JunkCarEstimatorProps {
  lang: Language;
}

export default function JunkCarEstimator({ lang }: JunkCarEstimatorProps) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [condition, setCondition] = useState('');
  const [hasTitle, setHasTitle] = useState('yes');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const t = TRANS[lang];

  const conditions = [
    { id: 'damaged', label_en: 'Damaged / Won’t Start', label_es: 'Averiado / No Enciende' },
    { id: 'wrecked', label_en: 'Wrecked / Post-Accident Salvage', label_es: 'Chocado / Salvamento de Accidente' },
    { id: 'running', label_en: 'Runs Fine but No Use', label_es: 'Enciende y Corre bien / Sin Uso' },
    { id: 'parts', label_en: 'Stripped / Shell for Parts only', label_es: 'Desarmado / Solo Carrocería para Repuestos' }
  ];

  const handleGenerateOffer = (e: FormEvent) => {
    e.preventDefault();
    if (!make || !model || !condition) return;
    setIsSubmitted(true);
  };

  const getWhatsAppMessage = () => {
    const condText = conditions.find(c => c.id === condition)?.[lang === 'en' ? 'label_en' : 'label_es'];
    const message = lang === 'en'
      ? `Hi Elite Towing! I would like to get a custom cash offer for my junk car:
- Vehicle Make & Model: ${make} ${model}
- Condition: ${condText}
- Has Clean Title: ${hasTitle === 'yes' ? 'Yes, clean title' : 'No title'}
Please let me know your cash offer and when you can dispatch a flatbed tow truck. Thank you!`
      : `¡Hola Elite Towing! Me gustaría recibir una oferta personalizada de efectivo por mi auto chatarra:
- Marca y modelo del vehículo: ${make} ${model}
- Condición mecánica: ${condText}
- Tiene título limpio: ${hasTitle === 'yes' ? 'Sí, título limpio' : 'No tiene título'}
Por favor envíeme su oferta de compra y disponibilidad de retiro. ¡Gracias!`;
    return encodeURIComponent(message);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 text-white rounded-xl shadow-md p-6 md:p-8" id="junk-car-estimator">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-amber-500 rounded-lg text-slate-950">
          <DollarSign className="h-5.5 w-5.5" />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            {t.junk_title}
          </h3>
          <p className="text-sm text-slate-400">
            {t.junk_sub}
          </p>
        </div>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleGenerateOffer} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                <Car className="h-4 w-4 text-amber-500" />
                {t.junk_make}
              </label>
              <input
                type="text"
                placeholder="e.g., Honda, Toyota"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                <Settings className="h-4 w-4 text-green-500" />
                {t.junk_model}
              </label>
              <input
                type="text"
                placeholder="e.g., Civic 2010, F-150 2005"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                <Wrench className="h-4 w-4 text-green-500" />
                {t.junk_condition}
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              >
                <option value="">{t.field_select}</option>
                {conditions.map(c => (
                  <option key={c.id} value={c.id}>{lang === 'en' ? c.label_en : c.label_es}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                <FileText className="h-4 w-4 text-green-500" />
                {t.junk_title_status}
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setHasTitle('yes')}
                  aria-label={lang === 'en' ? 'Has car title: Yes' : 'Tiene título del coche: Sí'}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition duration-150 min-h-[44px] flex items-center justify-center ${
                    hasTitle === 'yes'
                      ? 'bg-green-500 border-green-500 text-slate-950'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  {t.title_yes}
                </button>
                <button
                  type="button"
                  onClick={() => setHasTitle('no')}
                  aria-label={lang === 'en' ? 'Has car title: No' : 'Tiene título del coche: No'}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition duration-150 min-h-[44px] flex items-center justify-center ${
                    hasTitle === 'no'
                      ? 'bg-amber-500 border-amber-500 text-slate-950'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  {t.title_no}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            aria-label={lang === 'en' ? 'Process and submit junk car evaluation details' : 'Procesar y cotizar auto chatarra ahora'}
            className="w-full bg-green-500 hover:bg-green-600 text-slate-950 font-black py-4 rounded-xl shadow-lg transition duration-200 flex items-center justify-center gap-2 cursor-pointer text-sm uppercase tracking-wider min-h-[44px]"
          >
            <Send className="h-4 w-4 animate-pulse" />
            {t.junk_get_offer}
          </button>
        </form>
      ) : (
        <div className="mt-2 animate-fadeIn space-y-5">
          <div className="bg-slate-950 border border-slate-850 rounded-lg p-5 relative overflow-hidden">
            {/* Top-right decorative status indicator */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded text-[10px] font-bold text-emerald-400 tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {lang === 'en' ? 'READY TO SEND' : 'LISTO PARA ENVIAR'}
            </div>

            <span className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
              {t.junk_offer_title}
            </span>

            {/* Structured Specifications list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
              <div className="space-y-1.5">
                <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">{t.junk_make}</span>
                <p className="text-sm font-semibold flex items-center gap-2 text-white">
                  <Car className="h-4 w-4 text-green-505 text-green-400" />
                  {make}
                </p>
              </div>
              <div className="space-y-1.5">
                <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">{t.junk_model}</span>
                <p className="text-sm font-semibold flex items-center gap-2 text-white">
                  <Settings className="h-4 w-4 text-green-400" />
                  {model}
                </p>
              </div>
              <div className="space-y-1.5">
                <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">{t.junk_condition}</span>
                <p className="text-sm font-semibold flex items-center gap-2 text-white">
                  <Wrench className="h-4 w-4 text-green-400" />
                  {conditions.find(c => c.id === condition)?.[lang === 'en' ? 'label_en' : 'label_es']}
                </p>
              </div>
              <div className="space-y-1.5">
                <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">{t.junk_title_status}</span>
                <p className="text-sm font-semibold flex items-center gap-2 text-white">
                  <FileText className="h-4 w-4 text-green-400" />
                  {hasTitle === 'yes' ? t.title_yes : t.title_no}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6 bg-slate-900 border border-slate-850 rounded-xl p-3.5">
              <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
              <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                {lang === 'en' 
                  ? 'We will review your car specifications and reply immediately via WhatsApp with a customized high-value cash offer.' 
                  : 'Revisaremos las especificaciones de su vehículo y le responderemos de inmediato por WhatsApp con una oferta de compra formal.'}
              </p>
            </div>

            <a
              href="#"
              onPointerOver={(e) => hydrateSecureHref(e, 'whatsapp', getWhatsAppMessage())}
              onFocus={(e) => hydrateSecureHref(e, 'whatsapp', getWhatsAppMessage())}
              onTouchStart={(e) => hydrateSecureHref(e, 'whatsapp', getWhatsAppMessage())}
              onClick={(e) => hydrateSecureHref(e, 'whatsapp', getWhatsAppMessage())}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={lang === 'en' ? 'Submit junk car details via WhatsApp' : 'Enviar detalles del auto chatarra por WhatsApp'}
              className="w-full flex items-center justify-center gap-2.5 bg-emerald-750 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-lg text-center transition duration-150 text-sm tracking-wide shadow-sm uppercase cursor-pointer min-h-[44px]"
            >
              <Send className="h-4 w-4" />
              {t.junk_accept_btn}
            </a>

            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                aria-label={lang === 'en' ? 'Start over and edit details' : 'Empezar de nuevo y editar datos'}
                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-white transition cursor-pointer min-h-[44px] px-3 justify-center"
              >
                <RefreshCw className="h-3 w-3" />
                {lang === 'en' ? 'Edit Details / Start Over' : 'Editar Datos / Empezar de Nuevo'}
              </button>
            </div>

            <p className="text-center text-[10px] text-slate-500 mt-3 pt-3 border-t border-slate-900">
              {lang === 'en'
                ? '*All junk car pickups include complimentary, absolute zero-deductible flatbed tow extraction across Broward, Dade & Palm Beach.'
                : '*Todos los retiros de vehículos chatarra incluyen grúa plataforma completamente gratis en Broward, Dade y Palm Beach.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
