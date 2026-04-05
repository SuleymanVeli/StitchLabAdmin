import mongoose, { Schema, model, models } from 'mongoose';

// Tərcümə oluna bilən sahələr üçün ortaq struktur
// Bu, həm kodun təkrarının qarşısını alır, həm də gələcəkdə yeni dil əlavə etməyi asanlaşdırır.
const LocalizedString = {
  az: { type: String, required: true },
  en: { type: String },
  ru: { type: String },
  tr: { type: String },
  es: { type: String }
};

// Addım daxilindəki mətnlər üçün (bəziləri optional ola bilər)
const LocalizedStringOptional = {
  az: { type: String },
  en: { type: String },
  ru: { type: String },
  tr: { type: String },
  es: { type: String }
};

const ProductSchema = new Schema({
  // Başlıq və Təsvir çoxdilli oldu
  title: LocalizedString,
  description: LocalizedString,
  
  categories: [{ type: String }],
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'], 
    default: 'easy' 
  },
  isPro: { 
    type: Boolean, 
    default: false 
  },   
  
  images: {
    large: { type: String, required: true }, 
    thumbnail: { type: String, required: true } 
  },

  preparation: {
    main: {
      // İp və Tiğ adları da dildən asılı ola bilər (məs: "Ağ ip" vs "White yarn")
      yarn: LocalizedString, 
      hook: LocalizedString 
    },
    extras: [{ type: String }] // İkon adları (məs: "scissors") sabit qalır
  },

  sections: [{
    // Bölmə adı (məs: "Baş hissəsi" / "Head Part")
    name: LocalizedString,
    sectionImage: { type: String, required: true}, 
    content: [{
      type: { type: String, enum: ['text', 'image', 'step'], default: 'text' },
      // Addım mətni çoxdilli oldu
      text: LocalizedStringOptional,
      images: [{ type: String }], 
      step: { type: Number } 
    }]
  }],
  // Qısaltmalar: Məsələn [{ key: "sc", value: { az: "sıx iynə", en: "single crochet" } }]
  abbreviations: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false }
}, { 
  timestamps: true,
  // Axtarış funksiyası üçün indekslər
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Axtarış üçün indeksləmə (Azərbaycan və İngilis dilləri üçün)
ProductSchema.index({ 
    "title.az": "text", 
    "title.en": "text", 
    "description.az": "text" 
});

export default models.products || model('products', ProductSchema);