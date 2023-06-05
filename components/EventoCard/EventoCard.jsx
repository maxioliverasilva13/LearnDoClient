import clsx from "clsx";
import GlobalImage from "components/GlobalImage/GlobalImage";
import Link from "next/link";
import {
  fomratColorCurso,
  formatTitle,
  handleRedirectByTipo,
} from "utils/evento";

const EventoCard = ({ curso, index }) => {
  return (
    <Link href={handleRedirectByTipo(curso.tipo, curso?.id)} key={index}>
      <div
        className="max-w-[250px] transition-all transform hover:scale-105 cursor-pointer min-h-[350px]"
        key={curso.id}
      >
        <div
          className="w-[250px] h-[300px] relative rounded-lg overflow-hidden shadow-md"
          key={curso.id}
        >
          <div
            className={clsx(
              "w-min  absolute z-[20] left-0 top-4 px-4 py-1 font-semibold text-white max-w-full truncate rounded-r-md ",
              `bg-[${fomratColorCurso(curso?.tipo)}]`
            )}
          >
            {formatTitle(curso?.tipo)}
          </div>
          <GlobalImage
            src={curso?.imagen}
            loader={() => curso?.imagen}
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute bottom-0 left-0 w-full z-20 bg-black bg-opacity-50 p-4 flex flex-row items-center justify-between">
            <p className="text-xl text-left text-white flex-grow font-medium max-w-full overflow-hidden truncate mt-2">{curso.nombre}</p>
            <span className="text-[20px] max-w-full w-auto truncate overflow-hidden text-yellow-500">${curso?.precio}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventoCard;
