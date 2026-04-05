// utils/localize.ts
import { ProductResponse } from './types';

export function localizeProduct(data: any[], lang: string): ProductResponse[];
export function localizeProduct(data: any, lang: string): ProductResponse;
export function localizeProduct(data: any | any[], lang: string): any {
  if (!data) return null;

  // Massiv emalı
  if (Array.isArray(data)) {
    return data.map((item) => localizeProduct(item, lang));
  }

  // Tək obyekt emalı
  const obj = data.toObject ? data.toObject() : data;

  // Yardımçı funksiya: Dil yoxdursa 'az'-a qayıt (fallback)
  const getVal = (field: any) => field?.[lang] || "";

  const localized: ProductResponse = {
    ...obj,
    _id: obj._id.toString(), // MongoDB ObjectId-ni string-ə çeviririk
    title: getVal(obj.title),
    description: getVal(obj.description),
    preparation: {
      ...obj.preparation,
      main: {
        yarn: getVal(obj.preparation?.main?.yarn),
        hook: getVal(obj.preparation?.main?.hook),
      },
    },
    sections: (obj.sections || []).map((section: any) => ({
      ...section,
      name: getVal(section.name),
      content: (section.content || []).map((step: any) => ({
        ...step,
        text: getVal(step.text),
      })),
    }))  
  };

  return localized;
}