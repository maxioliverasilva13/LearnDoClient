import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";

import CardPost from "components/Cards/CardPost";
import ConfirmModal from "components/Modals/ConfirmModal";
import appRoutes from "routes/appRoutes";
import { IoMdAddCircleOutline } from "react-icons/io";

import {
  useListarPublicacionesByForoIdQuery,
  useCreatePostMutation,
  useDeletePostMutation,
} from "store/services/PublicacionService";

import { useDeleteCommentMutation } from "store/services/ComentarioService";

import {
  useGetEventoInfoQuery,
  useUserIsStudentOrOwnerQuery,
} from "store/services/EventoService";
import NotFoundPage from "components/NotFoundPage/NotFoundPage";
import Modal from "components/Modal/modal";
import GlobalImage from "components/GlobalImage/GlobalImage";
import Spinner from "components/Spinner/Spinner";
import useGlobalSlice from "hooks/useGlobalSlice";

export default function Foro() {
  const router = useRouter();
  const { cursoId: curso_id } = router.query;
  const [foroId, setCursoId] = useState(curso_id);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [foroExist, setForoExist] = useState(true);

  const { handleSetLoading } = useGlobalSlice();

  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [submitNewPost, setSubmitNewPost] = useState(false);
  const [formHasError, setFormHasError] = useState(false);
  const [openAddPostModal, setOpenAddPostModal] = useState(false);
  const [userIsStudentOrOwner, setUserIsStudentOrOwner] = useState(true);
 
  const [createPost] = useCreatePostMutation();
  const [deletePost] = useDeletePostMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const { data, error, isLoading, refetch } =
    useListarPublicacionesByForoIdQuery({ foroId: foroId });

  const { data: isStudentOrOwnerRes } = useUserIsStudentOrOwnerQuery({
    eventoId: foroId,
  });

  const eventoInfo = isStudentOrOwnerRes?.eventoInfo;


  const [hasMore, setHasMore] = useState(true);
  const [validationsMessage, setValidationsMessage] = useState([]);

  const [showModalDeletePost, setShowModalDeletePost] = useState(false);
  const [postIdDelete, setPostIdDelete] = useState(null);

  useEffect(() => {
    if (data) {
      setPosts(data);
    }
    if (error) {
      const { status } = error;
      if (status == 404) {
        setForoExist(false);
        return;
      }
    }
  }, [data]);

  useEffect(() => {
    handleSetLoading(isLoading)
  }, [isLoading])

  useEffect(() => {
    if (isStudentOrOwnerRes) {
      const { result } = isStudentOrOwnerRes; //code is 200
      setUserIsStudentOrOwner(result);
    }
  }, [isStudentOrOwnerRes]);

  async function onCreatePost() {
    setSubmitNewPost(true);
    try {
      const isValidForm = validateForm();
      setFormHasError(!isValidForm);
      if (!isValidForm) {
        setSubmitNewPost(false);
        return;
      }
      const body = {
        nombre: postTitle,
        contenido: postContent,
        foroId: foroId,
      };
      const response = await createPost(body);
      const { data } = response;
      const postsData = [...posts];
      postsData.unshift(data);
      setPosts(postsData);
      setSubmitNewPost(false);
      setPostContent("");
      setPostTitle("");
      setOpenAddPostModal(false);
    } catch (e) {
      console.log(e); //considerar redireccionar a pagina 500
    }
  }

  function validateForm() {
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

  function openModalDeletePost(id) {
    setPostIdDelete(id);
    setShowModalDeletePost(true);
  }

  function closeModalDeletePost() {
    setPostIdDelete(null);
    setShowModalDeletePost(false);
  }

  async function onConfirmModalDeletePost() {
    setShowModalDeletePost(false);
    try {
      const response = await deletePost(postIdDelete);
      const { data } = response;
      const { id } = data;
      const postsData = [...posts];
      const index = posts.findIndex((post) => post.id == id);
      if (index < 0) {
        return;
      }
      postsData.splice(index, 1);
      setPosts(postsData);
    } catch (e) {
      console.log(e);
    }
  }


  if (!foroExist) {
    return <NotFoundPage />;
  }

  return (
    <div className="w-full min-h-screen" id="scrollableDiv">
      {openAddPostModal && (
        <Modal
          isVisible={openAddPostModal}
          onClose={() => setOpenAddPostModal(false)}
          alto="auto"
          ancho="auto"
        >
          <div className="flex md:w-[600px] w-[90%] justify-center p-4 pb-0">
            <form className=" w-full p-4 rounded transition">
              {formHasError && (
                <div
                  className="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                  role="alert"
                >
                  <svg
                    aria-hidden="true"
                    className="flex-shrink-0 inline w-5 h-5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Info</span>
                  <div>
                    <span className="font-medium">Error!</span>
                    <ul>
                      {validationsMessage.map((message) => {
                        return <li>{message}</li>;
                      })}
                    </ul>
                  </div>
                </div>
              )}

              <p className="text-white mr-5 font-medium text-2xl">
                {" "}
                Escribe una publicacion.{" "}
              </p>

              <div className="py-2 px-4 mb-4 bg-[#31174a] rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 mt-5">
                <label htmlFor="comment" className="sr-only">
                  Titulo
                </label>
                <input
                  id="comment"
                  rows="6"
                  maxLength={250}
                  value={postTitle}
                  disabled={submitNewPost}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="px-0 w-full bg-[#31174a] text-sm text-white border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-white dark:bg-gray-800"
                  placeholder="Escribe un titulo"
                  required
                />
              </div>
              <div className="py-2 px-4 mb-4 bg-[#31174a] rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 mt-5">
                <label htmlFor="comment" className="sr-only">
                  Tu contenido
                </label>
                <textarea
                  maxLength={250}
                  id="comment"
                  rows="6"
                  value={postContent}
                  disabled={submitNewPost}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="px-0 w-full bg-[#31174a] text-sm text-white border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-white dark:bg-gray-800"
                  placeholder="Escribe el contenido de la publicacion..."
                  required
                ></textarea>
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={onCreatePost}
                  disabled={submitNewPost}
                  className="flex  justify-end items-center py-4 px-10 mt-2 text-sm font-medium text-center text-dark bgPrincipal text-white rounded-[14px] focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900"
                >
                  Publicar
                  {submitNewPost && (
                    <svg
                      aria-hidden="true"
                      className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
      <ConfirmModal
        show={showModalDeletePost}
        closeModal={closeModalDeletePost}
        confirmModal={onConfirmModalDeletePost}
        text="Seguro deseas eliminar la publicacion?"
      />
      {(!foroExist || !userIsStudentOrOwner) && (
        <div className="mt-10">
          <NotFoundPage></NotFoundPage>
          {!foroExist && (
            <div className="flex flex-col items-center">
              <h1 className="flex justify-center text-white text-xl">
                El foro no existe{" "}
              </h1>

              <button
                className="bgPrincipal hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5"
                onClick={() => (window.location.href = appRoutes.home())}
              >
                Ir al inicio
              </button>
            </div>
          )}

          {!userIsStudentOrOwner && (
            <div className="flex flex-col items-center">
              <h1 className="flex justify-center text-white text-xl">
                Para acceder al foro necesitas obtener el curso{" "}
              </h1>

              <button className="bgPrincipal hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5">
                Ir al curso
              </button>
            </div>
          )}
        </div>
      )}
      {foroExist && userIsStudentOrOwner && (
        <div className="relatve z-10">
          <div className="w-screen sticky top-[64px] h-[400px] z-0">
            <div className="w-full h-full pb-5 pl-5 bg-gray-900 bg-opacity-50 backdrop-blur-md absolute top-0 left-0 z-20 flex items-start flex-col justify-center">
            <h1 className="text-white text-5xl text-center p-6">
                Foro del curso : {eventoInfo?.nombre}
              </h1>
            </div>
            <div className="w-full h-full relative z-10">
              <GlobalImage 
                src={eventoInfo?.imagen}
                layout="fill"
                objectFit="cover"
              />
            </div>
            
          </div>
          <div className="z-[10] relative">
            <div className="my-10"></div>
            <div className="w-[75%] m-auto flex items-center z-20 justify-end">
              <button
                onClick={() => setOpenAddPostModal(!openAddPostModal)}
                className="text-white cursor-pointer border-white px-4 py-2 border-2 bg-transparent rounded-full flex gap-2 items-center"
              >
                <IoMdAddCircleOutline
                  size={30}
                  color="white"
                  className="text-white"
                />
                <span>Agregar Publicacion</span>
              </button>
            </div>

            <div className="flex z-20 justify-center gap-10 text-center flex-wrap px-8 py-8">
              {posts.map((post) => (
                <CardPost
                  key={post.id}
                  post={post}
                  openModalDeletePost={openModalDeletePost}
                ></CardPost>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
