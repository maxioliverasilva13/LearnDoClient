export default function CardGananciasAcumuladas({gananciasAcumuladas}) {


        return <>
        
        <div class="max-w-sm rounded overflow-hidden shadow-lg bg-[#Ab43f2] ">
                    <div class="px-6 py-4 flex justify-center items-center">
                      <div class="font-bold text-xl text-white">Ganancias acumuladas</div>
                      <p class="text-[#2DDC29] text-xl ml-2">
                        {gananciasAcumuladas}$
                      </p>
                    </div>

           </div>
        </>

}