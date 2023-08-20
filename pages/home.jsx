import React, { useEffect } from "react";
import CourseGroup from "components/CourseGroup/CourseGroup";
import SeminarioGroup from "components/SeminariosGroup/SeminariosGroup";
import SwiperCursos from "components/SwiperCursos/SwiperCursos";

// Services
import { useGetTendenciasQuery } from "store/services/EventoService";
import useGlobalSlice from "hooks/useGlobalSlice";
import appRoutes from "routes/appRoutes";

const Home = () => {
  const { data, isFetching, refetch } = useGetTendenciasQuery();
  const { handleSetLoading } = useGlobalSlice();
  const tendencias = data?.eventosMasComprados || [];
  const agregadosRecientemente = data?.cursosRecientes || [];
  const seminarios = data?.seminariosRandom || [];

  
  useEffect(() => {
    refetch()
  }, [])

  useEffect(() => {
    handleSetLoading(isFetching);
  }, [isFetching]);

  return (
    <div className="w-full py-4 md:px-10 px-4 h-auto justify-start">
      <SwiperCursos />

      <div className="mt-[140px] md:px-20 w-full h-auto flex lg:flex-row flex-col items-start justify-center md:gap-x-[40px]">
        <div className="flex w-full h-auto flex-col gap-y-[120px]">
          <CourseGroup
            cursos={agregadosRecientemente}
            title={"Agregados Recientemente"}
            link={appRoutes.cursos()}
            loading={isFetching}
          />

          <CourseGroup cursos={tendencias} title={"Tendencias"} link={appRoutes.cursos()} loading={isFetching} />
        </div>
        <div className="m-auto min-w-[500px] lg:mt-0 mt-10 w-[500px]">
          <SeminarioGroup seminarios={seminarios} loading={isFetching} />
        </div>
      </div>
    </div>
  );
};

export default Home;
