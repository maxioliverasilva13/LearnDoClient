import React from "react";
// import ReactDOM from "react-dom";
import App from "next/app";
import Head from "next/head";
// import Router from "next/router";
 
// import PageChange from "components/PageChange/PageChange.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "styles/tailwind.css";
import { Provider } from "react-redux";
import store from "store/store";
import CheckTokenWrapper from "components/CheckTokenWrapper/CheckTokenWrapper";
import LoadingWrapper from "components/LoadingWrapper/LoadingWrapper";
import "../styles/index.css";
import "../styles/tailwind.css";
import "react-dropdown/style.css";
import MessageWrapper from "components/MessageWrapper/MessageWrapper";
import Footer from "components/Footers/Footer";
import CheckRoutes from "components/CheckRoutes/CheckRoutes";

// Router.events.on("routeChangeStart", (url) => {
//   console.log(`Loading: ${url}`);
//   document.body.classList.add("body-page-transition");
//   ReactDOM.render(
//     <PageChange path={url} />,
//     document.getElementById("page-transition")
//   );
// });
// Router.events.on("routeChangeComplete", () => {
//   ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
//   document.body.classList.remove("body-page-transition");
// });
// Router.events.on("routeChangeError", () => {
//   ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
//   document.body.classList.remove("body-page-transition");
// });

export default class MyApp extends App {
  componentDidMount() {
    let comment = document.createComment(`

=========================================================
* Notus NextJS - v1.1.0 based on Tailwind Starter Kit by Creative Tim
=========================================================

* Product Page: https://www.creative-tim.com/product/notus-nextjs
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/notus-nextjs/blob/main/LICENSE.md)

* Tailwind Starter Kit Page: https://www.creative-tim.com/learning-lab/tailwind-starter-kit/presentation

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

`);
    document.insertBefore(comment, document.documentElement);
  }
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }
  render() {
    const { Component, pageProps } = this.props;

    const Layout = Component.layout || (({ children }) => <>{children}</>);

    return (
      <Provider store={store}>
        <React.Fragment>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <title>LearnDo</title>
            <link href="https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css" rel="stylesheet"/>
            <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY_HERE"></script>
            <link
              href="https://fonts.cdnfonts.com/css/gotham"
              rel="stylesheet"
            />
            <script src="https://cdn.tailwindcss.com"></script>
          </Head>
          <CheckTokenWrapper>
            <LoadingWrapper>
              <CheckRoutes>
              <MessageWrapper>
                <Layout>
                  <Component {...pageProps} />
        {/* <Footer /> */}

                </Layout>
              </MessageWrapper>
              </CheckRoutes>
            </LoadingWrapper>
          </CheckTokenWrapper>
        </React.Fragment>
      </Provider>
    );
  }
}
