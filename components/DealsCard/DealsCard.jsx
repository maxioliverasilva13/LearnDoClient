import { defaultDisccount, handleGeetDisccount } from "utils/cupon";


const DealsCard = ({price}) => {

    return <div className="flex appearsAnimation flex-row w-auto p-1 gap-2 items-center justify-center">
        <span className="text-white text-[20px] font-bold">{handleGeetDisccount(price)}</span>
        <span className="p-2 bg-red-500 rounded-lg mx-1 text-white font-bold">-{defaultDisccount}%</span>
    </div>
}

export default DealsCard;