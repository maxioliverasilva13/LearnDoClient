const appRoutes = {
    login: () => "/auth/login",
    register: () => "/auth/register",
    activate: () => "/activate/[token]",
    home: () => "/home",
    seminarios: () => "/seminarios",
    cursos: () => "/cursos",
    landing: () => "/",
    messages: () => "/messages",
    profile: () => "/profile",
    foroPage: (foroId) => `/cursos/${foroId}/foro`,
    clasePage: (claseId, cursoId) => `/cursos/${cursoId}/clase/${claseId}`,
}

export default appRoutes;