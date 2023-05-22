import clsx from "clsx";

const Progress = ({ porcentage = 0}) => {
    const finalProcentage = porcentage > 100 ? 100 : porcentage;

  return (
    <div className="w-full h-full rounded-full border border-white relative">
        <div className={clsx("rounded-full relative h-full bg-white", `w-[${finalProcentage}%]`)}>
            <span className="absolute font-semibold text-sm right-0 -top-[25px]">{finalProcentage}%</span>
        </div>
    </div>
  );
};

export default Progress;
