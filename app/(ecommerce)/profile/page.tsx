/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"

import getUserSession from "@/actions/auth/getUserSession";
import { getOrders } from "@/actions/orders/get-orders";
import { IUserEntity } from "oneentry/dist/users/usersInterfaces";
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronsLeft, Package } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserStats {
    lifetimeOrders: number;
    lifetimeSpent: number;
    yearlyOrders: number;
    yearlySpent: number;
    monthlyOrders: number;
    monthlySpent: number;
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<IUserEntity | null>(null);
    const [stats, setStats] = useState<UserStats>({
        lifetimeOrders: 42,
        lifetimeSpent: 3750.5,
        yearlyOrders: 15,
        yearlySpent: 1250.75,
        monthlyOrders: 3,
        monthlySpent: 275.25,
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const userData = await getUserSession();
            if (userData) {
                setUser(userData);
            }
            const orders = await getOrders();
            if (orders) {
                let lifetimeOrders = 0;
                let lifetimeSpent = 0;
                let yearlyOrders = 0;
                let yearlySpent = 0;
                let monthlyOrders = 0;
                let monthlySpent = 0;

                orders.items.forEach((order) => {
                    const orderDate = new Date(order.createdDate);
                    const orderyear = orderDate.getFullYear();
                    const orderMonth = orderDate.getMonth();
                    const totalSum = parseFloat(order.totalSum);
                    const currentyear = new Date().getFullYear();
                    const currentMonth = new Date().getMonth() + 1;

                    lifetimeOrders += 1;
                    lifetimeSpent += totalSum;

                    if (orderyear === currentyear) {
                        yearlyOrders += 1;
                        yearlySpent += totalSum;
                    }

                    if (orderyear === currentyear && orderMonth === currentMonth) {
                        monthlyOrders += 1;
                        monthlySpent += totalSum;
                    }
                });
                setStats({
                    /* @ts-ignore */
                    lifetimeOrders,
                    /* @ts-ignore */
                    lifetimeSpent,
                    /* @ts-ignore */
                    yearlyOrders,
                    /* @ts-ignore */
                    yearlySpent,
                    /* @ts-ignore */
                    monthlyOrders,
                    /* @ts-ignore */
                    monthlySpent,
                    /* @ts-ignore */
                });
            }
        };
        fetchData();
    }, []);


    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
            <motion.div
                className="max-w-4xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <ChevronsLeft className='text-gray-400 h-6 w-6 sm:h-8 sm:w-8 cursor-pointer' onClick={() => router.push('/')} />
                <motion.h1
                    className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-customThemeColor to-[#00cccc]"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    My Profile
                </motion.h1>
                {isLoading ? (
                    <div className="space-y-8">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-pulse">
                            <div className="flex items-center space-x-4">
                                <div className="w-24 h-24 bg-gray-700 rounded-full"></div>
                                <div className="space-y-2 flex-1">
                                    <div className="h-6 bg-gray-700 rounded w-1/4"></div>
                                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-pulse">
                            <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-700 rounded w-full"></div>
                                <div className="h-4 bg-gray-700 rounded w-full"></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <motion.div
                            className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-24 w-24 text-6xl text-customThemeColor">
                                    <AvatarFallback className="bg-[#0f172a]">
                                        {user?.formData[0].value.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-2xl font-semibold text-customThemeColor">
                                        {user?.formData[0].value}
                                    </h2>
                                        <p className="text-gray-400">{user?.identifier}</p>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            className="bg-gray-800 p-6 rounded-lg shadow-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <h3 className="text-xl font-semibold mb-4 text-customThemeColor">
                                My Stats
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* @ts-ignore */}
                                <StatCard
                                    icon={<Package className="h-8 w-8 text-customThemeColor" />}
                                    title="Lifetime Orders"
                                    value={stats.lifetimeOrders}
                                />
                                {/* @ts-ignore */}
                                <StatCard
                                    icon={<Package className="h-8 w-8 text-customThemeColor" />}
                                    title="Lifetime Spent"
                                    value={`$${stats.lifetimeSpent.toFixed(2)}`}
                                />
                                <StatCard
                                    icon={<Package className="h-8 w-8 text-customThemeColor" />}
                                    title="This Year"
                                    value={`${stats.yearlyOrders} orders`}
                                    subValue={`$${stats.yearlySpent.toFixed(2)} spent`}
                                />

                            </div>
                        </motion.div>
                    </>
                )}

            </motion.div>
        </div>
    );
}

function StatCard({
    icon,
    title,
    value,
    subValue,
}: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subValue: string;
}) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-700 p-4 rounded-lg items-center space-x-4"
        >
            {icon}
            <div>
                <h4 className="text-sm font-semibold text-gray-400">{title}</h4>
                <p className="text-2xl font-bold text-customThemeColor">{value}</p>
                {subValue && <p className="text-sm text-gray-400">{subValue}</p>}
            </div>
        </motion.div>
    );
}