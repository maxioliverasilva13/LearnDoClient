const { default: appRoutes } = require("routes/appRoutes");
const DEFAULT_SCROLLABLE_ID = "ScrollableContainer";

export const listOfAuthPages = [
  appRoutes.login(),
  appRoutes.register(),
  appRoutes.activate(),
];

export const listOfPublicPath = [
  appRoutes.login(),
  appRoutes.register(),
  appRoutes.activate(),
  appRoutes.landing(),
];

export const scrollTop = () => {
  const item = document.getElementById(DEFAULT_SCROLLABLE_ID);
  if (item) {
    item?.scrollTo({ top: 0, behavior: "smooth" });
  }
};
