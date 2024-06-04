import React, { useState } from 'react';
import { signOut, useSession } from "next-auth/react";
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Cookies from "js-cookie";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Menu } from "@headlessui/react";

export default function Layout({ title, children }) {
    const { status, data: session } = useSession();
    const [navbar, setNavbar] = useState(false);

    const logoutClickHandler = () => {
        Cookies.remove("cart");
        // dispatch({ type: 'CART_RESET' });
        signOut({ callbackUrl: "/login" });
    };

    return (
        <>
            <Head>
                <title>{title ? title + " - Tec Data" : "Tec Data"}</title>
                <meta name="description" content="Ecommerce Website" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <ToastContainer position="bottom-center" limit={1} />

            <div className="flex min-h-screen flex-col justify-between">
                <header>
                    <nav className="position: relative w-full bg-blue-900 shadow-lg h-16 z-20">
                        <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
                            <div>
                                <div className="flex /* items-left */ justify-between py-1 md:py-0 md:block">
                                    {/* <!-- Website Logo --> */}
                                    <div className="flex items-center">
                                        <Link href="/">
                                            <a href="#" className="flex items-center py-4 px-8 mr-2">
                                                <Image src="/LogotipoWeb_FondoAzul.png"
                                                    width="192"
                                                    height="32"
                                                    alt="Logo"
                                                    className="h-8 w-8 mr-12" />
                                            </a>
                                        </Link>
                                    </div>
                                    <div className="md:hidden">
                                        <button
                                            className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border mt-2"
                                            onClick={() => setNavbar(!navbar)}
                                        >
                                            {navbar ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-6 h-6 text-white"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-6 h-6 text-white"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M4 6h16M4 12h16M4 18h16"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div
                                    className={`flex-1 justify-self-center pb-2 mt-6 md:block md:pb-0 md:mt-0 z-20 ${navbar ? 'block' : 'hidden'
                                        } `}
                                >
                                    <ul className="bg-blue-900 items-center justify-content space-y-2 md:flex md:space-x-6 md:space-y-0 mt-4">
                                        <li className="mx-1">
                                            <Link href="/admin/dashboard">
                                                <a className="text-white hover:text-blue-200">Maintenance</a>
                                            </Link>
                                        </li>
                                        <li className="mx-1">
                                            <Link href="/advisory/dashboard">
                                                <a className="text-white hover:text-blue-200">Advisory</a>
                                            </Link>
                                        </li>
                                        <li className="mx-1">
                                            <Link href="/blogs">
                                                <a className="text-white hover:text-blue-200">Database</a>
                                            </Link>
                                        </li>
                                        <li className="mx-1">
                                            <Link href="/about">
                                                <a className="text-white hover:text-blue-200">Logistics</a>
                                            </Link>
                                        </li>
                                        <li className="mx-1">
                                            <Link href="/contact">
                                                <a className="text-white hover:text-blue-200">Personal</a>
                                            </Link>
                                        </li>
                                        <li className="mx-1">
                                            <Link href="/contact">
                                                <a className="text-white hover:text-blue-200">Box and Banks</a>
                                            </Link>
                                        </li>
                                        <li className="mx-1">
                                            <Link href="/contact">
                                                <a className="text-white hover:text-blue-200">Accounting</a>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {/* <!-- Secondary Navbar items --> */}
                            {status === "loading" ? (
                                "Loading"
                            ) : session?.user ? (
                                <Menu as="div" className="relative inline-block">
                                    <Menu.Button className="text-white">
                                        {session.user.name}
                                    </Menu.Button>
                                    <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white shadow-lg ">
                                        <Menu.Item>
                                            <a className="dropdown-link" href="/profile">
                                                Profile
                                            </a>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <a className="dropdown-link" href="/order-history">
                                                Order History
                                            </a>
                                        </Menu.Item>
                                        {session.user.isAdmin && (
                                            <Menu.Item>
                                                <Link className="dropdown-link" href="/admin/dashboard">
                                                    Admin Dashboard
                                                </Link>
                                            </Menu.Item>
                                        )}
                                        <Menu.Item>
                                            <a
                                                className="dropdown-link"
                                                href="#"
                                                onClick={logoutClickHandler}
                                            >
                                                Logout
                                            </a>
                                        </Menu.Item>
                                    </Menu.Items>
                                </Menu>
                            ) : (
                                <Link href="/login">
                                    <a className="p-2 text-white">Login</a>
                                </Link>
                            )}
                        </div>
                    </nav>
                </header>
                <main className="container m-auto mt-0 px-4">{children}</main>
                <footer className="flex h-10 z-30 justify-center items-center shadow-inner">
                    <p className="font-bold mt-2">
                        Copyright © 2022 Tec Data - Alta Tecnologia en Inversiones Rentables
                    </p>
                </footer>
            </div>

        </>
    );
}
