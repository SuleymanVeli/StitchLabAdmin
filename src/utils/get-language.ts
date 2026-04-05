// utils/get-language.ts
import { headers } from 'next/headers';

export function getLanguage() {
  const headersList = headers();
  const acceptLanguage = headersList.get('accept-language');
  
  // Əgər header-də dil varsa onu götür, yoxdursa 'az' qaytar
  // (Məsələn: "en-US,en;q=0.9" -> "en")
  const lang = acceptLanguage?.split(',')[0].split('-')[0] || 'az';
  
  const supportedLanguages = ['az', 'en', 'ru', 'tr', 'es'];
  return supportedLanguages.includes(lang) ? lang : 'az';
}