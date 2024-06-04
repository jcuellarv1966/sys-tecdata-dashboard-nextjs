import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import { getError } from "../../../utils/error";
import { useContext } from 'react';
import { Store } from '../../../utils/Store';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import SideNavbarAdvisory from "../../../components/SideNavbarAdvisory";
import Link from 'next/link';
import InputMask from 'react-input-mask';
import moment from "moment";
import "moment-timezone";
import { XCircleIcon } from '@heroicons/react/outline';
import NumberFormat from "react-number-format";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Tab } from '@headlessui/react';

function InputNumberContract(props) {
    return (
        <InputMask
            className={props.className}
            mask='2022-001-999999'
            maskChar="0"
            required={props.required}
            value={props.value}
            onChange={props.onChange}>
        </InputMask>
    );
}

function InputNumberProject(props) {
    return (
        <InputMask
            className={props.className}
            mask='2022-001-999999'
            maskChar="0"
            required={props.required}
            value={props.value}
            onChange={props.onChange}>
        </InputMask>
    );
}

function reducer(state, action) {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true, error: "" };
        case "FETCH_SUCCESS":
            return { ...state, loading: false, error: "" };
        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload };

        case "UPDATE_REQUEST":
            return { ...state, loadingUpdate: true, errorUpdate: "" };
        case "UPDATE_SUCCESS":
            return { ...state, loadingUpdate: false, errorUpdate: "" };
        case "UPDATE_FAIL":
            return { ...state, loadingUpdate: false, errorUpdate: action.payload };

        case "UPLOAD_REQUEST":
            return { ...state, loadingUpload: true, errorUpload: "" };
        case "UPLOAD_SUCCESS":
            return {
                ...state,
                loadingUpload: false,
                errorUpload: "",
            };
        case "UPLOAD_FAIL":
            return { ...state, loadingUpload: false, errorUpload: action.payload };

        default:
            return state;
    }
}

const initialState = {
    numberContract: "",
    contractType: "",
    contractTypes: [],
    numberOrder: "",
    numberProject: "",
    client: "",
    clients: [],
    razSocial: "",
    address: "",
    email: "",
    contactNumber: "",
    rut: "",
    products: [],
    clauses: [],
    observations: "",
    subscriptionDate: "",
    startDate: "",
    endDate: "",
    cash_credit: false,
    isValid: false,
}

