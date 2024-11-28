/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { FormEvent, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronsLeft, Facebook, Instagram, Key, Loader, Loader2, ShoppingBag, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSignupFormdata, handleSignupSubmit } from '@/actions/auth/signup';
import { getLoginFormdata, handleLoginSubmit } from '@/actions/auth/login';
import { IAttributes } from 'oneentry/dist/base/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface SignUpFormData {
    email: string;
    password: string;
    name: string;
}

interface LoginFormData {
    email: string;
    password: string;
}

const Auth = () => {
    const [isSignup, setIsSignup] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [inputValues, setInputValues] = useState<Partial<SignUpFormData & LoginFormData>>({});
    const [error, setError] = useState<string | null>(null);
    const [formData, setformData] = useState<IAttributes[]>([]);
    const router = useRouter();
    const serchPrams = useSearchParams();

    useEffect(() => {
        const type = serchPrams.get("type");
        setIsSignup(type !== "login");
    }, [serchPrams])

    useEffect(() => {
        setLoading(true);
        setError(null);
        const fetchData = isSignup ? getSignupFormdata : getLoginFormdata;
        fetchData().then((data) => setformData(data))
            .catch(() => setError("Failed to load form data, Please try again."))
            .finally(() => setLoading(false));
        console.log({ formData });

    }, [isSignup]);

    const toggleForm = () => {
        setIsSignup(!isSignup);
        setError(null);
        setInputValues({});
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputValues((prevValues) => ({ ...prevValues, [name]: value }));
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (isSignup) {
                if (inputValues.email && inputValues.password && inputValues.name) {
                    const response = await handleSignupSubmit(inputValues as SignUpFormData);
                    if ("identifier" in response) {
                        setInputValues({});
                        setIsSignup(false);
                        toast({ title: "User created. Please login to continue.", duration: 3000, variant: "tealBlack" })
                    }
                    else {
                        setError(response.message);
                    }
                }
                else {
                    setError("Please fill out required fields.");
                }
            }
            else {
                if (inputValues.email && inputValues.password) {
                    const response = await handleLoginSubmit(inputValues as LoginFormData);
                    if (response.message) {
                        setError(response.message)
                    } else {
                        setError("Please fill out required fields.");

                    }
                }
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : "An error occured, please try again.")
        }
        finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className='flex min-h-screen bg-gray-900 text-white'>
            <div className='w-full max-w-6xl mx-auto flex flex-col lg:flex-row'>
                <AnimatePresence mode='wait'>
                    <motion.div key={isSignup ? "signup" : "signin"}
                        className='w-full lg:w-3/5 p-4 sm:p-8 lg:p-12'
                        initial={{ opacity: 0, x: isSignup ? 50 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: isSignup ? 50 : -50 }}
                        transition={{ duration: 0.5 }}>
                        <div className='mb-8 lg:mb-12 cursor-pointer' onClick={() => router.push("/")}>
                            <ChevronsLeft className='text-gray-400 h-6 w-6 sm:h-8 sm:w-8' />
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}>
                            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4'>
                                {isSignup ? "Sign Up" : "Sign In"}
                            </h2>
                            <p className='text-base sm:text-lg lg:text-xl text-gray-400 mb-6 sm:mb-8'>
                                {
                                    isSignup
                                        ? "join our e-commerce platform and start shopping!"
                                        : "Welcome back! Please enter your details"
                                }
                            </p>
                        </motion.div>
                        {
                            loading ? <div className='flex justify-center items-center h-64'>
                                <Loader2 className='h-8 w-8 animate-spin text-[#00ffff]' />
                            </div> : <form className='space-y-4 sm:space-y-6' onSubmit={handleSubmit}>
                                {
                                    formData.map((field: IAttributes) => (
                                        <motion.div key={field.marker}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}>
                                            <Label className='text-base sm:text-lg text-gray-400 mb-1 sm:mb-2 block'
                                                htmlFor={field.marker}>
                                                {field.localizeInfos.title}
                                            </Label>
                                            <Input id={field.marker}
                                                type={field.marker === "password" ? "password" : "text"}
                                                name={field.marker}
                                                className='bg-gray-800 border-gray-700 text-white text-base sm:text-lg p-4 sm:p-6'
                                                placeholder={field.localizeInfos.title}
                                                value={inputValues[field.marker as keyof typeof inputValues] || ""}
                                                disabled={isSubmitting}
                                                onChange={handleInputChange}
                                            />
                                        </motion.div>
                                    ))
                                }
                                {
                                    error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className='text-red-500 text mt-2 text-center'
                                        >
                                            {error}
                                        </motion.div>
                                    )
                                }
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <Button className='w-full bg-[#00ffff] hover:bg-[#00cccc] text-black text-base sm:text-xl font-bold p-4 sm:p-6' disabled={isSubmitting}>
                                        {
                                            isSubmitting ? (
                                                <Loader2 className='h-5 w-5 sm:h-6 sm:w-6 animate-spin' />
                                            ) : isSignup ? (
                                                "Sign Up"
                                            ) : (
                                                "Sign In"
                                            )
                                        }
                                    </Button>
                                </motion.div>
                            </form>
                        }
                        <motion.div className='mt-6 sm:mt-8 flex flex-col sm:flex-row ice justify-center space-y-4 sm:space-y-0 sm:space-x-4'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}>
                            <div className='text-base sm:text-lg lg:text-xl text-gray-400'>
                                Or continue with
                            </div>
                            <div className='flex space-x-4'>
                                <Button variant="outline" size="icon" className='bg-gray-900 border-gray-700 w-12 h-12 sm:w-auto sm:h-auto p-2' disabled={isSubmitting}>
                                    <Facebook className='h-5 w-5 sm:h-6 sm:w-6' />
                                    <span className='hidden sm:inline-block sm:ml-2'>Facebook</span>
                                </Button>
                                <Button variant="outline" size="icon" className='bg-gray-900 border-gray-700 w-12 h-12 sm:w-auto sm:h-auto p-2' disabled={isSubmitting}>
                                    <Instagram className='h-5 w-5 sm:h-6 sm:w-6' />
                                    <span className='hidden sm:inline-block sm:ml-2'>Instagram</span>
                                </Button>
                            </div>
                        </motion.div>
                        <motion.div className='mt-4 sm:mt-5 flex items-center justify-center'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}>
                            <p className='text-base sm:text-lg lg:text-xl text-white'>
                                {
                                    isSignup ? "Already a member" : "Don't have an account?"
                                }
                            </p>
                            <Button variant="link" className='text-lg sm:text-xl lg:text-2xl text-white' disabled={isSubmitting} onClick={toggleForm}>
                                {
                                    isSignup ? "Sign In" : "Sign Up"
                                }
                            </Button>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
                <motion.div className='w-full hidden lg:w-2/5 bg-gradient-to-br from-[#00ffff] to-black p-12 lg:flex flex-col justify-between items-center h-full'
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}>
                    <div className='space-y-12 h-full flex flex-col items-center justify-center'>
                        <motion.div
                            className='bg-black bg-opacity-50 p-8 rounded-lg shadow-lg'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            {
                                isSignup ? (
                                    <>
                                        <h3 className='text-3xl font-bold mb-4'>New Arrivals</h3>
                                        <p className='text-5xl font-bold mb-4'>1,234</p>
                                        <div className='flex justify-between items-center w-full'>
                                            <div className='h-3 w-36 bg-black bg-opacity-50 rounded-full overflow-hidden'>
                                                <motion.div
                                                    className='h-full bg-[#00ffff]'
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "70%" }}
                                                    transition={{ delay: 0.6, duration: 0.8 }}
                                                />
                                            </div>
                                            <span className='text-2xl font-bold text-end'>
                                                70% increase
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <div className='p-3 py-0'>
                                        <h3 className='text-3xl font-bold mb-4'>Customer Reviews</h3>
                                        <div className='flex items-center mb-4'>
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className='text-yellow-400 h-8 w-8 mr-1' />
                                            ))}
                                            <span className='text-3xl ml-2 font-bold'>4.9</span>
                                        </div>
                                        <p className='text-xl text-gray-200'>Based on 10,000+ reviews</p>
                                    </div>
                                )
                            }
                        </motion.div>
                        <motion.div
                            className='bg-black bg-opacity-50 p-8 rounded-lg shadow-lg'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className='flex items-center mb-4'>
                                {
                                    isSignup ? (
                                        <ShoppingBag className=' text-[#00ffff] h-8 w-8 mr-4' />
                                    ) : (
                                        <Key className='text-[#00ffff] h-8 w-8 mr-4' />
                                    )
                                }
                                <h3 className='text-2xl font-bold'>
                                    {
                                        isSignup ? "Exclusive Deals" : "Secure Shopping"
                                    }
                                </h3>
                            </div>
                            <p className='text-xl text-gray-200'>
                                {
                                    isSignup
                                        ? "Sign up now and get access to exclusive deals and promotions!"
                                        : "Your data is protected with state-of-the-art encryption technology."
                                }
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Auth;
