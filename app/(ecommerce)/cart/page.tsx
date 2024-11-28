/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import getUserSession from '@/actions/auth/getUserSession';
import useCartStore from '@/stores/cartStore';
import { IUserEntity } from 'oneentry/dist/users/usersInterfaces';
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronsLeft, CreditCard, LogIn, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IOrderData } from 'oneentry/dist/orders/ordersInterfaces';
import createOrders from '@/actions/orders/create-order';

const cart = () => {
  const router = useRouter();
  const cartItem = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<IUserEntity | null>(null);

  const subTotal = cartItem.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const tax = subTotal * 0.1;
  const total = subTotal + tax;


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserSession();
        if (userData) setUser(userData);


      } catch (error) {
        console.error({ error });

      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer);
  }, []);

  const createOrderAndCheckout = async () => {
    const data: IOrderData = {
      formData: [],
      formIdentifier: "order-form",
      paymentAccountIdentifier: "stripe-payment",
      products: cartItem.map((item) => ({ productId: item.id, quantity: item.quantity })),
    };
    // const url = await createOrders(data);
    clearCart();
    router.push(await createOrders(data));
  };

  return (
    <div className='min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8'>
      <motion.div className='max-w-4xl mx-auto'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}>
        <ChevronsLeft className='text-gray-400 h-6 w-6 sm:h-8 sm:w-8 cursor-pointer' onClick={() => router.push('/')} />
        <motion.h1 className='text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-customThemeColor to-[#00cccc] '
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}>
          Your Cart
        </motion.h1>
        {
          isLoading ? (
            <div className='space-y-4'>

              {[...Array(3)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className='bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg animate-pulse'
                  layout
                >
                  <div className='flex items-center space-x-4'>
                    <div className='w-16 h-16 sm:w-20 sm:h-20  bg-gray-700 rounded-md'></div>
                    <div className='flex-1 space-y-2'>
                      <div className='h-4 bg-gray-700 rounded w-3/4'></div>
                      <div className='h-4 bg-gray-700 rounded w-1/2'></div>
                    </div>
                  </div>
                </motion.div>
              ))}

            </div>
          ) : <>
            <AnimatePresence>
              {cartItem.map((item, index) => <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className='bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg mb-4 relative overflow-hidden'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:space-x-4'>
                  <div className='flex items-center space-x-4 mb-4 sm:mb-0'>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className='w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md' />
                    <div className='flex-1'>
                      <h3 className='text-lg font-semibold text-customThemeColor line-clamp-1'>
                        {item.name}
                      </h3>
                      <p className='text-gray-400'>
                        ${item.price}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center justify-between sm:justify-end sm:flex-1'>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="icon"
                        className='text-customThemeColor border-customThemeColor hover:bg-customThemeColor hover:text-gray-900'
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className='h-4 w-4' />
                      </Button>
                      <Input
                        type='number'
                        min="0"
                        value={item.quantity}
                        className='w-16 bg-gray-700 border-gray-600 text-center text-customThemeColor'
                        onChange={e => updateQuantity(item.id, parseInt(e.target.value))}
                      />
                      <Button
                        size="icon"
                        className='text-customThemeColor border-customThemeColor hover:bg-customThemeColor hover:text-gray-900'
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className='h-4 w-4' />
                      </Button>
                    </div>
                    <Button className='text-red-500 hover:text-red-600 hover:bg-red-100  rounded-full transition-colors duration-200 ml-4'
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className='h-5 w-5' />
                    </Button>
                  </div>
                </div>
              </motion.div>)}
            </AnimatePresence>
            <motion.div
              className='bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg mt-8'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className='text-xl sm:text-2xl font-semibold mb-4 text-customThemeColor'>
                Order Summary
              </h2>
              <div className='space-y-2'>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subTotal.toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className='border-t border-gray-700 my-2'></div>
                <div className='flex justify-between text-lg font-semibold'>
                  <span>Total</span>
                  <span className='text-customThemeColor'>${total.toFixed(2)}</span>
                </div>
              </div>
              {user ? (
                <Button
                  className='w-full mt-6 bg-customThemeColor hover:bg-[#00cccc] text-gray-900 font-semibold'
                  disabled={!cartItem.length}
                  onClick={createOrderAndCheckout}
                >
                  <CreditCard className='mr-2 h-5 w-5' />
                  Proceed to Checkout
                </Button>
              ) : (
                <Link href="/auth?type=login">
                  <Button className='w-full mt-6 bg-customThemeColor hover:bg-[#00cccc] text-gray-900 font-semibold'>
                    <LogIn className='mr-2 h-5 w-5' />
                    Login to Checkout
                  </Button>
                </Link>
              )}
            </motion.div>
          </>}
        {
          !isLoading && cartItem.length === 0 && (
            <motion.div
              className='text-center py-12'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ShoppingCart className='mx-auto h-16 w-16 text-gray-400 mb-4' />
              <h2 className='text-2xl font-semibold mb-2 text-[#00ffff]'>
                Your cart is empty
              </h2>
              <p className='text-gray-400 mb-6'>
                Looks like you haven&apos;t added any items to your cart yet.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/">
                  <Button variant="outline" className='bg-transparent text-customThemeColor border-customThemeColor hover:bg-customThemeColor hover:text-black'>
                    Continue Shopping
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          )
        }
      </motion.div>
    </div >
  )
}

export default cart;
