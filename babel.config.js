module.exports = {
  "presets": [
    ["@babel/preset-env", {
      "modules": false
    }],
    ["@babel/preset-react", {
      "runtime": "automatic"
    }]
  ],
  "plugins": [
    "@babel/plugin-proposal-class-properties"
  ],
  "env": {
    "development": {
      "plugins": []
    }
  }
}; 