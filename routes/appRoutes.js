const appRoutes = {
    login: () => "/auth/login",
    register: () => "/auth/register",
    activate: () => "/activate/[token]",
    home: () => "/home",
    seminarios: () => "/seminarios",
    seminarioPage: (seminarioId) => `/seminarios/${seminarioId ? seminarioId : "[seminarioId]"}`,
    cursos: () => "/cursos",
    landing: () => "/",
    messages: () => "/messages",
    misCursos: () => "/mis_cursos",
    profile: () => "/profile",
    foroPage: (foroId) => `/cursos/${foroId ? foroId : "[cursoId]"}/foro`,
    clasePage: (claseId, cursoId) => `/cursos/${cursoId ? [cursoId] : "[cursoId]"}/clase/${claseId ? claseId : "[claseId]"}`,
    cursoPage: (cursoId) => `/cursos/${cursoId ? cursoId : "[cursoId]"}`,
    editCurso: (cursoId) => `/cursos/editCurso/${cursoId ? cursoId : "[id]"}`,
    cursoSugerir: (cursoId) => `/cursos/sugerir/${cursoId ? cursoId : "[cursoId]"}`,
    mapaSeminarios: () => '/mapaSeminarios',
    createCurso: () => '/cursos/createCurso',
    createSeminario: () => '/crearSeminario',
    dashboard: () => '/admin/dashboard',
    misCursosAdmin: () => '/admin/cursos',
    progresoEstudiantes: () => `/admin/progresoEstudiantes`,
    selectRole: () => `/selectrole`,
    zoom: () => `/zoom`,

}

export default appRoutes;