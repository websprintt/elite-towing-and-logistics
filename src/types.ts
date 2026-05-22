export type Language = 'en' | 'es';

export interface Review {
  id: string;
  author: string;
  rating: number;
  text_en: string;
  text_es: string;
  location_en: string;
  location_es: string;
  tag: 'speed' | 'pricing' | 'professional' | 'bilingual';
  date: string;
}

export interface Service {
  id: string;
  title_en: string;
  title_es: string;
  desc_en: string;
  desc_es: string;
  time_en: string;
  time_es: string;
  features_en: string[];
  features_es: string[];
  iconName: 'Truck' | 'Wrench' | 'DollarSign' | 'ShieldCheck' | 'BatteryCharging' | 'HelpCircle';
}

export interface FAQItem {
  id: string;
  question_en: string;
  question_es: string;
  answer_en: string;
  answer_es: string;
  category: 'general' | 'pricing' | 'junk_cars' | 'areas';
}

export interface RegionSEO {
  id: string;
  name: string;
  title_en: string;
  title_es: string;
  desc_en: string;
  desc_es: string;
  landmarks_en: string[];
  landmarks_es: string[];
  zipCodes: string[];
  dispatchTime_en: string;
  dispatchTime_es: string;
  customFaq_en: { q: string; a: string }[];
  customFaq_es: { q: string; a: string }[];
}
