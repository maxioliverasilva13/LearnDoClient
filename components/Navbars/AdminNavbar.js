import React, { useEffect, useState } from "react";

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
import { RxHamburgerMenu } from "react-icons/rx";
import { Dialog } from "@headlessui/react";
import { RxCross1 } from "react-icons/rx";
import { useFilterByNicknameOrEmailQuery } from "store/services/UserService";
import NoResults from "components/NotFoundPage/NoResults";
import { BiLinkExternal } from "react-icons/bi";
import { useWindowDimensions } from "hooks/useMediaQuery";
import MobileNavbar from "./MobileNavbar";

export default function Navbar() {
  const { noReadsMessages } = useChats();
  const { userInfo } = useGlobalSlice();
  const [expandedMenu, setExpandedmenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const hasQuery = query != "" && query !== null && query != undefined;
  const { data: filterUsuarios = [] } = useFilterByNicknameOrEmailQuery(query, {
    skip: !hasQuery,
  });

  const { rol } = useGlobalSlice();

  const hasNoReadsMessages = noReadsMessages?.length > 0;
  const points = userInfo?.creditos_number || 0;

  const router = useRouter();

  useEffect(() => {
    // cerrar el navbar mobile al detectar cambio de ruta
    setMobileMenuOpen(false);
  }, [router]);

  const handleToggleExpandMenu = () => {
    setExpandedmenu(!expandedMenu);
  };
  const { handleLogout } = useGlobalSlice();
  const { isMobile, isTablet } = useWindowDimensions();

  const renderItems = () => {
    if (rol === "organizador") {
      return (
        <ul className="flex flex-col gap-y-5 lg:flex-row justify-center items-center">
          <li className="px-4">
            <Link href={appRoutes.dashboard()} className="hover:text-gray-400">
              Dashboard
            </Link>
          </li>
          <li className="px-4">
            <Link
              href={appRoutes.misCursosAdmin()}
              className="hover:text-gray-400"
            >
              Mis Eventos
            </Link>
          </li>
        </ul>
      );
    } else {
      return (
        <ul className="flex justify-center ml-[200px]">
          <li className="px-4">
            <Link href={appRoutes.home()} className="hover:text-gray-400">
              Inicio
            </Link>
          </li>
          <li className="px-4">
            <Link href={appRoutes.cursos()} className="hover:text-gray-400">
              Eventos
            </Link>
          </li>
          <li className="px-4">
            <Link href={appRoutes.misCursos()} className="hover:text-gray-400">
              Mis Eventos
            </Link>
          </li>
        </ul>
      );
    }
  };

  return (
    <>
      {/* Navbar */}
      {isMobile || isTablet ? (
        <>
          <header className="flex bg-[#1F2028] border-b-[1px] border-white sticky top-0 left-0 z-[50] w-full justify-between items-center text-white h-16 min-h-[64px]">
            {/* Logo */}
            <div className="px-4 ">
              {userInfo?.type === "estudiante" && (
                <Link href={appRoutes.home()}>
                  <span className="select-none font-bold cursor-pointer text-[20px]">
                    Learn
                    <span className="p-1 bgSecundario rounded-lg ml-1">
                      Do
                    </span>
                  </span>
                </Link>
              )}
              {userInfo?.type === "organizador" && (
                <Link href={appRoutes.dashboard()}>
                  <span className="select-none font-bold cursor-pointer text-[20px]">
                    Learn
                    <span className="p-1 bgSecundario rounded-lg">
                      Do
                    </span>
                  </span>
                </Link>
              )}
            </div>
            {/* Search bar and user avatar */}
            <div className="flex items-center px-4 ">
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
              <div className="ml-4 relative ">
                <div
                  onClick={handleToggleExpandMenu}
                  className="flex items-center cursor-pointer text-sm border-2 border-transparent rounded-full "
                >
                  <span className="mx-2 font-semibold text-[18px] max-w-[150px] overflow-hidden truncate">
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
                  <div className="w-[200px] appearsAnimation absolute top-[30px] right-[30px] rounded-lg p-2 bg-[#444444] shadow-md flex flex-col items-start justify-start gap-2">
                    <span
                      onClick={() => router.push(appRoutes.profile())}
                      className="text-white flex flex-row items-center w-full text-base cursor-pointer px-2 py-1 font-semibold transition-all hover:bg-gray-200 rounded-lg"
                    >
                      <CgProfile className="mr-2" />
                      Cuenta
                    </span>
                    <span
                      onClick={() => handleLogout()}
                      className="text-white flex flex-row items-center w-full text-base cursor-pointer px-2 py-1 font-semibold transition-all hover:bg-gray-200 rounded-lg"
                    >
                      <BiLogOutCircle className="mr-2" />
                      Salir
                    </span>
                  </div>
                )}
              </div>
            </div>
          </header>

          <MobileNavbar />
        </>
      ) : (
        <header className="flex bg-[#1F2028] border-b-[1px] border-white sticky top-0 left-0 z-[50] w-full justify-between items-center text-white h-16 min-h-[64px] ">
          {/* Logo */}
            <div className="px-4">
              {userInfo?.type === "estudiante" && (
                <Link href={appRoutes.home()}>
                  <span className="select-none font-bold cursor-pointer text-[20px]">
                    Learn
                    <span className="p-1 bgSecundario rounded-lg ml-1">Do</span>
                  </span>
                </Link>
              )}
              {userInfo?.type === "organizador" && (
                <Link href={appRoutes.dashboard()}>
                  <span className="select-none font-bold cursor-pointer text-[20px]">
                    Learn
                    <span className="p-1 bgSecundario rounded-lg">
                      Do
                    </span>
                  </span>
                </Link>
              )}
            </div>
            <div className="flex lg:hidden mr-5">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen((current) => !current)}
              >
                <span className="sr-only">Open main menu</span>
                <RxHamburgerMenu
                  className="h-6 w-6"
                  aria-hidden="true"
                  color="white"
                  size={12}
                />
              </button>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex">{renderItems()}</nav>
          
          {/* Search bar and user avatar */}
          <div className="hidden lg:flex items-center px-4">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e?.target?.value)}
                type="text"
                placeholder="Buscar"
                className="text-white px-4 h-9 outline-none border border-white bg-transparent rounded-l-full rounded-r-full w-56"
              ></input>
              {hasQuery && (
                <div className="w-full h-auto absolute mt-1 top-full left-0 max-h-[400px] overflow-auto bg-[#444444] rounded-lg shadow-md p-4 appearsAnimation flex flex-col items-center justify-start gap-2">
                  {filterUsuarios?.length === 0 && (
                    <NoResults
                      customSizes="w-[200px]"
                      message="No se encontraron usuarios"
                    >
                      <span className="text-white font-medium m-auto text-center w-full">
                        No se encontraron usuarios
                      </span>
                    </NoResults>
                  )}
                  {filterUsuarios?.length > 0 &&
                    filterUsuarios?.map((usuario) => {
                      return (
                        <div
                          className="w-full"
                          onClick={() => {
                            router.push(appRoutes.userInfoPage(usuario?.id));
                            setQuery("");
                          }}
                          key={`userCard-${usuario?.id}`}
                        >
                          <div className="flex w-full rounded-lg transition-all hover:bg-gray-700 p-2 cursor-pointer flex-row gap-2 items-center justify-start">
                            <div className="relative overflow-hidden min-w-[50px] min-h-[50px] max-w-[50px] max-h-[50px]">
                              <GlobalImage
                                src={usuario?.imagen}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-full"
                              />
                            </div>
                            <div className="w-full h-auto flex-grow max-w-full overflow-hidden flex flex-col items-start justify-center gap-1">
                              <span className="text-white font-medium flex-grow max-w-full truncate">
                                {usuario?.nickname}
                              </span>
                              <span className="text-white text-sm font-medium flex-grow max-w-full truncate">
                                {usuario?.type === "estudiante"
                                  ? "Estudiante"
                                  : "Organizador"}
                              </span>
                            </div>
                            <BiLinkExternal size={25} color="white" />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
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
                <span className="mx-2 font-semibold text-md max-w-[150px] overflow-hidden truncate">
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
                <div className="w-[200px] appearsAnimation absolute top-[30px] right-[30px] rounded-lg p-2 bg-[#444444] shadow-md flex flex-col items-start justify-start gap-2">
                  <span
                    onClick={() => router.push(appRoutes.profile())}
                    className="text-white flex flex-row items-center w-full text-base cursor-pointer px-2 py-1 font-semibold transition-all hover:bg-gray-700 rounded-lg"
                  >
                    <CgProfile className="mr-2" />
                    Cuenta
                  </span>
                  <span
                    onClick={() => handleLogout()}
                    className="text-white flex flex-row items-center w-full text-base cursor-pointer px-2 py-1 font-semibold transition-all hover:bg-gray-700 rounded-lg"
                  >
                    <BiLogOutCircle className="mr-2" />
                    Salir
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>
      )}
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0" />
        <Dialog.Panel className="text-white fixed inset-y-0 right-[17px] z-10 w-full overflow-y-auto bg-slate-800 px-6 py-16 sm:max-w-xs sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-end">
            <button
              type="button"
              className=" rounded-md text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <RxCross1
                className="h-6 w-6 mt-2 text-white"
                aria-hidden="true"
              />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">{renderItems()}</div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
      {/* End Navbar */}
    </>
  );
}
