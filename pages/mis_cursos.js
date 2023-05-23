import React, { useState, Fragment } from "react";

import Navbar from "components/Navbars/AdminNavbar.js";
import Modal from "../components/Modal/modal"

import { BsDownload } from 'react-icons/bs';
import StarRating from "components/Rating/star";

import { Tooltip } from 'react-tooltip'

import 'react-tooltip/dist/react-tooltip.css'

const BarraDeCarga = ({ porcentajeCarga, ancho, colorFondo }) => {
    return (
        <div className="flex flex-row h-auto w-auto">
            <div class="ml-11 rounded-full h-2.5 dark:bg-gray-700 border-[1px] border-white mt-2" style={{ width: `${ancho}%` }}>
                <div class="h-full rounded-l-full" style={{ width: `${porcentajeCarga}%` ,backgroundColor:`${colorFondo}` }}></div>
            </div>
            <a className="text-white ml-1">{porcentajeCarga}%</a>
        </div>
    );
}

const Tarjeta = ({ imagenCurso, nombreCurso, descripcionCurso, porcentajeCurso, certificadoCurso }) => {
    return (
        <div className="h-72 w-4/5 flex flex-row justify-start items-center rounded-[12px] mb-8 px-8" style={{ backgroundColor: '#780EFF' }}>
            <div className="h-48 w-80 bg-black rounded-md">
                <img>{imagenCurso}</img>
            </div>
            <div className="w-full h-40 flex flex-col justify-start">
                    <BarraDeCarga porcentajeCarga={porcentajeCurso} ancho={40} colorFondo={'white'}></BarraDeCarga>
                <div className="flex flex-col mt-8">
                    <a className="ml-11 text-2xl text-white mb-4">{nombreCurso}</a>
                    <a className="ml-11 text-base text-white w-[473px]">{descripcionCurso}</a>
                </div>
            </div>
            <div>
                <button
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Descargar Certificado"
                    data-tooltip-place="top"
                >
                    <BsDownload size={30} color="white" ></BsDownload>
                </button>
                <Tooltip id="my-tooltip" clickable />
            </div>
        </div>
    );
};

export default function MisCursos() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <main className="miscursos_page w-full h-full flex flex-col items-center min-h-screen">
                <Navbar />
                <div className="h-72 w-4/5 flex flex-col justify-center mb-8">
                    <a className="ml-20 text-5xl text-white">Mis Cursos</a>
                </div>
                <Tarjeta nombreCurso={"lalala"} descripcionCurso={"jasdfj"} porcentajeCurso={"10"}></Tarjeta>
                <Tarjeta nombreCurso={"lalala"} descripcionCurso={"jasdfj"} porcentajeCurso={"20"}></Tarjeta>
                <Tarjeta nombreCurso={"lalala"} descripcionCurso={"jasdfj"} porcentajeCurso={"30"}></Tarjeta>
                <Tarjeta nombreCurso={"lalala"} descripcionCurso={"jasdfj"} porcentajeCurso={"40"}></Tarjeta>

                <button className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium text-sm rounded-lg px-5 py-2.5 text-center mr-5" onClick={() => setShowModal(true)}>
                    Ñañaña
                </button>
                <Modal isVisible={showModal} onClose={() => setShowModal(false)} className="flex flex-row justify-center" alto={26} ancho={31}>
                    <a className="text-2xl text-white">¿Que te parece este curso?</a>
                    <div className="flex flex-row mt-8 mb-8">
                        <StarRating></StarRating>
                    </div>
                    <button className="h-10 w-32 mb-8 rounded-full text-white" style={{ backgroundColor: '#780EFF' }} onClick={() => setShowModal(false)} onClose={() => setShowModal(false)}>Aceptar</button>
                </Modal>
            </main>

        </>
    );
}
