const { transformSync } = require("@babel/core");

const code = "function @@ foo(a, b, c) { return a + b + c }";

const babelConfig = {
  plugins: ["./babel-plugin-transformation-curry-function.js"],
};

const output = transformSync(code, babelConfig);

console.log(output);
