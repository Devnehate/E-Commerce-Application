/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client"
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { getCatalogWithProduts } from '@/actions/catalog/getCatalogWithProducts';
import { ICatalog } from '@/types/catalog';
import ProductCatalog from '@/components/productCatalog';

const banner = [
  {
    id: 1,
    title: "Summer Sale",
    description: "Up to 50% off on selected items",
    imgae: "/banner1.jpeg",
  },
];

function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<ICatalog[]>([]);

  useEffect(() => {
    const getData = async () => {
      const catalogs = await getCatalogWithProduts();
      //@ts-ignore
      if (catalogs?.length) setProducts(catalogs);
      setIsLoading(false);

    };
    getData();
  })

  return (
    <div className='min-h-screen bg-gray-900 text-gray-100'>
      <main className='container mx-auto px-4 py-8'>
        <section className='mb-12'>
          <motion.div className='relative overflow-hidden rounded-lg shadow-lg'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}>
            <motion.div className='relative w-full h-[400px]'
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}>
              <Image
                src={banner[0].imgae}
                alt={banner[0].title}
                layout='fill'
                objectFit='cover'
                className='rounded-lg'
              />
              <div className='absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center p-8'>
                <h2 className='text-4xl font-bold mb-4 text-white'>
                  {banner[0].title}
                </h2>
                <p className='text-xl mb-8 text-gray-300'>
                  {banner[0].description}
                </p>
                <Button className='bg-customThemeColor hover:bg-[#00cccc] text-black font-semibold'>
                  Show Now
                  <ArrowRight className='ml-2 h-4 w-4 '></ArrowRight>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </section>
        {
          isLoading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {[...Array(8)].map((_, index) => (
                <motion.div key={index} className='bg-gray-800 p-6 rounded-lg shadow-lg animate-pulse' layout>
                  <div className='w-full h-48 bg-gray-700 rounded-md mb-4'></div>
                  <div className='h-4 bg-gray-700 rounded w-3/4 mb-2'></div>
                  <div className='h-4 bg-gray-700 rounded w-1/2 mb-2'></div>
                  <div className='h-4 bg-gray-700 rounded w-1/4'></div>
                </motion.div>
              ))}
            </motion.div>
          )}
        {
          products.map(catalog=><ProductCatalog key={catalog.id} title={catalog.localizeInfos?.title!} products={catalog.catalogProducts.items} />)
        }
      </main>
    </div>
  )
}

export default Page