import React, { useEffect, useReducer } from "react";
import axios from "axios";
import { getError } from "../../utils/error";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faPencilAlt,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import SideNavbar from "../../components/SideNavbar";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        categories: action.payload,
        error: "",
      };
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

export default function AdminWorkersCategoriesScreen() {
  const [
    { loading, error, categories, loadingCreate, successDelete, loadingDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    categories: [],
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/workerscategories`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const deleteHandler = async (categoryId) => {
    if (!window.confirm("Are you sure?")) {
      return;
    }
    try {
      dispatch({ type: "DELETE_REQUEST" });
      await axios.delete(`/api/admin/workerscategories/${categoryId}`);
      dispatch({ type: "DELETE_SUCCESS" });
      toast.success("Worker Category deleted successfully");
    } catch (err) {
      dispatch({ type: "DELETE_FAIL" });
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Admin Workers Categories">
      <div className="grid md:grid-cols-8 md:gap-1 mt-4">
        <div>
          <SideNavbar />
        </div>
        <div className="overflow-x-auto md:col-span-7 ml-12">
          <div className="flex justify-between mb-6">
            <h1 className="mb-2 text-xl">Workers Categories</h1>
            {loadingDelete && <div>Deleting item...</div>}
            <Link href="/admin/workercategory/workercategorycreate">
              <a className="primary-button">
                <FontAwesomeIcon
                  icon={faUsers}
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
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b bg-gray-100">
                  <tr>
                    <th className="px-5 text-left">Id</th>
                    <th className="p-0 text-left">Name</th>
                    <th className="p-0 text-left">Edit</th>
                    <th className="p-0 text-left">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category._id} className="border-b">
                      <td className="px-3 p-1 ">
                        {category._id.substring(20, 24)}
                      </td>
                      <td className=" p-1 ">{category.name}</td>
                      <td className=" p-1 w-14">
                        <Link href={`/admin/workercategory/${category._id}`}>
                          <a>
                            <FontAwesomeIcon
                              icon={faPencilAlt}
                              className="h-6 w-6 text-green-700"
                            />
                          </a>
                        </Link>
                      </td>
                      <td className=" p-1 w-14">
                        <a onClick={() => deleteHandler(category._id)}>
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            className="h-6 w-6 text-red-700"
                          />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminWorkersCategoriesScreen.auth = { adminOnly: true };
