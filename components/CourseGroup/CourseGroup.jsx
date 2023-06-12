import appRoutes from "routes/appRoutes";
import { AiOutlineArrowRight } from "react-icons/ai";
import CursoItem from "./components/CursoItem";
import Link from "next/link";

const CourseGroup = ({ title, cursos, link, loading }) => {
  return (
    <div className="w-full h-auto flex flex-col md:items-start items-center justify-start">
      <div className="w-full mb-6 h-auto flex items-center justify-start">
        <span className="text-[36px] pl-2 border-l-4 border-red-700 leading-8 font-medium text-white">
          {title}
        </span>
      </div>
      { cursos.length >= 1 ? (
        <>
          <div className="w-full grid lg:justify-start justify-center cursosGridTemplate gap-x-8 gap-y-12">
            {cursos?.map((item, index) => {
              return <CursoItem {...item} key={`curso-${index}-${item?.nombre}`} />;
            })}
          </div>
          <Link
            href={link || appRoutes.home()}
          >
            <button className="flex items-center justify-center gap-1  text-[30px] mt-6 font-normal text-white">
              Ver todos los cursos
              <AiOutlineArrowRight className="text-white mt-[4px] font-semibold text-[30px]" />
            </button>
          </Link>
        </>
      ) : (
        !loading &&
        <p className="text-[30px] my-5 font-normal text-white">Lo sentimos, en éste momento no contamos con cursos para recomendarte</p>
      )}
    </div>
  );
};

export default CourseGroup;
