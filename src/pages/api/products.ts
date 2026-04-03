import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/db';
import Product from '../../models/Product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      if (id) {
        const product = await Product.findById(id);
        if (!product || product.isDeleted) {
          return res.status(404).json({ message: "Məhsul tapılmadı" });
        }
        return res.status(200).json(product);
      }
      const products = await Product.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 });
      return res.status(200).json(products);
    }

    if (req.method === 'POST') {
      const product = await Product.create(req.body);
      return res.status(201).json(product);
    }

    if (req.method === 'PUT') {
      const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
      if (!product) {
        return res.status(404).json({ message: "Məhsul tapılmadı" });
      }
      return res.status(200).json(product);
    }


    /// isDeleted true olanları silmək üçün

    if (req.method === 'DELETE') {
      const product = await Product.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
      if (!product) {
        return res.status(404).json({ message: "Məhsul tapılmadı" });
      } else {
        return res.status(200).json({ message: "Məhsul silindi" });
      }
    }

    return res.status(405).json({ message: "Bu metod desteklenmiyor" });  

  } catch (error) {
    return res.status(500).json({ message: "Server xətası", error });
  }
}