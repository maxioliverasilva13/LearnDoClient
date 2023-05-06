const appRoutes = {
    login: () => "/auth/login",
    register: () => "/auth/register",
    activate: () => "/activate/[token]",
    cursos: () => "/cursos",
    home: () => "/",
}

export default appRoutes;