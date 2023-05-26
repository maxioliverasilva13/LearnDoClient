import React, { useState } from "react";

import { BiMessageAlt } from "react-icons/bi";
import { MdOutlineStars } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { BiLogOutCircle } from "react-icons/bi";
import useChats from "hooks/useChats";
import Link from "next/link";
import appRoutes from "routes/appRoutes";
import useGlobalSlice from "hooks/useGlobalSlice";
import GlobalImage from "components/GlobalImage/GlobalImage";
import { useRouter } from "next/router";

export default function Navbar() {
  const { noReadsMessages } = useChats();
  const { userInfo } = useGlobalSlice();
  const [expandedMenu, setExpandedmenu] = useState(false);
  const { rol } = useGlobalSlice();

  const hasNoReadsMessages = noReadsMessages?.length > 0;
  const points = 0;
  const router = useRouter();

  const handleToggleExpandMenu = () => {
    setExpandedmenu(!expandedMenu);
  };
  const { handleLogout } = useGlobalSlice();

  const renderItems = () => {
    if (rol === "organizador") {
      return <ul className="flex justify-center ml-[200px]">
      <li className="px-4">
        <Link href={appRoutes.dashboard()} className="hover:text-gray-400">
          Dashboard
        </Link>
      </li>
      <li className="px-4">
        <Link href={appRoutes.misCursosAdmin()} className="hover:text-gray-400">
          Mis cursos
        </Link>
      </li>
      <li className="px-4">
        <Link
          href={appRoutes.seminarios()}
          className="hover:text-gray-400"
        >
          Seminarios
        </Link>
      </li>
    </ul>
    } else {
      return <ul className="flex justify-center ml-[200px]">
      <li className="px-4">
        <Link href={appRoutes.home()} className="hover:text-gray-400">
          Inicio
        </Link>
      </li>
      <li className="px-4">
        <Link href={appRoutes.cursos()} className="hover:text-gray-400">
          Cursos
        </Link>
      </li>
      <li className="px-4">
        <Link
          href={appRoutes.seminarios()}
          className="hover:text-gray-400"
        >
          Seminarios
        </Link>
      </li>
      <li className="px-4">
        <Link href={appRoutes.misCursos()} className="hover:text-gray-400">
          Mis cursos
        </Link>
      </li>
    </ul>
    }
  }

  return (
    <>
      {/* Navbar */}
      <header
        className="flex sticky top-0 left-0 z-[50] w-full items-center text-white h-16 min-h-[64px]"
        style={{ backgroundColor: "#31174A" }}
      >
        {/* Logo */}
        <div className="px-4">
          <span className="text-lg font-bold">learndo</span>
        </div>
        {/* Navigation */}
        <nav className="flex-grow">
          {renderItems()}
        </nav>
        
        {/* Search bar and user avatar */}
        <div className="flex items-center px-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar"
              className="text-white px-4 py-2 w-64 border border-white rounded-l-full rounded-r-full h-8 w-[200px]"
              style={{ backgroundColor: "#31174A" }}
            ></input>
          </div>
          <div className="ml-4 relative flex flex-row items-center">
            <span className="text-white mx-2 text-[18px] font-semibold">
              {points}
            </span>
            <MdOutlineStars size={30} />
          </div>
          <Link href={appRoutes.messages()}>
            <div className="ml-4 relative">
              <button className="flex items-center relative text-sm border-2 border-transparent rounded-full">
                <BiMessageAlt size={30} />
                {hasNoReadsMessages && (
                  <div className="absolute text-[8px] text-center flex items-center justify-center rounded-full border border-white right-0 bottom-0 w-[14px] h-[14px] bg-red-500">
                    <span className="font-semibold">
                      {noReadsMessages?.length}
                    </span>
                  </div>
                )}
              </button>
            </div>
          </Link>
          <div className="ml-4 relative">
            <div
              onClick={handleToggleExpandMenu}
              className="flex items-center cursor-pointer text-sm border-2 border-transparent rounded-full "
            >
              <span className="mx-2 font-semibold text-[18px]">
                {userInfo?.nickname}
              </span>
              <div className="w-8 h-8 relative rounded-full">
                <GlobalImage
                  src={userInfo?.imagen}
                  loader={() => userInfo?.imagen}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
            </div>
            {expandedMenu && (
              <div className="w-[200px] appearsAnimation absolute top-[30px] right-[30px] rounded-lg p-2 bg-white shadow-md flex flex-col items-start justify-start gap-2">
                <span
                  onClick={() => router.push(appRoutes.profile())}
                  className="text-gray-800 flex flex-row items-center w-full text-base cursor-pointer px-2 py-1 font-semibold transition-all hover:bg-gray-200 rounded-lg"
                >
                  <CgProfile className="mr-2" />
                  Cuenta
                </span>
                <span
                  onClick={() => handleLogout()}
                  className="text-gray-800 flex flex-row items-center w-full text-base cursor-pointer px-2 py-1 font-semibold transition-all hover:bg-gray-200 rounded-lg"
                >
                  <BiLogOutCircle className="mr-2" />
                  Salir
                </span>
              </div>
            )}
          </div>
        </div>
      </header>
      {/* End Navbar */}
    </>
  );
}
