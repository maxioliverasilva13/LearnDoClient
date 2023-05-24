import clsx from "clsx";

const PuntuacionText = ({ puntuacion }) => {
  const getColor = () => {
    if (puntuacion < 33) {
      return "text-red-500";
    } else if (puntuacion < 66) {
      return "text-yellow-500";
    } else {
      return "text-green-500";
    }
  };

  return (
    <span className={clsx("font-medium text-[18px]", getColor())}>
      {puntuacion}
    </span>
  );
};

export default PuntuacionText;
