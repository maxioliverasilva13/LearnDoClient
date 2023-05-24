

export const EventosType = {
    curso: "curso",
    seminarioV: "seminarioV",
    seminarioP: "seminarioP",
}

export const formatCursoDescripcion = (descripcion = "") => {
    if (descripcion?.length > 90) {
        return descripcion?.slice(0, 90) + "...";
    }
    return descripcion;
}