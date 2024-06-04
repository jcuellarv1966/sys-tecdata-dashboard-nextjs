import axios from "axios";
import Link from "next/link";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import React, { useEffect, useReducer } from "react";
import Layout from "../../components/Layout";
import { getError } from "../../utils/error";
import SideNavbar from "../../components/SideNavbar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, summary: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

function AdminDashboardScreen() {
  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/summary`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: summary.salesData.map((x) => x._id), // 2022/01 2022/03
    datasets: [
      {
        label: "Sales",
        backgroundColor: "rgba(162, 222, 208, 1)",
        data: summary.salesData.map((x) => x.totalSales),
      },
    ],
  };

  return (
    <Layout title="Admin Dashboard">
      <div className="grid md:grid-cols-8 md:gap-1 mt-4">
        <div>
          <SideNavbar />
        </div>
        <div className="overflow-x-auto md:col-span-7 ml-12">
          <h1 className="mb-4 text-xl">Admin Dashboard</h1>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-6">
                <div className="card min-h-min m-0 p-0">
                  <p className="text-2xl">${summary.ordersPrice} </p>
                  <p>Sales</p>
                  <Link href="/admin/orders" className="text-xs">View sales</Link>
                </div>
                <div className="card m-1 p-1">
                  <p className="text-3xl">{summary.ordersCount} </p>
                  <p>Orders</p>
                  <Link href="/admin/orders" className="text-xs">View orders</Link>
                </div>
                <div className="card m-1 p-1">
                  <p className="text-3xl">{summary.productsCount} </p>
                  <p>Products</p>
                  <Link href="/admin/products" className="text-xs">View products</Link>
                </div>
                <div className="card m-1 p-1">
                  <p className="text-3xl">{summary.productscategoriesCount} </p>
                  <p>Products Categories</p>
                  <Link href="/admin/productscategories" className="text-xs">View products categories</Link>
                </div>
                <div className="card m-1 p-1">
                  <p className="text-3xl">{summary.clientsCount} </p>
                  <p>Clients</p>
                  <Link href="/admin/clients" className="text-xs">View clients</Link>
                </div>
                <div className="card m-1 p-1">
                  <p className="text-3xl">{summary.providersCount} </p>
                  <p>Providers</p>
                  <Link href="/admin/providers" className="text-xs">View providers</Link>
                </div>
                <div className="card m-1 p-1">
                  <p className="text-3xl">{summary.partnersCount} </p>
                  <p>Partners</p>
                  <Link href="/admin/partners" className="text-xs">View partners</Link>
                </div>
                <div className="card m-1 p-1">
                  <p className="text-3xl">{summary.workersCount} </p>
                  <p>Workers</p>
                  <Link href="/admin/workers" className="text-xs">View workers</Link>
                </div>
                <div className="card m-1 p-1">
                  <p className="text-3xl">{summary.workerscategoriesCount} </p>
                  <p>Workers Categories</p>
                  <Link href="/admin/workerscategories" className="text-xs">View workers categories</Link>
                </div>
                <div className="card m-1 p-1">
                  <p className="text-3xl">{summary.workersplacesCount} </p>
                  <p>Workers Places</p>
                  <Link href="/admin/workersplaces" className="text-xs">View workers places</Link>
                </div>
                <div className="card m-1 p-1">
                  <p className="text-3xl">{summary.usersCount} </p>
                  <p>Users</p>
                  <Link href="/admin/users" className="text-xs">View users</Link>
                </div>
              </div>
              <h2 className="text-xl">Sales Report</h2>
              <Bar
                options={{
                  legend: { display: true, position: "right" },
                }}
                data={data}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminDashboardScreen.auth = { adminOnly: true };
export default AdminDashboardScreen;
