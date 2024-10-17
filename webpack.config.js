/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

"use strict";

const path = require("path");

/**@type {import('webpack').Configuration}*/
const config = {
  entry: "./src/extension/extension.ts",
  devtool: "source-map",
  externals: {
    vscode: "commonjs vscode",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  target: "web",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: path.resolve(
                __dirname,
                "./src/extension/tsconfig.json"
              ),
              projectReferences: true,
              compilerOptions: {
                module: "esnext",
              },
            },
          },
        ],
      },
    ],
  },
};

const nodeConfig = {
  ...config,
  target: "node",
  output: {
    // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
    path: path.resolve(__dirname, "dist"),
    filename: "extension-node.js",
    libraryTarget: "commonjs2",
    devtoolModuleFilenameTemplate: "../[resource-path]",
  },
};

function getRendererConfig(rendererName) {
  const gitHubRendererConfig = {
    ...config,
    entry: `./src/${rendererName}/index.tsx`,
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: `${rendererName}.js`,
      libraryTarget: "module",
    },
    resolve: {
      extensions: [".ts", ".tsx", ".css"],
    },
    experiments: {
      outputModule: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "ts-loader",
              options: {
                configFile: path.resolve(
                  __dirname,
                  `./src/${rendererName}/tsconfig.json`
                ),
                projectReferences: true,
                compilerOptions: {
                  module: "esnext",
                },
              },
            },
          ],
        },
        {
          test: /\.css$/i,
          use: ["raw-loader"],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i, // Regular expression for matching image files
          type: "asset/resource", // Webpack 5 built-in feature to handle assets
        },
      ],
    },
  };

  return gitHubRendererConfig;
}

const makeConfig = (argv, { entry, out, target, library = "commonjs" }) => ({
  mode: argv.mode,
  devtool: argv.mode === "production" ? false : "inline-source-map",
  entry,
  target,
  output: {
    path: path.join(__dirname, path.dirname(out)),
    filename: path.basename(out),
    publicPath: "",
    libraryTarget: library,
    chunkFormat: library,
  },
  externals: {
    vscode: "commonjs vscode",
    vm: "commonjs vm",
    // "seed-client": "commonjs seed-client",
    axios: "commonjs axios",
    https: "commonjs https",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".css"],
    fallback: { util: require.resolve("util/"), https: false },
  },
  experiments: {
    outputModule: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: path.join(path.dirname(entry), "tsconfig.json"),
              projectReferences: true,
              transpileOnly: true,
              compilerOptions: {
                module: "NodeNext",
                moduleResolution: "NodeNext",
              },
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ["raw-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i, // Regular expression for matching image files
        type: "asset/resource", // Webpack 5 built-in feature to handle assets
      },
    ],
  },
});

module.exports = (env, argv) => {
  return [
    nodeConfig,
    ////////
    makeConfig(argv, {
      entry: "./src/extension/extension.ts",
      out: "./dist/extension/extension.js",
      target: "node",
    }),
    makeConfig(argv, {
      entry: "./src/extension/extension.ts",
      out: "./dist/extension/extension.web.js",
      target: "webworker",
    }),
    makeConfig(argv, {
      entry: "./src/extension/simple-renderer.ts",
      out: "./dist/extension/simple-renderer.js",
      target: "web",
      library: "module",
    }),
  ];
};
