import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import Spinner from "components/Spinner/Spinner";
import FilterEventoModal from "components/Popups/FilterEventoModal";

//services
import { useListarEventosQuery } from "store/services/EventoService";
import useGlobalSlice from "hooks/useGlobalSlice";

export default function Cursos() {
  const [cursosList, setCursosList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsNumbers, setRowsNumbers] = useState(15);
  const [showModalFilter, setModalFilter] = useState(false);
  const { handleSetLoading  } = useGlobalSlice();

  const [filterData, setFilterData] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const { data, error, isLoading, refetch } = useListarEventosQuery({
    page: page,
    rowsNumbers,
    filterData,
    busqueda,
  });

  const updateShowModal = (show) => {
    setModalFilter(show);
  };

  useEffect(() => {
    refetch();

    if (data) {
      const { result } = data;
      setCursosList(result);
    }
  }, [page, busqueda, filterData, data]);

  function loadMoreItems() {
    setPage(page + 1);
  }

  useEffect(() => {
    handleSetLoading(isLoading)
  }, [isLoading])

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
          <div
            className={
              "bg-gradient-to-b from-[#780eff]  via-[#5B23A2] to-[#000] pt-12"
            }
            style={{ minHeight: "100vh" }}
          >
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
                  className="bg-transparent border-white border-2 p-1 text-white outline-none	rounded-full no-underline	hover:border-white"
                  placeholder="buscar"
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
              {cursosList.length <= 0 && !isLoading && (
                <h2>Lo sentimos pero no existen eventos disponibles.</h2>
              )}
              <FilterEventoModal
                show={showModalFilter}
                updateShowModal={updateShowModal}
                onFilterEvent={onFilterEvent}
              ></FilterEventoModal>

              <InfiniteScroll
                dataLength={cursosList.length}
                next={loadMoreItems}
                hasMore={hasMore}
              >
                <div className="flex justify-center gap-10 text-center flex-wrap px-8">
                  {cursosList.map((curso) => {
                    return (
                      <div
                        className="max-w-[250px] min-h-[350px]"
                        key={curso.id}
                      >
                        <img
                          className="max-w-[250px] min-h-[350px] object-cover rounded-lg	"
                          src="https://definicion.de/wp-content/uploads/2010/11/curso-1.jpg"
                        ></img>
                        <p className="text-xl	">{curso.nombre}</p>
                      </div>
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
