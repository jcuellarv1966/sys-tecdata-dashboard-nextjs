import React from 'react';
// eslint-disable-next-line no-unused-vars
import Link from "next/link";
import {
  MdOutlineSpaceDashboard,
  MdAccountBalance,
  MdOutlinePayments
} from "react-icons/md";
import { FaWpforms, FaFileContract, FaProjectDiagram, FaRegChartBar } from "react-icons/fa";

function SideNavbar() {
  return (
    <div>
      <div className="p-1 w-1/7 h-288px bg-white relative lg:left-0 lg:w-48 peer-focus:left-0 ">
        <div className="flex flex-col justify-start item-center">
          <div className=" my-1 border-b border-gray-100 pb-4">
            <Link href="/advisory/dashboard" >
              <a className="flex mb-0 justify-start items-center gap-1 pl-2 hover:bg-blue-700 p-0 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <MdOutlineSpaceDashboard className="text-2xl text-gray-600 group-hover:text-white " />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold mt-2">
                  Dashboard
                </h3>
              </a>
            </Link>
            <Link href="/advisory/proforms">
              <a className="flex mb-0 justify-start items-center gap-1 pl-2 hover:bg-blue-700 p-0 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <FaWpforms className="text-2xl text-gray-600 group-hover:text-white " />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold mt-2">
                  Proforms
                </h3>
              </a>
            </Link>
            <div>
              <Link href="/advisory/contracts">
                <a className="flex mb-0 justify-start items-center gap-1 pl-2 hover:bg-blue-700 p-0 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                  <FaFileContract className="text-2xl text-gray-600 group-hover:text-white " />
                  <h3 className="text-base text-gray-800 group-hover:text-white font-semibold mt-2">
                    Contracts
                  </h3>
                </a>
              </Link>
              <div className="focused-within-parent:h-10 hovered-parent:h-10 focused-within-parent:mt-1 hovered-parent:mt-1 transition-height duration-100 h-0 overflow-hidden flex flex-col">
                <Link href="/advisory/clientcontract/clientcontractcreatewithproform">
                  <a className="flex w-full ml-8 mb-2 gap-1 pl-1 hover:bg-gray-100 p-1 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                    <h4 className="text-gray-800 group-hover:text-blue-700 font-bold mt-0 text-xs">Create Contract based in Proforms </h4>
                  </a>
                </Link>
              </div>
            </div>
            <Link href="/advisory/beads">
              <a className="flex mb-0 justify-start items-center gap-1 pl-2 hover:bg-blue-700 p-0 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <MdAccountBalance className="text-2xl text-gray-600 group-hover:text-white " />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold mt-2">
                  Beads
                </h3>
              </a>
            </Link>
            <Link href="/advisory/projects">
              <a className="flex mb-0 justify-start items-center gap-1 pl-2 hover:bg-blue-700 p-0 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <FaProjectDiagram className="text-2xl text-gray-600 group-hover:text-white " />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold mt-2">
                  Projects
                </h3>
              </a>
            </Link>
            <Link href="/advisory/collections">
              <a className="flex mb-0 justify-start items-center gap-1 pl-2 hover:bg-blue-700 p-0 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <MdOutlinePayments className="text-2xl text-gray-600 group-hover:text-white " />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold mt-2">
                  Collections
                </h3>
              </a>
            </Link>
            <div>
              <Link href="/advisory/statistics">
                <a className="flex mb-0 justify-start items-center gap-1 pl-2 hover:bg-blue-700 p-0 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                  <FaRegChartBar className="text-2xl text-gray-600 group-hover:text-white " />
                  <h3 className="text-base text-gray-800 group-hover:text-white font-semibold mt-2">
                    Statistics
                  </h3>
                </a>
              </Link>
              {/* <div className="focused-within-parent:h-16 hovered-parent:h-16 focused-within-parent:mt-1 hovered-parent:mt-1 transition-height duration-100 h-0 overflow-hidden flex flex-col items-stretch">
                <Link href="/advisory/workerscategories">
                  <a className="flex w-full ml-8 mb-0 gap-1 pl-1 hover:bg-gray-100 p-1 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                    <h4 className="text-gray-800 group-hover:text-blue-700 font-bold mt-0 text-sm">Workers Categories</h4>
                  </a>
                </Link>
                <Link href="/advisory/workersplaces">
                  <a className="flex w-full ml-8 mb-0 gap-1 pl-1 hover:bg-gray-100 p-1 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                    <h4 className="text-left text-gray-800 group-hover:text-blue-700 font-bold mt-0 text-sm">Workers Places</h4>
                  </a>
                </Link>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideNavbar;