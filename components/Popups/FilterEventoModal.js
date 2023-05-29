import React, {useState} from "react";
import { useEffect } from "react";
import Select from 'react-select'

const FilterEventoModal = ({ show, updateShowModal,onFilterEvent,categorias}) => {
  const [categoriasOptions, setCategoriasOptions] = useState([]);

  
  const [categoriasSelected, setCategoriasSelected] = useState();
  const [tipoOptionSelected, setTipoSelected] = useState();
  
  useEffect(()=>{
    if(categorias){
      const categoriasOpt =  categorias.map(item =>{
       return {
         value: item.id,
         label: item.nombre
       }
      });
      setCategoriasOptions(categoriasOpt)
   }
  
  },categorias)



  const tiposOptions = [
    { value: null, label: 'Todos'  },
    { value: "Curso", label: 'Cursos'  },
    { value: "SeminarioOnline", label: 'Seminario Online'  },
    { value: "SeminarioPresencial", label: 'Seminario Presencial'  },
  ];

 

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? 'white' : 'black', // set the text color based on the selected state
    }),
  };
  

  function closeModal(){
    updateShowModal(false);
  }

  function handleSelectTipo(data) {
    setTipoSelected(data);
  }

  function handleSelectCategorias(data) {
    setCategoriasSelected(data);
  }

 

  function onFilter(){
        const categoriasIds = categoriasSelected ? categoriasSelected.map(item => item.value) : [];
        const filterObj = {
            tipo :  tipoOptionSelected ? tipoOptionSelected.value : null,
            categoriasIds
        } 
        onFilterEvent(filterObj);
  }
  return (
    <>
      {show ?
      
      (
  
        <div className="modal-overlay">
  <div className="modal-container">
    
      <div
         className={"fixed top-0 right-0 z-50 w-full h-full flex items-center justify-center" }
       >  

       
            <form action="#" method="get"  tabIndex="-1" aria-hidden="true" >
       <div className={"relative w-full h-full max-w-md md:h-auto"}>
           <div className={"relative bg-white rounded-lg shadow dark:bg-gray-800 w-[500px] h-auto"}>
               <div className={"flex items-start justify-between px-6 py-4 rounded-t"}>
                   <h3 className={"text-lg font-normal text-gray-500 dark:text-gray-400"}>
                       Aplicar filtros para eventos:
                   </h3>
                   <button type="button"
                       onClick={closeModal}
                       className={"text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"}
                       data-modal-toggle="defaultModal">
                       <svg aria-hidden="true" className={"w-5 h-5"} fill="currentColor" viewBox="0 0 20 20"
                           xmlns="http://www.w3.org/2000/svg">
                           <path fillRule={"evenodd"}
                               d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                               clipRule={"evenodd"}></path>
                       </svg>
                       <span className={"sr-only"}>Close modal</span>
                   </button>
               </div>
               <div className={"px-4 space-y-4 md:px-6"}>
                   
   
   
                   <div className={"flex items-center justify-between"}>
                       <div>
                           <label className={"relative inline-flex items-center cursor-pointer"}>
                              
                               <span className={"ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"}>
                                   Tipo de evento</span>
                           </label>
                       </div>
   
                       <div>
                             <Select options={tiposOptions} 
                               value={tipoOptionSelected}
                               onChange={handleSelectTipo}
                               theme={(theme) => ({
                                ...theme,
                                borderRadius: 0,
                                colors: {
                                  ...theme.colors,
                                  primary25: '#780eff',
                            
                                  text: '#780eff',
                                  font:'#780eff',
                                 
                                  primary: '#780eff',
                                  neutral80: 'black',
                                  color: "black"
                                },
                              })}
                              styles={customStyles}
                        

                               />


                       </div>
                   </div>  

                   <div className={"flex items-center justify-between"}>
                       <div>
                           <label className={"relative inline-flex items-center cursor-pointer"}>
                              
                               <span className={"ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"}>
                                   Categorias</span>
                           </label>
                       </div>
   
                       <div>
                             <Select options={categoriasOptions}  isMulti
                             value={categoriasSelected}
                             onChange={handleSelectCategorias}
                             theme={(theme) => ({
                                ...theme,
                                borderRadius: 0,
                                colors: {
                                  ...theme.colors,
                                  primary25: '#780eff',
                                  primary: 'black',
                                  text: 'black'
                                },
                              })}
                              styles={customStyles}
                            />


                       </div>
                   </div>
   
   
               </div>
               <div className={"flex items-center p-6 space-x-4 rounded-b dark:border-gray-600"}>
                  
                   <button type="reset" onClick={onFilter}
                       className={"w-full py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"}>
                       Filtrar
                   </button>
               </div>
           </div>
       </div>
            </form>
        </div>
  </div>
</div>


           
      
      
        
      ) : null}
    </>
  );
};

export default FilterEventoModal;