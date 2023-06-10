import React, { useState, useEffect } from "react";
import moment from "moment";

//services
import { useListarComentariosByPublicacionIdQuery } from "store/services/ComentarioService";

import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
} from "store/services/ComentarioService";
import NoResults from "components/NotFoundPage/NoResults";

export default function CardPost({
  post,
  openModalDeletePost,
  openModalDeleteComment,
}) {
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [postId] = useState(post?.id);
  const [showComments, setShowComments] = useState(false);
  const [isQueryStarted, setIsQueryStarted] = useState(false);
  const { data, error, isLoading, refetch } =
    useListarComentariosByPublicacionIdQuery({ publicacionId: postId });

  const [inputComment, setInputComment] = useState("");
  const [submitNewComment, setSubmitNewComment] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);

  const [createComment] = useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  useEffect(() => {
    setLoadingComments(true);
    // Realiza acciones con el nuevo resultado de la consulta
    if (isQueryStarted && data && !isLoading) {
      // Verificar si la consulta se ha iniciado antes de mostrar los datos
      console.log(data);
      setComments(data);
      setLoadingComments(false);
    }

    if (error) {
      console.log(error);
    }
  }, [data, isQueryStarted]);

  function formatDate(dateStr) {
    return moment(dateStr).format("DD-MM-YYYY HH:MM");
  }

  function toggleComments() {
    if (!showComments) {
      setShowComments(true);

      if (!isQueryStarted) {
        setIsQueryStarted(true);
      }

      if (!isLoading && !error) {
        refetch();
      }

      return;
    }
    setShowComments(!showComments);
  }

  async function onCreateComment() {
    setSubmitNewComment(true);
    try {
      const body = {
        publicacionId: post?.id,
        contenido: inputComment,
      };
      const response = await createComment(body);
      console.log(response);
      const { data } = response;
      setComments([data, ...comments]);
      setSubmitNewComment(false);
      setInputComment("");
    } catch (e) {
      console.log(e); //considerar redireccionar a pagina 500
    }
  }

  async function onDeleteComment(comment) {
    try {
      const response = await deleteComment(comment.id);

      const commentsData = [...comments];
      const index = commentsData.findIndex(
        (commentData) => commentData.id == comment.id
      );
      if (index < 0) {
        return;
      }
      commentsData.splice(index, 1);
      setComments(commentsData);
    } catch (e) {
      console.log(e);
    }
  }

  async function toggleDropdown() {
    setShowDropDown(!showDropDown);
  }

  function onDeletePost({ id }) {
    openModalDeletePost(id);
  }

  return (
    <>
      <div className="flex flex-col w-[80%] justify-center items-center p-4 gap-4 rounded-lg transition ease-in-out delay-150 ">
        <div
          className="flex justify-between  rounded-lg mx-4 md:mx-auto px-4  w-full py-8 bg-[#31174a9f]"
          key={post.id}
        >
          <div className="flex items-start px-4 py-6">
            <img
              className="w-28 h-28 rounded-full object-cover mr-4 shadow "
              src={post.user.imagen}
              alt="avatar"
            />
            <div className="w-full ml-3">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-lg font-semibold text-white font-medium mt-1 text-2xl">
                  {post.nombre}{" "}
                </h2>
              </div>
              <div className="mt-3 text-left text-white text-sm  ">{post.contenido}</div>
            </div>
          </div>
          <div className="mt-4 flex flex-col justify-between items-end">
            <div className="flex justify-center items-center">
              <p className="text-white mr-5 min-w-fit max-w-[200px] overflow-hidden truncate"> {post.user.nombre} </p>
              <p className="text-white mr-5 min-w-fit max-w-[200px] overflow-hidden truncate"> {formatDate(post.created_at)} </p>

              <div className="flex flex-col relative">
                {post.enableDelete && (
                  <div>
                    <button
                      id="dropdownMenuIconButton"
                      onClick={toggleDropdown}
                      data-dropdown-toggle="dropdownDots"
                      className=" flex-none w-8 h-8 mr-5 inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                      type="button"
                    >
                      <svg
                        className="w-6 h-6"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                      </svg>
                    </button>

                    <div
                      id="dropdownDots"
                      className={` ${
                        showDropDown ? "" : "hidden"
                      } : ""} z-10 absolute  mr-5 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600`}
                    >
                      <ul
                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownMenuIconButton"
                      >
                        <li onClick={() => onDeletePost(post)}>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Eliminar
                          </a>
                        </li>
                      </ul>
                      <div className="py-2">
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          onClick={toggleDropdown}
                        >
                          Cerrar
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div
              className="flex mr-2 text-white text-sm mr-8"
              onClick={toggleComments}
            >
              <svg
                fill="none"
                viewBox="0 0 24 24"
                className="w-10 h-10 hover:cursor-pointer hover:fill-blue-500 mr-1"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
            </div>
          </div>
        </div>
        {(showComments || comments?.length > 0) && <div className="dark:bg-gray-900 bg-opacity-50 rounded-lg py-8 px-6 lg:py-16 w-full ">
          <div classNameName=" mx-auto px-4">
            {loadingComments && showComments ? (
              <div className="border border-blue-300 shadow rounded-md p-4 w-full h-48  mx-auto">
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                  <div className="flex-1 space-y-6 py-1">
                    <div className="h-2 bg-slate-200 rounded"></div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                        <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                      </div>
                      <div className="h-2 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            <div>
              {!loadingComments && showComments && (
                <div>
                  <div className="flex justify-between items-center mb-6 ">
                    <h2 className="text-lg lg:text-2xl font-bold text-white dark:text-white">
                      Comentarios
                    </h2>
                  </div>

                  <div className="max-h-[450px] overflow-y-auto	">
                    {comments.map((comment) => {
                      return (
                        <article
                          className="p-6 mb-6 text-base bg-[#31174a74] rounded-lg flex flex-col"
                          key={comment.id}
                        >
                          <footer className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <p className="inline-flex items-center mr-3 text-sm text-white dark:text-white">
                                <img
                                  className="mr-2 w-10 h-10 rounded-full"
                                  src={comment.user.imagen}
                                  alt="Michael Gough"
                                />
                                {comment.user.nombre}
                              </p>
                              <p className="text-sm text-white dark:text-gray-400">
                                <time
                                  pubdate
                                  datetime="2022-02-08"
                                  title="February 8th, 2022"
                                >
                                  {formatDate(comment.created_at)}
                                </time>
                              </p>
                            </div>

                            <div className="flex flex-col relative">
                              {comment.enableDelete && (
                                <button
                                  className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-white text-white text-sm font-medium rounded-md"
                                  onClick={() => {
                                    onDeleteComment(comment);
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </footer>

                          <div className="flex justify-start ml-16">
                            <p className="text-white text-left dark:text-gray-400">
                              {comment.contenido}
                            </p>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                  <form className="mb-6">
                    <div className="py-2 px-4 mb-4 bg-[#31174a] rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                      <label htmlFor="comment" className="sr-only">
                        Your comment
                      </label>
                      <textarea
                        id="comment"
                        rows="6"
                        value={inputComment}
                        disabled={submitNewComment}
                        onChange={(e) => setInputComment(e.target.value)}
                        className="px-0 p-4 w-full min-h-[100px] max-h-[100px] bg-[#31174a] text-sm text-white border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                        placeholder="Escribe un comentario..."
                        required
                      ></textarea>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={onCreateComment}
                        disabled={
                          submitNewComment || inputComment.trim().length <= 0
                        }
                        className="bg-white cursor-pointer hover:bg-blue-700 text-dark hover:bg-[#8244bd] font-bold py-2 px-4 rounded"
                      >
                        Comentar
                        {submitNewComment && (
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
              )}
            </div>
          </div>
        </div>}
      </div>
    </>
  );
}
