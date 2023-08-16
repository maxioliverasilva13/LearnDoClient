import GlobalImage from "components/GlobalImage/GlobalImage";
import Link from "next/link";
import React from "react";
import { AiOutlineUser, AiOutlineMail, AiOutlineMessage } from "react-icons/ai";
import { GiSmartphone } from "react-icons/gi";
import appRoutes from "routes/appRoutes";
// components

export default function CardProfile({ userInfo }) {
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-[#4444] md: lg:w-[800px] w-[85%] mb-6 shadow-xl rounded-lg mt-[80px]">
        <div className="px-6">
          <div className="flex flex-wrap justify-center">
            <div className="w-full px-4 flex justify-center">
              <div className="relative w-[150px] h-[150px] -m-16 -ml-20 lg:-ml-16 ">
                <GlobalImage
                  alt="..."
                  src={userInfo?.imagen}
                  layout="fill"
                  objectFit="cover"
                  className="shadow-xl rounded-full h-auto align-middle border-none absolute"
                />
              </div>
            </div>
            <h3 className="text-xl font-semibold mt-20 leading-normal text-white mb-2">
              {userInfo.nombre}
            </h3>
            <div className="w-full px-4 text-center">
              <div className="flex justify-center py-4 lg:pt-4 pt-8">
                <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-300">
                    22
                  </span>
                  <span className="text-sm text-blueGray-400">Seminarios</span>
                </div>
                <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-300">
                    10
                  </span>
                  <span className="text-sm text-blueGray-400">Cursos</span>
                </div>
              </div>
              <Link href={appRoutes.messageWithId(userInfo?.id)}>
                <div className="w-full h-auto gap-2 cursor-pointer flex items-center justify-center">
                  <AiOutlineMessage className="cursor-pointer" size={30} color="white" />
                  <span className="text-blueGray-300">Enviar Mensaje</span>
                </div>
              </Link>
            </div>
          </div>
          <div className="text-center mt-12">
            <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
              <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>{" "}
              Los Angeles, California
            </div>
            <a href={`tel:${userInfo?.telefono}`} className="text-sm flex flex-row items-center justify-center gap-2 leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
              <GiSmartphone className="text-text-blueGray-400" size={20} />
              Phone: {userInfo?.telefono}
            </a>
            <a href={`mailTo:${userInfo?.email}`} className="text-sm flex flex-row items-center justify-center gap-2 leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
              <AiOutlineMail className="text-text-blueGray-400" size={20} />
              Email: {userInfo?.email}
            </a>
            {userInfo?.type === "organizador" && (
              <div className="mb-2 mt-0 text-blueGray-600">
                <i className="fas fa-briefcase mr-2 text-lg text-blueGray-300"></i>
                <a className="text-blueGray-300">
                  Organizador - LearnDo
                </a>
              </div>
            )}
            {userInfo?.type === "estudiante" && (
              <div className="mb-2 mt-0 text-blueGray-600">
                <i className="fas fa-university mr-2 text-lg text-blueGray-300 "></i>
                <a className="text-blueGray-300">
                  Estudiante - LearnDo
                </a>
              </div>
            )}
          </div>
          {userInfo?.biografia && (
            <div className="mt-10 py-10 border-t border-gray-600 text-center">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-9/12 px-4">
                  <span className="flex flex-row items-center justify-center gap-2 font-medium m-auto text-blueGray-300">
                    <AiOutlineUser size={20} color="white" />
                    Biografia:
                  </span>
                  <p className="mb-4 text-lg leading-relaxed text-blueGray-300">
                    {userInfo?.biografia}
                  </p>
                  {/* <a
                  href="#pablo"
                  className="font-normal text-lightBlue-500"
                  onClick={(e) => e.preventDefault()}
                >
                  Show more
                </a> */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
