import React, { useState, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import Alert from "components/Popups/Alert";

// const [evaluacion, setEvaluacion] = useState({ nombre: "", maximo_puntuacion: "", modulo_id: 0, preguntas: []},);

const EvaluationPage = ({ isEditing, setIsOpen, preguntas, setEvaluacion }) => {
  const [evaluationName, setEvaluationName] = useState("");
  const [maxPunt, setMaxPunt] = useState("");
  const [questions, setQuestions] = useState(
    !preguntas
      ? [
          {
            contenido: "",
            opciones: [
              { contenido: "", correcta: true },
              { contenido: "", correcta: false },
              { contenido: "", correcta: false },
              { contenido: "", correcta: false },
            ],
          },
        ]
      : preguntas
  );
  const [answers, setAnswers] = useState([]);

  const [error, setError] = useState({
    show: false,
    message: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setError({
        show: false,
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [error.show]);

  const handleEvaluationNameChange = (event) => {
    setEvaluationName(event.target.value);
  };

  const handleMaxPuntChange = (event) => {
    setMaxPunt(event.target.value);
  };

  const handleQuestionChange = (event, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].contenido = event.target.value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (event, questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].opciones[optionIndex].contenido =
      event.target.value;
    // console.log(event.target.value);
    setQuestions(updatedQuestions);
  };

  const setFalseToAllOptions = (questions, questionIndex) => {
    questions[questionIndex].opciones.forEach((opcion) => {
      opcion.correcta = false;
    });
    return questions;
  };

  const handleCorrectOptionChange = (event, questionIndex, optionIndex) => {
    let updatedQuestions = [...questions];
    updatedQuestions = setFalseToAllOptions(updatedQuestions, questionIndex);
    updatedQuestions[questionIndex].opciones[optionIndex].correcta = true; // [{ contenido: "", opciones: ["", "", "", ""], correctOptionIndex: 0 }]
    // TODO: NUEVA FUNCION QUE AL SETTEAR UNA CORRECTA, SETTEE TODAS LAS DEMAS EN FALSE.
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        contenido: "",
        opciones: [
          { contenido: "", correcta: true },
          { contenido: "", correcta: false },
          { contenido: "", correcta: false },
          { contenido: "", correcta: false },
        ],
        //correctOptionIndex: 0
      },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  // ultimo change
  const handleOptionSelection = (questionIndex, optionIndex) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = optionIndex;
    setAnswers(updatedAnswers);
  };

  function esContenidoPreguntaVacio(pregunta) {
    return pregunta.contenido == null || pregunta.contenido.trim() === "";
  }

  function esContenidoOpcionesVacio(pregunta) {
    return pregunta.opciones.some(
      (opcion) => opcion.contenido == null || opcion.contenido.trim() === ""
    );
  }

  const validateForm = () => {
    if (evaluationName === "" || maxPunt === "") {
      setError({
        show: true,
        message: "La evaluación debe tener un NOMBRE y una PUNTUACIÓN MÁXIMA.",
      });
      return false;
    }

    if (!questions) {
      setError({
        show: true,
        message: "La evaluación debe tener al menos UNA PREGUNTA.",
      });
      return false;
    }

    const temp = [...questions];
    return temp.every((pregunta) => {
      if (esContenidoPreguntaVacio(pregunta)) {
        setError({
          show: true,
          message: "El CONTENIDO de alguna PREGUNTA está vacío.",
        });
        return false;
      }

      if (esContenidoOpcionesVacio(pregunta)) {
        setError({
          show: true,
          message: "El CONTENIDO de alguna OPCIÓN de respuesta está vacío.",
        });
        return false;
      }
      return true;
    });
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    const currentEvaluacion = {
      nombre: evaluationName,
      maximo_puntuacion: maxPunt,
      preguntas: questions,
    };

    // tambien validar que tenga alguna pregunta en el array
    setEvaluacion(currentEvaluacion);
    console.log("preguntas", questions);
    console.log("respuestas", answers);
    if (setIsOpen) setIsOpen(false);
  };

  return (
    <div className="flex justify-center item-no-scrollbar">
      <div className="flex flex-col gap-8 w-full max-w-2xl p-4 bg-transparent">
        <h2 className="text-3xl font-bold text-white text-center mb-4">
          {isEditing && "Crear Evaluación"}
          {!isEditing && "Realizar Evaluación"}
        </h2>
        <div className="my-2">
          {error.show && isEditing && (
            <Alert
              show={true}
              setShow={error.show}
              important={"Error"}
              text={error.message}
              color={"bg-red-500"}
              icon={"fas fa-regular fa-user"}
            />
          )}
        </div>
        {isEditing && (
          <>
            <input
              type="text"
              value={evaluationName}
              onChange={handleEvaluationNameChange}
              placeholder="Nombre de la evaluación"
              className="w-full px-5 py-3 border border-white rounded-full text-white bg-transparent text-md"
            />
            <input
              type="number"
              value={maxPunt}
              onChange={handleMaxPuntChange}
              placeholder="Puntuación máxima"
              className="w-full px-5 py-3 border border-white rounded-full mb-4 text-white bg-transparent text-md"
            />
          </>
        )}
        <div className="flex flex-col p-1 overflow-y-scroll scroll-smooth h-[260px] max-h-[260px] gap-y-8">
          {questions.map((question, index) => (
            <div key={index}>
              <input
                type="text"
                value={question.contenido}
                onChange={(event) => handleQuestionChange(event, index)}
                placeholder={
                  isEditing
                    ? "Ingrese la pregunta"
                    : "Contenido de la pregunta..."
                }
                className="w-full px-5 py-3 border border-white rounded-full mb-3 text-white bg-transparent text-md"
                disabled={!isEditing}
              />

              <div className="flex justify-center items-center gap-2 sm:gap-4">
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  {question.opciones.map((
                    option,
                    optionIndex // [{ contenido: "", opciones: ["", "", "", ""], correctOptionIndex: 0 }]
                  ) => (
                    <div key={optionIndex} className="flex gap-2 items-center">
                      {isEditing ? (
                        <input
                          type="radio"
                          id={`option-${index}-${optionIndex}`}
                          name={`question-${index}`}
                          value={optionIndex}
                          checked={option.correcta === true}
                          onChange={(event) =>
                            handleCorrectOptionChange(event, index, optionIndex)
                          }
                          className="accent-green-500"
                        />
                      ) : (
                        <input
                          type="radio"
                          id={`option-${index}-${optionIndex}`}
                          name={`question-${index}`}
                          checked={answers[index] === optionIndex}
                          onChange={() =>
                            handleOptionSelection(index, optionIndex)
                          }
                          value={optionIndex}
                          className="mr-2 accent-green-500"
                        />
                      )}
                      <label htmlFor={`option-${index}-${optionIndex}`}>
                        {isEditing ? (
                          <input
                            type="text"
                            value={option.contenido}
                            onChange={(event) =>
                              handleOptionChange(event, index, optionIndex)
                            }
                            // onClick={() =>
                            //   handleOptionSelection(index, optionIndex)
                            // }
                            placeholder={`Opción ${optionIndex + 1}`}
                            className="w-full px-4 py-2 border border-white rounded-full bg-transparent text-white text-md"
                          />
                        ) : (
                          <input
                            type="text"
                            value={option.contenido}
                            onClick={() => {
                              handleOptionSelection(index, optionIndex);
                            }}
                            placeholder={`Opción ${optionIndex + 1}`}
                            className="w-full px-4 py-2 border border-white rounded-full bg-transparent text-white text-md cursor-pointer"
                            readOnly={true}
                          />
                        )}
                      </label>
                    </div>
                  ))}
                </div>
                {isEditing && (
                  <RiDeleteBin6Line
                    className="text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer"
                    color="white"
                    size={30}
                    onClick={() => handleRemoveQuestion(index)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        {isEditing && (
          <div className="flex justify-center">
            <button
              onClick={handleAddQuestion}
              className="w-max self-center active:bg-purple-800 hover:bg-purple-900 text-white font-semibold
              hover:shadow-md shadow text-md px-5 py-2 rounded-full outline outline-1 sm:mr-2 mb-1 ease-linear transition-all duration-150"
            >
              Agregar Pregunta
            </button>
          </div>
        )}
        {isEditing ? (
          <div className="flex justify-center mt-4">
            <button
              className="w-max self-center bg-[#780EFF] active:bg-purple-800 text-white font-semibold
            hover:shadow-md shadow text-md px-5 py-3 rounded-full sm:mr-2 mb-1 ease-linear transition-all duration-150"
              // onClick={/* TODO: CREAR la EVALUACIÓN para éste módulo (front+back) */}
              onClick={handleSave}
            >
              Crear Evaluación
            </button>
          </div>
        ) : (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded-full shadow hover:bg-green-600 transition-colors"
            >
              Finalizar Evaluación
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluationPage;
