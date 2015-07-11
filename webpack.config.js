module.exports = {
  entry: "./src/server/public/js/main.js",
  output: {
    path: __dirname,
    filename: "./src/server/public/bundle.js"
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.woff$/,   loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.woff2$/,   loader: "url-loader?limit=10000&mimetype=application/font-woff2" },
      { test: /\.ttf$/,    loader: "file-loader" },
      { test: /\.eot$/,    loader: "file-loader" },
      { test: /\.svg$/,    loader: "file-loader" }
    ]
  }
};