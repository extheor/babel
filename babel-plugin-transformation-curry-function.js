const customParser = require("./packages/babel-parser/lib/index.js");

module.exports = ({ types: t }) => {
  return {
    parserOverride(code, opts) {
      return customParser.parse(code, opts);
    },

    visitor: {
      FunctionDeclaration(path) {
        if (path.get("curry").node) {
          // const foo = curry(function () { ... });
          path.node.curry = false;
          path.replaceWith(
            t.variableDeclaration(
              t.identifier(path.get("id.name").node),
              t.callExpression(t.identifier("currying"), [
                t.toExpression(path.node),
              ])
            )
          );
        }
      },
    },
  };
};
