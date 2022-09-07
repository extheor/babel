const { transformSync } = require("@babel/core");

const code = "function @@ foo(a, b, c) { return a + b + c }";

// 如果在babel.config.js中配置了plugins, 就不用在这里配置了
const babelConfig = {
  // plugins: ["./index.js"],
};

const output = transformSync(code, babelConfig);

console.log(output.code);
