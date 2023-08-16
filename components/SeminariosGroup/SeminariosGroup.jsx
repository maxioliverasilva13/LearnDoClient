import SeminarioItem from "./SeminarioItem/SeminarioItem";

const SeminarioGroup = ({ title = "Seminarios", seminarios, loading }) => {
  return (
    <div className="w-full h-auto flex flex-col items-start justify-start">
      <div className="w-full mb-6 h-auto flex items-center justify-between">
        <span className="text-[36px] pl-2 border-l-4 border-[#78A132] leading-8 font-medium text-white">
          {title}
        </span>
      </div>
      { seminarios.length >= 1 ? (
        <div className="w-full h-auto flex flex-col items-start justify-start gap-y-10">
          {seminarios?.map((item, index) => {
            return <SeminarioItem {...item} key={`seminario-${index}-${item?.nombre}`} />;
          })}
        </div>
      ) : (
        !loading &&
        <p className="text-[30px] my-5 font-normal text-white">Lo sentimos, en éste momento no contamos con seminarios para recomendarte.</p>
      ) }
    </div>
  );
};

export default SeminarioGroup;
