// pages/api/notes.ts
import dbConnect from '@/lib/db';
import { Note } from '@/models/Note';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  // Query string-dən ID-ni götürürük: /api/notes?id=123
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        if (id) {
          // GetById
          const note = await Note.findById(id);
          if (!note) return res.status(404).json({ error: 'Not tapılmadı' });
          return res.status(200).json(note);
        }
        // GetAll
        const notes = await Note.find({}).sort({ updatedAt: -1 });
        return res.status(200).json(notes);
      } catch (error) {
        return res.status(500).json({ error: 'Server xətası' });
      }

    case 'POST':
      try {
        // Create
        const newNote = await Note.create(req.body);
        return res.status(201).json(newNote);
      } catch (error) {
        return res.status(400).json({ error: 'Məlumat bazasına yazıla bilmədi' });
      }

    case 'PUT':
      try {
        // Edit
        if (!id) return res.status(400).json({ error: 'ID tələb olunur' });
        const updatedNote = await Note.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(200).json(updatedNote);
      } catch (error) {
        return res.status(400).json({ error: 'Yeniləmə zamanı xəta' });
      }

    case 'DELETE':
      try {
        // Delete
        if (!id) return res.status(400).json({ error: 'ID tələb olunur' });
        await Note.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Uğurla silindi' });
      } catch (error) {
        return res.status(400).json({ error: 'Silmə zamanı xəta' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}