export default function AdminScreenClientContractCreate() {
    const { state, dispatching } = useContext(Store);
    const { cart } = state;
    const { cartItems } = cart;

    const [values, setValues] = useState(initialState);
    const [flag, setFlag] = useState(0);

    // eslint-disable-next-line no-unused-vars
    const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
        useReducer(reducer, {
            loading: true,
            error: "",
        });

    const {
        numberContract,
        contractType,
        contractTypes,
        numberOrder,
        numberProject,
        client,
        clients,
        razSocial,
        address,
        email,
        contactNumber,
        rut,
        products,
        clauses,
        observations,
        subscriptionDate,
        startDate,
        endDate,
        cash_credit,
        isValid
    } = values;

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: "FETCH_REQUEST" });

                dispatching({ type: 'CART_CLEAR_ITEMS' });
                Cookies.set(
                    'cart',
                    JSON.stringify({
                        ...cart,
                        cartItems: [],
                    })
                );
                dispatch({ type: "FETCH_SUCCESS" });
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: getError(err) });
            }
        };
        fetchData();
        loadClients();
        loadProducts();
        loadContractTypes();
        loadContractClauses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag]);

    const loadClients = async () => {
        const { data } = await axios.get(`/api/admin/clients`);
        setValues({ ...values, clients: data });
        if (clients.length === 0) {
            setFlag(flag + 1);
        }
    };

    const loadProducts = async () => {
        const { data } = await axios.get(`/api/admin/products`);
        setValues({ ...values, products: data });
        if (products.length === 0) {
            setFlag(flag + 1);
        }
    };

    const loadContractTypes = async () => {
        const { data } = await axios.get(`/api/advisory/clientscontractstypes`);
        setValues({ ...values, contractTypes: data });
        if (contractTypes.length === 0) {
            setFlag(flag + 1);
        }
    };

    const loadContractClauses = async () => {
        const { data } = await axios.get(`/api/advisory/clientscontractsclauses`);
        setValues({ ...values, clauses: data });
        if (clauses.length === 0) {
            setFlag(flag + 1);
        }
    }

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleClientChange = async (e) => {
        e.preventDefault();
        const { data } = await axios.get(`/api/admin/clients/${e.target.value}`);
        setValues({
            ...values, client: e.target.value,
            razSocial: data.razSocial,
            address: data.address,
            email: data.email,
            contactNumber: data.contactNumber,
            rut: data.rut,
        });
    };

    const handleProductChange = async (e) => {
        e.preventDefault();
        const { data } = await axios.get(`/api/admin/products/${e.target.value}`);
        const existItem = cart.cartItems.find((x) => x.slug === data.slug);
        const quantity = existItem ? existItem.quantity + 1 : 1;

        if (data.countInStock < quantity) {
            return toast.error('Sorry. Product is out of stock');
        }
        dispatching({ type: 'CART_ADD_ITEM', payload: { ...data, quantity } });
        toast.success('Product added to the Grid');
    };

    const handleClientContractTypeChange = async (e) => {
        e.preventDefault();
        setValues({ ...values, contractType: e.target.value });
    };

    const updateCartHandler = async (item, qty) => {
        const quantity = Number(qty);
        const { data } = await axios.get(`/api/admin/products/${item._id}`);
        if (data.countInStock < quantity) {
            return toast.error('Sorry. Product is out of stock');
        }
        dispatching({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
        toast.success('Product updated in the Grid');
    };

    const removeItemHandler = (item) => {
        dispatching({ type: 'CART_REMOVE_ITEM', payload: item });
    };

    const handleInputNumberContract = ({ target: { value } }) => setValues({ ...values, numberContract: value });

    const handleInputNumberProject = ({ target: { value } }) => setValues({ ...values, numberProject: value });

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch({ type: "UPDATE_REQUEST" });
            const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
            const subtotal = round2(cartItems.reduce((a, c) => a + c.quantity * c.price, 0));
            const igv = round2(subtotal * 0.19);
            const total = round2(subtotal * 1.19);
            await axios.post(`/api/advisory/clientscontracts`, {
                numberContract,
                contractType,
                numberOrder,
                numberProject,
                client,
                razSocial,
                observations,
                contractItems: cartItems,
                subtotal,
                igv,
                total,
                subscriptionDate,
                startDate,
                endDate,
                cash_credit,
                isValid
            })
            dispatching({ type: 'CART_CLEAR_ITEMS' });
            Cookies.set(
                'cart',
                JSON.stringify({
                    ...cart,
                    cartItems: [],
                })
            );
            dispatch({ type: "UPDATE_SUCCESS" });
            setValues(initialState);
            toast.success("Client Contract created successfully");
            router.push("/advisory/contracts");
        } catch (err) {
            dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
            toast.error(getError(err));
        }
    };

    return (
        <Layout title={`Create Contract of Client`}>
            <div className="grid md:grid-cols-8 md:gap-1 mt-4">
                <div>
                    <SideNavbarAdvisory />
                </div>
                <div className="overflow-x-auto md:col-span-7 ml-12">
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div className="alert-error">{error}</div>
                    ) : (
                        <form className="mx-auto max-w-screen-lg" onSubmit={handleSubmit}>
                            <h1 className="mb-4 text-xl text-left">{`Create Client Contract`}</h1>

                            <div className="grid md:grid-cols-2 md:gap-2">
                                <div>
                                    <div className="md:flex md:items-start mb-2">
                                        <div className="md:w-1/3">
                                            <label className="block text-black md:text-right mb-1 md:mb-0 pr-4 mt-1" htmlFor="inline-full-name">Client</label>
                                        </div>
                                        <div className="md:w-2/3">
                                            <select
                                                name="client"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                                                aria-label="Default select example"
                                                required
                                                onClick={handleClientChange}
                                            >
                                                <option disabled>Please select</option>
                                                {clients.length > 0 &&
                                                    clients.map((c) => (
                                                        <option key={c._id} value={c._id}>
                                                            {c.razSocial}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="md:flex md:items-start mb-2">
                                        <div className="md:w-1/3">
                                            <label className="block text-black md:text-right mb-1 md:mb-0 pr-4 mt-1" htmlFor="inline-full-name">Address</label>
                                        </div>
                                        <div className="md:w-2/3">
                                            <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 h-8"
                                                id="inline-full-name"
                                                type="text"
                                                value={address}
                                                readOnly />
                                        </div>
                                    </div>

                                    <div className="md:flex md:items-start mb-2">
                                        <div className="md:w-1/3">
                                            <label className="block text-black md:text-right mb-1 md:mb-0 pr-4 mt-1" htmlFor="inline-full-name">eMail</label>
                                        </div>
                                        <div className="md:w-2/3">
                                            <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 h-8"
                                                id="inline-full-name"
                                                type="text"
                                                value={email}
                                                readOnly />
                                        </div>
                                    </div>

                                    <div className="md:flex md:items-start mb-2">
                                        <div className="md:w-1/3">
                                            <label className="block text-black md:text-right mb-1 md:mb-0 pr-4 mt-1" htmlFor="inline-full-name">contact Number</label>
                                        </div>
                                        <div className="md:w-2/3">
                                            <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 h-8"
                                                id="inline-full-name"
                                                type="text"
                                                value={contactNumber}
                                                readOnly />
                                        </div>
                                    </div>

                                    <div className="md:flex md:items-start mb-2">
                                        <div className="md:w-1/3">
                                            <label className="block text-black md:text-right mb-1 md:mb-0 pr-4 mt-1" htmlFor="inline-full-name">RUT</label>
                                        </div>
                                        <div className="md:w-2/3">
                                            <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 h-8"
                                                id="inline-full-name"
                                                type="text"
                                                value={rut}
                                                readOnly />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="md:flex md:items-start mb-1 mr-2">
                                        <div className="md:w-1/4 mt-1">
                                            <label className="block text-black md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">N# of Contract:</label>
                                        </div>
                                        <div className="md:w-1/4">
                                            <InputNumberContract
                                                type="text"
                                                required
                                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 h-8 text-[13px]"
                                                name="numberProform"
                                                value={numberContract}
                                                onChange={handleInputNumberContract}
                                            />
                                        </div>
                                        <div className="md:w-1/4 mt-1">
                                            <div className="flex items-center justify-center mb-2">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mt-1"
                                                    name="isCash_Credit"
                                                    checked={cash_credit}
                                                    value={cash_credit}
                                                    onChange={(e) =>
                                                        setValues({ ...values, cash_credit: e.target.checked })
                                                    }
                                                />
                                                <label
                                                    htmlFor="isFeatured"
                                                    className="ml-2 text-sm text-gray-900 dark:text-gray-300 mt-1"
                                                >
                                                    Cash/Credit?
                                                </label>
                                            </div>
                                        </div>
                                        <div className="md:w-1/4 mt-1">
                                            <div className="flex items-center justify-center mb-2">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mt-1"
                                                    name="isValid"
                                                    checked={isValid}
                                                    value={isValid}
                                                    onChange={(e) =>
                                                        setValues({ ...values, isValid: e.target.checked })
                                                    }
                                                />
                                                <label
                                                    htmlFor="isFeatured"
                                                    className="ml-2 text-sm text-gray-900 dark:text-gray-300 mt-1"
                                                >
                                                    Is Valid?
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="md:flex md:items-start mb-0 mr-2">
                                            <div className="md:w-1/4 mt-1">
                                                <label className="block text-black md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">N# of Project:</label>
                                            </div>
                                            <div className="md:w-1/4 mb-2">
                                                <InputNumberProject
                                                    type="text"
                                                    required
                                                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 h-8 text-[13px]"
                                                    name="numberProject"
                                                    value={numberProject}
                                                    onChange={handleInputNumberProject}
                                                />
                                            </div>
                                            <div className="md:w-2/4">
                                                <select
                                                    name="clientContractType"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8 ml-2"
                                                    aria-label="Default select example"
                                                    required
                                                    placeholder="Select Type of Client Contract ..."
                                                    onChange={handleClientContractTypeChange}
                                                >
                                                    <option disabled>Please select</option>
                                                    {contractTypes.length > 0 &&
                                                        contractTypes.map((c) => (
                                                            <option key={c._id} value={c._id}>
                                                                {c.name}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap mb-1 text-sm ml-2">
                                        <div className="w-full md:w-1/3 px-0 mb-2 md:mb-0">
                                            <label htmlFor="bornDate">Date of Subscription</label>
                                            <input
                                                type="date"
                                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                                                name="subscriptionDate"
                                                placeholder="Fecha de Nacimiento ..."
                                                value={moment(subscriptionDate).add("hours", 4).format("yyyy-MM-DD")}
                                                onChange={handleChange}
                                            ></input>
                                        </div>
                                        <div className="w-full md:w-1/3 px-0">
                                            <label htmlFor="beginDate">Date of Start</label>
                                            <input
                                                type="date"
                                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                                                name="startDate"
                                                placeholder="Fecha de Inicio ..."
                                                value={moment(startDate).add("hours", 4).format("yyyy-MM-DD")}
                                                onChange={handleChange}
                                            ></input>
                                        </div>
                                        <div className="w-full md:w-1/3 px-0">
                                            <label htmlFor="endDate">Date of End</label>
                                            <input
                                                type="date"
                                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                                                name="endDate"
                                                placeholder="Fecha de Termino ..."
                                                value={moment(endDate).add("hours", 4).format("yyyy-MM-DD")}
                                                onChange={handleChange}
                                            ></input>
                                        </div>
                                    </div>

                                    <div className="mb-2 ml-2">
                                        <label htmlFor="observations">Observations</label>
                                        <textarea
                                            type="text"
                                            rows="1"
                                            className="block p-1.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 px-1"
                                            name="observations"
                                            placeholder="Observations ..."
                                            value={observations}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>

                                </div>
                            </div>

                            <div className="w-full max-w-full px-2 py-0 sm:px-0">
                                <Tab.Group >
                                    <Tab.List className="flex space-x-1 rounded-md bg-blue-900/20 p-1">
                                        <Tab className="w-full rounded-md py-0 text-sm font-medium leading-3 text-blue-700',
                  'ring-white ring-opacity-60 ring-offset-0 ring-offset-blue-400 focus:outline-none focus:ring-2">Products</Tab>
                                        <Tab className="w-full rounded-md py-0 text-sm font-medium leading-5 text-blue-700',
                  'ring-white ring-opacity-60 ring-offset-0 ring-offset-blue-400 focus:outline-none focus:ring-2">Clauses</Tab>
                                        <Tab className="w-full rounded-md py-0 text-sm font-medium leading-5 text-blue-700',
                  'ring-white ring-opacity-60 ring-offset-0 ring-offset-blue-400 focus:outline-none focus:ring-2">Tab 3</Tab>
                                    </Tab.List>
                                    <Tab.Panels>
                                        <Tab.Panel>
                                            <div className="md:flex md:items-start mt-2 mb-2">
                                                <div className="md:w-1/3">
                                                    <label className="block text-black md:text-right mb-1 md:mb-0 pr-4 mt-1" htmlFor="inline-full-name">Select Product ...</label>
                                                </div>
                                                <div className="md:w-2/3">
                                                    <select
                                                        name="product"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                                                        aria-label="Default select example"
                                                        required
                                                        defaultValue={""}
                                                        onChange={handleProductChange}
                                                    >
                                                        <option disabled value="">Please select</option>
                                                        {products.length > 0 &&
                                                            products.map((p) => (
                                                                <option key={p._id} value={p._id}>
                                                                    {p.title}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <table className="min-w-full mt-2">
                                                <thead className="border-b bg-gray-100">
                                                    <tr>
                                                        <th className="p-0 text-left">Item</th>
                                                        <th className="p-0 text-right">Quantity</th>
                                                        <th className="p-0 text-right w-20">Price</th>
                                                        <th className="p-0 text-right">Sub Total</th>
                                                        <th className="p-0">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {cartItems.map((item) => (
                                                        <tr key={item.slug} className="border-b">
                                                            <td>
                                                                <Link href={`/admin/product/${item._id}`}>
                                                                    <a className="flex items-center">
                                                                        {item.title}
                                                                    </a>
                                                                </Link>
                                                            </td>
                                                            <td className="p-0 text-right">
                                                                <select
                                                                    className="h-9"
                                                                    value={item.quantity}
                                                                    onChange={(e) =>
                                                                        updateCartHandler(item, e.target.value)
                                                                    }
                                                                >
                                                                    {[...Array(item.countInStock).keys()].map((x) => (
                                                                        <option key={x + 1} value={x + 1}>
                                                                            {x + 1}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </td>
                                                            <td className="p-0 text-right w-20">${item.price}</td>
                                                            <td className="p-0 text-right">${item.quantity * item.price}</td>
                                                            <td className="p-0 text-center">
                                                                <button onClick={() => removeItemHandler(item)}>
                                                                    <XCircleIcon className="h-5 w-5 text-red-700"></XCircleIcon>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                            <div className="pt-2 pb-1 text-sm text-right px-3 font-bold">
                                                Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}) : $
                                                <NumberFormat
                                                    value={Number.parseFloat(cartItems.reduce((a, c) => a + c.quantity * c.price, 0)).toFixed(2)}
                                                    displayType={"text"}
                                                    thousandSeparator={true}
                                                    /* prefix={"$"} */
                                                    decimalScale={2}
                                                />

                                            </div>
                                            <div className="pb-1 text-sm text-right px-3 font-bold">
                                                IGV : $
                                                <NumberFormat
                                                    value={Number.parseFloat(cartItems.reduce((a, c) => a + c.quantity * c.price, 0) * 0.19).toFixed(2)}
                                                    displayType={"text"}
                                                    thousandSeparator={true}
                                                    /* prefix={"$"} */
                                                    decimalScale={2}
                                                />
                                            </div>
                                            <div className="pb-1 text-sm text-right px-3 font-bold">
                                                Total : $
                                                <NumberFormat
                                                    value={Number.parseFloat(cartItems.reduce((a, c) => a + c.quantity * c.price, 0) * 1.19).toFixed(2)}
                                                    displayType={"text"}
                                                    thousandSeparator={true}
                                                    /* prefix={"$"} */
                                                    decimalScale={2}
                                                />
                                            </div>

                                        </Tab.Panel>
                                        <Tab.Panel>
                                            <div className="md:flex md:items-start mt-2 mb-2">
                                                <div className="md:w-1/3">
                                                    <label className="block text-black md:text-right mb-1 md:mb-0 pr-4 mt-1" htmlFor="inline-full-name">Select Clause ...</label>
                                                </div>
                                                <div className="md:w-2/3">
                                                    <select
                                                        name="clause"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                                                        aria-label="Default select example"
                                                        required
                                                        defaultValue={""}
                                                        onChange={handleProductChange}
                                                    >
                                                        <option disabled value="">Please select</option>
                                                        {clauses.length > 0 &&
                                                            clauses.map((p) => (
                                                                <option key={p._id} value={p._id}>
                                                                    {p.clause}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </Tab.Panel>
                                        <Tab.Panel>Content 3</Tab.Panel>
                                    </Tab.Panels>
                                </Tab.Group>
                                <div className="flex flex-wrap mt-2 mb-2 gap-0">
                                    <div className="w-full md:w-1/2 px-1 mb-2 md:mb-0">
                                        <button
                                            href={`/advisory/contracts`}
                                            className="inline-flex items-center h-9 py-0 px-4 text-sm font-medium text-center w-full rounded-md outline outline-offset-0 outline-1"
                                        >
                                            <FontAwesomeIcon
                                                icon={faArrowLeft}
                                                className="h-6 w-6 text-blue-500 mr-1"
                                            />
                                            Back
                                        </button>
                                    </div>
                                    <div className="w-full md:w-1/2 px-2 mb-2 md:mb-0">
                                        <button
                                            disabled={loadingUpdate}
                                            className="inline-flex items-center h-9 py-0 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-md hover:bg-blue-800 hover:text-yellow-200 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-2 w-full">
                                            <FontAwesomeIcon
                                                icon={faSave}
                                                className="h-6 w-6 text-white hover:text-yellow-200"
                                            />
                                            {loadingUpdate ? "Loading" : "Save"}
                                        </button>
                                    </div>
                                </div>
                            </div>


                        </form>
                    )}
                </div>
            </div>
        </Layout>
    )
}

AdminScreenClientContractCreate.auth = { adminOnly: true };