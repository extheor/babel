module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current", // 描述当前是node环境使用babel
        },
      },
    ],
  ],
  plugins: ["./lib/index.js"], // 使用自定义插件
};
