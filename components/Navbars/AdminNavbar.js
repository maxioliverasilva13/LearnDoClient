import React, { useState } from "react";

import UserDropdown from "components/Dropdowns/UserDropdown.js";
import { BiMessageAlt } from 'react-icons/bi';
import { MdOutlineStars } from 'react-icons/md';
import { useRouter } from "next/router";

import Modal from "../Modal/modal"

export default function Navbar() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      {/* Navbar */}
      <header className="flex items-center text-white h-16" style={{ backgroundColor: '#31174A' }}>
        {/* Logo */}
        <div className="px-4">
          <span className="text-lg font-bold">learndo</span>
        </div>
        {/* Navigation */}
        <nav className="flex-grow">
          <ul className="flex justify-center ml-[200px]">
            <li className="px-4">
              <a href="#" className="hover:text-gray-400" onClick={() => setShowModal(true)}>Inicio</a>
            </li>
            <li className="px-4">
              <a href="#" className="hover:text-gray-400">Cursos</a>
            </li>
            <li className="px-4">
              <a href="#" className="hover:text-gray-400">Seminarios
              </a>
            </li>
            <li className="px-4">
              <a href="/mis_cursos" className="hover:text-gray-400 ">Mis cursos</a>
            </li>
          </ul>
        </nav>
        {/* Search bar and user avatar */}
        <div className="flex items-center px-4">
          <div className="relative">
            <input type="text" placeholder="Buscar" className="text-white px-4 py-2 w-64 border border-white rounded-l-full rounded-r-full h-8 w-[200px]" style={{ backgroundColor: '#31174A' }}>
            </input>
          </div>
          <div className="ml-4 relative">
            <MdOutlineStars size={30} />
          </div>
          <div className="ml-4 relative">
            <BiMessageAlt size={30} />
          </div>
          <div className="ml-4 relative">
            <button class="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-500 transition duration-150 ease-in-out">
              <img class="h-8 w-8 rounded-full object-cover" src="https://via.placeholder.com/50" alt="User avatar"></img>
            </button>
          </div>
        </div>
        <Modal isVisible={showModal}/>
      </header>
      {/* End Navbar */}
    </>
  );
}
