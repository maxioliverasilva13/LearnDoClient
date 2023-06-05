import CardProfile from "components/Cards/CardProfile";
import NotFoundPage from "components/NotFoundPage/NotFoundPage";
import useGlobalSlice from "hooks/useGlobalSlice";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useLazyGetCursosCompradosQuery } from "store/services/EventoService";
import { useFindUserByIdQuery } from "store/services/UserService";

const UserId = () => {
  const router = useRouter();
  const userId = router.query?.userId;
  const { data, isLoading } = useFindUserByIdQuery({
    uid: userId,
  });
  const { handleSetLoading } = useGlobalSlice();
  const [eventos, setEventos] = useState([]);
  const [eventosComprados , { isLoading: isLoadingComprados }] = useLazyGetCursosCompradosQuery();

  useEffect(() => {
    handleSetLoading(isLoading || isLoadingComprados);
  }, [isLoading, isLoadingComprados]);

  const handleLoadEventos = async (userInfo) => {

    if (userInfo?.type === "organizador") {

    } else {
      const response = await eventosComprados({
        estudianteId: userInfo?.id
      })
      const cursos = response?.data?.cursos;

      console.log("response is", cursos);
    }
  }

  useEffect(() => {
    const userId = data?.userInfo?.userData?.id;
    if (data && userId) {
      handleLoadEventos(data?.userInfo?.userData)
    }
  }, [data])

  if (!data?.ok && (!isLoading)) {
    return <NotFoundPage message={"Usuario no encontrado"} />;
  }

  const userInfo = data?.userInfo?.userData;

  return (
    <div className="flex flex-col items-center justify-center gap-10 mt-[40px]">
      {userInfo && <CardProfile userInfo={userInfo} />}

      <div className="h-full flex flex-col items-center justify-center md: w-[80%]">
        <span className="text-white font-semibold text-[30px]">
          {userInfo?.type === "organizador"
            ? "Eventos dictados"
            : "Eventos comprados"}
        </span>
      </div>
    </div>
  );
};

export default UserId;
