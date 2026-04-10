import { useEffect, useState } from 'react';
import api from '../lib/axios';
import styles from '../styles/productlist.module.css';
import layoutStyles from '../styles/layout.module.css'; // Header və s. üçün
import Link from 'next/link';
import Button from '@/components/Button';
import PreviewModal from '@/components/PreviewModal';
import Loading from '@/components/Loading';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  const [previewOpen, setPreviewOpen] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error("Məlumat yüklənərkən xəta:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Silmək istədiyinizə əminsiniz?')) return;

    try {
      await api.delete(`/products?id=${id}`);
      fetchProducts(); // Silindikdən sonra məlumatları yenidən yükləyin      
    } catch (error) {
      console.error("Məlumat silinərkən xəta:", error);
    }
  };

  const getDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Asan';
      case 'medium':
        return 'Orta';
      case 'hard':
        return 'Çətin';
      default:
        return difficulty;
    }
  };

  if (loading) return <Loading fullScreen message="Məlumatlar gətirilir..." />;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Əl İşləri ({products.length})</h1>
        <Link href="/productform">
          <Button variant='primary'>+ Yeni Əl İşi</Button>
        </Link>
      </div>

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Şəkil</th>
              <th>Ad</th>
              <th>Kateqoriyalar</th>
              <th>Hazırlıq</th>
              <th>Ön Baxış</th>
              <th>Dillər</th>
              <th>Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td data-label="Şəkil">
                  <div className={styles.thumbnailWrapper}>
                    <img src={product.images.thumbnail || '/placeholder.png'} alt={product.title} className={styles.thumbnailImage} />
                  </div>
                </td>
                <td data-label="Ad">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontWeight: 600 }}>{product.title}</span>
                    <span style={{ fontSize: '11px', color: '#888' }}>Səviyyə: {getDifficulty(product.difficulty)}</span>
                  </div>
                </td>
                <td data-label="Kateqoriyalar">
                  <div className={styles.tagGroup}>
                    {product.categories?.map((cat: string, i: number) => (
                      <span key={i} className={styles.categoryTag}>{cat}</span>
                    ))}
                  </div>
                </td>
                <td data-label="Hazırlıq">
                  {product.preparation.main.yarn} / {product.preparation.main.hook}
                </td>
                <td data-label="Ön Baxış">
                  <Button variant='outline' onClick={() => setPreviewOpen(product)}>👁️ Baxış</Button>
                </td>
                <td data-label="Dillər">
                  <div className={styles.tagGroup}>
                    {['en', 'ru', 'es', 'tr', 'de'].map(lang => (
                      <Link key={lang} href={`/productformlanguage?id=${product._id}&lang=${lang}`}>
                        <Button variant='outline' style={{ padding: '4px 8px', fontSize: '11px' }}>{lang.toUpperCase()}</Button>
                      </Link>
                    ))}
                  </div>
                </td>
                <td className={styles.actions}>
                  <Link href={`/productform?id=${product._id}`} style={{ width: '100%' }}>
                    <Button variant='secondary' style={{ width: '100%' }}>✏️ Dəyiş</Button>
                  </Link>
                  <Button variant='danger' style={{ width: '100%' }} onClick={() => { handleDelete(product._id) }}>🗑️ Sil</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className={styles.emptyState}>
            <p>Heç bir layihə tapılmadı. Yeni birini əlavə etməyə nə deyirsən?</p>
          </div>
        )}
      </div>

      <PreviewModal
        isOpen={previewOpen !== null}
        onClose={() => setPreviewOpen(null)}
        data={previewOpen}
      />
    </div>
  );
}