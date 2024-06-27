const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  devtool: "cheap-module-source-map",
  entry: {
    popup: path.resolve("./src/popup.js"),
    background: path.resolve("./src/background.js"),
    content: path.resolve("./src/content.js"),
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].bundle.js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new Dotenv({
      path: "./.env",
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ["popup"],
      filename: "popup.html",
      template: "./public/popup.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src", "manifest.json"),
          to: "manifest.json",
        },
        {
          from: path.resolve(__dirname, "public", "icon-48.png"),
          to: "icon-48.png",
        },
        {
          from: path.resolve(__dirname, "public", "icon-128.png"),
          to: "icon-128.png",
        },
        {
          from: path.resolve(__dirname, "src", "remindly-vector.png"),
          to: "remindly-vector.png",
        },
        { from: path.resolve(__dirname, "public", "assets"), to: "assets" },
        { from: path.resolve(__dirname, "src", "_locales"), to: "_locales" },
      ],
    }),
  ],
};
