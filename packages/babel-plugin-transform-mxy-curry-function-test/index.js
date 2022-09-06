const { declare } = require("@babel/helper-plugin-utils");
const { types: t } = require("@babel/core");
const customParser = require("./src/custom-parser");

module.exports = declare(api => {
  api.assertVersion(7);

  return {
    name: "transform-curry-function",

    // 使用修改过(自定义)的 babel-parser 解析代码
    parserOverride(code, opts) {
      return customParser.parse(code, opts);
    },

    visitor: {
      FunctionDeclaration(path) {
        if (path.get("curry").node) {
          // const foo = curry(function () { ... });
          const functionName = path.get("id.name").node;
          path.node.id = undefined;
          path.node.curry = false;

          const curryCode = `
            const foo = currying(function (a, b, c) {
              return a + b + c;
            });

            function currying(fn) {
              const numParamsRequired = fn.length;
              function curryFactory(params) {
                return function (...args) {
                  const newParams = params.concat(args);
                  if (newParams.length >= numParamsRequired) {
                    return fn(...newParams);
                  }
                  return curryFactory(newParams);
                }
              }
              return curryFactory([]);
            }
          `;

          const curryAst = customParser.parse(curryCode);
          // console.log(JSON.stringify(curryAst));

          // path.replaceWith(
          //   t.variableDeclaration("const", [
          //     t.variableDeclarator(
          //       t.identifier(functionName),
          //       t.callExpression(this.addHelper("currying"), [
          //         t.toExpression(path.node),
          //       ])
          //     ),
          //   ])
          // );

          path.replaceWith(
            // t.variableDeclaration("const", [
            //   t.variableDeclarator(
            //     t.identifier(functionName),
            //     t.callExpression(t.identifier("currying"), [
            //       t.toExpression(path.node),
            //     ])
            //   ),
            // ]),

            curryAst

            // t.functionDeclaration(
            //   t.identifier("currying"),
            //   [t.identifier("fn")],
            //   t.blockStatement([])
            // )
          );

          // hoist it
          const node = path.node;
          const currentScope = path.scope.path;
          path.remove();
          currentScope.unshiftContainer("body", node);
        }
      },
    },
  };
});
