import CheckBox from "components/Checkbox/Checkbox";
import useForm from "hooks/useForm";
import Image from "next/image";
import { useState } from "react";
import { BiImageAdd } from "react-icons/bi";

const CrearSeminario = () => {
  const { formValues, handleChangeValue } = useForm({
    imagen: "",
    nombre: "",
    descripcion: "",
    gratis: false,
    precio: 0,
    fecha: "",
    hora: "",
    online: false,
    link: "",
    capacidad: "",
    ubicacion: {
      lat: 0,
      lng: 0,
    },
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [checkedGratis, setCheckedGratis] = useState(false);
  const [checkedOnline, setCheckedOnline] = useState(false);

  const hasPreviewImage = previewImage !== null;

  const handleChangeImage = (e) => {
    const firstFile = e?.target?.files[0];
    if (firstFile) {
      const newSrc = URL.createObjectURL(firstFile);
      console.log(newSrc);
      setPreviewImage(newSrc);
    }
  };

  return (
    <div className="w-full h-auto md:pt-10 flex flex-col items-center justify-start">
      <p className="w-full text-center text-white text-[32px] font-bold">
        Agergar Seminario
      </p>

      <form className="w-[320px] pb-[40px] h-auto flex flex-col items-center gap-y-4 justify-start">
        <label
          for="inputFile"
          className={`w-full shadow-md overflow-hidden relative cursor-pointer flex items-center justify-center mt-[20px] h-[165px] mb-[30px] rounded-lg ${
            !hasPreviewImage ? "border-2 border-dashed border-white" : ""
          }`}
        >
          {!previewImage && (
            <span className="text-white flex items-center font-semibold">
              <BiImageAdd size={20} color="white" className="mr-1" /> Add or
              Drop Image
            </span>
          )}
          {previewImage && (
            <Image
              src={previewImage}
              loader={() => previewImage}
              layout="fill"
              objectFit="cover"
            />
          )}
        </label>
        <input
          accept="image/png, image/gif, image/jpeg"
          onChange={handleChangeImage}
          type="file"
          className="sr-only"
          id="inputFile"
          name="inputFile"
        />

        <input
          value={formValues?.nombre}
          onChange={(e) => handleChangeValue("nombre", e?.target?.value)}
          className="w-full text-white outline-none placeholder-white px-4 py-2 h-[40px] bg-transparent rounded-full border border-white"
          placeholder="Agregar Nombre"
        />
        <textarea
          onChange={(e) => handleChangeValue("descripcion", e?.target?.value)}
          value={formValues?.descripcion}
          className="w-full text-white outline-none placeholder-white px-4 py-2 h-[120px] bg-transparent rounded-lg border border-white"
          placeholder="Descripcion"
        />

        <div className="w-full flex h-[40px] items-center justify-start gap-4">
          <CheckBox setValue={setCheckedGratis} label="Gratis" />
          {!checkedGratis && (
            <input
              onChange={(e) => handleChangeValue("precio", e?.target?.value)}
              value={formValues?.precio}
              className="appearsAnimation w-full text-white outline-none placeholder-white px-4 py-2 h-[40px] bg-transparent rounded-full border border-white"
              placeholder="Precio"
            />
          )}
        </div>

        <div className="w-full flex h-[40px] items-center justify-start gap-4">
          <input
            onChange={(e) => handleChangeValue("fecha", e?.target?.value)}
            value={formValues?.fecha}
            className="appearsAnimation w-full flex-grow flex text-white outline-none placeholder-white px-4 py-2 h-[40px] bg-transparent rounded-full border border-white"
            placeholder="Fecha"
          />
          <input
            onChange={(e) => handleChangeValue("hora", e?.target?.value)}
            value={formValues?.hora}
            className="appearsAnimation w-full flex-grow flex text-white outline-none placeholder-white px-4 py-2 h-[40px] bg-transparent rounded-full border border-white"
            placeholder="Hora"
          />
        </div>

        <div className="w-full flex h-[40px] items-center justify-start gap-4">
          <CheckBox setValue={setCheckedOnline} label="Online" />
          {checkedOnline && (
            <input
              onChange={(e) => handleChangeValue("link", e?.target?.value)}
              value={formValues?.link}
              className="appearsAnimation w-full text-white outline-none placeholder-white px-4 py-2 h-[40px] bg-transparent rounded-full border border-white"
              placeholder="Link"
            />
          )}
        </div>
        <input
          value={formValues?.capacidad}
          onChange={(e) => handleChangeValue("capacidad", e?.target?.value)}
          className="appearsAnimation w-full text-white outline-none placeholder-white px-4 py-2 h-[40px] bg-transparent rounded-full border border-white"
          placeholder="Capacidad"
        />
        <button className="appearsAnimation w-full text-white outline-none placeholder-white px-4 py-3 bg-transparent rounded-full border border-white">
          Seleccionar Ubicacion
        </button>

        <button
          type="submit"
          className="px-6 py-4 text-white rounded-full font-semibold bg-[#780EFF]"
        >
          Guardar
        </button>
      </form>
    </div>
  );
};

export default CrearSeminario;
