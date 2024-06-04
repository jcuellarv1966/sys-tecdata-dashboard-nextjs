import React, { useState, useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getError } from "../../../utils/error";
import Layout from "../../../components/Layout";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
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
    // images: [],
};

export default function AdminWorkerCategoryEditScreen() {
    const { query } = useRouter();
    const categoryId = query.id;

    const [values, setValues] = useState(initialState);

    // eslint-disable-next-line no-unused-vars
    const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
        useReducer(reducer, {
            loading: true,
            error: "",
        });

    // eslint-disable-next-line no-unused-vars
    const { name, images } = values;

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: "FETCH_REQUEST" });
                const { data } = await axios.get(
                    `/api/admin/workerscategories/${categoryId}`
                );
                setValues({ ...values, ...data });
                dispatch({ type: "FETCH_SUCCESS" });
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: getError(err) });
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch({ type: "UPDATE_REQUEST" });
            await axios.put(`/api/admin/workerscategories/${categoryId}`, {
                values,
            });
            dispatch({ type: "UPDATE_SUCCESS" });
            toast.success("Worker Category updated successfully");
            router.push("/admin/workerscategories");
        } catch (err) {
            dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
            toast.error(getError(err));
        }
    };

    return (
        <Layout title={`Edit Worker Category ${categoryId}`}>
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
                            <h1 className="mb-4 text-xl">{`Edit Worker Category ${categoryId}`}</h1>
                            <div className="mb-4">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    className="w-full"
                                    name="name"
                                    placeholder="Name"
                                    value={name}
                                    onChange={handleChange}
                                    autoFocus
                                />
                            </div>

                            <div className="mb-4">
                                <button disabled={loadingUpdate}
                                    className="primary-button">
                                    <FontAwesomeIcon
                                        icon={faSave}
                                        className="h-6 w-6 text-white mr-1 hover:text-yellow-200"
                                    />
                                    {loadingUpdate ? "Loading" : "Update"}
                                </button>
                            </div>
                            <div className="mb-4">
                                <a href={`/admin/workerscategories`} className="text-black">
                                    <FontAwesomeIcon
                                        icon={faArrowLeft}
                                        className="h-6 w-6 text-blue-500 mr-1"
                                    />Back</a>
                            </div>

                        </form>
                    )}
                </div>
            </div>
        </Layout>
    );
}

AdminWorkerCategoryEditScreen.auth = { adminOnly: true };
