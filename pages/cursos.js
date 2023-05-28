import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "components/Spinner/Spinner";
import FilterEventoModal from "components/Popups/FilterEventoModal";

// layout for page
import Admin from "layouts/Admin.js";

//services
import { useListarEventosQuery } from "store/services/EventoService";
import { useGetCategoriasQuery } from "store/services/CategoriaService";
import useGlobalSlice from "hooks/useGlobalSlice";
import GlobalImage from "components/GlobalImage/GlobalImage";
import Link from "next/link";
import appRoutes from "routes/appRoutes";
import { fomratColorCurso, formatTitle } from "utils/evento";
import clsx from "clsx";

export default function Cursos() {
  const [cursosList, setCursosList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsNumbers, setRowsNumbers] = useState(15);
  const [showModalFilter, setModalFilter] = useState(false);
  const { handleSetLoading } = useGlobalSlice();

  const [filterData, setFilterData] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const { data, error, isLoading, refetch } = useListarEventosQuery({
    page,
    rowsNumbers,
    filterData,
    busqueda,
  });

  const {
    data: categorias,
    error: errorCategorias,
    isLoading: isLoadingCats,
  } = useGetCategoriasQuery();

  const updateShowModal = (show) => {
    setModalFilter(show);
  };

  useEffect(() => {
    refetch();

    if (data) {
      const { result } = data;
      setCursosList(result);
    }
  }, [busqueda, filterData, data]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refetch();
    }, 250);
    return () => clearTimeout(timeoutId);
  }, [page]);

  function loadMoreItems() {
    setPage(page + 1);
  }

  useEffect(() => {
    handleSetLoading(isLoading);
  }, [isLoading]);

  function onFilterEvent(filterObj) {
    setModalFilter(false);
    setCursosList([]);
    setFilterData(filterObj);
    setPage(1);
  }

  function openModalFilters() {
    setModalFilter(true);
  }

  function handleChangeSearch(event) {
    setCursosList([]);
    setPage(1);
    const text = event.target.value;
    setBusqueda(text);
  }

  return (
    <>
      <div className="flex flex-wrap bg text-white relative">
        <div className="w-full">
          <div className={"pt-12"} style={{ minHeight: "100vh" }}>
            <div className={" mt-10 "}>
              <p className={" text-white text-center 	text-5xl font-semibold "}>
                Todos los eventos disponibles en nuestra plataforma
              </p>
            </div>
            <div className="{ flex flex-col items-center px-40 mt-10 }">
              <div
                className={
                  "w-full flex justify-between items-center	 px-10 py-10"
                }
              >
                <input
                  type="text"
                  className="bg-transparent border-white border-2 py-2 px-4 text-white outline-none	rounded-full no-underline	hover:border-white"
                  placeholder="Buscar"
                  onChange={handleChangeSearch}
                  value={busqueda}
                />

                <div className={"flex items-center gap-5"}>
                  <div
                    className={"flex items-center"}
                    onClick={openModalFilters}
                  >
                    <p className={"mr-2"}>Filtros</p>
                    <i className={"fa fa-bars text-white "}></i>{" "}
                  </div>
                </div>
              </div>
              {cursosList.length <= 0 && (
                <h2>Lo sentimos pero no existen eventos disponibles.</h2>
              )}
              <FilterEventoModal
                show={showModalFilter}
                updateShowModal={updateShowModal}
                onFilterEvent={onFilterEvent}
                categorias={categorias}
              ></FilterEventoModal>

              <InfiniteScroll
                dataLength={cursosList.length}
                next={loadMoreItems}
                hasMore={hasMore}
              >
                <div className="flex justify-center gap-10 text-center flex-wrap px-8">
                  {cursosList.map((curso) => {
                    return (
                      <Link href={appRoutes.cursoPage(curso?.id)}>
                      <div
                        className="max-w-[250px] cursor-pointer min-h-[350px]"
                        key={curso.id}
                      >
                        <div
                          className="w-[250px] h-[300px] relative rounded-lg overflow-hidden shadow-md"
                          key={curso.id}
                        >
                          <div className={clsx("w-min  absolute z-[20] left-0 top-4 px-4 py-1 font-semibold text-white max-w-full truncate rounded-r-md ",
                            `bg-[${fomratColorCurso(curso?.tipo)}]`
                          )}>
                            {formatTitle(curso?.tipo)}
                          </div>
                          <GlobalImage
                            src={curso?.imagen}
                            loader={() => curso?.imagen}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <p className="text-xl	">{curso.nombre}</p>
                      </div>
                      </Link>
                    );
                  })}
                </div>
              </InfiniteScroll>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
