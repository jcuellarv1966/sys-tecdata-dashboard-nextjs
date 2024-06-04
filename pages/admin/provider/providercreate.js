import React, { useState, useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getError } from "../../../utils/error";
import { toast } from "react-toastify";
import Layout from "../../../components/Layout";
import moment from "moment";
import "moment-timezone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import FileUploadProviders from "../../../components/FileUploadProviders";
import InputMask from 'react-input-mask';
import SideNavbar from "../../../components/SideNavbar";

function InputRut(props) {
    return (
        <InputMask
            className={props.className}
            mask='99999999999'
            maskChar="0"
            required={props.required}
            autoFocus={props.autoFocus}
            value={props.value}
            onChange={props.onChange}>
        </InputMask>
    );
}

function InputContactNumber(props) {
    return (
        <InputMask
            className={props.className}
            mask='+56999999999'
            maskChar="9"
            required={props.required}
            alwaysShowMask={true}
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
    rut: "",
    razSocial: "",
    address: "",
    email: "",
    contactNumber: "56900000000",
    credit: 0,
    bornDate: "",
    beginDate: "",
    endDate: "",
    image: "",
};

export default function AdminProviderCreateScreen() {
    const [values, setValues] = useState(initialState);

    // eslint-disable-next-line no-unused-vars
    const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
        useReducer(reducer, {
            loading: true,
            error: "",
        });

    const {
        rut,
        razSocial,
        address,
        email,
        contactNumber,
        credit,
        bornDate,
        beginDate,
        endDate,
        image,
    } = values;

    useEffect(() => {
        try {
            dispatch({ type: "FETCH_REQUEST" });
            dispatch({ type: "FETCH_SUCCESS" });
        } catch (err) {
            dispatch({ type: "FETCH_FAIL", payload: getError(err) });
        }
    }, []);

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch({ type: "UPDATE_REQUEST" });
            await axios.post(`/api/admin/providers`, {
                rut,
                razSocial,
                address,
                email,
                contactNumber,
                credit,
                bornDate,
                beginDate,
                endDate,
                image,
            });
            dispatch({ type: "UPDATE_SUCCESS" });
            setValues(initialState);
            toast.success("Provider created successfully");
            router.push("/admin/providers");
        } catch (err) {
            dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
            toast.error(getError(err));
        }
    };

    const handleInputRUT = ({ target: { value } }) => setValues({ ...values, rut: value });

    const handleInputContactNumber = ({ target: { value } }) => setValues({ ...values, contactNumber: value });

    return (
        <Layout title={`Create Provider`}>
            <div className="grid md:grid-cols-8 md:gap-1 mt-4">
                <div>
                    <SideNavbar />
                </div>
                <div className="grid-2">
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div className="alert-error">{error}</div>
                    ) : (
                        <div className="grid md:grid-cols-2 md:gap-0">

                            <div className="p-1">
                                <FileUploadProviders
                                    values={values}
                                    setValues={setValues}
                                    loadingUpload={loadingUpload}
                                />
                            </div>

                            <div className="flex flex-col items-center justify-center p-1">
                                <form className="mx-auto max-w-screen-md" onSubmit={handleSubmit}>
                                    <h1 className="mb-4 text-xl">{`Create Provider`}</h1>
                                    <div className="flex flex-wrap mb-2">
                                        <div className="w-full md:w-1/3 px-1 mb-2 md:mb-0">
                                            <label htmlFor="rut">RUT</label><br />
                                            <InputRut
                                                type="text"
                                                required
                                                className="w-full"
                                                name="rut"
                                                placeholder="RUT"
                                                autoFocus={true}
                                                value={rut}
                                                onChange={handleInputRUT}
                                            />
                                        </div>
                                        <div className="w-full md:w-2/3 px-1">
                                            <label htmlFor="razSocial">Razon Social</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full"
                                                name="razSocial"
                                                placeholder="Razon Social"
                                                value={razSocial}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap mb-2">
                                        <div className="w-full md:w-3/3 px-1 mb-2 md:mb-0">
                                            <label htmlFor="address">Direccion</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full"
                                                name="address"
                                                placeholder="Direccion"
                                                value={address}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap mb-2">
                                        <div className="w-full md:w-1/3 px-1 mb-2 md:mb-0">
                                            <label htmlFor="email">Email</label>
                                            <input
                                                type="email"
                                                required
                                                className="w-full"
                                                name="email"
                                                placeholder="Email"
                                                value={email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="w-full md:w-1/3 px-1">
                                            <label htmlFor="contactNumber">Telefono</label><br />
                                            <InputContactNumber
                                                type="text"
                                                required
                                                className="w-full"
                                                name="contactNumber"
                                                placeholder="Telefono"
                                                value={contactNumber}
                                                onChange={handleInputContactNumber}
                                            />
                                        </div>
                                        <div className="w-full md:w-1/3 px-1">
                                            <label htmlFor="credit">Credito</label>
                                            <input
                                                type="number"
                                                className="w-full text-right"
                                                name="credit"
                                                placeholder="Credito"
                                                value={credit}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap mb-2">
                                        <div className="w-full md:w-1/3 px-1 mb-2 md:mb-0">
                                            <label htmlFor="bornDate">Fecha de Nacimiento</label>
                                            <input
                                                type="date"
                                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                name="bornDate"
                                                placeholder="Fecha de Nacimiento ..."
                                                value={moment(bornDate).add("hours", 4).format("yyyy-MM-DD")}
                                                onChange={handleChange}
                                            ></input>
                                        </div>
                                        <div className="w-full md:w-1/3 px-1">
                                            <label htmlFor="beginDate">Fecha de Inicio</label>
                                            <input
                                                type="date"
                                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                name="beginDate"
                                                placeholder="Fecha de Inicio ..."
                                                value={moment(beginDate).add("hours", 4).format("yyyy-MM-DD")}
                                                onChange={handleChange}
                                            ></input>
                                        </div>
                                        <div className="w-full md:w-1/3 px-1">
                                            <label htmlFor="endDate">Fecha de Termino</label>
                                            <input
                                                type="date"
                                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                name="endDate"
                                                placeholder="Fecha de Termino ..."
                                                value={moment(endDate).add("hours", 4).format("yyyy-MM-DD")}
                                                onChange={handleChange}
                                            ></input>
                                        </div>
                                    </div>

                                    <div className="mt-4 mb-4">
                                        <button disabled={loadingUpdate} className="primary-button">
                                            <FontAwesomeIcon
                                                icon={faSave}
                                                className="h-6 w-6 text-white mr-1 hover:text-yellow-200"
                                            />
                                            {loadingUpdate ? "Loading" : "Save"}
                                        </button>
                                    </div>
                                    <div className="mb-4">
                                        <a href={`/admin/providers`} className="text-black">
                                            <FontAwesomeIcon
                                                icon={faArrowLeft}
                                                className="h-6 w-6 text-blue-500 mr-1"
                                            />
                                            Back</a>
                                    </div>
                                </form>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </Layout>
    )
}

AdminProviderCreateScreen.auth = { adminOnly: true };