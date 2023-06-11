import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="es">
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#000000" />
          <link rel="shortcut icon" href="/learnDoLogo.png" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" href="/learnDoLogo.png" />

          <link
            rel="apple-touch-icon"
            sizes="76x76"
            href="/learnDoLogo.png"
          />
        </Head>
        <body className="text-blueGray-700 antialiased">
          <div id="page-transition"></div>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
