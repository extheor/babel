import { declare } from "@babel/helper-plugin-utils";
import { types as t } from "@babel/core";
import customParser from "../babel-parser/lib/index.js.js";

export default declare(api => {
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

          path.replaceWith(
            t.variableDeclaration("const", [
              t.variableDeclarator(
                t.identifier(functionName),
                t.callExpression(this.addHelper("currying"), [
                  t.toExpression(path.node),
                ]),
              ),
            ]),
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
