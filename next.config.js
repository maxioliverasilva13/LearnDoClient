const runtimeCaching = require("next-pwa/cache");
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  runtimeCaching,
  buildExcludes: [/middleware-manifest.json$/],
});

const nextConfig = withPWA({
 
});
module.exports = nextConfig;

// const withPWA = require('next-pwa')
// const runtimeCaching = require('next-pwa/cache')

// module.exports = withPWA({
//   pwa: {
//     dest: 'public',
//     runtimeCaching,
//   },
// })

// // next.config.js
// const withPWA = require("next-pwa");

// const runtimeCaching = require('next-pwa/cache')
// runtimeCaching[0].handler = 'StaleWhileRevalidate'

// module.exports = withPWA({
//   pwa: {
//     dest: "public",
//     register: true,
//     skipWaiting: true,
//     runtimeCaching,
//   },
// });

// module.exports = {
//   webpack(config, options) {
//     config.module.rules.push({
//       test: /\.(mp3)$/,
//       type: "asset/resource",
//       generator: {
//         filename: "static/chunks/[path][name].[hash][ext]",
//       },
//     });

//     return config;
//   },
// };
