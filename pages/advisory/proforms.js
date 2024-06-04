import React, { useEffect, useReducer, useState } from "react";
import { useRouter } from 'next/router';
import axios from "axios";
import { getError } from "../../utils/error";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import Link from "next/link";
import SideNavbarAdvisory from "../../components/SideNavbarAdvisory";
import Moment from "react-moment";
import "moment-timezone";
import NumberFormat from "react-number-format";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faSearch,
    faPencilAlt,
    faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faCheckCircle, faCircle } from "@fortawesome/free-regular-svg-icons";
import db from '../../utils/db';
import ClientProform from '../../models/ClientProform';
import { Pagination } from '@material-ui/lab';
import useStyles from '../../utils/styles';

const PAGE_SIZE = 11;

function reducer(state, action) {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true, error: "" };
        case "FETCH_SUCCESS":
            return { ...state, loading: false, proforms: action.payload, error: "" };
        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload };
        case "CREATE_REQUEST":
            return { ...state, loadingCreate: true };
        case "CREATE_SUCCESS":
            return { ...state, loadingCreate: false };
        case "CREATE_FAIL":
            return { ...state, loadingCreate: false };
        case "DELETE_REQUEST":
            return { ...state, loadingDelete: true };
        case "DELETE_SUCCESS":
            return { ...state, loadingDelete: false, successDelete: true };
        case "DELETE_FAIL":
            return { ...state, loadingDelete: false };
        case "DELETE_RESET":
            return { ...state, loadingDelete: false, successDelete: false };

        default:
            state;
    }
}

