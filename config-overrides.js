const { override, addWebpackPlugin } = require("customize-cra");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

const overrideEntry = (config) => {
  config.entry = {
    popup: "./src/popup.js",
    reminderPopup: "./src/reminderPopup.js",
    background: "./src/background.js",
    content: "./src/content.js",
  };
  return config;
};

const overrideOutput = (config) => {
  config.output = {
    ...config.output,
    filename: "[name].bundle.js",
    chunkFilename: "[name].bundle.js",
  };
  return config;
};

module.exports = override(
  overrideEntry,
  overrideOutput,
  addWebpackPlugin(
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ["popup"],
      filename: "popup.html",
      template: "./public/popup.html",
    })
  ),
  addWebpackPlugin(
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ["reminderPopup"],
      filename: "reminderPopup.html",
      template: "./public/reminderPopup.html",
    })
  ),
  addWebpackPlugin(
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
    })
  )
);
