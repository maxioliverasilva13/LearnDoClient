import appRoutes from "routes/appRoutes"


export const EventosType = {
    curso: "curso",
    seminarioV: "seminarioV",
    seminarioP: "seminarioP",
}

export const SugerenciaType = {
    aprobado: "aprobado",
    rechazado: "rechazado",
    pendiente: "pendiente",
}

const seminariosTipo = {
    seminarioP: "Seminario Presencial",
    seminarioV: "Seminario Virtual",
    curso: "Curso",
}

export const SugerenciaText = {
    aprobado: "Aprobada",
    rechazado: "Rechazada",
    pendiente: "Pendiente",
}

export const formatCursoDescripcion = (descripcion = "") => {
    if (descripcion?.length > 90) {
        return descripcion?.slice(0, 90) + "...";
    }
    return descripcion;
}

export const formatTitle = (tipoCurso) => {
    return seminariosTipo[tipoCurso];
}

export const fomratColorCurso = (tipoCurso) => {
    // console.log(tipoCurso)
    if (tipoCurso == EventosType.curso) {
        return "#78A132";
    }
    if (tipoCurso == EventosType.seminarioP) {
        return "#0E8BFF";
    }
    if (tipoCurso == EventosType.seminarioV) {
        return "#31174A";
    }
}



export const formatSugerenciaColor = (tipoSugerencia) => {
    if (tipoSugerencia == SugerenciaType.rechazado) {
        return "red-500";
    }
    if (tipoSugerencia == SugerenciaType.pendiente) {
        return "yellow-500";
    }
    if (tipoSugerencia == SugerenciaType.aprobado) {
        return "green-500";
    }
}

export const formatSugerenciaText = (tipoSugerencia) => {
    return SugerenciaText[tipoSugerencia];
}

export const handleRedirectByTipo = (tipo, eventId) => {
    if (tipo === 'curso'){
      return appRoutes.cursoPage(eventId);
    }
    if (tipo === 'seminarioP'){
      return appRoutes.seminarioPage(eventId);
    }
    if (tipo === 'seminarioV'){
      return appRoutes.seminarioPage(eventId);
    }
  }