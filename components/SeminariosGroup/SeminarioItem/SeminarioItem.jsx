import Image from "next/image";

const SeminarioItem = ({ imagen, nombre }) => {
  return (
    <div className="min-w-[500px] w-[500px] transition-all transform hover:scale-110 h-auto overflow-hidden flex flex-col items-start justify-center relative gap-y-4">
      <div className="w-full relative h-[270px] overflow-hidden rounded-[12px] gap-y-5 shadow-md">
        <div className="w-full h-full absolute cursoOverlay z-[2] " />
        <Image
          src={imagen}
          loader={() => imagen}
          layout="fill"
          objectFit="cover"
          className="z-[1]"
        />
      </div>
      <p className="text-left w-full text-white max-w-full truncate">
        {nombre}
      </p>
    </div>
  );
};

export default SeminarioItem;
