"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ClassScope = void 0;

var _scopeflags = require("./scopeflags");

var _location = require("./location");

var _parseError = require("../parse-error");

var _tokenizer = require("../tokenizer");

class ClassScope {
  privateNames = new Set();
  loneAccessors = new Map();
  undefinedPrivateNames = new Map();
}

exports.ClassScope = ClassScope;

class ClassScopeHandler {
  parser;
  stack = [];
  undefinedPrivateNames = new Map();

  constructor(parser) {
    this.parser = parser;
  }

  current() {
    return this.stack[this.stack.length - 1];
  }

  enter() {
    this.stack.push(new ClassScope());
  }

  exit() {
    const oldClassScope = this.stack.pop();
    const current = this.current();

    for (const [name, loc] of Array.from(oldClassScope.undefinedPrivateNames)) {
      if (current) {
        if (!current.undefinedPrivateNames.has(name)) {
          current.undefinedPrivateNames.set(name, loc);
        }
      } else {
        this.parser.raise(_parseError.Errors.InvalidPrivateFieldResolution, {
          at: loc,
          identifierName: name
        });
      }
    }
  }

  declarePrivateName(name, elementType, loc) {
    const {
      privateNames,
      loneAccessors,
      undefinedPrivateNames
    } = this.current();
    let redefined = privateNames.has(name);

    if (elementType & _scopeflags.CLASS_ELEMENT_KIND_ACCESSOR) {
      const accessor = redefined && loneAccessors.get(name);

      if (accessor) {
        const oldStatic = accessor & _scopeflags.CLASS_ELEMENT_FLAG_STATIC;
        const newStatic = elementType & _scopeflags.CLASS_ELEMENT_FLAG_STATIC;
        const oldKind = accessor & _scopeflags.CLASS_ELEMENT_KIND_ACCESSOR;
        const newKind = elementType & _scopeflags.CLASS_ELEMENT_KIND_ACCESSOR;
        redefined = oldKind === newKind || oldStatic !== newStatic;
        if (!redefined) loneAccessors.delete(name);
      } else if (!redefined) {
        loneAccessors.set(name, elementType);
      }
    }

    if (redefined) {
      this.parser.raise(_parseError.Errors.PrivateNameRedeclaration, {
        at: loc,
        identifierName: name
      });
    }

    privateNames.add(name);
    undefinedPrivateNames.delete(name);
  }

  usePrivateName(name, loc) {
    let classScope;

    for (classScope of this.stack) {
      if (classScope.privateNames.has(name)) return;
    }

    if (classScope) {
      classScope.undefinedPrivateNames.set(name, loc);
    } else {
      this.parser.raise(_parseError.Errors.InvalidPrivateFieldResolution, {
        at: loc,
        identifierName: name
      });
    }
  }

}

exports.default = ClassScopeHandler;

//# sourceMappingURL=class-scope.js.map
