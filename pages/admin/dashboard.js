import React from "react";
import CardLineChart from "components/Cards/CardLineChart.js";
import CardDashboardItem from "components/Cards/CardDashboardItem";
import Link from "next/link";
import { useGetCompradosOwnerQuery } from "store/services/EventoService";
import { useState, useEffect } from "react";
import { array } from "prop-types";
import { data } from "autoprefixer";

function ObtenerAlumnos() {
  const { data } = useGetCompradosOwnerQuery();
  return data;
}

export default function Dashboard() {
  const Alumnos = ObtenerAlumnos();
  const [nombreTabla, setNombreTabla] = useState("Alumnos Nuevos");
  const { format, subMonths } = require("date-fns");
  const currentDate = new Date();
  const months = [];
  const [Data, setData] = useState();
  const [prueba, setPrueba] = useState();
  const [tipoTabla, setTipoTabla] = useState("Alumnos");

  useEffect(() => {
    setData(prueba);
    console.log(prueba);
  }, [prueba]);

  for (let i = 0; i < 7; i++) {
    const month = subMonths(currentDate, i);
    const formattedMonth = format(month, "MMMM yyyy");
    months.push(formattedMonth);
  }

  const handleSetAlumnos = () => {
    setTipoTabla("Alumnos");
    setPrueba(Alumnos?.NuevosAlumnos);
    console.log("Nuevos :,(");
  };

  const handleSetGanancias = () => {
    setTipoTabla("Ganancias");
    setPrueba(Alumnos?.Ganancias);
    console.log("Ganancias:,(");
  };

  const handleSetVendidos = () => {
    setTipoTabla("Ventas");
    setPrueba(Alumnos?.CantidadVentas);
    console.log("Ventas :,(");
  };

  const handleRenderTable = () => {
    if (tipoTabla == "Alumnos") {
      return (
        <CardLineChart
          title={nombreTabla}
          month={months}
          data={Alumnos.NuevosAlumnos}
        />
      );
    }
    if (tipoTabla == "Ganancias") {
      return (
        <CardLineChart
          title={nombreTabla}
          month={months}
          data={Alumnos.Ganancias}
        />
      );
    }
    if (tipoTabla == "Ventas") {
      return (
        <CardLineChart
          title={nombreTabla}
          month={months}
          data={Alumnos.CantidadVentas}
        />
      );
    }
  };

  return (
    <>
      <div className="w-full py-8 md:px-10 px-0 justify-start">
        <div className="w-full h-auto flex flex-col items-center justify-center pt-5 gap-y-10">
          <h2 className="self-start text-white text-5xl font-semibold">
            Dashboard
          </h2>
          <div className="w-full flex flex-wrap justify-around items-between gap-8">
            <div onClick={handleSetAlumnos} className="cursor-pointer">
              <CardDashboardItem
                title="Alumnos Nuevos"
                data={Alumnos?.NuevosAlumnos[0]}
              />
            </div>
            <div onClick={handleSetGanancias}>
              <CardDashboardItem
                title="Ganancias del Mes"
                data={Alumnos?.Ganancias[0]}
              />
            </div>
            <div onClick={handleSetVendidos}>
              <CardDashboardItem
                title="Cursos Vendidos este mes"
                data={Alumnos?.CantidadVentas[0]}
              />
            </div>
            <div>
              <CardDashboardItem
                title="Alumnos Totales"
                data={Alumnos?.AlumnosTotales}
                clickable={false}
              />
            </div>
          </div>
          <div className="w-full xl:w-3/4 mb-12 xl:mb-0 px-4">
            {Alumnos ? (
              handleRenderTable()
            ) : (
              <p className="text-white">Cargando...</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
