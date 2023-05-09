import React from "react";

import CardLineChart from "components/Cards/CardLineChart.js";
import CardDashboardItem from "components/Cards/CardDashboardItem";

export default function Dashboard() {
  return (
    <>
    <div className="w-full py-4 md:px-10 px-4 h-screen overflow-auto max-h-screen justify-start">
        <div className="w-full h-auto flex flex-col items-center justify-center pt-5 gap-y-10">
            <h2 className="self-start text-white text-5xl">Dashboard</h2>
            <div className="w-full flex flex-wrap justify-around items-between gap-8">    
                <CardDashboardItem title="Alumnos Nuevos" data={120} />
                <CardDashboardItem title="Tasa de Finalización" data="70%" />
                <CardDashboardItem title="Cursos Vendidos" data={230} />
                <CardDashboardItem title="Duración prom. de las clases" data="30 min." />
            </div>
            <div className="w-full xl:w-3/4 mb-12 xl:mb-0 px-4">
                <CardLineChart title="Alumnos Nuevos" />
            </div>
        </div>
    </div>
    </>
  );
}