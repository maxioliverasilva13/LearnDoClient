import clsx from "clsx";
import { BsFillStarFill } from "react-icons/bs";

const Stars = ({
  stars,
  size = 20,
  needsCount = true,
  justifyStart = false,
  countStars,
}) => {
  return (
    <div
      className={clsx(
        "w-full h-auto flex flex-row gap-1 items-end justify-end",
        justifyStart ? "justify-start" : "justify-center"
      )}
    >
      {Array.from(Array(5).keys()).map((value, index) => {
        const isChecked = value < stars;
        return (
          <BsFillStarFill
            key={index}
            className={clsx(
              `mr-1 text-[${size}px]`,
              isChecked ? "text-yellow-500" : "text-white"
            )}
          />
        );
      })}
      {needsCount && <span className="text-white">({countStars})</span>}
    </div>
  );
};

export default Stars;
