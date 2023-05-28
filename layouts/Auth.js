import React from "react";

// components

export default function Auth({ children }) {
  return (
    <>
      <main>
        <section className="flex items-center relative w-full h-full min-h-screen">
          <div
            className="absolute top-0 w-full h-full bg-no-repeat bg-full"
          ></div>
          {children}
          {/* <FooterSmall absolute /> */}
        </section>
      </main>
    </>
  );
}
