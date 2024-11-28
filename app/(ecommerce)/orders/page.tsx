"use client"
import { getOrders } from '@/actions/orders/get-orders';
import { AlertCircle, CheckCircle, ChevronsLeft, Package, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
//@ts-ignore

function MyOrders() {

    interface Product {
        id: number;
        title: string;
        price: string;
        quantity: number | null;
    }

    interface OrderItem {
        id: number;
        createdDate: string;
        statusIdentifier: string;
        totalSum: string;
        products: Product[];
    }

    interface IOrder {
        items: OrderItem[];
        total: number;
    }

    const orderStatusIcons = {
        processing: <Package className='w-5 h-5 text-yellow-500' />,
        shipped: <Truck className='w-5 h-5 text-blue-500' />,
        delivered: <CheckCircle className='w-5 h-5 text-green-500' />,
        chancelled: <AlertCircle className='w-5 h-5 text-red-500' />,

    }

    const [orders, setOrders] = useState<IOrder>({ items: [], total: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            const data = await getOrders();
            if (data !== undefined) {
                //@ts-ignore
                setOrders({ items: data.items.reverse(), total: data.total });
            }
            else {
                setOrders({ total: 0, items: [] });
            }
            setIsLoading(false);
        };
        fetchOrders();
    }, [])
    return (
        <div className='min-h-screen bg-gray-900 text-gray-100 p-8'>
            <motion.div
                className='max-w-4xl mx-auto'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <ChevronsLeft className='text-gray-400 h-6 w-6 sm:h-8 sm:w-8 cursor-pointer' onClick={() => router.push('/')} />
                <motion.h1
                    className='text-4xl font-bold text-center mb-12  bg-clip-text text-transparent bg-gradient-to-r from-customThemeColor to-[#00cccc]'
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    My Orders
                </motion.h1>
                {isLoading ? (
                    <div className='space-y-4'>
                        {[...Array(3)].map((_, index) => (
                            <motion.div
                                key={index}
                                className='bg-gray-800 p-6 rounded-lg shadow-lg animate-pulse'
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <div className='h-6 bg-gray-700 rounded w-1/4 mb-4'></div>
                                <div className='h-6 bg-gray-700 rounded w-1/2 mb-2'></div>
                                <div className='h-6 bg-gray-700 rounded-none w-1/3'></div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <AnimatePresence>
                        {orders?.items?.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <div className='p-6'>
                                    <div className='flex justify-between items-center mb-4'>
                                        <h2 className='text-2xl font-semibold text-customThemeColor'>
                                            Order #{order.id}
                                        </h2>
                                        <Badge className={`text-white`}>
                                            {/* @ts-ignore */}
                                            {orderStatusIcons[order.statusIdentifier]}
                                            <span className='ml-2 capitalize'>
                                                {order.statusIdentifier}
                                            </span>
                                        </Badge>
                                    </div>
                                    <div className='flex justify-between text-gray-400 mb-4'>
                                        <span>
                                            Order Date:{order.createdDate.split("T").shift()}
                                        </span>
                                        <span>
                                            Total : ${order.totalSum}
                                        </span>
                                    </div>
                                    <Accordion type='single' collapsible className='w-full'>
                                        <AccordionItem value='items'>
                                            <AccordionTrigger className='text-customThemeColor hover:text-[#00cccc]'>
                                                View Order Details
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className='space-y-4 mt-4'>
                                                    {order.products.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className='flex items-center space-x-4'
                                                        >
                                                            <div className='text-gray-400'>
                                                                <h3 className='font-semibold text-customThemeColor'>
                                                                    {item.title}
                                                                </h3>
                                                                <p className='text-gray-400'>
                                                                    Quantity: {item.quantity}
                                                                </p>
                                                            </div>
                                                            <span className='text-customThemeColor'>
                                                                ${item.price}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                                <div className='bg-gray-700 p-4 flex justify-between items-center'>
                                    <Button className='text-customThemeColor border-customThemeColor hover:bg-[#00cccc] hover:text-gray-400'>
                                        track Order
                                    </Button>
                                    <Button className='text-gray-400 hover:text-customThemeColor'>
                                        Need Help?
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </motion.div>
        </div>
    )
}

export default MyOrders