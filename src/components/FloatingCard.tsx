'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    mainImageUrl: string;
    hoverImageUrl?: string;
  };
}

export default function FloatingCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/product/${product.id}`} className="block w-full max-w-[300px]" data-cursor="Discover">
      <div 
        className="group relative flex flex-col items-center p-3 sm:p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 w-full cursor-pointer h-full border border-transparent hover:border-warm-beige"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-full aspect-[3/4] overflow-hidden flex items-center justify-center">
          {/* Antigravity Floating Wrapper */}
          <motion.div
            animate={{
              y: ['-2%', '2%', '-2%'], // More subtle float for mobile friendliness
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative w-full h-full"
          >
            {/* Primary Main Image */}
            <Image
              src={product.mainImageUrl}
              alt={product.title}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-md drop-shadow-lg z-10"
              sizes="(max-width: 768px) 100vw, 300px"
              priority
            />
            {/* Hover Detailed Image cross-fade */}
            {product.hoverImageUrl && (
              <Image
                src={product.hoverImageUrl}
                alt={`${product.title} Detail`}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-md drop-shadow-lg absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-[800ms]"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            )}
          </motion.div>
        </div>

        <div className="mt-6 text-center">
          <h3 className="font-serif text-xl text-gray-900 mb-2">{product.title}</h3>
          <p className="font-sans text-lg text-gray-600 font-medium">৳{product.price}</p>
        </div>
      </div>
    </Link>
  );
}

