import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  categories: [{ type: String }],
  difficulty: { 
    type: String, 
    enum: ['Asan', 'Orta', 'Çətin'], 
    default: 'Asan' 
  },
  isPro: { 
    type: Boolean, 
    default: false 
  },  
  // Şəkillər: həm böyük (hero), həm də kiçik (thumbnail) formatda
  images: {
    large: { type: String, required: true }, // Main high-res image
    thumbnail: { type: String, required: true } // Small preview image
  },

  // Hazırlıq mərhələsi (Yarn and Hook details)
  preparation: {
    main: {
      yarn: { type: String, required: true }, // İp (e.g., Cotton, Wool)
      hook: { type: String, required: true }  // Tiğ (e.g., 3.5mm, 4mm)
    },
    extras: [{ type: String }]  // e.g., "scissors-icon", "needle-icon"
  },

  // Addım-addım hissələr (e.g., "Head", "Body", "Arms")
  sections: [{
    name: { type: String, required: true },
    sectionImage: { type: String, required: true}, 
    content: [{
      type: { type: String, enum: ['text', 'image', 'step'], default: 'text' },
      text: { type: String },
      images: [String], // Array of images for this specific step
      step: { type: Number } // Step number (e.g., Round 1, Round 2)
    }]
  }],

  // Qısaltmalar (Abbreviations: e.g., sc, inc, dec)
  abbreviations: [{ type: String }],

  createdAt: { type: Date, default: Date.now },

  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export default models.products || model('products', ProductSchema);