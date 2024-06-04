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

function InputNumberProform(props) {
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
    numberProform: "",
    client: "",
    razSocial: "",
    address: "",
    email: "",
    contactNumber: "",
    proformItems: [],
    issueDate: "",
    receptionDate: "",
    acceptanceDate: "",
    acceptance: false,
    observations: "",
}

export default function AdminScreenClientProformEdit() {
    const { query } = useRouter();
    const proformId = query.id;

    const { state, dispatching } = useContext(Store);
    const { cart } = state;
    const { cartItems } = cart;

    const [values, setValues] = useState(initialState);
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState("");
    const [products, setProducts] = useState([]);
    const [flag, setFlag] = useState(0);

    // eslint-disable-next-line no-unused-vars
    const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
        useReducer(reducer, {
            loading: true,
            error: "",
        });

    const {
        numberProform,
        client,
        // eslint-disable-next-line no-unused-vars
        razSocial,
        address,
        email,
        contactNumber,
        proformItems,
        issueDate,
        receptionDate,
        acceptanceDate,
        acceptance,
        observations,
    } = values;

    useEffect(() => {
        const fetchData = async () => {
            try {
                loadProform();
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: getError(err) });
            }
        };
        fetchData();
        loadClients();
        loadProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag]);

    const loadProform = async () => {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/advisory/clientsproforms/${proformId}`);
        setValues({ ...values, ...data });
        if (client !== "") {
            const { data } = await axios.get(`/api/admin/clients/${client._id}`);
            setValues({ ...values, razSocial: data.razSocial, address: data.address, email: data.email, contactNumber: data.contactNumber });
        } else {
            setFlag(flag + 1);
        }
        dispatching({ type: 'CART_CLEAR_ITEMS' });
        Cookies.set(
            'cart',
            JSON.stringify({
                ...cart,
                cartItems: [],
            })
        );
        for (let i = 0; i < proformItems.length; i++) {
            const { data } = await axios.get(`/api/admin/products/${proformItems[i]._id}`);
            const quantity = proformItems[i].quantity;
            dispatching({ type: 'CART_ADD_ITEM', payload: { ...data, quantity } });
        }
        dispatch({ type: "FETCH_SUCCESS" });
    }

    const loadClients = async () => {
        const { data } = await axios.get(`/api/admin/clients`);
        setClients(data);
    }

    const loadProducts = async () => {
        const { data } = await axios.get(`/api/admin/products`);
        setProducts(data);
    }

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleClientChange = async (e) => {
        e.preventDefault();
        setSelectedClient(e.target.value);
        const { data } = await axios.get(`/api/admin/clients/${e.target.value}`);
        setValues({ ...values, client: e.target.value, razSocial: data.razSocial, address: data.address, email: data.email, contactNumber: data.contactNumber });
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
    }

    const updateCartHandler = async (item, qty) => {
        const quantity = Number(qty);
        const { data } = await axios.get(`/api/admin/products/${item._id}`);
        if (data.countInStock < quantity) {
            return toast.error('Sorry. Product is out of stock');
        }
        dispatching({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
        toast.success('Product updated in the Grid');
    }

    const removeItemHandler = (item) => {
        dispatching({ type: 'CART_REMOVE_ITEM', payload: item });
    }

    const handleInputNumberProform = ({ target: { value } }) => setValues({ ...values, numberProform: value });

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let arr = [];
        for (let i = 0; i < cartItems.length; i++) {
            arr.push({
                title: cartItems[i].title,
                slug: cartItems[i].slug,
                quantity: cartItems[i].quantity,
                price: cartItems[i].price,
                _id: cartItems[i]._id
            });
        }
        values.proformItems = arr;
        const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
        values.subtotal = round2(cartItems.reduce((a, c) => a + c.quantity * c.price, 0));
        values.igv = round2(cartItems.reduce((a, c) => a + c.quantity * c.price, 0) * 0.19);
        values.total = round2(cartItems.reduce((a, c) => a + c.quantity * c.price, 0) * 1.19)
        try {
            dispatch({ type: "UPDATE_REQUEST" });
            await axios.put(`/api/advisory/clientsproforms/${proformId}`, { values });
            dispatching({ type: 'CART_CLEAR_ITEMS' });
            Cookies.set(
                'cart',
                JSON.stringify({
                    ...cart,
                    cartItems: [],
                })
            );
            dispatch({ type: "UPDATE_SUCCESS" });
            toast.success("Client Proform updated successfully");
            router.push("/advisory/proforms");
        } catch (err) {
            dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
            toast.error(getError(err));
        }
    }

    return (
        <Layout title={`Edit Proform of Client`}>
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
                            <h1 className="mb-0 text-xl">{`Edit Client Proform ${proformId}`}</h1>

                            <div className="grid md:grid-cols-2 md:gap-2">
                                <div>
                                    <div className="md:flex md:items-start mb-2">
                                        <div className="md:w-1/3">
                                            <label className="block text-gray-500 md:text-right mb-1 md:mb-0 pr-4 mt-1" htmlFor="inline-full-name">Client</label>
                                        </div>
                                        <div className="md:w-2/3">
                                            <select
                                                name="client"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                                                aria-label="Default select example"
                                                required
                                                value={selectedClient ? selectedClient : client._id}
                                                onChange={handleClientChange}
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
                                            <label className="block text-gray-500 md:text-right mb-1 md:mb-0 pr-4 mt-1" htmlFor="inline-full-name">Address</label>
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
                                            <label className="block text-gray-500 md:text-right mb-1 md:mb-0 pr-4 mt-1" htmlFor="inline-full-name">eMail</label>
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
                                            <label className="block text-gray-500 md:text-right mb-1 md:mb-0 pr-4 mt-1" htmlFor="inline-full-name">contact Number</label>
                                        </div>
                                        <div className="md:w-2/3">
                                            <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 h-8"
                                                id="inline-full-name"
                                                type="text"
                                                value={contactNumber}
                                                readOnly />
                                        </div>
                                    </div>

                                    <hr />

                                    <div className="md:flex md:items-start mt-2 mb-2">
                                        <div className="md:w-1/3">
                                            <label className="block text-gray-500 md:text-right mb-1 md:mb-0 pr-4 mt-1" htmlFor="inline-full-name">Select Product ...</label>
                                        </div>
                                        <div className="md:w-2/3">
                                            <select
                                                name="product"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                                                aria-label="Default select example"
                                                required
                                                onChange={handleProductChange}
                                            >
                                                <option disabled>Please select</option>
                                                {products.length > 0 &&
                                                    products.map((p) => (
                                                        <option key={p._id} value={p._id}>
                                                            {p.title}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="md:flex md:items-start mb-2">
                                        <div className="md:w-1/4">
                                            <label className="block text-gray-500 md:text-right mb-1 md:mb-0 pr-4 mt-1" htmlFor="inline-full-name">Number Proform:</label>
                                        </div>
                                        <div className="md:w-2/4">
                                            <InputNumberProform
                                                type="text"
                                                required={false}
                                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 h-8"
                                                name="numberProform"
                                                value={numberProform}
                                                onChange={handleInputNumberProform}
                                            />
                                        </div>
                                        <div className="md:w-1/4 mt-1">
                                            <div className="flex items-center justify-center mb-2">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    name="isFeatured"
                                                    checked={acceptance}
                                                    value={acceptance}
                                                    onChange={(e) =>
                                                        setValues({ ...values, acceptance: e.target.checked })
                                                    }
                                                />
                                                <label
                                                    htmlFor="isFeatured"
                                                    className="ml-2 text-sm text-gray-900 dark:text-gray-300"
                                                >
                                                    isValid
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap mb-1 text-sm">
                                        <div className="w-full md:w-1/3 px-0 mb-2 md:mb-0">
                                            <label htmlFor="bornDate">Date of Issue</label>
                                            <input
                                                type="date"
                                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                                                name="issueDate"
                                                placeholder="Fecha de Nacimiento ..."
                                                value={moment(issueDate).add("hours", 4).format("yyyy-MM-DD")}
                                                onChange={handleChange}
                                            ></input>
                                        </div>
                                        <div className="w-full md:w-1/3 px-0">
                                            <label htmlFor="beginDate">Date of Reception</label>
                                            <input
                                                type="date"
                                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                                                name="receptionDate"
                                                placeholder="Fecha de Inicio ..."
                                                value={moment(receptionDate).add("hours", 4).format("yyyy-MM-DD")}
                                                onChange={handleChange}
                                            ></input>
                                        </div>
                                        <div className="w-full md:w-1/3 px-0">
                                            <label htmlFor="endDate">Date of Acceptance</label>
                                            <input
                                                type="date"
                                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                                                name="acceptanceDate"
                                                placeholder="Fecha de Termino ..."
                                                value={moment(acceptanceDate).add("hours", 4).format("yyyy-MM-DD")}
                                                onChange={handleChange}
                                            ></input>
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <label htmlFor="observations">Observations</label>
                                        <textarea
                                            type="text"
                                            rows="3"
                                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 px-1"
                                            name="observations"
                                            placeholder="Observations ..."
                                            value={observations}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>

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

                            <div className="flex flex-wrap mt-2 mb-2">
                                <div className="w-full md:w-1/2 px-1 mb-2 md:mb-0">
                                    <button
                                        href={`/advisory/proforms`}
                                        className="inline-flex items-center h-9 py-0 px-4 text-sm font-medium text-center w-full rounded-md outline outline-offset-0 outline-1"
                                    >
                                        <FontAwesomeIcon
                                            icon={faArrowLeft}
                                            className="h-6 w-6 text-blue-500 mr-1"
                                        />
                                        Back
                                    </button>
                                </div>
                                <div className="w-full md:w-1/2 px-1 mb-2 md:mb-0">
                                    <button
                                        disabled={loadingUpdate}
                                        className="inline-flex items-center h-9 py-0 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-md hover:bg-blue-800 hover:text-yellow-200 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-2 w-full">
                                        <FontAwesomeIcon
                                            icon={faSave}
                                            className="h-6 w-6 text-white hover:text-yellow-200"
                                        />
                                        {loadingUpdate ? "Loading" : "Update"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Layout>
    )
}

AdminScreenClientProformEdit.auth = { adminOnly: true };