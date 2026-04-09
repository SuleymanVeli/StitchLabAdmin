// models/Note.ts
import mongoose, { Schema, model, models } from 'mongoose';

const NoteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  path: { type: String, default: '' }, // folder/subfolder/note
  updatedAt: { type: Date, default: Date.now }
});

export const Note = models.Note || model('Note', NoteSchema);