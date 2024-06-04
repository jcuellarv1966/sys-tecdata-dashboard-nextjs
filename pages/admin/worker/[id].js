import React, { useState, useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getError } from "../../../utils/error";
import { toast } from "react-toastify";
import Layout from "../../../components/Layout";
import moment from "moment";
import "moment-timezone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalculator, faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import FileUploadWorkers from "../../../components/FileUploadWorkers";
import InputMask from 'react-input-mask';
import SideNavbar from "../../../components/SideNavbar";

function InputDNI(props) {
    return (
        <InputMask
            className={props.className}
            mask='99999999'
            maskChar="0"
            required={props.required}
            autoFocus={props.autoFocus}
            value={props.value}
            onChange={props.onChange}>
        </InputMask>
    );
}

function InputRut(props) {
    return (
        <InputMask
            className={props.className}
            mask='99999999999'
            maskChar="0"
            required={props.required}
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
    dni: "",
    rut: "",
    firstName: "",
    lastName: "",
    address: "",
    email: "",
    contactNumber: "",
    workerCategory: "",
    workerPlace: "",
    basicSalary: 0,
    bonifications: 0,
    foodSupplier: 0,
    movilizations: 0,
    brutSalary: 0,
    discountESSALUD: 0,
    discountFONASA: 0,
    discountAFP: 0,
    totalDiscounts: 0,
    percentDiscountESSALUD: 3,
    percentDiscountFONASA: 7,
    percentDiscountAFP: 13,
    netSalary: 0,
    bornDate: "",
    beginDate: "",
    endDate: "",
    image: "",
};

export default function AdminWorkerEditScreen() {
    const { query } = useRouter();
    const workerId = query.id;

    const [values, setValues] = useState(initialState);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [subOptions, setSubOptions] = useState([]);
    const [selectedWorkerPlace, setSelectedWorkerPlace] = useState("");
    const [flag, setFlag] = useState(0);

    const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
        useReducer(reducer, {
            loading: true,
            error: "",
        });

    const {
        dni,
        rut,
        firstName,
        lastName,
        address,
        email,
        contactNumber,
        workerCategory,
        // eslint-disable-next-line no-unused-vars
        workerPlace,
        basicSalary,
        bonifications,
        foodSupplier,
        movilizations,
        brutSalary,
        discountESSALUD,
        discountFONASA,
        discountAFP,
        totalDiscounts,
        percentDiscountESSALUD,
        percentDiscountFONASA,
        percentDiscountAFP,
        netSalary,
        bornDate,
        beginDate,
        endDate,
    } = values;

    useEffect(() => {
        const fetchData = async () => {
            try {
                loadWorker();
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: getError(err) });
            }
        };

        fetchData();
        loadCategories();
        loadSubCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag]);

    const loadWorker = async () => {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/workers/${workerId}`);
        setValues({ ...values, ...data });
        setSelectedWorkerPlace(data.workerPlace._id);
        dispatch({ type: "FETCH_SUCCESS" });
    };

    const loadCategories = async () => {
        const { data } = await axios.get(`/api/admin/workerscategories`);
        setCategories(data);
    };

    const loadSubCategories = async () => {
        const { data } = await axios.post(`/api/admin/workerscategories/workersplaces`, {
            selectedCategory: workerCategory._id,
        });
        setSubOptions(data);
        if (subOptions.length === 0) {
            setFlag(flag + 1);
        }
    };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleCategoryChange = async (e) => {
        e.preventDefault();
        setSelectedCategory(e.target.value);
        // setValues({ ...values, workerPlace: "" });
        const { data } = await axios.post(`/api/admin/workerscategories/workersplaces`, {
            selectedCategory: e.target.value,
        });
        setSubOptions(data);
        const myWorkerPlace = JSON.stringify(data[0], ["_id"]);
        if (myWorkerPlace !== undefined) {
            setSelectedWorkerPlace(datazo);
            const datazo = JSON.parse(myWorkerPlace)._id;
            const { data } = await axios.post(`/api/admin/workerscategories/workersplacesfindone`, {
                selectedWorkerPlace: datazo
            });
            setValues({
                ...values, workerCategory: data[0].workerCategory, workerPlace: data[0]._id, basicSalary: data[0].basicSalary, bonifications: data[0].bonifications,
                foodSupplier: data[0].foodSupplier, movilizations: data[0].movilizations,
                brutSalary: parseFloat(data[0].basicSalary) + parseFloat(data[0].bonifications) + parseFloat(data[0].foodSupplier) + parseFloat(data[0].movilizations),
                discountESSALUD: (parseFloat(parseFloat(data[0].basicSalary) + parseFloat(data[0].bonifications) + parseFloat(data[0].foodSupplier) + parseFloat(data[0].movilizations))) * (parseFloat(percentDiscountESSALUD)) / 100,
                discountFONASA: (parseFloat(parseFloat(data[0].basicSalary) + parseFloat(data[0].bonifications) + parseFloat(data[0].foodSupplier) + parseFloat(data[0].movilizations))) * (parseFloat(percentDiscountFONASA)) / 100,
                discountAFP: (parseFloat(parseFloat(data[0].basicSalary) + parseFloat(data[0].bonifications) + parseFloat(data[0].foodSupplier) + parseFloat(data[0].movilizations))) * (parseFloat(percentDiscountAFP)) / 100,
                totalDiscounts: (parseFloat(data[0].basicSalary) + parseFloat(data[0].bonifications) + parseFloat(data[0].foodSupplier) + parseFloat(data[0].movilizations)) * ((parseFloat(percentDiscountESSALUD) + parseFloat(percentDiscountFONASA) + parseFloat(percentDiscountAFP)) / 100),
                netSalary: (parseFloat(data[0].basicSalary) + parseFloat(data[0].bonifications) + parseFloat(data[0].foodSupplier) + parseFloat(data[0].movilizations)) - ((parseFloat(data[0].basicSalary) + parseFloat(data[0].bonifications) + parseFloat(data[0].foodSupplier) + parseFloat(data[0].movilizations)) * ((parseFloat(percentDiscountESSALUD) + parseFloat(percentDiscountFONASA) + parseFloat(percentDiscountAFP)) / 100))
            });
        } else {
            setValues({
                ...values, basicSalary: 0, bonifications: 0,
                foodSupplier: 0, movilizations: 0,
                brutSalary: 0,
                discountESSALUD: 0,
                discountFONASA: 0,
                discountAFP: 0,
                totalDiscounts: 0,
                netSalary: 0
            });
        }
        if (values.workerCategory._id === e.target.value) {
            loadWorker();
            setFlag(flag + 1);
        }
        setSelectedWorkerPlace("");
    }

    const handleWorkerPlaceChange = async (e) => {
        e.preventDefault();
        setSelectedWorkerPlace(e.target.value);
        const { data } = await axios.post(`/api/admin/workerscategories/workersplacesfindone`, {
            selectedWorkerPlace: e.target.value
        });
        console.log(data);
        setValues({
            ...values, workerCategory: data[0].workerCategory, workerPlace: data[0]._id, basicSalary: data[0].basicSalary, bonifications: data[0].bonifications,
            foodSupplier: data[0].foodSupplier, movilizations: data[0].movilizations,
            brutSalary: parseFloat(data[0].basicSalary) + parseFloat(data[0].bonifications) + parseFloat(data[0].foodSupplier) + parseFloat(data[0].movilizations),
            discountESSALUD: (parseFloat(parseFloat(data[0].basicSalary) + parseFloat(data[0].bonifications) + parseFloat(data[0].foodSupplier) + parseFloat(data[0].movilizations))) * (parseFloat(percentDiscountESSALUD)) / 100,
            discountFONASA: (parseFloat(parseFloat(data[0].basicSalary) + parseFloat(data[0].bonifications) + parseFloat(data[0].foodSupplier) + parseFloat(data[0].movilizations))) * (parseFloat(percentDiscountFONASA)) / 100,
            discountAFP: (parseFloat(parseFloat(data[0].basicSalary) + parseFloat(data[0].bonifications) + parseFloat(data[0].foodSupplier) + parseFloat(data[0].movilizations))) * (parseFloat(percentDiscountAFP)) / 100,
            totalDiscounts: (parseFloat(data[0].basicSalary) + parseFloat(data[0].bonifications) + parseFloat(data[0].foodSupplier) + parseFloat(data[0].movilizations)) * ((parseFloat(percentDiscountESSALUD) + parseFloat(percentDiscountFONASA) + parseFloat(percentDiscountAFP)) / 100),
            netSalary: (parseFloat(data[0].basicSalary) + parseFloat(data[0].bonifications) + parseFloat(data[0].foodSupplier) + parseFloat(data[0].movilizations)) - ((parseFloat(data[0].basicSalary) + parseFloat(data[0].bonifications) + parseFloat(data[0].foodSupplier) + parseFloat(data[0].movilizations)) * ((parseFloat(percentDiscountESSALUD) + parseFloat(percentDiscountFONASA) + parseFloat(percentDiscountAFP)) / 100))
        });
    }

    const handleCalculus = (e) => {
        e.preventDefault();
        setValues({
            ...values, brutSalary: parseFloat(basicSalary) + parseFloat(bonifications) + parseFloat(foodSupplier) + parseFloat(movilizations),
            discountESSALUD: (parseFloat(parseFloat(basicSalary) + parseFloat(bonifications) + parseFloat(foodSupplier) + parseFloat(movilizations))) * (parseFloat(percentDiscountESSALUD)) / 100,
            discountFONASA: (parseFloat(parseFloat(basicSalary) + parseFloat(bonifications) + parseFloat(foodSupplier) + parseFloat(movilizations))) * (parseFloat(percentDiscountFONASA)) / 100,
            discountAFP: (parseFloat(parseFloat(basicSalary) + parseFloat(bonifications) + parseFloat(foodSupplier) + parseFloat(movilizations))) * (parseFloat(percentDiscountAFP)) / 100,
            totalDiscounts: (parseFloat(basicSalary) + parseFloat(bonifications) + parseFloat(foodSupplier) + parseFloat(movilizations)) * ((parseFloat(percentDiscountESSALUD) + parseFloat(percentDiscountFONASA) + parseFloat(percentDiscountAFP)) / 100),
            netSalary: (parseFloat(basicSalary) + parseFloat(bonifications) + parseFloat(foodSupplier) + parseFloat(movilizations)) - ((parseFloat(basicSalary) + parseFloat(bonifications) + parseFloat(foodSupplier) + parseFloat(movilizations)) * ((parseFloat(percentDiscountESSALUD) + parseFloat(percentDiscountFONASA) + parseFloat(percentDiscountAFP)) / 100))
        })
    }

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        values.workerCategory = selectedCategory ? selectedCategory : values.workerCategory;
        values.workerPlace = selectedWorkerPlace ? selectedWorkerPlace : values.workerPlace;
        try {
            dispatch({ type: "UPDATE_REQUEST" });
            await axios.put(`/api/admin/workers/${workerId}`, { values });
            dispatch({ type: "UPDATE_SUCCESS" });
            toast.success("Worker updated successfully");
            router.push("/admin/workers");
        } catch (err) {
            dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
            toast.error(getError(err));
        }
    };

    const handleInputDNI = ({ target: { value } }) => setValues({ ...values, dni: value });

    const handleInputRUT = ({ target: { value } }) => setValues({ ...values, rut: value });

    const handleInputContactNumber = ({ target: { value } }) => setValues({ ...values, contactNumber: value });

    return (
        <Layout title={`Edit Worker ${workerId}`}>
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
                        <div className="grid md:grid-cols-3 md:gap-3 sm:gap-1">

                            <div className="p-1">
                                <FileUploadWorkers
                                    values={values}
                                    setValues={setValues}
                                    loadingUpload={loadingUpload}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <form className="mx-auto max-w-screen-lg" onSubmit={handleSubmit}>
                                    <h1 className="mb-2 text-xl">{`Edit Worker ${workerId}`}</h1>

                                    <div className="flex flex-wrap mb-2 text-sm">
                                        <div className="w-full md:w-1/3 px-1 mb-2 md:mb-0">
                                            <label htmlFor="dni">DNI</label><br />
                                            <InputDNI
                                                type="text"
                                                required
                                                className="w-full h-6"
                                                name="dni"
                                                placeholder="DNI"
                                                minLength={11}
                                                maxLength={11}
                                                value={dni}
                                                onChange={handleInputDNI}
                                            />
                                        </div>
                                        <div className="w-full md:w-1/3 px-1">
                                            <label htmlFor="rut">RUT</label><br />
                                            <InputRut
                                                type="text"
                                                required
                                                className="w-full h-6"
                                                name="rut"
                                                placeholder="RUT"
                                                minLength={11}
                                                maxLength={11}
                                                value={rut}
                                                onChange={handleInputRUT}
                                            />
                                        </div>
                                        <div className="w-full md:w-1/3 px-1">
                                            <label htmlFor="contactNumber">Telefono</label><br />
                                            <InputContactNumber
                                                type="text"
                                                required
                                                className="w-full h-6"
                                                name="contactNumber"
                                                placeholder="Telefono"
                                                value={contactNumber}
                                                onChange={handleInputContactNumber}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap mb-2 text-sm">
                                        <div className="w-full md:w-1/3 px-1 mb-2 md:mb-0">
                                            <label htmlFor="firstName">Nombres</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full h-6"
                                                name="firstName"
                                                placeholder="Nombres"
                                                value={firstName}
                                                onChange={handleChange}
                                                autoFocus
                                            />
                                        </div>
                                        <div className="w-full md:w-1/3 px-1">
                                            <label htmlFor="lastName">Apellidos</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full h-6"
                                                name="lastName"
                                                placeholder="Apellidos"
                                                value={lastName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="w-full md:w-1/3 px-1">
                                            <label htmlFor="email">Email</label>
                                            <input
                                                type="email"
                                                required
                                                className="w-full h-6"
                                                name="email"
                                                placeholder="Email"
                                                value={email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap mb-2 text-sm">
                                        <div className="w-full md:w-3/3 px-1 mb-2 md:mb-0">
                                            <label htmlFor="address">Direccion</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full h-6"
                                                name="address"
                                                placeholder="Direccion"
                                                value={address}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap mb-2 text-sm">
                                        <div className="w-full md:w-1/3 px-1 mb-2 md:mb-0">
                                            <label>Categoria Laboral</label>
                                            <select
                                                name="workerCategory"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                                                aria-label="Default select example"
                                                value={selectedCategory ? selectedCategory : workerCategory._id}
                                                onChange={handleCategoryChange}
                                            >
                                                <option disabled>Please select</option>
                                                {categories.length > 0 &&
                                                    categories.map((c) => (
                                                        <option key={c._id} value={c._id}>
                                                            {c.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div className="w-full md:w-1/3 px-1">
                                            <label>Puesto Laboral</label>
                                            <select
                                                name="workerPlace"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                                                aria-label="Default select example"
                                                value={selectedWorkerPlace}
                                                onChange={handleWorkerPlaceChange}
                                            >
                                                <option disabled>Please select</option>
                                                {subOptions.length &&
                                                    subOptions.map((s) => (
                                                        <option key={s._id} value={s._id}>
                                                            {s.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div className="w-full md:w-1/3 px-1">
                                            <label htmlFor="netSalary">Sueldo Basico</label>
                                            <input
                                                type="number"
                                                className="w-full text-right h-8"
                                                name="basicSalary"
                                                placeholder="Sueldo Basico"
                                                value={basicSalary}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap mb-2 text-sm">
                                        <div className="w-full md:w-1/4 px-1 mb-2 md:mb-0">
                                            <label htmlFor="netSalary">Bonificaciones</label>
                                            <input
                                                type="number"
                                                className="w-full text-right h-6"
                                                name="bonifications"
                                                placeholder="Bonificaciones"
                                                value={bonifications}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="w-full md:w-1/4 px-1">
                                            <label htmlFor="netSalary">Colaciones</label>
                                            <input
                                                type="number"
                                                className="w-full text-right h-6"
                                                name="foodSupplier"
                                                placeholder="Colaciones"
                                                value={foodSupplier}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="w-full md:w-1/4 px-1">
                                            <label htmlFor="netSalary">Movilizaciones</label>
                                            <input
                                                type="number"
                                                className="w-full text-right h-6"
                                                name="movilizations"
                                                placeholder="Movilizaciones"
                                                value={movilizations}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="w-full md:w-1/4 px-1">
                                            <label htmlFor="netSalary">Sueldo Bruto</label>
                                            <input
                                                type="number"
                                                className="w-full text-right"
                                                name="brutSalary"
                                                placeholder="Sueldo Bruto"
                                                value={brutSalary}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap mb-2 text-sm">
                                        <div className="w-full md:w-1/4 px-1 mb-2 md:mb-0">
                                            <label htmlFor="netSalary">Descto ESSALUD</label>
                                            <input
                                                type="number"
                                                className="w-full text-right h-6"
                                                name="discountESSALUD"
                                                placeholder="Descto ESSALUD"
                                                value={discountESSALUD}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="w-full md:w-1/4 px-1">
                                            <label htmlFor="netSalary">Descto FONASA</label>
                                            <input
                                                type="number"
                                                className="w-full text-right h-6"
                                                name="discountFONASA"
                                                placeholder="Descto FONASA"
                                                value={discountFONASA}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="w-full md:w-1/4 px-1">
                                            <label htmlFor="netSalary">Descto AFP</label>
                                            <input
                                                type="number"
                                                className="w-full text-right h-6"
                                                name="discountAFP"
                                                placeholder="Descto AFP"
                                                value={discountAFP}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="w-full md:w-1/4 px-1">
                                            <label htmlFor="netSalary">Total Desctos</label>
                                            <input
                                                type="number"
                                                className="w-full text-right h-6"
                                                name="totalDiscounts"
                                                placeholder="Total Desctos"
                                                value={totalDiscounts}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap mb-2 text-sm">
                                        <div className="w-full md:w-1/4 px-1 mb-2 md:mb-0">
                                            <label htmlFor="netSalary">% Descto ESSALUD</label>
                                            <input
                                                type="number"
                                                className="w-full text-right h-6"
                                                name="percentDiscountESSALUD"
                                                placeholder="% Descto ESSALUD"
                                                value={percentDiscountESSALUD}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="w-full md:w-1/4 px-1">
                                            <label htmlFor="netSalary">% Descto FONASA</label>
                                            <input
                                                type="number"
                                                className="w-full text-right h-6"
                                                name="percentDiscountFONASA"
                                                placeholder="% Descto FONASA"
                                                value={percentDiscountFONASA}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="w-full md:w-1/4 px-1">
                                            <label htmlFor="netSalary">% Descto AFP</label>
                                            <input
                                                type="number"
                                                className="w-full text-right h-6"
                                                name="percentDiscountAFP"
                                                placeholder="% Descto AFP"
                                                value={percentDiscountAFP}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="w-full md:w-1/4 px-1">
                                            <label htmlFor="netSalary">Sueldo Neto</label>
                                            <input
                                                type="number"
                                                className="w-full text-right h-6"
                                                name="netSalary"
                                                placeholder="Sueldo Neto"
                                                value={netSalary}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap mb-2 text-sm">
                                        <div className="w-full md:w-1/3 px-1 mb-2 md:mb-0">
                                            <label htmlFor="bornDate">Fecha de Nacimiento</label>
                                            <input
                                                type="date"
                                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
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
                                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
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
                                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                                                name="endDate"
                                                placeholder="Fecha de Termino ..."
                                                value={moment(endDate).add("hours", 4).format("yyyy-MM-DD")}
                                                onChange={handleChange}
                                            ></input>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap mb-2">
                                        <div className="w-full md:w-1/3 px-1 mb-2 md:mb-0">
                                            <button
                                                disabled={loadingUpdate}
                                                className="inline-flex items-center h-9 py-0 px-4 text-sm font-medium text-center text-white bg-indigo-700 rounded-md hover:bg-indigo-800 hover:text-yellow-200 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 mr-2 w-full"
                                                onClick={handleCalculus}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faCalculator}
                                                    className="h-6 w-6 text-white mr-1 hover:text-yellow-200"
                                                />
                                                {loadingUpdate ? "Loading" : "Calc"}
                                            </button>
                                        </div>
                                        <div className="w-full md:w-1/3 px-1">
                                            <button
                                                disabled={loadingUpdate}
                                                className="inline-flex items-center h-9 py-0 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-md hover:bg-blue-800 hover:text-yellow-200 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-2 w-full">
                                                <FontAwesomeIcon
                                                    icon={faSave}
                                                    className="h-6 w-6 text-white mr-1 hover:text-yellow-200"
                                                />
                                                {loadingUpdate ? "Loading" : "Update"}
                                            </button>
                                        </div>
                                        <div className="mb-2">
                                            <button
                                                href={`/admin/workers`}
                                                className="inline-flex items-center h-9 py-0 px-4 font-medium hover:text-blue-500"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faArrowLeft}
                                                    className="h-6 w-full text-blue-500 mr-2"
                                                />
                                                Back</button>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div >
        </Layout >
    )

}

AdminWorkerEditScreen.auth = { adminOnly: true };