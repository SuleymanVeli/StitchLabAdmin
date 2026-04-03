import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI dəyişəni .env faylında tapılmadı!');
}

// Global obyekt üzərində keşləmə (Serverless üçün vacibdir)
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Eyni anda maksimum 10 aktiv bağlantı
      serverSelectionTimeoutMS: 5000, // 5 saniyə ərzində qoşulmasa xəta ver
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Xəta olarsa növbəti dəfə yenidən cəhd etsin
    throw e;
  }

  return cached.conn;
}

export default dbConnect;