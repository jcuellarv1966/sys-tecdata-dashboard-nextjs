import React from 'react';
// eslint-disable-next-line no-unused-vars
import Link from "next/link";
import {
  MdOutlineSpaceDashboard,
  MdSupervisorAccount,
  MdStore,
  MdPendingActions,
  MdOutlineWifiProtectedSetup,
  MdEngineering
} from "react-icons/md";
import { CgProfile } from "react-icons/cg";

function SideNavbar() {
  return (
    <div>
      <div className="p-1 w-1/7 h-288px bg-white relative lg:left-0 lg:w-48 peer-focus:left-0 ">
        <div className="flex flex-col justify-start item-center">
          <div className=" my-1 border-b border-gray-100 pb-4">
            <Link href="/admin/dashboard" >
              <a className="flex mb-0 justify-start items-center gap-1 pl-2 hover:bg-blue-700 p-0 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <MdOutlineSpaceDashboard className="text-2xl text-gray-600 group-hover:text-white " />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold mt-2">
                  Dashboard
                </h3>
              </a>
            </Link>
            <Link href="/admin/profile">
              <a className="flex mb-0 justify-start items-center gap-1 pl-2 hover:bg-blue-700 p-0 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <CgProfile className="text-2xl text-gray-600 group-hover:text-white " />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold mt-2">
                  Profile
                </h3>
              </a>
            </Link>
            <div>
              <Link href="/admin/products">
                <a className="flex mb-0 justify-start items-center gap-1 pl-2 hover:bg-blue-700 p-0 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                  <MdStore className="text-2xl text-gray-600 group-hover:text-white " />
                  <h3 className="text-base text-gray-800 group-hover:text-white font-semibold mt-2">
                    Products
                  </h3>
                </a>
              </Link>
              <div className="focused-within-parent:h-8 hovered-parent:h-8 focused-within-parent:mt-1 hovered-parent:mt-1 transition-height duration-100 h-0 overflow-hidden flex flex-col">
                <Link href="/admin/productscategories">
                  <a className="flex w-full ml-8 mb-0 gap-1 pl-1 hover:bg-gray-100 p-1 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                    <h4 className="text-gray-800 group-hover:text-blue-700 font-bold mt-0 text-sm">Products Categories</h4>
                  </a>
                </Link>
              </div>
            </div>
            <Link href="/admin/clients">
              <a className="flex mb-0 justify-start items-center gap-1 pl-2 hover:bg-blue-700 p-0 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <MdSupervisorAccount className="text-2xl text-gray-600 group-hover:text-white " />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold mt-2">
                  Clients
                </h3>
              </a>
            </Link>
            <Link href="/admin/providers">
              <a className="flex mb-0 justify-start items-center gap-1 pl-2 hover:bg-blue-700 p-0 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <MdPendingActions className="text-2xl text-gray-600 group-hover:text-white " />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold mt-2">
                  Providers
                </h3>
              </a>
            </Link>
            <Link href="/admin/partners">
              <a className="flex mb-0 justify-start items-center gap-1 pl-2 hover:bg-blue-700 p-0 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <MdOutlineWifiProtectedSetup className="text-2xl text-gray-600 group-hover:text-white " />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold mt-2">
                  Partners
                </h3>
              </a>
            </Link>
            <div>
              <Link href="/admin/workers">
                <a className="flex mb-0 justify-start items-center gap-1 pl-2 hover:bg-blue-700 p-0 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                  <MdEngineering className="text-2xl text-gray-600 group-hover:text-white " />
                  <h3 className="text-base text-gray-800 group-hover:text-white font-semibold mt-2">
                    Workers
                  </h3>
                </a>
              </Link>
              <div className="focused-within-parent:h-16 hovered-parent:h-16 focused-within-parent:mt-1 hovered-parent:mt-1 transition-height duration-100 h-0 overflow-hidden flex flex-col items-stretch">
                <Link href="/admin/workerscategories">
                  <a className="flex w-full ml-8 mb-0 gap-1 pl-1 hover:bg-gray-100 p-1 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                    <h4 className="text-gray-800 group-hover:text-blue-700 font-bold mt-0 text-sm">Workers Categories</h4>
                  </a>
                </Link>
                <Link href="/admin/workersplaces">
                  <a className="flex w-full ml-8 mb-0 gap-1 pl-1 hover:bg-gray-100 p-1 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                    <h4 className="text-left text-gray-800 group-hover:text-blue-700 font-bold mt-0 text-sm">Workers Places</h4>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideNavbar;