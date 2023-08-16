import clsx from "clsx";

export default function CardDashboardItem ({title, data, clickable = true}) {
    return (
    <div className={clsx("w-auto h-auto overflow-hidden flex flex-col items-start justify-center gap-y-4 rounded-[9px] shadow-xl bg-[#2A2B36]", clickable && "cursor-pointer transition-all transform hover:scale-110 hover:bg-opacity-50")}>
        <div className="w-96 relative h-40 overflow-hidden ">
            <div className="flex flex-col text-left p-5 gap-y-4">
                <p className="w-full text-white font-medium text-2xl max-w-full truncate">{title}</p>
                <p className="w-full colorSecundario font-bold text-5xl max-w-full truncate">{data}</p>
            </div>
        </div>
    </div>)
}