import React, { useState, useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getError } from "../../../utils/error";
import { toast } from "react-toastify";
import Layout from "../../../components/Layout";
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
      return { ...state, loadingUpload: false, errorUpload: "", };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
}

const initialState = {
  name: "",
  images: [],
};

export default function AdminProductCategoryCreateScreen() {
  const [values, setValues] = useState(initialState);

  // eslint-disable-next-line no-unused-vars
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  useEffect(() => {
    try {
      dispatch({ type: "FETCH_REQUEST" });
      dispatch({ type: "FETCH_SUCCESS" });
    } catch (err) {
      dispatch({ type: "FETCH_FAIL", payload: getError(err) });
    }
  }, []);

  const { name, images } = values;

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.post(`/api/admin/productscategories`, {
        name,
        images,
      });
      dispatch({ type: "UPDATE_SUCCESS" });
      setValues(initialState);
      toast.success("Product Category created successfully");
      router.push("/admin/productscategories");
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
      toast.error(getError(err));
    }
  };

  return (
    <Layout title={`Create Product Category`}>
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
              <h1 className="mb-4 text-xl">{`Create Product Category`}</h1>
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
                  {loadingUpdate ? "Loading" : "Save"}
                </button>
              </div>
              <div className="mb-4">
                <a href={`/admin/productscategories`} className="text-black">
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

AdminProductCategoryCreateScreen.auth = { adminOnly: true };
