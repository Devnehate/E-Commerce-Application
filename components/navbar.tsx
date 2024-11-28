/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Bell, Heart, LogOut, Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import { IUserEntity } from 'oneentry/dist/users/usersInterfaces';
import getUserSession from '@/actions/auth/getUserSession';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import logoutAction from '@/actions/auth/logout';
import useCartStore from '@/stores/cartStore';

function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [typingText, setTypingText] = useState("");
    const [user, setUser] = useState<IUserEntity | null>(null);
    const [isMobileMenuOpen, setisMobileMenuOpen] = useState(false);
    
    const searchRef = useRef<HTMLDivElement>(null);
    const cartItem = useCartStore((state) => state.cart);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

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
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isSearchOpen) {
            const text = "Search Products...";
            let i = 0;
            const typingInterval = setInterval(() => {
                if (i < text.length) {
                    setTypingText(text.slice(0, i + 1));
                    i++;
                } else {
                    clearInterval((typingInterval));
                }
            }, 100);
        } else {
            setTypingText("");
        }
    }, [isSearchOpen])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target as Node) &&
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)) {
                setisMobileMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.length) {
            router.push(`/search?searchTerm=${searchQuery}`)
        }
    }

    const handleLogout = async () => {
        await logoutAction();
        router.push("/");
        setUser(null);
        setisMobileMenuOpen(false);
    }

    const handleMenuItemClick = () => {
        setisMobileMenuOpen(false);
    }

    return (
        <motion.nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
            ${isScrolled
                ? "bg-black/95 backdrop-blur-md"
                : "bg-transparent"}`
        }
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex items-center justify-between h-16'>
                    <div className='flex items-center'>
                        <Link href="/" className='flex-shrink-0'>
                            <motion.span className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00ffff] to-[#00cccc]'
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}>
                                Tech        Store
                            </motion.span></Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <motion.div className='relative' initial={false} animate={isSearchOpen ? "open" : "closed"}
                            ref={searchRef}>
                            <motion.form onSubmit={handleSubmit} className='flex items-center' variants={{
                                open: { width: "300px" },
                                closed: { width: "35px" },
                            }}>
                                <Input
                                    type="text"
                                    placeholder={typingText}
                                    value={searchQuery}
                                    className="bg-gray-800 border-gray-700 text-white w-full"
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                                <Button className='absolute right-0 top-0 bottom-0'
                                    type='submit'
                                    size="icon"
                                    onClick={() => !isSearchOpen && setIsSearchOpen(true)}>
                                    <Search className='h-5 w-5 text-gray-300 hover:text-[#00ffff]' />
                                </Button>
                            </motion.form>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}>
                            <Link href="/wishlist"
                                onClick={handleMenuItemClick}
                            >
                                <Button size="icon">
                                    <Heart className='h-5 w-5 text-gray-300 hover:text-[#00ffff]' />
                                </Button>
                            </Link>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}>
                            <Link href="/cart"
                                onClick={handleMenuItemClick}
                            >
                                <Button size="icon" className='relative'>
                                    <ShoppingCart className='h-5 w-5 text-gray-300 hover:text-[#00ffff]' />
                                    {cartItem.length > 0 && (
                                        <span className='absolute top-0 right-0 inline-flex items-center justify-center px-[5.5px] py-[3px] text-xs font-bold leading-none text-white bg-red-500 rounded-full'>
                                            {cartItem.length}
                                        </span>
                                    )}
                                </Button>
                            </Link>
                        </motion.div>
                        {
                            user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className='relative h-8 w-8 rounded-full'>
                                            <Avatar className='h-8 w-8'>
                                                <AvatarFallback className='bg-customThemeColor'>
                                                    {
                                                        user.formData
                                                            .find((f) => f.marker === "name")
                                                            ?.value?.charAt(0)
                                                    }
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className='w-56 bg-gray-900 border-gray-800 text-gray-100' align='end' forceMount>
                                        <DropdownMenuLabel className='font-normal'>
                                            <div className='flex flex-col space-y-1'>
                                                <p className='text-sm font-medium leading-none text-customThemeColor'>
                                                    {
                                                        user.formData
                                                            .find((f) => f.marker === "name")
                                                            ?.value
                                                    }
                                                </p>
                                                <p className='text-xs leading-none text-gray-400'>
                                                    {user?.identifier}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator className='bg-gray-800' />
                                        <DropdownMenuItem className='focus:bg-gray-800 focus:text-customThemeColor'>
                                            <Link href="/profile" className='flex w-full'>
                                                <User className='mr-2 h-4 w-4' />
                                                <span>Profile</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className='focus:bg-gray-800 focus:text-customThemeColor'>
                                            <Bell className='mr-2 h-4 w-4' />
                                            <span>Notifications</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className='focus:bg-gray-800 focus:text-customThemeColor'>
                                            <Link href="/orders" className='flex w-full'>
                                                <ShoppingCart className='mr-2 h-4 w-4' />
                                                <span>Orders</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className='bg-gray-800' />
                                        <DropdownMenuItem className='focus:bg-gray-800 focus:text-customThemeColor' onClick={handleLogout}>
                                            <LogOut className='mr-2 h-4 w-4' />
                                            <span>Logout</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <div className='flex space-x-2'>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Link href="/auth?type=login">
                                            <Button variant="outline" className='bg-transparent text-customThemeColor border-customThemeColor hover:bg-customThemeColor hover:text-black'>
                                                Login
                                            </Button>
                                        </Link>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Link href="/auth?type=signup">
                                            <Button className='bg-customThemeColor text-black hover:bg-[#00cccc]'>
                                                Signup
                                            </Button>
                                        </Link>
                                    </motion.div>
                                </div>)
                        }
                    </div>
                    <div className='md:hidden flex items-center'>
                        <motion.button onClick={() => setisMobileMenuOpen(!isMobileMenuOpen)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            {
                                isMobileMenuOpen ? <X className='h-6 w-6 text-gray-300' /> : <Menu className='h-6 w-6 text-gray-300' />
                            }
                        </motion.button>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {
                    isMobileMenuOpen && <motion.div className='md:hidden bg-black'
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        ref={mobileMenuRef} >
                        <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
                            <form onSubmit={handleSubmit} className='mb-4'>
                                <Input type="text"
                                    placeholder='Search Products...'
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className='bg-gray-800 border-gray-700 text-white w-full'
                                />
                            </form>
                            <Link href="/wishlist" className='text-gray-300 hover:text-customThemeColor block px-3 py-2 rounded-md'
                                onClick={handleMenuItemClick}
                            >
                                Wishlist
                            </Link>
                            <Link href="/cart" className='text-gray-300 hover:text-customThemeColor block px-3 py-2 rounded-md'
                                onClick={handleMenuItemClick}
                            >
                                Cart
                            </Link>
                        </div>
                        <div className='border-t border-gray-700 pt-4 pb-3'>
                            {user && (
                                <div className='flex items-center px-5 mb-3'>
                                    <div className='flex-shrink-0'>
                                        <Avatar className='h-8 w-8'>
                                            <AvatarFallback className='bg-customThemeColor text-black'>
                                                {user.formData
                                                    .find((f: any) => f.marker === "name")
                                                    ?.value?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className='ml-3'>
                                        <div className='text-base font-medium text-white'>
                                            {
                                                user.formData
                                                    .find((f: any) => f.marker === "name")
                                                    ?.value
                                            }
                                        </div>
                                        <div className='text-sm font-medium text-gray-400'>
                                            {user?.identifier}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {user ? (
                                <div className='mt-3 px-2 space-y-1'>
                                    <Link href="/profile" className='block px-3 py-2 rounded-md font-medium text-gray-400 hover:text-white hover:bg-gray-700' onClick={handleMenuItemClick}>
                                        Your Profile
                                    </Link>
                                    <Link href="/notifications" className='block px-3 py-2 rounded-md font-medium text-gray-400 hover:text-white hover:bg-gray-700' onClick={handleMenuItemClick}>
                                        Notifications
                                    </Link>
                                    <Link href="/orders" className='block px-3 py-2 rounded-md font-medium text-gray-400 hover:text-white hover:bg-gray-700' onClick={handleMenuItemClick}>
                                        Orders
                                    </Link>
                                    <button onClick={handleLogout} className='block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700'>
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className='mt-3 px-2 space-y-1' >
                                    <Link href="/auth?type=login" className='block px-3 py-2 rounded-md font-medium text-gray-400 hover:text-white hover:bg-gray-700' onClick={handleMenuItemClick}>   
                                        login
                                    </Link>
                                    <Link href="/auth?type=signup" className='block px-3 py-2 rounded-md font-medium text-gray-400 hover:text-white hover:bg-gray-700' onClick={handleMenuItemClick}>
                                        Sign Up
                                    </Link>
                                </div>
                            )
                            }
                        </div>
                    </motion.div>
                }
            </AnimatePresence>
        </motion.nav>
    )
}

export default Navbar