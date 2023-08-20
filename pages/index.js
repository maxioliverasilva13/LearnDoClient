import React, { useEffect } from "react";

// components
import CourseGroup from "components/CourseGroup/CourseGroup";

// layout for page
import Image from "next/image";
import welcome from "public/img/welcome.svg";

// Services
import { useGetTendenciasQuery } from "store/services/EventoService";
import useGlobalSlice from "hooks/useGlobalSlice";
import appRoutes from "routes/appRoutes";
import Link from "next/link";

export default function LandingPage() {
  const { data, isLoading } = useGetTendenciasQuery();
  const { handleSetLoading } = useGlobalSlice();
  const recomendados = data?.cursosRecientes || [];

  useEffect(() => {
    handleSetLoading(isLoading);
  }, [isLoading]);
  return (
    <>
      <div className="w-full py-4 md:px-10 px-4 h-auto justify-start landingBGImage !h-screen">
        <div className="w-full h-auto flex flex-col items-start justify-center pt-6 gap-y-28">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="flex w-full md:w-1/2">
              <Image priority src={welcome} alt="¡Bienvenido a LearnDo!" />
            </div>
            <div className="flex flex-col my-auto  w-full md:w-2/5 px-12 gap-y-4 font-light text-lg">
              <div className="flex flex-col gap-y-4 w-full mb-8 text-center">
                <p className="text-white">
                  Accede a cientos de cursos, seminarios con los mejores
                  profesionales o conviértete en organizador y crea tus propios
                  cursos para generar tu propia audiencia y comunidad.
                </p>
                <p className="text-white font-normal">
                  ¡Las posibilidades son infinitas! ¿Qué esperas?
                </p>
              </div>
              <Link
                href="/auth/register"
              >
                <span
                  className="w-max cursor-pointer self-center border border-white text-white
                hover:shadow-md shadow text-normal px-20 py-4 rounded-full outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                >
                  Registrarme
                </span>
              </Link>
              <div className="w-full flex justify-center my-4 gap-x-2">
                {/* SPACER */}
                <div className="flex items-center" aria-hidden="true">
                  <div className="w-24 border-t border-gray-300" />
                </div>
                <div className="flex justify-center text-center">
                  <span className="px-2 text-white text-lg">
                    ¿Ya tienes una cuenta?
                  </span>
                </div>
                <div className="flex items-center" aria-hidden="true">
                  <div className="w-24 border-t border-gray-300" />
                </div>
              </div>
              {/* SPACER */}
              <Link
                href="/auth/login"
              >
                <span
                  className="w-max cursor-pointer self-center bgPrincipal text-white
                hover:shadow-md shadow text-normal px-20 py-4 rounded-full outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                >
                  Iniciar Sesión
                </span>
              </Link>
            </div>
          </div>

          <div className="md:px-20 w-full h-auto flex flex-row items-start justify-center md:gap-x-[40px]">
            <div className="flex w-full h-auto flex-col gap-y-[120px]">
              <CourseGroup
                cursos={recomendados}
                title={"Cursos Recomendados"}
                link={appRoutes.cursos()}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
