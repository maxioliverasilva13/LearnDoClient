import Image from "next/image";

const SwiperCurso = ({imagen, nombre, clases, mainCategoria}) => {
    return  (
    <div className="w-full h-full max-w-full max-h-full rounded-[12px] overflow-hidden relative">
        <Image
            src={imagen}
            loader={() => imagen}
            className="z-[1]"
            layout="fill"
            objectFit="cover"
        />
        <div className="w-full h-full absolute z-[2] cursoBGOverlay"/>
        <div className="w-full h-full z-[3] relative flex flex-col items-start p-10 justify-end ">
            <div className="font-normal md:text-base text-sm my-2 text-white px-4 py-1 rounded-md bg-[#31174A]">
                {mainCategoria}
            </div>
            <p className="text-white font-medium md:text-[48px] text-[32px] leading-[45px]">{nombre}</p>
            <p className="text-white md:text-base text-sm">{clases} Clases</p>
            <div className="font-medium mt-6 leading-4 md:text-base text-sm text-white px-2 py-3 rounded-[30px] bg-[#780EFF]">
                Mas informacion
            </div>
        </div>
    </div>
)
}

export default SwiperCurso;