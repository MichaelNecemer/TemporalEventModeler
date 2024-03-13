const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  watch: true,
  mode: "development",
  entry: {
    main: path.resolve(__dirname, "src/index.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      { test: /\.bpmn$/, use: "raw-loader" },
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader"] },
      { test: /\.(png|jpe?g|gif)$/i, use: "file-loader" },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
};
