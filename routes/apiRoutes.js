const apiRoutes = {
    signIn: () => "/api/auth/login",
    activate: () => "/api/auth/activate",
    signUp: () => "/api/auth/signup",
    checkNickname: () => "/api/auth/checkNickname",
    me: () => "/api/auth/me",
    getMessages: () => "/api/messages/",
    createMessage: () => "/api/messages/create",
}

export default apiRoutes;