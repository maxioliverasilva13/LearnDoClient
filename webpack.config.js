const path = require('path');

module.exports = {
  entry: 'pages/index.js', // Reemplaza './src/index.js' con la ruta a tu archivo JavaScript principal
  output: {
    path: path.resolve(__dirname, 'dist'), // Reemplaza 'dist' con la carpeta de salida deseada
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'videos/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
};