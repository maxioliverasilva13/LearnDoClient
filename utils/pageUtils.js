const { default: appRoutes } = require("routes/appRoutes")


export const listOfAuthPages = [
    appRoutes.login(),
    appRoutes.register(),
    appRoutes.activate(),
]

export const listOfPublicPath = [
    appRoutes.login(),
    appRoutes.register(),
    appRoutes.activate(),
    appRoutes.landing(),
]