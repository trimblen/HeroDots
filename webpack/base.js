const webpack                   = require("webpack");
const path                      = require("path");
const HtmlWebpackPlugin         = require("html-webpack-plugin");
const WebfontPlugin             = require("webfont-webpack-plugin").default;

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: "raw-loader"
      },
      {
        test: /\.(gif|png|ogg|jpe?g|svg|xml|fnt)$/i,
        use: "file-loader"
      },
      {
        test: /\.css/,
        use: ["style-loader", "css-loader"]
      },
      {
        loader: "url-loader",
        test: /\.(svg|eot|ttf|woff|woff2)?$/
      }    
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, "../")
    }),
    new webpack.DefinePlugin({
        'CANVAS_RENDERER': JSON.stringify(true),
        'WEBGL_RENDERER': JSON.stringify(true),
        'PLUGIN_FBINSTANT': JSON.stringify(true)
    }),
    new WebfontPlugin({
      files: path.resolve(__dirname, "../fixtures/svg-icons/**/*.svg"),
      dest: path.resolve(__dirname, "../fixtures/css/fonts"),
      destTemplate: path.resolve(__dirname, "../fixtures/css")
    }),  
    new HtmlWebpackPlugin({
      template: "./index.html"
    })
  ]
};
