import React, { useState } from "react";
import { RxCrossCircled } from 'react-icons/rx';


const Modal = ({ isVisible, onClose, children, alto = "auto", ancho = "auto" }) => {
    if (!isVisible) return null;

    const handleClose = (e) => {
        if (e.target.id === "wrapper") onClose();
    }

    return (
        <div className="fixed appearsAnimation z-[100] inset-0 bg-black-800/200 backdrop-blur-md flex justify-center items-center" id="wrapper" onClick={handleClose}>
            <div className="bg-gray-900 appearsAnimation p-2 rounded-[20px] flex flex-col" style={{ height: alto, width: ancho  }}>
                <div className="w-full flex justify-end items-start">
                    <button className="" onClick={() => onClose()}>
                        <RxCrossCircled size={30} color="white">
                        </RxCrossCircled>
                    </button>
                </div>
                <div className="h-full w-full flex flex-col items-center justify-start">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;