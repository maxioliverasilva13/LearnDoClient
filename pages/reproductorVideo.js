import React from "react";
import ReactPlayer from "react-player";
import Navbar from "components/Navbars/AdminNavbar.js";

function videoPlayer() {
    return (
        <>
            <Navbar />
            <main className="videoPlayer w-full h-auto flex flex-col items-center">
                <div className="h-[853px] w-[1425px] flex flex-col justify-start mb-7 mt-4">
                    <a className="ml-[44px] text-4xl text-white">Clase 1: titulo de la clase</a>
                    <div className="h-full w-full mt-4">
                        <ReactPlayer
                            url={''}
                            controls
                            className="h-full w-full"></ReactPlayer>
                    </div>
                </div>
            </main>
        </>
    );
}

export default function App() {
    return videoPlayer();
}