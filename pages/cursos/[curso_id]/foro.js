import { useRouter } from 'next/router';
import React, { useEffect, useState, useRef } from "react";

import CardPost from 'components/Cards/CardPost';
import ConfirmModal from "components/Modals/ConfirmModal";

import { useListarPublicacionesByForoIdQuery, useCreatePostMutation,useDeletePostMutation } from "store/services/PublicacionService";
import { useDeleteCommentMutation } from "store/services/ComentarioService";


export default function Foro() {
  const router = useRouter();
  const { curso_id } = router.query;
  const [foroId, setCursoId] = useState(curso_id);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);

  const [postTitle, setPostTitle] = useState("");
  const [postContent,setPostContent] = useState("");
  const [submitNewPost , setSubmitNewPost] = useState(false);
  const [formHasError, setFormHasError] = useState(false);

  const [createPost] =  useCreatePostMutation();
  const [deletePost] = useDeletePostMutation();
  const  [deleteComment] = useDeleteCommentMutation();

  const { data, error, isLoading, refetch } = useListarPublicacionesByForoIdQuery({ foroId: foroId });
  const [hasMore, setHasMore] = useState(true);
  const [validationsMessage, setValidationsMessage] =  useState([]);

  const [showModalDeletePost , setShowModalDeletePost] = useState(false);
  const [postIdDelete , setPostIdDelete] = useState(null);

 


  useEffect(() => {
    if (data) {
      setPosts(data);
      setLoading(false);
    }
    if (error) {
      console.log(error);
    }
  }, []);

  function loadMoreItems() {
    setPage(page + 1);
  }

  async function onCreatePost(){
    setSubmitNewPost(true);
    try{
      const isValidForm = validateForm();
      setFormHasError(!isValidForm);
      if(!isValidForm){
        setSubmitNewPost(false);
        return;
      }
      const body = {
        nombre: postTitle,
        contenido: postContent,
        foroId: foroId
      }
      const response  =  await createPost(body);
      console.log(response);
      const {data} = response;
      const postsData = [...posts];
      postsData.unshift(data);
      setPosts(postsData);
      setSubmitNewPost(false);
      setPostContent("");
      setPostTitle(""); 
    }catch(e){
        console.log(e);  //considerar redireccionar a pagina 500
    }
  }

  function validateForm () {
    let isValid = true;
    const messages = []; 
    if (postTitle.trim().length <= 0) {
      messages.push("Titulo es requerido");
      isValid = false;
    }

    if (postContent.trim().length <= 0) {
      messages.push("Contenido es requerido");
      isValid = false;
    }
    setValidationsMessage(messages);
    return isValid;
  }


  function openModalDeletePost(id){
      setPostIdDelete(id);
      setShowModalDeletePost(true);
    
  }

  function closeModalDeletePost(){
    setPostIdDelete(null);
    setShowModalDeletePost(false);
  }


 

  async function onConfirmModalDeletePost(){
    setShowModalDeletePost(false);
    try{
        const response = await deletePost(postIdDelete);
        const { data}  = response;
        const { id } = data;
        const postsData = [...posts];
        const index = posts.findIndex(post => post.id == id);
        if(index < 0){
          return;
        }
        postsData.splice(index,1);
        setPosts(postsData);
        
    }catch(e){  
        console.log(e);
    }
  }

 



  return (
    <div className='w-full min-h-screen' id='scrollableDiv'>
     
          <ConfirmModal show={showModalDeletePost} closeModal={closeModalDeletePost} confirmModal={onConfirmModalDeletePost} text="Seguro deseas eliminar la publicacion?"/>


    
      <div className='w-1/3 py-16'>
        <h1 className='text-white text-5xl text-center'>Foro del curso</h1>
      </div>

      <div className='flex justify-center w-full  '>
      <form className="mb-6 w-1/3 bg-[#780EFF] p-10 rounded transition">
        {
          formHasError &&
          (
            <div class="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
          <span className="sr-only">Info</span>
          <div>
            
            <span className="font-medium">Error!</span> 
            <ul>
              {
                validationsMessage.map(message =>{
                    return (
                      <li>{message}</li>
                    )
                })

              }
              
            </ul>
          </div>
           </div>
          )
        }
      
      <p className="text-white mr-5 font-medium text-2xl"> Escribe una publicacion. </p>

         <div className="py-2 px-4 mb-4 bg-[#31174a] rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 mt-5">
              <label htmlFor="comment" className="sr-only">Titulo</label>
              <input id="comment" rows="6"
                  value={postTitle}
                  disabled={submitNewPost}
                  onChange={(e)=> setPostTitle(e.target.value)}
                  className="px-0 w-full bg-[#31174a] text-sm text-white border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                  placeholder="Escribe un titulo" required/>
          </div>
          <div className="py-2 px-4 mb-4 bg-[#31174a] rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 mt-5">
              <label htmlFor="comment" className="sr-only">Tu contenido</label>
              <textarea id="comment" rows="6"
                  value={postContent}
                  disabled={submitNewPost}
                  onChange={(e)=> setPostContent(e.target.value)}
                  className="px-0 w-full bg-[#31174a] text-sm text-white border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                  placeholder="Escribe el contenido de la publicacion..." required></textarea>
          </div>
          <div className='flex justify-end'>
          <button type="button" onClick={onCreatePost}
              disabled={submitNewPost}
              className="flex  justify-end items-center py-4 px-8 text-sm font-medium text-center text-dark bg-white rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
              Publicar
              {
                  submitNewPost && (
                      <svg aria-hidden="true" className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                      </svg>
                  )
              }
              
          </button>
          </div>
         
         </form>
    </div>
      
          
        <div className="flex justify-center gap-10 text-center flex-wrap px-8 py-8"> 
        {posts.map((post) => (
              <CardPost  key={post.id}   post={post} openModalDeletePost={openModalDeletePost} ></CardPost>
    
          ))}
        </div>
     
      
    </div>
  );
}