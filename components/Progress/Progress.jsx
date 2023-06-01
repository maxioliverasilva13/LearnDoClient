import clsx from "clsx";

const Progress = ({ porcentage = 0, color }) => {
    const finalProcentage = porcentage > 100 ? 100 : porcentage;
    const bgColorClass = color ? `bg-[${color}]` : `bg-white` ;
  return (
    <div className={`w-full h-full rounded-full border border-white relative`}>
        <div className={clsx("rounded-full relative h-full ", `w-[${finalProcentage}%]`, `${bgColorClass}`)}>
            <span className="absolute font-semibold text-sm right-0 -top-[25px]">{finalProcentage}%</span>
        </div>
    </div>
  );
};

export default Progress;
