export default function CardGananciasAcumuladas({gananciasAcumuladas}) {


        return <>
        
        <div class="max-w-sm rounded-md overflow-hidden shadow-lg bgPrincipal ">
                    <div class="px-6 py-3 flex justify-center items-center">
                      <div class="font-bold text-xl text-white">Ganancias acumuladas</div>
                      <p class="text-white text-xl ml-2">
                        {gananciasAcumuladas}$
                      </p>
                    </div>

           </div>
        </>

}