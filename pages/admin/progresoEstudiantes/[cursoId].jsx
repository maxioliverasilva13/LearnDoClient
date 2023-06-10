import GlobalImage from "components/GlobalImage/GlobalImage";
import NoResults from "components/NotFoundPage/NoResults";
import NotFoundPage from "components/NotFoundPage/NotFoundPage";
import UserProgress from "components/UserProgress/UserProgress";
import useGlobalSlice from "hooks/useGlobalSlice";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useGetProgresoEstudiantesQuery } from "store/services/EventoService";


const ProgresoEstudiantes = () => {
  const cursoName = "Curso Nombre 1";

  const { query } = useRouter();
  const cursoId = query?.cursoId;
  const { userInfo, handleSetLoading } = useGlobalSlice();
  const userId = userInfo?.id;

  const { data, isLoading } = useGetProgresoEstudiantesQuery(
    {
      cursoId,
      userId,
    },
    {
      skip: !cursoId || !userId,
    }
  );

  useEffect(() => {
    handleSetLoading(isLoading);
  }, [isLoading]);


  const eventoInfo = data?.eventoInfo;
  const cursoInfo = data?.cursoInfo;
  const estudiantes = data?.estudiantes || [];

  if (data?.ok === false) {
    return <NotFoundPage />;
  }

  return (
    <div className="w-full h-full">
      <div className="w-full h-[250px] relative">
        <GlobalImage
          src={eventoInfo?.imagen}
          loader={() => eventoInfo?.imagen}
          layout="fill"
          objectFit="cover"
          className="bg-fixed"
        />
        <div className="w-full h-full flex items-end justify-start p-4 absolute top-0 left-0 bg-black bg-opacity-50">
          <p className="text-white font-semibold text-[40px]">{cursoName}</p>
        </div>
      </div>
      <div className="flex flex-col items-start justify-start md:pt-[20px] pb-5 md:px-[80px] px-5">
        <h1 className="text-white font-semibold pb-10 text-[30px]">
          Progreso Estudiantes
        </h1>

        {estudiantes?.length === 0 && !isLoading ? (
          <NoResults message="Al parecer no tienes estudiantes" />
        ) : (
          <div className="w-full h-auto flex flex-col items-start justify-start gap-6 border-white border rounded-[10px] p-[32px] bg-transparent flex-grow max-h-full overflow-auto">
            <div className="w-full flex h-auto items-center justify-between">
              <p className="text-white md:block hidden font-semibold text-[18px]">Estudiante</p>
              <p className="text-white md:block hidden font-semibold text-[18px] pr-10">
                Progreso
              </p>
            </div>
            {estudiantes?.map((item, index) => {
              return (
                <UserProgress
                  aprobacion={cursoInfo?.porcentaje_aprobacion}
                  userName={item?.userInfo?.nombre}
                  userImage={item?.userInfo?.imagen}
                  porcentage={item?.progreso?.avgCalifications || 0}
                  userId={item?.id}
                  key={`UserProgress-${index}`}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgresoEstudiantes;
