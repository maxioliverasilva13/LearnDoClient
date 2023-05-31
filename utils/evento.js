

export const EventosType = {
    curso: "curso",
    seminarioV: "seminarioV",
    seminarioP: "seminarioP",
}

const seminariosTipo = {
    seminarioP: "Seminario Presencial",
    seminarioV: "Seminario Virtual",
    curso: "Curso",
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
    console.log(tipoCurso)
    if (tipoCurso == EventosType.curso) {
        return "#780EFF";
    }
    if (tipoCurso == EventosType.seminarioP) {
        return "#0E8BFF";
    }
    if (tipoCurso == EventosType.seminarioV) {
        return "#31174A";
    }
}

