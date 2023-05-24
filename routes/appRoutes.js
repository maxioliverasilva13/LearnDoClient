const appRoutes = {
    login: () => "/auth/login",
    register: () => "/auth/register",
    activate: () => "/activate/[token]",
    home: () => "/home",
    seminarios: () => "/seminarios",
    cursos: () => "/cursos",
    landing: () => "/",
    messages: () => "/messages",
    misCursos: () => "/mis_cursos",
    profile: () => "/profile",
    foroPage: (foroId) => `/cursos/${foroId ? foroId : "[cursoId]"}/foro`,
    clasePage: (claseId, cursoId) => `/cursos/${cursoId ? [cursoId] : "[cursoId]"}/clase/${claseId ? claseId : "[claseId]"}`,
    cursoPage: (cursoId) => `/cursos/${cursoId ? cursoId : "[cursoId]"}`,
    mapaSeminarios: () => '/mapaSeminarios',
    createCurso: () => '/cursos/createCurso',
    createSeminario: () => '/cursos/createCurso',
    dashboard: () => '/admin/dashboard',
    misCursosAdmin: () => '/admin/cursos',
}

export default appRoutes;