import React , { useEffect,useState} from "react";

import InfiniteScroll from 'react-infinite-scroll-component';
import axios from "axios";
import Spinner from "components/Spinner/Spinner";
import FilterEventoModal from "components/Popups/FilterEventoModal";

// layout for page
import Admin from "layouts/Admin.js";


export default function Cursos() {

  const [cursosList, setCursosList] = useState([]);   
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsNumbers ,setRowsNumbers] = useState(15);
  const [loading, setLoading ] = useState(true);
  const [showModalFilter, setModalFilter] = useState(false);
  
  const [filterData, setFilterData] = useState(null);
  const [busqueda,setBusqueda] =  useState('');

  
  const  updateShowModal = (show)=>{
    setModalFilter(show);
  }


  const getCursos = ()=>{
    setLoading(true); 
    const urlFinal = new URL("http://127.0.0.1:8000/api/eventos");

    urlFinal.searchParams.append("page",page);
    urlFinal.searchParams.append("maxRows", rowsNumbers);

    if(filterData){
      if(filterData.categoriasIds && filterData.categoriasIds.length > 0 ){
        var categoriasArrQry = filterData.categoriasIds.map(function(id, idx) {
          return '&categoria[' + idx + ']=' + id;
       }).join('&');
       urlFinal.href = urlFinal.href+ categoriasArrQry;
       
      }
    }
    if(busqueda && busqueda.trim().length > 0){
      urlFinal.searchParams.append("busqueda",busqueda);

    }
    axios.get(urlFinal.href).then(response =>{
      const { data } = response;
      const { result} = data;
      
      setCursosList(cursosList.concat(result));
      setHasMore(result.length > 0);
      setLoading(false);
    });
  }

 
  useEffect(()=>{
    if(filterData){
      setCursosList([]);  
      setPage(1);
      getCursos();
    }
    
  }, [filterData])

  
  useEffect(()=>{
    getCursos(); 
  }, [page,busqueda])


  function loadMoreItems() {
    setPage(page + 1);
  }

  function onFilterEvent(filterObj){
       setModalFilter(false);
       setFilterData(filterObj);
  }

  function openModalFilters(){
    setModalFilter(true);
   
 }

 function handleChangeSearch(event){
      setCursosList([]);   
      setPage(1);
      const text = event.target.value;
      setBusqueda(text);
 }

 

  return (
    <> 
      
      <div className="flex flex-wrap bg text-white relative">
        <div className="w-full px-4 ">
            <div className={ "bg-gradient-to-b from-[#780eff]  via-[#5B23A2] to-[#000] pt-12" } style={{minHeight: "100vh"}}>
              <div className={ " mt-10 " }>
                  <p className={" text-white text-center 	text-5xl font-semibold "}>Todos los eventos disponibles en nuestra plataforma</p>

              </div>
              <div className="{ flex flex-col items-center px-40 mt-10 }" >
                  <div className= { "w-full flex justify-between items-center	 px-10 py-10" }>
                      <input
                        type="text"
                        className="bg-transparent border-white text-white outline-none	rounded-full no-underline	hover:border-white	border-3	"
                        placeholder="buscar"
                        onChange={handleChangeSearch}
                        value={busqueda}                      />

                      <div className={ "flex items-center gap-5" } > 
                        <div className={ "flex items-center" } onClick={openModalFilters}> 
                        
                        <p className={"mr-2"} >Filtros</p>
                          <i
                          className={
                            "fa fa-bars text-white "
                          }
                        ></i>{" "}
                        </div>
                         
                       
                         

                      
                      </div>

                     
                  </div>
                  {
                  (loading)  &&
                    <Spinner></Spinner>
                    
                  }
                  {
                    (cursosList.length <= 0  && !loading)  &&
                    <h2>
                      Lo sentimos pero no existen eventos disponibles.
                    </h2>
                    
                  }
                          <FilterEventoModal show={showModalFilter} updateShowModal={updateShowModal} onFilterEvent={onFilterEvent}></FilterEventoModal>

                    <InfiniteScroll
                          dataLength={cursosList.length}
                          next={loadMoreItems}
                          hasMore={hasMore}  
                        >
                          <div className="flex justify-center gap-10 text-center flex-wrap px-8" >          
                            {
                              cursosList.map(curso => {
                                return    <div className="max-w-[250px] min-h-[350px]" key={curso.id}>
                                            <img  className="max-w-[250px] min-h-[350px] object-cover rounded-lg	" src="https://definicion.de/wp-content/uploads/2010/11/curso-1.jpg"></img>
                                            <p className="text-xl	">{curso.nombre}</p>
                                          </div>
                              })

                            }

                            </div>
                          
                        </InfiniteScroll>
                      </div>
              </div>
              
            </div>

        </div>

     
    </>
  );
}

Cursos.layout = Admin;
