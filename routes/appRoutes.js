const appRoutes = {
    login: () => "/auth/login",
    register: () => "/auth/register",
    activate: () => "/activate/[token]",
    home: () => "/home",
    seminarios: () => "/seminarios",
    cursos: () => "/cursos",
    profile: () => "/perfil",
    landing: () => "/",
    messages: () => "/messages",
}

export default appRoutes;