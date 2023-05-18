import React, { useState } from "react";
import { RxCrossCircled } from 'react-icons/rx';


const Modal = ({ isVisible, onClose, children }) => {
    if (!isVisible) return null;

    const handleClose = (e) => {
        if (e.target.id === "wrapper") onClose();
    }

    return (
        <div className="fixed inset-0 bg-black-800/200 backdrop-blur-sm flex justify-center items-center" id="wrapper" onClick={handleClose}>
            <div className="w-[600px] h-auto bg-gray-900 p-2 rounded-lg flex flex-col">
                <div className="w-full flex justify-end items-start">
                    <button classname="" onClick={() => onClose()}>
                        <RxCrossCircled size={30} color="white">
                        </RxCrossCircled>
                    </button>
                </div>
                <div className="flex flex-col items-center justify-start">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;