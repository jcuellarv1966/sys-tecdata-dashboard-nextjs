import React, { useEffect, useReducer, useState } from "react";
import { useRouter } from 'next/router';
import axios from "axios";
import { getError } from "../../utils/error";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import Link from "next/link";
import NumberFormat from "react-number-format";
import Moment from "react-moment";
import "moment-timezone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faSearch,
  faPencilAlt,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import db from '../../utils/db';
import Client from '../../models/Client';
import { Pagination } from '@material-ui/lab';
import useStyles from '../../utils/styles';
import SideNavbar from "../../components/SideNavbar";

const PAGE_SIZE = 11;

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, clients: action.payload, error: "" };
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

export default function AdminClientsScreen(props) {
  const { clients, pages } = props;
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
      router.push(`/admin/clients`);
    } else {
      router.push(`/admin/clients?query=${querySearch}`);
    }
  };

  // step 1
  const [keyword, setKeyword] = useState("");

  const {
    query = 'all',
  } = router.query;

  const [
    { loading, error, loadingCreate, successDelete, loadingDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    clients: [],
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        // const { data } = await axios.get(`/api/admin/clients`);
        dispatch({ type: "FETCH_SUCCESS", payload: props.clients });
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

  const deleteHandler = async (clientId, image) => {
    if (!window.confirm("Are you sure?")) {
      return;
    }
    try {
      dispatch({ type: "DELETE_REQUEST" });
      if (image && image !== "") {
        await axios.post("/api/admin/clients/imagesdeleted", {
          deletedImage: image,
        });
      }
      await axios.delete(`/api/admin/clients/${clientId}`);
      dispatch({ type: "DELETE_SUCCESS" });
      toast.success("Client deleted successfully");
      router.push("/admin/clients");
    } catch (err) {
      dispatch({ type: "DELETE_FAIL" });
      toast.error(getError(err));
    }
  };

  // step 3
  // eslint-disable-next-line no-unused-vars
  const handleSearchChange = (e) => {
    e.preventDefault();
    setKeyword(e.target.value.toLowerCase());
  };

  // step 4
  const searched = (keyword) => (c) => c.razSocial.toLowerCase().includes(keyword);

  return (
    <Layout title="Admin Clients">
      <div className="grid md:grid-cols-8 md:gap-1 mt-4">
        <div>
          <SideNavbar />
        </div>
        <div className="overflow-x-auto md:col-span-7 ml-12">
          <div className="flex justify-between">
            <h1 className="mb-4 text-xl">Clients</h1>
            {loadingDelete && <div>Deleting item...</div>}
            <Link href="/admin/client/clientcreate">
              <a className="primary-button">
                <FontAwesomeIcon
                  icon={faUserPlus}
                  className="h-6 w-6 text-white mr-1 hover:text-yellow-200"
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
                {/* step 2 */}
                <div className="w-full sm:w-10/12 md:w-8/12 lg:w-6/12 px-8 mt-2 relative">
                  <input
                    type="search"
                    name="query"
                    className="w-full bg-white h-[32px] rounded outline-none pl-5 pr-14"
                    placeholder="Search Clients"
                    // value={keyword}
                    // onChange={handleSearchChange}
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
                      <th className="px-5 text-left">Id</th>
                      <th className="p-0 text-left">Razon Social</th>
                      <th className="p-0 text-left">Direccion</th>
                      <th className="p-0 text-left">Telefono</th>
                      <th className="p-0 text-left">Email</th>
                      <th className="px-1 p-0 text-right">Credito</th>
                      <th className="px-5 p-0 text-right">Fecha Ingreso</th>
                      <th className="p-0 text-left">Edit</th>
                      <th className="p-0 text-left">Delete</th>
                    </tr>
                  </thead>
                  {
                    <tbody>
                      {clients.filter(searched(keyword)).map((client) => (
                        <tr key={client._id} className="border-b">
                          <td className=" p-1 ">
                            {client._id.substring(20, 24)}
                          </td>
                          <td className=" p-1 ">{client.razSocial}</td>
                          <td className=" p-1 ">{client.address}</td>
                          <td className=" p-1 ">{client.contactNumber}</td>
                          <td className=" p-1 ">{client.email}</td>
                          <td className=" p-1 text-right">
                            <NumberFormat
                              value={Number.parseFloat(client.credit).toFixed(2)}
                              displayType={"text"}
                              thousandSeparator={true}
                              prefix={"$"}
                              decimalScale={2}
                            />
                          </td>
                          <td className=" px-0 p-1 text-center w-1">
                            <Moment format="DD/MM/YYYY" add={{ hours: 4 }}>
                              {client.beginDate}
                            </Moment>
                          </td>
                          <td className=" p-1 ">
                            <Link href={`/admin/client/${client._id}`}>
                              <a>
                                <FontAwesomeIcon
                                  icon={faPencilAlt}
                                  className="h-6 w-6 text-green-700"
                                />
                              </a>
                            </Link>
                          </td>
                          <td className=" p-1 ">
                            <a onClick={() => deleteHandler(client._id, client.image)}>
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
  );
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

  const clientDocs = await Client.find({
    ...queryFilter,
  })
    .sort('razSocial')
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .lean();

  const countClients = await Client.countDocuments({
    ...queryFilter,
  });

  await db.disconnect();

  const clients = clientDocs.map(db.convertDocToObjClient);

  return {
    props: {
      clients,
      countClients,
      page,
      pages: Math.ceil(countClients / pageSize),
    },
  };
}

AdminClientsScreen.auth = { adminOnly: true };
