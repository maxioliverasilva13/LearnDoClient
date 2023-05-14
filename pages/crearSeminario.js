import clsx from "clsx";
import CheckBox from "components/Checkbox/Checkbox";
import InputText from "components/InputText/InputText";
import Alert from "components/Popups/Alert";
import SelectLocationModal from "components/SelectLocationModal/SelectLocationModal";
import useForm from "hooks/useForm";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BiImageAdd } from "react-icons/bi";
import { scrollTop } from "utils/pageUtils";

const CrearSeminario = () => {
  const { formValues, handleChangeValue } = useForm({
    imagen: "",
    nombre: "",
    descripcion: "",
    precio: 0,
    fecha: "",
    hora: "",
    link: "",
    capacidad: 0,
    ubicacion: {
      lat: 0,
      lng: 0,
    },
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [checkedGratis, setCheckedGratis] = useState(false);
  const [checkedOnline, setCheckedOnline] = useState(false);
  const [openSelectLocation, setOpenSelectLocation] = useState(false);
  const [error, setError] = useState(null);

  const hasPreviewImage = previewImage !== null;

  const handleChangeImage = (e) => {
    const firstFile = e?.target?.files[0];
    if (firstFile) {
      const newSrc = URL.createObjectURL(firstFile);
      setPreviewImage(newSrc);
    }
  };

  useEffect(() => {
      if (previewImage) {
        handleChangeValue("imagen", previewImage)
      }
  }, [previewImage])

  const handleChangeLatLng = (cordenates) => {
    handleChangeValue("ubicacion", {
      lat: cordenates?.lat,
      lng: cordenates?.lng,
    });
  };

  useEffect(() => {
    if (error) {
      scrollTop();
    }
  }, [error]);

  const getValidationError = (value) => {
    if (error?.validated) {
      return (
        error?.validated[value] !== null && error?.validated[value] === true
      );
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();

    // checking errors
    if (checkedOnline) {
      if (
        !formValues?.imagen ||
        !formValues?.nombre ||
        !formValues?.descripcion ||
        !formValues?.fecha ||
        !formValues?.hora ||
        !formValues?.link ||
        (!checkedGratis &&
          (formValues?.precio === 0 || formValues?.capacidad === 0))
      ) {
        setError({
          type: "required",
          message: "Completa los campos requeridos",
          validated: {
            imagen: !formValues?.imagen,
            nombre: !formValues?.nombre,
            descripcion: !formValues?.descripcion,
            fecha: !formValues?.fecha,
            hora: !formValues?.hora,
            link: !formValues?.link,
            precio:
              !checkedGratis &&
              (formValues?.precio === 0 || formValues?.capacidad === 0),
            capacidad: !formValues?.capacidad || formValues?.capacidad === 0,
          },
        });
        return;
      }
    } else {
      if (
        !formValues?.imagen ||
        !formValues?.nombre ||
        !formValues?.descripcion ||
        !formValues?.fecha ||
        !formValues?.hora ||
        !formValues?.precio ||
        (!checkedGratis &&
          (formValues?.precio === 0 || formValues?.capacidad === 0)) ||
        formValues?.ubicacion?.lat === 0 ||
        formValues?.ubicacion?.lng === 0
      ) {
        setError({
          type: "required",
          message: "Completa los campos requeridos",
          validated: {
            imagen: !formValues?.imagen,
            nombre: !formValues?.nombre,
            descripcion: !formValues?.descripcion,
            fecha: !formValues?.fecha,
            hora: !formValues?.hora,
            precio:
              !checkedGratis &&
              (formValues?.precio === 0 || formValues?.capacidad === 0),
            capacidad: !formValues?.capacidad || formValues?.capacidad === 0,
            lat: formValues?.ubicacion?.lat === 0,
            lng: formValues?.ubicacion?.lng === 0,
          },
        });
        return;
      }
    }
    setError(null);

    const prepareData = {
      ...formValues,
      isOnline: checkedOnline,
      isGratis: checkedGratis,
    }
    console.log("prepareData", prepareData)
  };

  return (
    <div className="w-full h-auto md:pt-10 flex flex-col items-center justify-start">
      <Alert
        text={error?.message}
        color="bg-red-500"
        show={error !== null}
        important={true}
        icon={<i className="fas fa-bell" />}
      />

      <p className="w-full text-center text-white text-[32px] font-bold">
        Agergar Seminario
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-[320px] pb-[40px] h-auto flex flex-col items-center gap-y-4 justify-start"
      >
        <label
          htmlFor="inputFile"
          className={clsx(
            `w-full shadow-md overflow-hidden relative cursor-pointer flex items-center justify-center mt-[20px] h-[165px] mb-[30px] rounded-lg`,
            !hasPreviewImage ? "border-2 border-dashed" : "",
            getValidationError("imagen") ? "border-red-500" : "border-white"
          )}
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

        <InputText
          hasError={getValidationError("nombre")}
          value={formValues?.nombre}
          onChange={(e) => handleChangeValue("nombre", e?.target?.value)}
          placeholder="Agregar Nombre"
        />
        <InputText
          hasError={getValidationError("descripcion")}
          onChange={(e) => handleChangeValue("descripcion", e?.target?.value)}
          value={formValues?.descripcion}
          placeholder="Descripcion"
          type="textarea"
        />

        <div className="w-full flex h-[40px] items-center justify-start gap-4">
          <CheckBox setValue={setCheckedGratis} label="Gratis" />
          {!checkedGratis && (
            <InputText
              hasError={getValidationError("precio")}
              onChange={(e) => handleChangeValue("precio", e?.target?.value)}
              value={formValues?.precio}
              placeholder="Precio"
              type="number"
            />
          )}
        </div>

        <div className="w-full flex h-[40px] items-center justify-start gap-4">
          <InputText
            hasError={getValidationError("fecha")}
            onChange={(e) => handleChangeValue("fecha", e?.target?.value)}
            value={formValues?.fecha}
            placeholder="Fecha"
          />
          <InputText
            hasError={getValidationError("hora")}
            onChange={(e) => handleChangeValue("hora", e?.target?.value)}
            value={formValues?.hora}
            placeholder="Hora"
          />
        </div>

        <div className="w-full flex h-[40px] items-center justify-start gap-4">
          <CheckBox setValue={setCheckedOnline} label="Online" />
          {checkedOnline && (
            <InputText
              hasError={getValidationError("link")}
              onChange={(e) => handleChangeValue("link", e?.target?.value)}
              value={formValues?.link}
              placeholder="Link"
            />
          )}
        </div>
        <InputText
          hasError={getValidationError("capacidad")}
          value={formValues?.capacidad}
          onChange={(e) => handleChangeValue("capacidad", e?.target?.value)}
          className="appearsAnimation w-full text-white outline-none placeholder-white px-4 py-2 h-[40px] bg-transparent rounded-full border border-white"
          placeholder="Capacidad"
          type="number"
        />
        {!checkedOnline && (
          <button
            onClick={() => setOpenSelectLocation(true)}
            type="button"
            className={clsx(
              "appearsAnimation w-full text-white outline-none placeholder-white px-4 py-3 bg-transparent rounded-full border ",
              getValidationError("lat") || getValidationError("lng")
                ? "border-red-500"
                : "border-white"
            )}
          >
            Seleccionar Ubicacion
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-4 text-white rounded-full font-semibold bg-[#780EFF]"
        >
          Guardar
        </button>
      </form>

      {openSelectLocation && (
        <SelectLocationModal
          setLatLng={handleChangeLatLng}
          open={openSelectLocation}
          setOpen={(val) => setOpenSelectLocation(val)}
        />
      )}
    </div>
  );
};

export default CrearSeminario;
