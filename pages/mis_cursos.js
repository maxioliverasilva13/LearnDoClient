import React, { useState, Fragment } from "react";

import Navbar from "components/Navbars/AdminNavbar.js";
import Modal from "../components/Modal/modal"

import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import StarRating from "components/Rating/star";

export default function MisCursos() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Fragment>
                <Navbar />
                <main className="miscursos_page w-full h-full flex flex-col items-center">
                    <div className="h-[286px] w-[1425px] flex flex-col justify-center mb-8">
                        <a className="ml-[44px] text-5xl text-white">Mis Cursos</a>
                    </div>
                    <div className="h-[286px] w-[1425px] flex flex-row justify-start items-center rounded-[12px] mb-8 px-8" style={{ backgroundColor: '#780EFF' }}>
                        <div className="h-[195px] w-[283px] bg-black rounded-[8px]">
                            <img></img>
                        </div>
                        <div className="w-[283px] w-full h-[195px] flex flex-col justify-start items-baseline">
                            <div className="flex flex-row">
                                <div class="ml-[44px] w-[473px] rounded-full h-2.5 dark:bg-gray-700 border-[1px] mt-2">
                                    <div class="bg-white h-2.5 w-[300px] rounded-l-full"></div>
                                </div>
                                <a className="text-white ml-1">80%</a>
                            </div>
                            <div className="flex flex-col mt-8">
                                <a className="ml-[44px] text-2xl text-white mb-4">Nombre del curso</a>
                                <a className="ml-[44px] text-base text-white w-[473px]">Descubre como generer riqueza
                                    en este curso corto, donde hablaremos de teoria economica y otros temas</a>
                            </div>
                        </div>
                    </div>
                    <div className="h-[286px] w-[1425px] flex flex-row justify-start items-center rounded-[12px] mb-8 py-4 px-8" style={{ backgroundColor: '#780EFF' }}>
                        <div className="h-[195px] w-[283px] bg-black rounded-[8px]">
                            <img></img>
                        </div>
                        <div className="w-[283px] w-full h-[195px] flex flex-col justify-start items-baseline">
                            <div className="flex flex-row">
                                <div class="ml-[44px] w-[473px] rounded-full h-2.5 dark:bg-gray-700 border-[1px] mt-2">
                                    <div class="bg-white h-2.5 w-[300px] rounded-l-full"></div>
                                </div>
                                <a className="text-white ml-1">80%</a>
                            </div>
                            <div className="flex flex-col mt-8">
                                <a className="ml-[44px] text-2xl text-white mb-4">Nombre del curso</a>
                                <a className="ml-[44px] text-base text-white w-[473px]">Descubre como generer riqueza
                                    en este curso corto, donde hablaremos de teoria economica y otros temas</a>
                            </div>
                        </div>
                    </div>
                    <div className="h-[286px] w-[1425px] flex flex-row justify-start items-center rounded-[12px] mb-8 px-8" style={{ backgroundColor: '#780EFF' }}>
                        <div className="h-[195px] w-[283px] bg-black rounded-[8px]">
                            <img></img>
                        </div>
                        <div className="w-[283px] w-full h-[195px] flex flex-col justify-start items-baseline">
                            <div className="flex flex-row">
                                <div class="ml-[44px] w-[473px] rounded-full h-2.5 dark:bg-gray-700 border-[1px] mt-2">
                                    <div class="bg-white h-2.5 w-[300px] rounded-l-full"></div>
                                </div>
                                <a className="text-white ml-1">80%</a>
                            </div>
                            <div className="flex flex-col items-between mt-8">
                                <a className="ml-[44px] text-2xl text-white mb-4">Nombre del curso</a>
                                <a className="ml-[44px] text-base text-white w-[473px]">Descubre como generer riqueza
                                    en este curso corto, donde hablaremos de teoria economica y otros temas</a>
                            </div>
                        </div>
                    </div>
                    <button className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium text-sm rounded-lg px-5 py-2.5 text-center mr-5" onClick={() => setShowModal(true)}>
                        Ñañaña
                    </button>
                    <Modal isVisible={showModal} onClose={() => setShowModal(false)} className="flex flex-row justify-center">

                        <a className="text-2xl text-white">¿Que te parece este curso?</a>
                        <div className="flex flex-row mt-8 mb-8">
                            <StarRating></StarRating>
                        </div>
                        <button className="h-10 w-32 mb-8 rounded-full text-white" style={{ backgroundColor: '#780EFF' }} onClick={() => setShowModal(false)} onClose={() => setShowModal(false)}>Aceptar</button>

                    </Modal>
                </main>
            </Fragment>
        </>
    );
}
