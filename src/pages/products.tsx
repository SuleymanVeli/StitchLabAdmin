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
              <th>Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <div className={styles.thumbnailWrapper}>
                    <img
                      src={product.images.thumbnail || '/placeholder.png'}
                      alt={product.title}
                      className={styles.thumbnailImage}
                    />
                  </div>
                </td>                
                {/* Cədvəlin daxilində Title-ın yanına əlavə etmək olar */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600 }}>{product.title}</span>
                    {product.isPro && (
                      <span style={{ 
                        backgroundColor: '#fff3cd', 
                        color: '#856404', 
                        fontSize: '10px', 
                        padding: '2px 6px', 
                        borderRadius: '4px',
                        border: '1px solid #ffeeba'
                      }}>
                        PRO
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: '#888' }}>Səviyyə: {getDifficulty(product.difficulty)}</div>
                </td>
                <td>
                  <div className={styles.tagGroup}>
                    {product.categories?.map((cat: string, i: number) => (
                      <span key={i} className={styles.categoryTag}>{cat}</span>
                    ))}
                  </div>
                </td>
                <td style={{ fontSize: '0.85rem', color: '#666' }}>
                  {product.preparation.main.yarn} / {product.preparation.main.hook}
                </td>
                <td>
                  <Button 
                    variant='outline'
                    style={{ padding: '6px 12px', fontSize: '13px' }}
                    onClick={() => setPreviewOpen(product)}
                  >
                    👁️ Baxış
                  </Button>
                </td>
                <td className={styles.actions}>
                  <Link href={`/productform?id=${product._id}`}>
                    {/* Edit düyməsi üçün ikon əlavə etmək vizualı gücləndirər */}
                    <Button variant='secondary' style={{ padding: '6px 12px', fontSize: '13px' }}>
                      ✏️ Dəyiş
                    </Button>
                  </Link>
                  <Button
                    variant='danger'
                    style={{ padding: '6px 12px', fontSize: '13px' }}
                    onClick={() => { handleDelete(product._id) }}
                  >
                    🗑️ Sil
                  </Button>
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