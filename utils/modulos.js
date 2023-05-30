

export const formatEvaluacion = (evaluacionInfo) => {
    if (!evaluacionInfo) {
        return null;
    }
    const formatEvaluacionInfo = {
        ...evaluacionInfo,
        preguntas: evaluacionInfo?.preguntas?.map((pregunta) => {
            return {
                preguntaId: pregunta?.id,
                contenido: pregunta?.contenido,
                opciones: pregunta?.opciones?.map((opcion) => {
                    return {
                        opcionId: opcion?.id,
                        contenido: opcion?.contenido,
                        correcta: opcion?.es_correcta === 1
                    }
                }) || []
            }
        }) || []
    };
   
    return formatEvaluacionInfo;
}

export const formatClases = (clases = []) => {
    if (!clases || clases?.length === 0) {
        return [];
    }

    const formatClases = clases?.map((clase) => {
        return {
            claseId: clase?.id,
            descripcion: clase?.descripcion,
            nombre: clase?.nombre,
            titulo: clase?.titulo,
            video: clase?.video,
        }
    })
    return formatClases;
}

export const formatModulosFromDB = (modulos = []) => {
    if (!modulos || modulos?.length === 0) {
        return [];
    }

    const formatModulos = modulos?.map((modulo) => {
        return {
            moduloId: modulo?.id,
            estado: modulo?.estado,
            nombre: modulo?.nombre,
            clases: formatClases(modulo?.clases),
            evaluacion: formatEvaluacion(modulo?.evaluacionInfo)
        }
    })

    return formatModulos;
}