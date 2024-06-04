import React, { useState, useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getError } from "../../../utils/error";
import { toast } from "react-toastify";
import Layout from "../../../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import FileUploadProducts from "../../../components/FileUploadProducts";
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
  title: "",
  category: "",
  categories: [],
  images: [],
  price: "",
  brand: "",
  countInStock: "",
  description: "",
  featuredImage: "",
  isFeatured: false,
};

export default function AdminProductCreateScreen() {
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
      loadCategories();
      dispatch({ type: "FETCH_SUCCESS" });
    } catch (err) {
      dispatch({ type: "FETCH_FAIL", payload: getError(err) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCategories = async () => {
    const { data } = await axios.get(`/api/admin/productscategories`);
    if (data.length > 0) {
      setValues({ ...values, categories: data, category: data[0]._id });
    }
  };

  const {
    title,
    category,
    categories,
    images,
    price,
    brand,
    countInStock,
    description,
    featuredImage,
    isFeatured,
  } = values;

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = async (e) => {
    e.preventDefault();
    setValues({ ...values, category: e.target.value });
  };

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.post(`/api/admin/products`, {
        title,
        category,
        images,
        price,
        brand,
        countInStock,
        description,
        featuredImage,
        isFeatured,
      });
      dispatch({ type: "UPDATE_SUCCESS" });
      setValues(initialState);
      toast.success("Product created successfully");
      router.push("/admin/products");
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
      toast.error(getError(err));
    }
  };

  return (
    <Layout title={`Create Product`}>
      <div className="grid md:grid-cols-8 md:gap-0 mt-4">
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
              <h1 className="mb-0 text-xl">{`Create Product`}</h1>

              <div className="p-1">
                <FileUploadProducts
                  values={values}
                  setValues={setValues}
                  loadingUpload={loadingUpload}
                />
              </div>

              <div className="flex flex-wrap mb-2">
                <div className="w-full md:w-2/3 px-1 mb-2 md:mb-0">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    className="w-full h-8"
                    required
                    name="title"
                    placeholder="Title"
                    value={title}
                    onChange={handleChange}
                    autoFocus
                  />
                </div>

                <div className="w-full md:w-1/3 px-1">
                  <label>Category</label>
                  <select
                    name="category"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-8"
                    aria-label="Default select example"
                    required
                    value={category}
                    defaultValue={""}
                    onChange={handleCategoryChange}
                  >
                    <option disabled value="">
                      Please select
                    </option>
                    {categories.length > 0 &&
                      categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap mb-2">
                <div className="w-full md:w-1/3 px-1 mb-2 md:mb-0">
                  <label htmlFor="brand">Brand</label>
                  <input
                    type="text"
                    className="w-full h-8"
                    required
                    name="brand"
                    placeholder="Brand"
                    value={brand}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-full md:w-1/3 px-1">
                  <label htmlFor="price">Price</label>
                  <input
                    type="number"
                    className="w-full h-8"
                    required
                    name="price"
                    placeholder="Price"
                    value={price}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-full md:w-1/3 px-1">
                  <label htmlFor="countInStock">Count in Stock</label>
                  <input
                    type="number"
                    className="w-full h-8"
                    required
                    name="countInStock"
                    placeholder="Quantity"
                    value={countInStock}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-2">
                <label htmlFor="description">Description</label>
                <textarea
                  type="text"
                  rows="2"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  name="description"
                  placeholder="Description ..."
                  value={description}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  name="isFeatured"
                  checked={isFeatured}
                  value={isFeatured}
                  onChange={(e) =>
                    setValues({ ...values, isFeatured: e.target.checked })
                  }
                />
                <label
                  htmlFor="isFeatured"
                  className="ml-2 text-sm text-gray-900 dark:text-gray-300"
                >
                  isFeatured
                </label>
              </div>

              <div className="flex flex-wrap mt-2 mb-2">
                <div className="w-full md:w-1/2 px-1 mb-2 md:mb-0">
                  <button
                    href={`/admin/products`}
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
                    className="inline-flex items-center h-9 py-0 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-md hover:bg-blue-800 hover:text-yellow-200 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-2 w-full"
                  >
                    <FontAwesomeIcon
                      icon={faSave}
                      className="h-6 w-6 text-white hover:text-yellow-200"
                    />
                    {loadingUpdate ? "Loading" : "Save"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminProductCreateScreen.auth = { adminOnly: true };
