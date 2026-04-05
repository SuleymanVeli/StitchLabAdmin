// utils/types.ts

// MongoDB-dəki 5 dilli struktur
export interface LocalizedField {
  az: string;
  en?: string;
  ru?: string;
  tr?: string;
  es?: string;
}

// Realm-ə (və ya UI-a) gedəcək tək dilli struktur
export interface ProductResponse {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  categories: string[];
  isPro: boolean;
  images: {
    large: string;
    thumbnail: string;
  };
  preparation: {
    main: {
      yarn: string;
      hook: string;
    };
    extras: string[];
  };
  sections: {
    name: string;
    sectionImage: string;
    content: {
      type: 'text' | 'image' | 'step';
      text?: string;
      images: string[];
      step?: number;
    }[];
  }[];
  abbreviations: {
    key: string;
    value?: string;
  }[];
  createdAt: Date;
}