import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/db';
import Product from '../../models/Product';
import { localizeProduct } from '@/utils/localize';
import { prepareForStorage } from '@/utils/prepare-data';
import { applyLocalizedUpdate } from '@/utils/update-helper';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { id, lang } = req.query;

  const targetLang = (lang as string) || (req.headers['accept-language']?.split(',')[0].split('-')[0]) || 'az';

  try {
    if (req.method === 'GET') {
      if (id) {
        const product = await Product.findById(id);
        if (!product || product.isDeleted) {
          return res.status(404).json({ message: "Məhsul tapılmadı" });
        }

        const localizedData = localizeProduct(product, targetLang);
        return res.status(200).json(localizedData);
      }

      const products = await Product.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 }).lean();

      const localizedData = localizeProduct(products, targetLang);


      return res.status(200).json(localizedData);
    }

    if (req.method === 'POST') {
      const rawData = req.body;

      // 1. Gələn sadə datanı MongoDB strukturuna uyğunlaşdır
      const formattedData = prepareForStorage(rawData)
      

      const product = await Product.create(formattedData);
      return res.status(201).json(product);
    }

    if (req.method === 'PUT') {
      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({ message: "Məhsul tapılmadı" });
      }

      // 2. Helper vasitəsilə lazımi dili/dataları üzərinə yazırıq
      applyLocalizedUpdate(product, req.body, targetLang);

      // 3. MongoDB-nin dəyişikliyi anlaması üçün bəzən massivləri "markModified" etmək lazım olur
      product.markModified('sections');
      product.markModified('preparation');
      product.markModified('abbreviations');
      product.createdAt = Date.now;
      // 4. Yadda saxla
      await product.save();

      return res.status(200).json({
        message: `${targetLang.toUpperCase()} dili uğurla yeniləndi`,
        data: product
      });
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