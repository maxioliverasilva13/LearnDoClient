import appRoutes from "routes/appRoutes";
import { AiOutlineArrowRight } from "react-icons/ai";
import CursoItem from "./components/CursoItem";

const CourseGroup = ({ title, cursos, link }) => {
  return (
    <div className="w-full h-auto flex flex-col items-start justify-start">
      <div className="w-full mb-6 h-auto flex items-center justify-start">
        <span className="text-[36px] pl-2 border-l-4 border-[#780EFF] leading-8 font-medium text-white">
          {title}
        </span>
      </div>
      <div className="w-full grid  cursosGridTemplate gap-x-8 gap-y-12">
        {cursos?.map((item, index) => {
          return <CursoItem {...item} key={`curso-${index}-${item?.nombre}`} />;
        })}
      </div>
      <a
          href={link || appRoutes.home()}
          className="flex items-center justify-center gap-1  text-[30px] mt-6 font-normal text-white"
        >
          Ver todos los cursos{" "}
          <AiOutlineArrowRight className="text-white mt-[4px] font-semibold text-[30px]" />
        </a>
    </div>
  );
};

export default CourseGroup;
