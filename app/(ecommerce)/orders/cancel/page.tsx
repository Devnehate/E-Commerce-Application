"use client"
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AlertTriangle, XCircle } from 'lucide-react';
import Link from 'next/link';
export default function OrdersCanceld() {
    return (
        <div className="min-h-[90vh] bg-gray-900 text-gray-100 flex items-center justify-center p-4">
            <motion.div
                className='max-w-md w-full bg-gray-800 rounded-lg shadow-lg'
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className='text-center mb-8'
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                    <XCircle className='w-20 h-20 text-red-500 mx-auto mb-4' />
                    <h1 className='text-3xl font-bold text-red-500 mb-2'>
                        Order Canceled
                    </h1>
                    <p className='text-gray-400'>
                        Your order has been canceled successfully.
                    </p>
                </motion.div>
                <motion.div
                    className='bg-gray-700 rounded-lg mb-8'
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <div className='flex ice space-x-4 text-yellow-400 mb-2'>
                        <AlertTriangle className='w-6 h-6' />
                        <h2 className='text-lg font-semibold'>What happen next?</h2>
                    </div>
                    <ul className='list-disc list-inside text-gray-300 space-y-2'>
                        <li>Any charges will be refunded within 3-5 business days.</li>
                        <li>You&apos;ll recieve a confirmation email for the cancellation.</li>
                        <li>Feel free to place a new order if you change your mind.</li>
                    </ul>
                </motion.div>
                <motion.div
                    className='text-center space-y-4'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <p className='text-gray-400'>
                        We&apos;re sorry to see you go. Is ther anything we can help with?
                    </p>
                    <div className='space-x-4'>
                        <Link href="/" passHref>
                            <Button
                                className='bg-customThemeColor hover:bg-[#00cccc] text-gray-900 font-semibold'>
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}