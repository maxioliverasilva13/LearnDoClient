import useGlobalSlice from "hooks/useGlobalSlice";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import { useGetSeminariosPresencialesQuery } from "store/services/EventoService";
import { generateNewMarkerWithCustomHtml, initMap } from "utils/mapbox";

let alreadyAddedMarkers = false;
const MapaSeminarios = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const { data, isLoading } = useGetSeminariosPresencialesQuery();
  const { handleSetLoading } = useGlobalSlice();
  console.log("data is", data)

  useEffect(() => {
    handleSetLoading(isLoading);
  }, [isLoading]);

  const seminarios = data?.seminarios || [];

  useEffect(() => {
    if (isLoading) return;
    if (map.current) return; // initialize map only once
    map?.current?.resize();
    if (!mapContainer.current) return;
    map.current = initMap(
      mapContainer.current,
      [-100.31019063199852, 25.66901932031443]
    );
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });
    map.current.addControl(geolocate);

    return () => {
      map.current = null;
      mapContainer.current = null;
    };
  }, [mapContainer.current, isLoading]);

  useEffect(() => {
    if (
      map.current !== null &&
      map.current !== undefined &&
      alreadyAddedMarkers === false &&
      seminarios?.length > 0
    ) {
      alreadyAddedMarkers = true;
      seminarios?.forEach((item) => {
        generateNewMarkerWithCustomHtml({
          lat: item?.latitud,
          lng: item?.longitud,
          map: map.current,
          html: `
            <div class="w-[200px] h-auto rounded-[20px] gap-y-[4px] flex flex-col">
                <div class="w-full flex flex-row items-center justify-start gap-2">
                <img src="${item?.imagen}" class="w-full h-[60px] object-cover rounded-lg shadow-md border border-black" />
                </div>
            <span class="text-gray-800 max-w-full truncate font-semibold text-[16px]">${item?.nombre}</span>
            <span class="text-gray-800 font-semibold text-[14px]">Fecha: ${item?.fecha}</span>
            <span class="text-gray-800 font-semibold text-[14px]">Hora: ${item?.hora}</span>
            <span class="text-gray-800 font-semibold text-[14px]">Duracion: ${item?.duracion}</span>

            </div>`,
        });
      });
    }
  }, [map.current]);

  return (
    <div className="w-full h-full relative">
      <div className="w-full h-[340px] absolute">
        <div className="w-full h-full relative">
        <img
          src="https://concepto.de/wp-content/uploads/2020/10/seminario-e1603162873945.jpg"
          className="w-full h-full z-[3] object-cover"
        />
        <div className="absolute bg-black bg-opacity-50 bgFilter top-0 left-0 w-full h-full">

        </div>
        </div>
        
      </div>
      <div className="w-full h-full z-30 flex flex-col items-center justify-center px-10 py-5">
      <h1 className="text-white font-bold z-[30] mb-[30px] text-[30px]">
          Mapa Seminarios Presenciales
        </h1>
        <div className="w-full h-full flex-grow rounded-lg overflow-hidden relative">
          <div className="w-full h-full" ref={mapContainer}></div>
        </div>
      </div>
    </div>
  );
};

export default MapaSeminarios;
