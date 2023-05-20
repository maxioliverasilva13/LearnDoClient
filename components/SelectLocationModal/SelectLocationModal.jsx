import clsx from "clsx";
import mapboxgl, { Marker } from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { generateNewMarker, initMap } from "utils/mapbox";
let defaultMarker = null;

const SelectLocationModal = ({ setOpen, open, setLatLng }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map?.current?.resize();
    if (!mapContainer.current) return;
    map.current = initMap(
      mapContainer.current,
      [-100.31019063199852, 25.66901932031443]
    );

    map.current &&
      map.current.on("load", (event) => {
        map?.current?.resize();
        if (defaultMarker) {
          const currentOffset = defaultMarker?.getLngLat();
          generateNewMarker({
            map: map.current,
            lat: currentOffset?.lat,
            lng: currentOffset?.lng,
          });
        }
        const geolocate = new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        });
        map.current.addControl(geolocate);
        geolocate.on("geolocate", () => {});
      });

    return () => {
      if (defaultMarker) {
        const currentOffset = defaultMarker?.getLngLat();
        setLatLng({
          ...currentOffset,
        });
      }
      map.current = null;
      mapContainer.current = null;
    };
  }, [mapContainer.current, open]);

  useEffect(() => {
    map.current &&
      map.current.on("dblclick", ({ lngLat }) => {
        if (!defaultMarker) {
          const newMarker = generateNewMarker({
            map: map.current,
            ...lngLat,
          });
          newMarker.on("dragend", (event) => {
            defaultMarker = event?.target;
          });
          defaultMarker = newMarker;
        }
      });

    return () => {
      map.current?.off("click");
    };
  }, [map.current, defaultMarker]);

  const handleClose = () => {
    setOpen && setOpen(false);
  };

  if (!open) {
    return null;
  }

  return (
    <div
      className={clsx(
        "appearsAnimation w-full h-full flex items-center justify-center inset-0 z-[50] fixed bg-black bg-opacity-50 ",
        !open && "hidden"
      )}
    >
      <div className="md:w-[700px] relative bg-white bg-opacity-100 w-[85%] h-auto flex flex-col items-center justify-start p-4 rounded-lg shadow-md">
        <IoMdClose
          onClick={handleClose}
          size={30}
          color="black"
          className="absolute right-2 top-2 cursor-pointer text-black"
        />
        <p className="my-[40px] text-[24px] font-semibold text-gray-950">
          Seleccionar Ubicacion
        </p>

        <div
          ref={mapContainer}
          className="rounded-lg overflow-hidden w-full h-[550px] "
        ></div>
      </div>
    </div>
  );
};

export default SelectLocationModal;
