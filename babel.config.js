module.exports = {
  presets: ["babel-preset-expo"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./"],
        extensions: [
          ".ios.js",
          ".android.js",
          ".ios.jsx",
          ".android.jsx",
          ".js",
          ".jsx",
          ".json",
          ".ts",
          ".tsx",
        ],
        alias: {
          "@components": "./src/components",
          "@ui": "./src/ui",
          "@config": "./src/config",
          "@constants": "./src/constants",
          "@helpers": "./src/helpers",
          "@hooks": "./src/hooks",
          "@interfaces": "./src/interfaces",
          "@screens": "./src/screens",
          "@store": "./src/store",
          "@utils": "./src/utils",
        },
      },
    ],
    "react-native-reanimated/plugin",
  ],
};
