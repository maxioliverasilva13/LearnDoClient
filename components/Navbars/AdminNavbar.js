import React from "react";

import UserDropdown from "components/Dropdowns/UserDropdown.js";
import { BiMessageAlt } from 'react-icons/bi';
import { FaBeer } from 'react-icons/fa';
import useChats from "hooks/useChats";
import Link from "next/link";
import appRoutes from "routes/appRoutes";

export default function Navbar() {
  const { noReadsMessages } = useChats();

  const hasNoReadsMessages = noReadsMessages?.length > 0;

  return (
    <>
      {/* Navbar */}
      <header className="flex w-full items-center text-white h-16 min-h-[64px]" style={{ backgroundColor: '#31174A' }}>
        {/* Logo */}
        <div className="px-4">
          <span className="text-lg font-bold">learndo</span>
        </div>
        {/* Navigation */}
        <nav className="flex-grow">
          <ul className="flex justify-center">
            <li className="px-4">
              <a href="#" className="hover:text-gray-400">Inicio</a>
            </li>
            <li className="px-4">
              <a href="#" className="hover:text-gray-400">Cursos</a>
            </li>
            <li className="px-4">
              <a href="#" className="hover:text-gray-400">Seminarios</a>
            </li>
            <li className="px-4">
              <a href="#" className="hover:text-gray-400">Mis cursos</a>
            </li>
          </ul>
        </nav>
        {/* Search bar and user avatar */}
        <div className="flex items-center px-4">
          <div className="relative">
            <input type="text" placeholder="Buscar" className="text-white px-4 py-2 w-64 border border-white rounded-l-full rounded-r-full h-8 w-[200px]" style={{ backgroundColor: '#31174A' }}>
            </input>
          </div>
          <div>
            <button className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-500 transition duration-150 ease-in-out ml-4">

            </button>
          </div>
          <Link href={appRoutes.messages()}>
          <div className="ml-4 relative">
            <button className="flex relative text-sm border-2 border-transparent rounded-full">
              <BiMessageAlt size={30} />
              {
                hasNoReadsMessages && <div className="absolute text-[8px] text-center flex items-center justify-center rounded-full border border-white right-0 bottom-0 w-[14px] h-[14px] bg-red-500">
                <span className="font-semibold">{noReadsMessages?.length}</span>
              </div>
              }
            </button>
          </div>
          </Link>
          <div className="ml-4 relative">
            <button className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-500 transition duration-150 ease-in-out">
              <img className="h-8 w-8 rounded-full object-cover" src="https://via.placeholder.com/50" alt="User avatar"></img>
            </button>
          </div>
        </div>
      </header>
      {/* End Navbar */}
    </>
  );
}
