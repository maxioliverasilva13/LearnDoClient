import React from 'react';
import { useState } from 'react';
// import Image from 'next/image';
import { FiEdit3 } from 'react-icons/fi'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { VscCheck } from 'react-icons/vsc'
import { RxCross1 } from 'react-icons/rx'

import ColaboradoresModal from 'components/Modals/ColaboradoresModal';
import AddModuloModal from 'components/Modals/AddModuloModal';

export default function CreateCurso() {
    // Modals
    const [isColaboradoresOpen, setIsColaboradoresOpen] = useState(false);
    const [isModulosOpen, setIsModulosOpen] = useState(false);
    const modals = {
        modulos: () => setIsModulosOpen(current => !current),
        colaboradores: () => setIsColaboradoresOpen(current => !current),
    }

    const [cursoImage, setCursoImage] = React.useState('/img/img-1-1000x600.jpg');
    const [firebaseImage, setFirebaseImage] = React.useState(null);
    const [isFree, setIsFree] = useState(false);
    
    const [modulos, setModulos] = useState([
        {
            id: 1,
            nombre: "Módulo Programacion",
            clases: [
                {
                nombre: "Clase tutorial",
                video: "www.si.com",
                },
            ]
        },
    ]);
    const [colaboradores, setColaboradores] = useState([
        {
            id: 1932,
            nombre: "Pepe Arias",
        },
        {
            id: 2553,
            nombre: "Antonio Diaz",
        },
        {
            id: 333,
            nombre: "Felipe Gimenez",
        },
        {
            id: 4443,
            nombre: "Mauro Fernández",
        },
    ]);
    const [sugerencias, setSugerencias] = useState([
        {
            id: 1,
            nombre: "Módulo X",
        },
        {
            id: 2,
            nombre: "Curso X",
        },
        {
            id: 3,
            nombre: "Módulo Y",
        },
        {
            id: 4,
            nombre: "Curso Y",
        }
    ]);
    

    const onImageChange = (e) => {
        setFirebaseImage(e.target.files[0]);
        if (e.target.files && e.target.files[0]) {
            setCursoImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleCheckboxChange = event => {
        setIsFree(current => !current);
    };

    const handleRemoveCollaborator = (user) => {
        setColaboradores((current) =>
          current.filter((colaborador) => colaborador.id !== user.id)
        );
    };
    
    const handleOpenModal = (value) => {
        value();      
    };

    
  return (
    <>
      <ColaboradoresModal open={isColaboradoresOpen} setIsOpen={setIsColaboradoresOpen} colaboradores={colaboradores} setColaboradores={setColaboradores} />
      <AddModuloModal open={isModulosOpen} setIsOpen={setIsModulosOpen} modulos={modulos} setModulos={setModulos} />
      <div className="w-full py-4 md:px-10 px-4 h-screen overflow-auto max-h-screen justify-start item-no-scrollbar">
        <div className="w-full h-auto flex flex-col items-start justify-center pt-16">
            <p className="text-5xl text-white px-16 py-4">Agregar un curso</p>

            <div className="px-16 w-full gap-8 flex flex-col lg:flex-row justify-center text-white font-light">
                <div className="flex flex-col gap-4 w-full sm:w-1/3"> {/* INICIO columna 1 */}
                    <div className="flex flex-col gap-y-4">
                        <div className="flex w-full justify-center">
                            <img
                                src={cursoImage}
                                alt="vista previa imagen de perfil"
                                className="shadow rounded-md object-scale-down h-auto w-[500px] align-middle border-none"
                            />
                        </div>
                        <input
                            type="file"
                            id="foto"
                            name="image"
                            onChange={onImageChange}
                            className="border-0 px-6 py-3 text-white bg-[#780EFF] rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        />
                    </div>
                    <div className="flex flex-col gap-y-4">
                        <input
                            type="text"
                            id="nombreCurso"
                            name="nombreCurso"
                            className="border border-white px-6 py-3 text-white bg-inherit rounded-full text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            placeholder="Nombre del Curso"
                        />
                        <textarea
                            type="text"
                            id="nombreCurso"
                            name="nombreCurso"
                            className="border border-white px-6 py-3 text-white bg-inherit rounded-3xl text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            placeholder="Descripción del Curso"
                        />
                        <div className="flex items-center gap-4">
                            <label htmlFor='gratuito'>
                                <input type="checkbox"
                                 id="gratuito"
                                 className="accent-pink-500"
                                 value={isFree}
                                 onChange={handleCheckboxChange}
                                /> Gratuito
                            </label>
                            {
                                !isFree &&
                                <input
                                    type="number"
                                    id="nombreCurso"
                                    
                                    name="nombreCurso"
                                    className="border border-white px-6 py-3 text-white bg-inherit rounded-full text-sm shadow focus:outline-none focus:ring w-max ease-linear transition-all duration-150"
                                    placeholder="Precio"
                                />
                            }
                        </div>
                    </div>
                </div> {/* FIN columna 1 */}
                
                <div className="flex flex-col gap-4 w-full sm:w-1/3"> {/* INICIO columna 2 */}
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-normal">Módulos</p>
                        <button className="w-max self-center active:bg-purple-800 text-white font-semibold
                            hover:shadow-md shadow text-sm px-5 py-2 rounded-full outline outline-1 sm:mr-2 mb-1 ease-linear transition-all duration-150"
                            onClick={() => handleOpenModal(modals.modulos)}>
                            Agregar Módulo
                        </button>
                    </div>
                    <div className="flex flex-col overflow-y-scroll scroll-smooth px-5 py-3 h-[250px] max-h-[250px] border border-white rounded-xl gap-y-4">
                        {
                            modulos.map((item) => {
                                return(
                                    <div key={item.id} className="flex w-full py-4 px-6 bg-[#780EFF] rounded-full justify-between items-center hover:shadow-xl">
                                        <p>{item.nombre}</p>
                                        <FiEdit3 className="cursor-pointer"
                                            color="white"
                                            size={30}
                                        />
                                    </div>
                                );
                            })
                        }
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-lg font-normal">Colaboradores</p>
                        <button className="w-max self-center active:bg-purple-800 text-white font-semibold
                            hover:shadow-md shadow text-sm px-5 py-2 rounded-full outline outline-1 sm:mr-2 mb-1 ease-linear transition-all duration-150"
                            onClick={() => handleOpenModal(modals.colaboradores)}>
                            Agregar Colaborador
                        </button>
                    </div>
                    <div className="flex flex-col overflow-y-scroll scroll-smooth px-5 py-3 h-[250px] max-h-[250px] border border-white rounded-xl gap-y-4">
                        {
                            colaboradores.map((colaborador) => {
                                return(
                                    <div key={colaborador.id} className="flex w-full py-4 px-6 bg-[#780EFF] rounded-full justify-between items-center">
                                        <p>{colaborador.nombre}</p>
                                        <RiDeleteBin6Line className="cursor-pointer"
                                            color="white"
                                            size={30}
                                            onClick={(e) => { handleRemoveCollaborator(colaborador) }}
                                        />
                                    </div>
                                );
                            })
                        }
                    </div>
                </div> {/* FIN columna 2 */}

                <div className="flex flex-col gap-4 w-full sm:w-1/3"> {/* INICIO columna 3 */}
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-normal">Sugerencias</p>
                        <a className="w-max self-center active:bg-purple-800 text-white font-semibold
                            hover:shadow-md shadow text-md px-5 py-2 rounded-full outline outline-1 sm:mr-2 mb-1 ease-linear transition-all duration-150"
                            href='/createCurso#'>
                            Ver Progreso del Curso
                        </a>
                    </div>
                    <div className="flex flex-col overflow-y-scroll scroll-smooth px-5 py-3 h-[500px] max-h-[500px] border border-white rounded-xl gap-y-4">
                        {
                            sugerencias.map((sugerencia) => {
                                return(
                                    <div key={sugerencia.id} className="flex w-full py-4 px-6 bg-green-500 rounded-full justify-between items-center hover:shadow-xl">
                                        <p>{sugerencia.nombre}</p>
                                        <div className="flex gap-3">
                                            <RxCross1 className="cursor-pointer"
                                                color="white"
                                                size={30}
                                            />
                                            <VscCheck className="cursor-pointer"
                                                color="white"
                                                size={30}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div> {/* FIN columna 3 */}
            </div>

            <div className="flex justify-center w-full mt-6">
                <button className="w-max bg-[#780EFF] active:bg-purple-800 text-white font-semibold hover:shadow-md shadow text-lg px-6 py-4 rounded-full sm:mr-2 mb-1 ease-linear transition-all duration-150">
                    Guardar Cambios
                </button>
            </div>
        </div>
      </div>
    </>
  );
}
