
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductDetail from '@/components/products/ProductDetail';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <ProductDetail productId={id || ''} />
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
