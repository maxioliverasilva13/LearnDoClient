import React, { useState } from "react";
import { useEffect } from "react";
import Select from "react-select";
import Modal from "components/Modal/modal";

const FilterEventoModal = ({
  show,
  updateShowModal,
  onFilterEvent,
  categorias,
}) => {
  const [categoriasOptions, setCategoriasOptions] = useState([]);

  const [categoriasSelected, setCategoriasSelected] = useState();
  const [tipoOptionSelected, setTipoSelected] = useState();

  useEffect(() => {
    if (categorias) {
      const categoriasOpt = categorias.map((item) => {
        return {
          value: item.id,
          label: item.nombre,
        };
      });
      setCategoriasOptions(categoriasOpt);
    }
  }, [categorias]);

  const tiposOptions = [
    { value: null, label: "Todos" },
    { value: "Curso", label: "Cursos" },
    { value: "SeminarioOnline", label: "Seminario Online" },
    { value: "SeminarioPresencial", label: "Seminario Presencial" },
  ];

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "white" : "black", // set the text color based on the selected state
    }),
  };

  function closeModal() {
    updateShowModal(false);
  }

  function handleSelectTipo(data) {
    setTipoSelected(data);
  }

  function handleSelectCategorias(data) {
    setCategoriasSelected(data);
  }

  function onFilter() {
    const categoriasIds = categoriasSelected
      ? categoriasSelected.map((item) => item.value)
      : [];
    const filterObj = {
      tipo: tipoOptionSelected ? tipoOptionSelected.value : null,
      categoriasIds,
    };
    onFilterEvent(filterObj);
  }
  return (
    <>
      {show ? (
        <Modal ancho="400px" isVisible={true} onClose={closeModal}>
          <div className={"relative w-full h-full max-w-md md:h-auto"}>
            <div className={"relative h-auto"}>
              <div
                className={
                  "flex items-start justify-between px-6 py-4 rounded-t"
                }
              >
                <h3
                  className={
                    "text-lg font-normal text-white dark:text-gray-400"
                  }
                >
                  Aplicar filtros para eventos:
                </h3>
              </div>
              <div className={"px-4 space-y-4 md:px-6"}>
                <div className={"flex items-center justify-between"}>
                  <div>
                    <label
                      className={
                        "relative inline-flex items-center cursor-pointer"
                      }
                    >
                      <span
                        className={
                          "ml-3 text-sm font-medium text-white dark:text-gray-300"
                        }
                      >
                        Tipo de evento
                      </span>
                    </label>
                  </div>

                  <div>
                    <Select
                      options={tiposOptions}
                      value={tipoOptionSelected}
                      onChange={handleSelectTipo}
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                          ...theme.colors,
                          primary25: "#78A132",

                          text: "#78A132",
                          font: "#78A132",

                          primary: "#78A132",
                          neutral80: "black",
                          color: "black",
                        },
                      })}
                      styles={customStyles}
                    />
                  </div>
                </div>

                <div className={"flex items-center justify-between"}>
                  <div>
                    <label
                      className={
                        "relative inline-flex items-center cursor-pointer"
                      }
                    >
                      <span
                        className={
                          "ml-3 text-sm font-medium text-white dark:text-gray-300"
                        }
                      >
                        Categorias
                      </span>
                    </label>
                  </div>

                  <div>
                    <Select
                      options={categoriasOptions}
                      isMulti
                      value={categoriasSelected}
                      onChange={handleSelectCategorias}
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                          ...theme.colors,
                          primary25: "#78A132",
                          primary: "black",
                          text: "black",
                        },
                      })}
                      styles={customStyles}
                    />
                  </div>
                </div>
              </div>
              <div
                className={
                  "flex items-center justify-center p-6 space-x-4 rounded-b dark:border-gray-600"
                }
              >
                <button
                  type="reset"
                  onClick={onFilter}
                  className={
                    "w-1/3 py-2.5 px-5 text-sm font-medium focus:outline-none bgPrincipal rounded-full text-white focus:z-10"
                  }
                >
                  Filtrar
                </button>
              </div>
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  );
};

export default FilterEventoModal;
