# babel-plugin-transform-curry-function

## 插件说明
本插件基于 `babel` 开发，用于完成柯里化函数的快速实现。

## 环境依赖
nodejs v14.20.0+

## 使用步骤
- 安装插件
  ```bash
  yarn add babel-plugin-transform-mxy-curry-function --dev
  ```
- 配置插件
  - 如果是 `nodejs` 环境使用
    ```javascript
    // babel.config.js
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
    ```
  - 如果是 `浏览器` 环境使用
    ```javascript
    // babel.config.js
    module.exports = {
      presets: ["@babel/preset-env"],
      plugins: ["./lib/index.js"], // 使用自定义插件
    };
    ```
  > 如果你没有 `babel.config.js`, 你应该先去创建一个。

- 使用插件
  现在你可以使用新的 js 语法了
  ```javascript
  function @@ foo(a, b, c) { return a + b + c }

  console.log(foo(1)(2)(3));
  ```
  > 试试上面这段代码能否正常运行

  > 如果报错提示缺少某些依赖，你应该去安装它们，比如 `@babel/core` 、 `@babel/preset`

- nodejs 环境下如何运行
  
  你可以通过安装 `@babel/node` 来完成新语法在 `nodejs` 环境下的运行
  ```bash
  yarn add @babel/node --dev
  ```

  在 `package.json` 中加上
  ```json
  "scripts": {
    "start": "babel-node example.js"
  }
  ```

  > 现在你可以通过 `yarn start` 来运行新语法了

- ESLint 报错解决
  
  在项目根目录创建 `.eslintrc.js` 文件
  ```javascript
  module.exports = {
    global: {
      @@: true
    },
  };
  ```
  > 允许全局的 `@@` 标识符


