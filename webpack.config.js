module.exports = {
  entry: {
    bundle: "./src/server/public/js/main.js",
    requests: "./src/server/public/js/requests.jsx",
    bulk_send: "./src/server/public/js/bulk_send.jsx",
  },
  output: {
    path: __dirname + '/src//server/public/assets/build/',
    filename: "[name].js"
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.woff$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.woff2$/, loader: "url-loader?limit=10000&mimetype=application/font-woff2" },
      { test: /\.ttf$/, loader: "file-loader" },
      { test: /\.eot$/, loader: "file-loader" },
      { test: /\.svg$/, loader: "file-loader" },
      { test: /\.jsx$/, loader: 'jsx-loader?insertPragma=React.DOM&harmony' }
    ]
  },
  externals: { 'react': 'React' },
  resolve: { extensions: ['', '.js', '.jsx'] }
};