import React, { useState, useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getError } from "../../../utils/error";
import { toast } from "react-toastify";
import Layout from "../../../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalculator, faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import SideNavbar from "../../../components/SideNavbar";

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
    name: "",
    workerCategory: "",
    categories: [],
    basicSalary: "",
    bonifications: "",
    foodSupplier: "",
    movilizations: "",
    brutSalary: "",
    // images: [],
};

export default function AdminWorkerPlaceCreateScreen() {
    const [values, setValues] = useState(initialState);
    const [flag, setFlag] = useState(0);

    // eslint-disable-next-line no-unused-vars
    const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
        useReducer(reducer, {
            loading: true,
            error: "",
        });

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: "FETCH_REQUEST" });

                dispatch({ type: "FETCH_SUCCESS" });
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: getError(err) });
            }
        };
        fetchData();
        loadCategories();
        handleFirstCategoryChange();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag]);

    const loadCategories = async () => {
        const { data } = await axios.get(`/api/admin/workerscategories`);
        setValues({ ...values, categories: data });
    };

    const handleFirstCategoryChange = async () => {
        const myWorkerCategory = JSON.stringify(categories[0], ["_id"]);
        if (myWorkerCategory !== undefined) {
            const datazo = JSON.parse(myWorkerCategory)._id;
            setValues({ ...values, workerCategory: datazo });
            console.log(values.workerCategory);
            setFlag(0);
        }
        if (values.workerCategory === "") {
            setFlag(flag + 1);
        }
    }

    const {
        name,
        workerCategory,
        categories,
        basicSalary,
        bonifications,
        foodSupplier,
        movilizations,
        brutSalary,
        // images
    } = values;

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleCategoryChange = async (e) => {
        e.preventDefault();
        setValues({ ...values, workerCategory: e.target.value });
    };

    const handleCalculus = (e) => {
        e.preventDefault();
        setValues({ ...values, brutSalary: parseFloat(basicSalary) + parseFloat(bonifications) + parseFloat(foodSupplier) + parseFloat(movilizations) })
    }

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch({ type: "UPDATE_REQUEST" });
            await axios.post(`/api/admin/workersplaces`, {
                name,
                workerCategory,
                basicSalary,
                bonifications,
                foodSupplier,
                movilizations,
                brutSalary,
                // images,
            });
            dispatch({ type: "UPDATE_SUCCESS" });
            setValues(initialState);
            toast.success("Worker Place created successfully");
            router.push("/admin/workersplaces");
        } catch (err) {
            dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
            toast.error(getError(err));
        }
    };

    return (
        <Layout title={`Create Worker Place`}>
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
                        <form className="mx-auto max-w-screen-lg" onSubmit={handleSubmit}>
                            <h1 className="mb-2 text-xl">{`Create Worker Place`}</h1>

                            <div className="mb-2">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full h-8"
                                    name="name"
                                    placeholder="Name"
                                    value={name}
                                    onChange={handleChange}
                                    autoFocus
                                />
                            </div>

                            <div className="mb-2">
                                <label>Worker Category</label>
                                <select
                                    name="category"
                                    required
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    aria-label="Default select example"
                                    value={workerCategory}
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

                            <div className="mb-2">
                                <label htmlFor="name">Basic Salary</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full text-right h-8"
                                    name="basicSalary"
                                    value={basicSalary}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-2">
                                <label htmlFor="name">Bonifications</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full text-right h-8"
                                    name="bonifications"
                                    value={bonifications}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-2">
                                <label htmlFor="name">Food Supplier</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full text-right h-8"
                                    name="foodSupplier"
                                    value={foodSupplier}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-2">
                                <label htmlFor="name">Movilizations</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full text-right h-8"
                                    name="movilizations"
                                    value={movilizations}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-2">
                                <label htmlFor="name">Brut Salary</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full text-right h-8"
                                    name="brutSalary"
                                    value={brutSalary}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="flex flex-wrap mb-2">
                                <div className="w-full md:w-1/3 px-1 mb-2 md:mb-0">
                                    <button
                                        disabled={loadingUpdate}
                                        className="indigo-button w-full"
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
                                    <button disabled={loadingUpdate} className="primary-button w-full">
                                        <FontAwesomeIcon
                                            icon={faSave}
                                            className="h-6 w-6 text-white mr-1 hover:text-yellow-200"
                                        />
                                        {loadingUpdate ? "Loading" : "Save"}
                                    </button>
                                </div>
                                <div className="mb-1">
                                    <button
                                        href={`/admin/workersplaces`}
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
                    )}
                </div>
            </div>
        </Layout>
    );
}

AdminWorkerPlaceCreateScreen.auth = { adminOnly: true };
