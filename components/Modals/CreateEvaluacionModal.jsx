import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import EvaluationPage from "components/Evaluation/Evaluation";
import { useGetEvaluacionInfoQuery } from "store/services/EventoService";
import useGlobalSlice from "hooks/useGlobalSlice";

export default function CreateEvaluacionModal({ isOpen, setIsOpen, setEvaluacion, evaluacionId, isEditing = true }) {

  const { handleSetLoading } = useGlobalSlice();
  const { data, isLoading } = useGetEvaluacionInfoQuery({
    evaluacionId
  },
  {
    skip: !evaluacionId
  }
  )

  const preguntas = data?.preguntas;
  const evaluacion = data?.evaluacion;

  useEffect(() => {
      if (evaluacionId) {
        handleSetLoading(isLoading);
      }
  }, [isLoading, evaluacionId])

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-20 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-slate-900 px-4 pb-4 text-left shadow-xl transition-all mt-2 sm:w-full sm:max-w-2xl sm:p-6">
                <EvaluationPage evaluacion={evaluacion} preguntas={preguntas} isEditing={isEditing} setEvaluacion={setEvaluacion} setIsOpen={setIsOpen} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
