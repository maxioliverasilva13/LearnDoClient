const apiRoutes = {
    signIn: () => "/api/auth/login",
    activate: () => "/api/auth/activate",
    signUp: () => "/api/auth/signup",
    signUpWithExternalService: () => "/api/auth/signupWithOauth",
    checkNickname: () => "/api/usuarios/checkNickname",
    me: () => "/api/auth/me",
    getMessages: () => "/api/messages/",
    createMessage: () => "/api/messages/create",
    changeIsRead: () => "/api/messages/changeIsRead",
    createEvento: () => "/api/eventos/createEvento",
    listarEventos:() => "/api/eventos",
    filterByNicknameOrEmail: () => "/api/usuarios/filterByNicknameOrEmail",
    getEventos: () => "/api/eventos/",
    createModulo: () => "/api/modulos/createModulo",
    createColaboraciones: () => "/api/colaboraciones/createColaboraciones",
    listarCategorias: () => "/api/categorias",
    listarEventosPresenciales: () => "/api/seminarios/presenciales",
    createComment: () => "/api/comentarios",
    createPost: () => "/api/publicaciones",
    getCompleteCursoInfo: () => "/api/cursos/getCompleteInfoCurso",
    uploadVideo: () => "/api/videos/upload-video",
    puntuarCurso: () => "/api/puntuacion/",
    evaluacionInfo: (evaluacionId) => `/api/evaluaciones?evaluacionId=${evaluacionId}`,
    userIsStudentOrOwner: (eventoId) => `/api/eventos/${eventoId}/userIsStudentOrOwner`,
    claseInfo: (claseId, cursoId) => `/api/clases?clase_id=${claseId}&curso_id=${cursoId}`,
    correjirEvaluacion: () => "/api/calificacion/",
    getCursosComprados: (estudianteId) => `/api/cursos/getCursosComprados?estudianteId=${estudianteId}`,
    changeUserRole: () => `/api/auth/changeRole`,
    getCursoAndClases: (cursoId) => `/api/cursos/getCursoAndClases?cursoId=${cursoId}`,
    createSugerencia: () => `/api/sugerencias/createSugerencia`,
    comprarEvento: () => "/api/eventos/comprarEvento",
    isUserColaborador: () => `/api/colaboraciones/isUserColaborador`,
    getEventosAdmin: (organizadorId) => `/api/eventos/getEventosAdmin?organizadorId=${organizadorId}`,
}

export default apiRoutes;