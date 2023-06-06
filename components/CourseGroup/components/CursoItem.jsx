import Image from "next/image";
import Link from "next/link";
import appRoutes from "routes/appRoutes";


const CursoItem = ({imagen, nombre, id}) => {
    return <Link href={appRoutes.cursoPage(id)}> 
    <div className="w-auto transition-all transform hover:scale-110 h-auto overflow-hidden flex flex-col items-start justify-center gap-y-4">
        <div className="w-[220px] relative h-[320px] overflow-hidden rounded-[12px] shadow-md">
        <div className="w-full h-full absolute cursoOverlay z-[2]" />
        <Image 
            src={imagen}
            loader={() => imagen}
            layout="fill"
            objectFit="cover"
            className="z-[1]"
        />
        </div>
        <p className="text-left w-full text-white max-w-full truncate">{nombre}</p>
    </div>
    </Link>
}

export default CursoItem;