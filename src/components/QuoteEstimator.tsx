import { useState, FormEvent } from 'react';
import { Truck, Phone, MessageSquare, Clock, Navigation, HelpCircle, MapPin, Car, AlertTriangle } from 'lucide-react';
import { Language } from '../types';
import { TRANS } from '../data';
import { hydrateSecureHref } from '../utils/security';

interface QuoteEstimatorProps {
  lang: Language;
}

export default function QuoteEstimator({ lang }: QuoteEstimatorProps) {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [issue, setIssue] = useState('');
  const [result, setResult] = useState<{
    distance: string;
    priceRange: string;
    arrival: string;
  } | null>(null);

  const t = TRANS[lang];

  // Simple localized quote calculations
  const cities = [
    { name: 'Lehigh Acres', group: 'lee', lat: 26.6201, lng: -81.6248 },
    { name: 'Cape Coral', group: 'lee', lat: 26.5629, lng: -81.9495 },
    { name: 'Fort Myers', group: 'lee', lat: 26.6406, lng: -81.8723 },
    { name: 'Miami-Dade County', group: 'miami_broward', lat: 25.7617, lng: -80.1918 },
    { name: 'Broward County', group: 'miami_broward', lat: 26.1224, lng: -80.1373 },
  ];

  const vehicles = [
    { id: 'sedan', label_en: 'Sedan / Compact Car', label_es: 'Sedán / Auto Compacto', multiplier: 1.0 },
    { id: 'suv', label_en: 'Mid-size SUV / Light Pickup', label_es: 'SUV Mediano / Camioneta Ligera', multiplier: 1.25 },
    { id: 'heavy', label_en: 'Heavy Duty Truck / Commercial Machinery', label_es: 'Camión de Carga / Maquinaria Pesada', multiplier: 1.8 },
    { id: 'moto', label_en: 'Motorcycle / Scooter', label_es: 'Motocicleta / Scooter', multiplier: 0.9 }
  ];

  const issues = [
    { id: 'breakdown', label_en: 'Engine Breakdown / Mechanical Failure', label_es: 'Avería de Motor / Falla Mecánica', base: 75 },
    { id: 'accident', label_en: 'Accident Collison / Recovery Needed', label_es: 'Choque o Accidente / Rescate de Grúa', base: 110 },
    { id: 'tire', label_en: 'Flat Tire (Spare change needed)', label_es: 'Llanta Pinchada (Requiere cambio)', base: 65 },
    { id: 'battery', label_en: 'Dead Battery Jump Start', label_es: 'Paso de corriente para Batería Muerta', base: 60 },
    { id: 'lockout', label_en: 'Locked Out (Keys inside vehicle)', label_es: 'Puerta Bloqueada (Llaves adentro)', base: 60 }
  ];

  const handleCalculate = (e: FormEvent) => {
    e.preventDefault();
    if (!pickup || !dropoff || !vehicle || !issue) return;

    const selectedVehicle = vehicles.find(v => v.id === vehicle);
    const selectedIssue = issues.find(i => i.id === issue);

    if (!selectedVehicle || !selectedIssue) return;

    // Calculate simulated distance in miles
    let distanceValue = 8; // base
    if (pickup !== dropoff) {
      if (pickup.includes('Miami') && dropoff.includes('Lee') || pickup.includes('Lehigh') && dropoff.includes('Miami')) {
        distanceValue = 135;
      } else if (pickup.includes('Broward') && dropoff.includes('Miami') || pickup.includes('Miami') && dropoff.includes('Broward')) {
        distanceValue = 28;
      } else if (pickup.includes('Cape Coral') && dropoff.includes('Fort Myers') || pickup.includes('Fort Myers') && dropoff.includes('Cape Coral')) {
        distanceValue = 12;
      } else if (pickup.includes('Lehigh') && dropoff.includes('Fort Myers')) {
        distanceValue = 18;
      } else {
        distanceValue = 15;
      }
    }

    const baseFare = selectedIssue.base * selectedVehicle.multiplier;
    const mileFare = distanceValue * 3.5; // $3.5 per mile
    const totalEstimate = Math.round(baseFare + mileFare);

    const minPrice = Math.max(70, totalEstimate - 15);
    const maxPrice = totalEstimate + 20;

    // Simulated arrival times based on pickup
    let arrivalStr_en = '15 - 20 minutes';
    let arrivalStr_es = '15 - 20 minutos';

    if (pickup.includes('Lehigh')) {
      arrivalStr_en = '10 - 15 minutes';
      arrivalStr_es = '10 - 15 minutos';
    } else if (pickup.includes('Fort Myers')) {
      arrivalStr_en = '12 - 18 minutes';
      arrivalStr_es = '12 - 18 minutos';
    } else if (pickup.includes('Miami')) {
      arrivalStr_en = '20 - 28 minutes';
      arrivalStr_es = '20 - 28 minutos';
    }

    setResult({
      distance: `${distanceValue} miles (Est.)`,
      priceRange: `$${minPrice} - $${maxPrice}`,
      arrival: lang === 'en' ? arrivalStr_en : arrivalStr_es
    });
  };

  const getWhatsAppMessage = () => {
    if (!result) return '';
    const vText = vehicles.find(v => v.id === vehicle)?.[lang === 'en' ? 'label_en' : 'label_es'];
    const iText = issues.find(i => i.id === issue)?.[lang === 'en' ? 'label_en' : 'label_es'];
    const message = `Hi Elite Towing! I generated an online quotation range:
- Pickup Point: ${pickup}
- Drop-off Point: ${dropoff}
- Vehicle Size: ${vText}
- Scenario/Issue: ${iText}
Estimated Price Range: ${result.priceRange}
Can we lock in this dispatch rate? Thank you!`;
    return encodeURIComponent(message);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-md p-6 md:p-8" id="online-quote-tool">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-amber-500 rounded-lg text-slate-950">
          <Truck className="h-5.5 w-5.5" />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.quick_calc_title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t.quick_calc_sub}
          </p>
        </div>
      </div>

      <form onSubmit={handleCalculate} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <MapPin className="h-4 w-4 text-amber-500" />
              {t.form_pickup}
            </label>
            <select
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            >
              <option value="">{t.field_select}</option>
              {cities.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <MapPin className="h-4 w-4 text-red-500" />
              {t.form_dropoff}
            </label>
            <select
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            >
              <option value="">{t.field_select}</option>
              {cities.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <Car className="h-4 w-4 text-amber-500" />
              {t.form_vehicle}
            </label>
            <select
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            >
              <option value="">{t.field_select}</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{lang === 'en' ? v.label_en : v.label_es}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              {t.form_issue}
            </label>
            <select
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            >
              <option value="">{t.field_select}</option>
              {issues.map(i => (
                <option key={i.id} value={i.id}>{lang === 'en' ? i.label_en : i.label_es}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          aria-label={lang === 'en' ? 'Calculate instant towing estimate' : 'Calcular presupuesto de grúa al instante'}
          className="w-full bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-600 text-white dark:text-slate-950 font-bold py-3.5 rounded-lg shadow-md transition duration-150 flex items-center justify-center gap-2 cursor-pointer text-sm font-semibold uppercase tracking-wider min-h-[44px]"
        >
          <Navigation className="h-4 w-4" />
          {t.calc_btn}
        </button>
      </form>

      {result && (
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 animate-fadeIn bg-slate-950/40 p-5 rounded-lg border border-slate-800/50">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-405 bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            {lang === 'en' ? 'Live Towing Estimate Calculated:' : 'Cotización de Grúa calculada en tiempo real:'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl text-center shadow-sm">
              <span className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                {t.calc_distance}
              </span>
              <span className="text-base font-bold text-slate-800 dark:text-slate-100 font-mono">
                {result.distance}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl text-center shadow-sm">
              <span className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                {t.calc_arrival}
              </span>
              <span className="text-base font-bold text-amber-600 dark:text-amber-400 font-mono flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 inline" /> {result.arrival}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl text-center shadow-sm border-l-4 border-l-amber-500">
              <span className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                {t.calc_price}
              </span>
              <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
                {result.priceRange}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="#"
              onPointerOver={(e) => hydrateSecureHref(e, 'tel')}
              onFocus={(e) => hydrateSecureHref(e, 'tel')}
              onTouchStart={(e) => hydrateSecureHref(e, 'tel')}
              onClick={(e) => hydrateSecureHref(e, 'tel')}
              aria-label={lang === 'en' ? 'Call now to lock in towing rate' : 'Llamar ahora para confirmar tarifa de grúa'}
              className="flex items-center justify-center gap-2 bg-amber-500 text-slate-950 hover:bg-amber-600 font-bold py-3 px-4 rounded-lg text-center transition duration-150 shadow-sm text-sm cursor-pointer min-h-[44px]"
            >
              <Phone className="h-4 w-4" />
              {t.calc_lock}
            </a>
            <a
              href="#"
              onPointerOver={(e) => hydrateSecureHref(e, 'whatsapp', getWhatsAppMessage())}
              onFocus={(e) => hydrateSecureHref(e, 'whatsapp', getWhatsAppMessage())}
              onTouchStart={(e) => hydrateSecureHref(e, 'whatsapp', getWhatsAppMessage())}
              onClick={(e) => hydrateSecureHref(e, 'whatsapp', getWhatsAppMessage())}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={lang === 'en' ? 'Send quote details via WhatsApp' : 'Enviar detalles del presupuesto por WhatsApp'}
              className="flex items-center justify-center gap-2 bg-emerald-700 text-white hover:bg-emerald-800 font-bold py-3 px-4 rounded-lg text-center transition duration-150 shadow-sm text-sm cursor-pointer min-h-[44px]"
            >
              <MessageSquare className="h-4 w-4" />
              {t.calc_whatsapp}
            </a>
          </div>

          <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4 flex items-center justify-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            {lang === 'en' 
              ? 'Quotes are estimated on normal local conditions. Instant dispatch lock is available over the phone'
              : 'Las cotizaciones son estimaciones para condiciones viales estándar. El bloqueo de tarifa se confirma por teléfono'}
          </p>
        </div>
      )}
    </div>
  );
}
