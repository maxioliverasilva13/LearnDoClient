import Image from "next/image";
import Link from "next/link";
import appRoutes from "routes/appRoutes";

const SeminarioItem = ({ imagen, nombre, id }) => {
  return (
    
    <div className="w-full">

    <Link href={appRoutes.seminarioPage(id)}>
    <div className="md:min-w-[500px] md:w-[500px] min-w-[100%] w-[100%] transition-all transform hover:scale-110 h-auto overflow-hidden flex flex-col items-start justify-center relative gap-y-4">
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
    </Link>
    </div>
  );
};

export default SeminarioItem;
