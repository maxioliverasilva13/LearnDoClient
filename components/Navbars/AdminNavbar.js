import React, { useState } from "react";

import UserDropdown from "components/Dropdowns/UserDropdown.js";
import { BiMessageAlt } from 'react-icons/bi';
import { MdOutlineStars } from 'react-icons/md';

import { FaBeer } from 'react-icons/fa';
import useChats from "hooks/useChats";
import Link from "next/link";
import appRoutes from "routes/appRoutes";
import useGlobalSlice from "hooks/useGlobalSlice";
import GlobalImage from "components/GlobalImage/GlobalImage";

export default function Navbar() {
  const { noReadsMessages } = useChats();
  const { userInfo } = useGlobalSlice();

  const hasNoReadsMessages = noReadsMessages?.length > 0;
  const points = 0;

  return (
    <>
      {/* Navbar */}
      <header className="flex sticky top-0 left-0 z-[30] w-full items-center text-white h-16 min-h-[64px]" style={{ backgroundColor: '#31174A' }}>
        {/* Logo */}
        <div className="px-4">
          <span className="text-lg font-bold">learndo</span>
        </div>
        {/* Navigation */}
        <nav className="flex-grow">
          <ul className="flex justify-center ml-[200px]">
            <li className="px-4">
              <Link href={appRoutes.home()} className="hover:text-gray-400">Inicio</Link>
            </li>
            <li className="px-4">
              <Link href={appRoutes.cursos()} className="hover:text-gray-400">Cursos</Link>
            </li>
            <li className="px-4">
              <Link href={appRoutes.seminarios()} className="hover:text-gray-400">Seminarios</Link>
            </li>
            <li className="px-4">
              <Link href="#" className="hover:text-gray-400">Mis cursos</Link>
            </li>
          </ul>
        </nav>
        {/* Search bar and user avatar */}
        <div className="flex items-center px-4">
          <div className="relative">
            <input type="text" placeholder="Buscar" className="text-white px-4 py-2 w-64 border border-white rounded-l-full rounded-r-full h-8 w-[200px]" style={{ backgroundColor: '#31174A' }}>
            </input>
          </div>
          <div className="ml-4 relative flex flex-row items-center">
            <span className="text-white mx-2 text-[18px] font-semibold">{points}</span>
            <MdOutlineStars size={30} />
          </div>
          <Link href={appRoutes.messages()}>
          <div className="ml-4 relative">
            <button className="flex items-center relative text-sm border-2 border-transparent rounded-full">
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
            <button class="flex items-center cursor-pointer text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-500 transition duration-150 ease-in-out">
              <span className="mx-2 font-semibold text-[18px]">{userInfo?.nickname}</span>
              <div className="w-8 h-8 relative rounded-full">
                <GlobalImage 
                  src={userInfo?.imagen}
                  loader={() => userInfo?.imagen}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
            </button>
          </div>
        </div>
      </header>
      {/* End Navbar */}
    </>
  );
}