export default function AdminProformsScreen(props) {
    const { proforms, pages } = props;
    const router = useRouter();
    const classes = useStyles();
    const [querySearch, setQuerySearch] = useState('');

    const queryChangeHandler = (e) => {
        e.preventDefault();
        setQuerySearch(e.target.value.toLowerCase());
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (querySearch === '') {
            router.push(`/advisory/proforms`);
        } else {
            router.push(`/advisory/proforms?query=${querySearch}`);
        }
    };

    const [keyword, setKeyword] = useState("");

    const {
        query = 'all',
    } = router.query;

    const [
        { loading, error, loadingCreate, successDelete, loadingDelete },
        dispatch,
    ] = useReducer(reducer, {
        loading: true,
        proforms: [],
        error: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: "FETCH_REQUEST" });
                dispatch({ type: "FETCH_SUCCESS", payload: props.proforms });
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: getError(err) });
            }
        };

        if (successDelete) {
            dispatch({ type: "DELETE_RESET" });
        } else {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [successDelete]);

    const filterSearch = ({
        page,
        searched
    }) => {
        const path = router.pathname;
        const { query } = router;
        if (page) query.page = page;
        if (searched !== '') query.searched = searched;

        router.push({
            pathname: path,
            query: query,
        });
    };

    const pageHandler = (e, page) => {
        filterSearch({ page });
    };

    const deleteHandler = async (proformId) => {
        if (!window.confirm("Are you sure?")) {
            return;
        }
        try {
            dispatch({ type: "DELETE_REQUEST" });
            await axios.delete(`/api/advisory/clientsproforms/${proformId}`);
            dispatch({ type: "DELETE_SUCCESS" });
            toast.success("Client Proform deleted successfully");
            router.push("/advisory/proforms");
        } catch (err) {
            dispatch({ type: "DELETE_FAIL" });
            toast.error(getError(err));
        }
    }

    // eslint-disable-next-line no-unused-vars
    const handleSearchChange = (e) => {
        e.preventDefault();
        setKeyword(e.target.value.toLowerCase());
    };

    const searched = (keyword) => (c) => c.client.razSocial.toLowerCase().includes(keyword);

    return (
        <Layout title="Admin Proforms">
            <div className="grid md:grid-cols-8 md:gap-1 mt-4">
                <div>
                    <SideNavbarAdvisory />
                </div>
                <div className="overflow-x-auto md:col-span-7 ml-12">
                    <div className="flex justify-between">
                        <h1 className="mb-4 text-xl">List of Proforms</h1>
                        {loadingDelete && <div>Deleting item...</div>}
                        <Link href="/advisory/clientproform/clientproformcreate">
                            <a className="primary-button">
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    className="h-6 w-6 text-white mr-1 group-hover:text-yellow-500"
                                />
                                {loadingCreate ? "Loading" : "Create"}
                            </a>
                        </Link>
                    </div>
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div className="alert-error">{error}</div>
                    ) : (
                        <div className="overflow-x-hidden">
                            <form className="flex -mx-8 justify-center mb-2" onSubmit={submitHandler}>
                                <div className="w-full sm:w-10/12 md:w-8/12 lg:w-6/12 px-8 mt-2 relative">
                                    <input
                                        type="search"
                                        name="query"
                                        className="w-full bg-white h-[32px] rounded outline-none pl-5 pr-14"
                                        placeholder="Search Proforms of Clients"
                                        onChange={queryChangeHandler}
                                    ></input>
                                    <FontAwesomeIcon
                                        icon={faSearch}
                                        className="absolute top-[8px] right-12 text-lg text-gray-500 cursor-pointe"
                                    />
                                </div>
                            </form>

                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="border-b bg-gray-50">
                                        <tr>
                                            <th className="px-0 p-0 text-right">Issue Date</th>
                                            <th className="px-5 text-left">Id</th>
                                            <th className="p-0 text-left">Client</th>
                                            <th className="px-1 p-0 text-right">Sub Total</th>
                                            <th className="px-1 p-0 text-right">IGV</th>
                                            <th className="px-1 p-0 text-right">Total</th>
                                            <th className="px-1 p-0 text-center">Accepted</th>
                                            <th className="p-0 text-center">Edit</th>
                                            <th className="p-0 text-center">Delete</th>
                                        </tr>
                                    </thead>
                                    {
                                        <tbody>
                                            {proforms.filter(searched(keyword)).map((proform) => (
                                                <tr key={proform._id} className="border-b">
                                                    <td className=" px-0 p-1 text-center w-1">
                                                        <Moment format="DD/MM/YYYY" add={{ hours: 4 }}>
                                                            {proform.issueDate}
                                                        </Moment>
                                                    </td>
                                                    <td className=" px-2 p-1 w-8">
                                                        {proform._id.substring(20, 24)}
                                                    </td>
                                                    <td className=" p-1 ">{proform.razSocial}</td>
                                                    <td className=" p-1 text-right">
                                                        <NumberFormat
                                                            value={Number.parseFloat(proform.subtotal).toFixed(2)}
                                                            displayType={"text"}
                                                            thousandSeparator={true}
                                                            prefix={"$"}
                                                            decimalScale={2}
                                                        />
                                                    </td>
                                                    <td className=" p-1 text-right">
                                                        <NumberFormat
                                                            value={Number.parseFloat(proform.igv).toFixed(2)}
                                                            displayType={"text"}
                                                            thousandSeparator={true}
                                                            prefix={"$"}
                                                            decimalScale={2}
                                                        />
                                                    </td>
                                                    <td className=" p-1 text-right">
                                                        <NumberFormat
                                                            value={Number.parseFloat(proform.total).toFixed(2)}
                                                            displayType={"text"}
                                                            thousandSeparator={true}
                                                            prefix={"$"}
                                                            decimalScale={2}
                                                        />
                                                    </td>
                                                    <td className=" p-1 text-center">
                                                        {
                                                            proform.acceptance ? (<>
                                                                <FontAwesomeIcon
                                                                    icon={faCheckCircle}
                                                                    className="h-6 w-6 text-black"
                                                                />
                                                            </>) : (<>
                                                                <FontAwesomeIcon
                                                                    icon={faCircle}
                                                                    className="h-6 w-6 text-black"
                                                                />
                                                            </>)
                                                        }
                                                    </td>
                                                    <td className="p-0 text-center">
                                                        <Link href={`/advisory/clientproform/${proform._id}`}>
                                                            <a>
                                                                <FontAwesomeIcon
                                                                    icon={faPencilAlt}
                                                                    className="h-6 w-6 text-green-700"
                                                                />
                                                            </a>
                                                        </Link>
                                                    </td>
                                                    <td className="p-0 text-center">
                                                        <a onClick={() => deleteHandler(proform._id)}>
                                                            <FontAwesomeIcon
                                                                icon={faTrashAlt}
                                                                className="h-6 w-6 text-red-700"
                                                            />
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    }
                                </table>
                            </div>

                            <Pagination
                                className={classes.mt1}
                                variant="outlined" color="primary"
                                size="small"
                                showFirstButton
                                showLastButton
                                defaultPage={parseInt(query.page || '1')}
                                count={pages}
                                onChange={pageHandler}
                            ></Pagination>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    )
}

export async function getServerSideProps({ query }) {
    await db.connect();

    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const searched = query.query || '';

    const queryFilter =
        searched && searched !== 'all'
            ? {
                razSocial: {
                    $regex: searched,
                    $options: 'i',
                },
            }
            : {};

    const proformDocs = await ClientProform.find({
        ...queryFilter,
    })
        .sort('issueDate')
        .populate("client")
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .lean();

    const countProforms = await ClientProform.countDocuments({
        ...queryFilter,
    });

    await db.disconnect();

    const proforms = proformDocs.map(db.convertDocToObjClientProform);

    return {
        props: {
            proforms,
            countProforms,
            page,
            pages: Math.ceil(countProforms / pageSize),
        },
    };
}

AdminProformsScreen.auth = { adminOnly: true };