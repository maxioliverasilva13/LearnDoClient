const apiRoutes = {
    signIn: () => "/api/auth/login",
    activate: () => "/api/auth/activate",
    signUp: () => "/api/auth/signup",
    checkNickname: () => "/api/usuarios/checkNickname",
    me: () => "/api/auth/me",
    getMessages: () => "/api/messages/",
    createMessage: () => "/api/messages/create",
    changeIsRead: () => "/api/messages/changeIsRead",
    createEvento: () => "/api/eventos/createEvento",
    listarEventos:() => "/api/eventos",
    filterByNicknameOrEmail: () => "/api/usuarios/filterByNicknameOrEmail",
}

export default apiRoutes;