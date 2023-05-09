export default function CardDashboardItem ({title, data}) {
    return (
    <div className="w-auto h-auto overflow-hidden flex flex-col items-start justify-center gap-y-4">
        <div className="w-[380px] relative h-[165px] overflow-hidden rounded-[9px] shadow-xl bg-[#242424]">
            <div className="flex flex-col text-left p-5 gap-y-4">
                <p className="w-full text-white font-medium text-2xl max-w-full truncate">{title}</p>
                <p className="w-full text-[#780EFF] font-bold text-5xl max-w-full truncate">{data}</p>
            </div>
        </div>
    </div>)
}