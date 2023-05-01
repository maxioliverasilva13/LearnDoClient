import SeminarioItem from "./SeminarioItem/SeminarioItem";

const SeminarioGroup = ({ title = "Seminarios", seminarios }) => {
  return (
    <div className="w-full h-auto flex flex-col items-start justify-start">
      <div className="w-full mb-6 h-auto flex items-center justify-between">
        <span className="text-[36px] pl-2 border-l-4 border-[#780EFF] leading-8 font-medium text-white">
          {title}
        </span>
      </div>
      <div className="w-full h-auto flex flex-col items-start justify-start gap-y-10">
        {seminarios?.map((item, index) => {
          return <SeminarioItem {...item} key={`seminario-${index}-${item?.nombre}`} />;
        })}
      </div>
    </div>
  );
};

export default SeminarioGroup;
