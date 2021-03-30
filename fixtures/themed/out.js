(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
  var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
  var __commonJS = (cb, mod) => () => (mod || cb((mod = {exports: {}}).exports, mod), mod.exports);
  var __exportStar = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, {get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable});
    }
    return target;
  };
  var __toModule = (module) => {
    return __exportStar(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? {get: () => module.default, enumerable: true} : {value: module, enumerable: true})), module);
  };

  // ../../packages/css/src/utils.ts
  function get(obj, path) {
    let result = obj;
    for (const key of path) {
      result = result[key];
    }
    return result;
  }
  function forEach(obj, fn) {
    for (const key in obj) {
      fn(obj[key], key);
    }
  }
  function omit(obj, omitKeys) {
    let result = {};
    for (const key in obj) {
      if (omitKeys.indexOf(key) === -1) {
        result[key] = obj[key];
      }
    }
    return result;
  }
  function mapKeys(obj, fn) {
    let result = {};
    for (const key in obj) {
      result[fn(obj[key], key)] = obj[key];
    }
    return result;
  }
  function walkObject(obj, fn, path = []) {
    const clone = obj.constructor();
    for (let key in obj) {
      const value = obj[key];
      const currentPath = [...path, key];
      if (typeof value === "object") {
        clone[key] = value ? walkObject(value, fn, currentPath) : value;
      } else if (typeof value === "string" || typeof value === "number") {
        clone[key] = fn(value, currentPath);
      } else {
        console.warn(`Skipping invalid key "${currentPath.join(".")}". Should be a string, number or object. Received: "${typeof value}"`);
      }
    }
    return clone;
  }
  function isEqual(a, b) {
    if (typeof a !== typeof b) {
      return false;
    }
    if (typeof a === "object") {
      const keys1 = Object.keys(a);
      const keys2 = Object.keys(b);
      if (keys1.length !== keys2.length) {
        return false;
      }
      for (const key in a) {
        if (!isEqual(a[key], b[key])) {
          return false;
        }
      }
      return true;
    } else {
      return a === b;
    }
  }
  var init_utils = __esm(() => {
  });

  // ../../packages/css/src/createInlineTheme.ts
  function createInlineTheme(themeVars, tokens) {
    const styles = {};
    walkObject(tokens, (value, path) => {
      const varName = get(themeVars, path);
      styles[varName.substring(4, varName.length - 1)] = String(value);
    });
    Object.defineProperty(styles, "toString", {
      value: function() {
        return Object.keys(this).map((key) => `${key}:${this[key]}`).join(";");
      },
      writable: false
    });
    return styles;
  }
  var init_createInlineTheme = __esm(() => {
    init_utils();
  });

  // ../../node_modules/cssesc/cssesc.js
  var require_cssesc = __commonJS((exports, module) => {
    /*! https://mths.be/cssesc v3.0.0 by @mathias */
    "use strict";
    var object = {};
    var hasOwnProperty = object.hasOwnProperty;
    var merge = function merge2(options, defaults) {
      if (!options) {
        return defaults;
      }
      var result = {};
      for (var key in defaults) {
        result[key] = hasOwnProperty.call(options, key) ? options[key] : defaults[key];
      }
      return result;
    };
    var regexAnySingleEscape = /[ -,\.\/:-@\[-\^`\{-~]/;
    var regexSingleEscape = /[ -,\.\/:-@\[\]\^`\{-~]/;
    var regexExcessiveSpaces = /(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g;
    var cssesc5 = function cssesc6(string, options) {
      options = merge(options, cssesc6.options);
      if (options.quotes != "single" && options.quotes != "double") {
        options.quotes = "single";
      }
      var quote = options.quotes == "double" ? '"' : "'";
      var isIdentifier = options.isIdentifier;
      var firstChar = string.charAt(0);
      var output = "";
      var counter = 0;
      var length = string.length;
      while (counter < length) {
        var character = string.charAt(counter++);
        var codePoint = character.charCodeAt();
        var value = void 0;
        if (codePoint < 32 || codePoint > 126) {
          if (codePoint >= 55296 && codePoint <= 56319 && counter < length) {
            var extra = string.charCodeAt(counter++);
            if ((extra & 64512) == 56320) {
              codePoint = ((codePoint & 1023) << 10) + (extra & 1023) + 65536;
            } else {
              counter--;
            }
          }
          value = "\\" + codePoint.toString(16).toUpperCase() + " ";
        } else {
          if (options.escapeEverything) {
            if (regexAnySingleEscape.test(character)) {
              value = "\\" + character;
            } else {
              value = "\\" + codePoint.toString(16).toUpperCase() + " ";
            }
          } else if (/[\t\n\f\r\x0B]/.test(character)) {
            value = "\\" + codePoint.toString(16).toUpperCase() + " ";
          } else if (character == "\\" || !isIdentifier && (character == '"' && quote == character || character == "'" && quote == character) || isIdentifier && regexSingleEscape.test(character)) {
            value = "\\" + character;
          } else {
            value = character;
          }
        }
        output += value;
      }
      if (isIdentifier) {
        if (/^-[-\d]/.test(output)) {
          output = "\\-" + output.slice(1);
        } else if (/\d/.test(firstChar)) {
          output = "\\3" + firstChar + " " + output.slice(1);
        }
      }
      output = output.replace(regexExcessiveSpaces, function($0, $1, $2) {
        if ($1 && $1.length % 2) {
          return $0;
        }
        return ($1 || "") + $2;
      });
      if (!isIdentifier && options.wrap) {
        return quote + output + quote;
      }
      return output;
    };
    cssesc5.options = {
      escapeEverything: false,
      isIdentifier: false,
      quotes: "single",
      wrap: false
    };
    cssesc5.version = "3.0.0";
    module.exports = cssesc5;
  });

  // ../../node_modules/css-selector-parser/lib/utils.js
  var require_utils = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    function isIdentStart(c) {
      return c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c === "-" || c === "_";
    }
    exports.isIdentStart = isIdentStart;
    function isIdent(c) {
      return c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c >= "0" && c <= "9" || c === "-" || c === "_";
    }
    exports.isIdent = isIdent;
    function isHex(c) {
      return c >= "a" && c <= "f" || c >= "A" && c <= "F" || c >= "0" && c <= "9";
    }
    exports.isHex = isHex;
    function escapeIdentifier(s) {
      var len = s.length;
      var result = "";
      var i = 0;
      while (i < len) {
        var chr = s.charAt(i);
        if (exports.identSpecialChars[chr]) {
          result += "\\" + chr;
        } else {
          if (!(chr === "_" || chr === "-" || chr >= "A" && chr <= "Z" || chr >= "a" && chr <= "z" || i !== 0 && chr >= "0" && chr <= "9")) {
            var charCode = chr.charCodeAt(0);
            if ((charCode & 63488) === 55296) {
              var extraCharCode = s.charCodeAt(i++);
              if ((charCode & 64512) !== 55296 || (extraCharCode & 64512) !== 56320) {
                throw Error("UCS-2(decode): illegal sequence");
              }
              charCode = ((charCode & 1023) << 10) + (extraCharCode & 1023) + 65536;
            }
            result += "\\" + charCode.toString(16) + " ";
          } else {
            result += chr;
          }
        }
        i++;
      }
      return result;
    }
    exports.escapeIdentifier = escapeIdentifier;
    function escapeStr(s) {
      var len = s.length;
      var result = "";
      var i = 0;
      var replacement;
      while (i < len) {
        var chr = s.charAt(i);
        if (chr === '"') {
          chr = '\\"';
        } else if (chr === "\\") {
          chr = "\\\\";
        } else if ((replacement = exports.strReplacementsRev[chr]) !== void 0) {
          chr = replacement;
        }
        result += chr;
        i++;
      }
      return '"' + result + '"';
    }
    exports.escapeStr = escapeStr;
    exports.identSpecialChars = {
      "!": true,
      '"': true,
      "#": true,
      $: true,
      "%": true,
      "&": true,
      "'": true,
      "(": true,
      ")": true,
      "*": true,
      "+": true,
      ",": true,
      ".": true,
      "/": true,
      ";": true,
      "<": true,
      "=": true,
      ">": true,
      "?": true,
      "@": true,
      "[": true,
      "\\": true,
      "]": true,
      "^": true,
      "`": true,
      "{": true,
      "|": true,
      "}": true,
      "~": true
    };
    exports.strReplacementsRev = {
      "\n": "\\n",
      "\r": "\\r",
      "	": "\\t",
      "\f": "\\f",
      "\v": "\\v"
    };
    exports.singleQuoteEscapeChars = {
      n: "\n",
      r: "\r",
      t: "	",
      f: "\f",
      "\\": "\\",
      "'": "'"
    };
    exports.doubleQuotesEscapeChars = {
      n: "\n",
      r: "\r",
      t: "	",
      f: "\f",
      "\\": "\\",
      '"': '"'
    };
  });

  // ../../node_modules/css-selector-parser/lib/parser-context.js
  var require_parser_context = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    var utils_1 = require_utils();
    function parseCssSelector(str, pos, pseudos, attrEqualityMods, ruleNestingOperators, substitutesEnabled) {
      var l = str.length;
      var chr = "";
      function getStr(quote, escapeTable) {
        var result = "";
        pos++;
        chr = str.charAt(pos);
        while (pos < l) {
          if (chr === quote) {
            pos++;
            return result;
          } else if (chr === "\\") {
            pos++;
            chr = str.charAt(pos);
            var esc = void 0;
            if (chr === quote) {
              result += quote;
            } else if ((esc = escapeTable[chr]) !== void 0) {
              result += esc;
            } else if (utils_1.isHex(chr)) {
              var hex = chr;
              pos++;
              chr = str.charAt(pos);
              while (utils_1.isHex(chr)) {
                hex += chr;
                pos++;
                chr = str.charAt(pos);
              }
              if (chr === " ") {
                pos++;
                chr = str.charAt(pos);
              }
              result += String.fromCharCode(parseInt(hex, 16));
              continue;
            } else {
              result += chr;
            }
          } else {
            result += chr;
          }
          pos++;
          chr = str.charAt(pos);
        }
        return result;
      }
      function getIdent() {
        var result = "";
        chr = str.charAt(pos);
        while (pos < l) {
          if (utils_1.isIdent(chr)) {
            result += chr;
          } else if (chr === "\\") {
            pos++;
            if (pos >= l) {
              throw Error("Expected symbol but end of file reached.");
            }
            chr = str.charAt(pos);
            if (utils_1.identSpecialChars[chr]) {
              result += chr;
            } else if (utils_1.isHex(chr)) {
              var hex = chr;
              pos++;
              chr = str.charAt(pos);
              while (utils_1.isHex(chr)) {
                hex += chr;
                pos++;
                chr = str.charAt(pos);
              }
              if (chr === " ") {
                pos++;
                chr = str.charAt(pos);
              }
              result += String.fromCharCode(parseInt(hex, 16));
              continue;
            } else {
              result += chr;
            }
          } else {
            return result;
          }
          pos++;
          chr = str.charAt(pos);
        }
        return result;
      }
      function skipWhitespace() {
        chr = str.charAt(pos);
        var result = false;
        while (chr === " " || chr === "	" || chr === "\n" || chr === "\r" || chr === "\f") {
          result = true;
          pos++;
          chr = str.charAt(pos);
        }
        return result;
      }
      function parse() {
        var res = parseSelector();
        if (pos < l) {
          throw Error('Rule expected but "' + str.charAt(pos) + '" found.');
        }
        return res;
      }
      function parseSelector() {
        var selector = parseSingleSelector();
        if (!selector) {
          return null;
        }
        var res = selector;
        chr = str.charAt(pos);
        while (chr === ",") {
          pos++;
          skipWhitespace();
          if (res.type !== "selectors") {
            res = {
              type: "selectors",
              selectors: [selector]
            };
          }
          selector = parseSingleSelector();
          if (!selector) {
            throw Error('Rule expected after ",".');
          }
          res.selectors.push(selector);
        }
        return res;
      }
      function parseSingleSelector() {
        skipWhitespace();
        var selector = {
          type: "ruleSet"
        };
        var rule = parseRule();
        if (!rule) {
          return null;
        }
        var currentRule = selector;
        while (rule) {
          rule.type = "rule";
          currentRule.rule = rule;
          currentRule = rule;
          skipWhitespace();
          chr = str.charAt(pos);
          if (pos >= l || chr === "," || chr === ")") {
            break;
          }
          if (ruleNestingOperators[chr]) {
            var op = chr;
            pos++;
            skipWhitespace();
            rule = parseRule();
            if (!rule) {
              throw Error('Rule expected after "' + op + '".');
            }
            rule.nestingOperator = op;
          } else {
            rule = parseRule();
            if (rule) {
              rule.nestingOperator = null;
            }
          }
        }
        return selector;
      }
      function parseRule() {
        var rule = null;
        while (pos < l) {
          chr = str.charAt(pos);
          if (chr === "*") {
            pos++;
            (rule = rule || {}).tagName = "*";
          } else if (utils_1.isIdentStart(chr) || chr === "\\") {
            (rule = rule || {}).tagName = getIdent();
          } else if (chr === ".") {
            pos++;
            rule = rule || {};
            (rule.classNames = rule.classNames || []).push(getIdent());
          } else if (chr === "#") {
            pos++;
            (rule = rule || {}).id = getIdent();
          } else if (chr === "[") {
            pos++;
            skipWhitespace();
            var attr = {
              name: getIdent()
            };
            skipWhitespace();
            if (chr === "]") {
              pos++;
            } else {
              var operator = "";
              if (attrEqualityMods[chr]) {
                operator = chr;
                pos++;
                chr = str.charAt(pos);
              }
              if (pos >= l) {
                throw Error('Expected "=" but end of file reached.');
              }
              if (chr !== "=") {
                throw Error('Expected "=" but "' + chr + '" found.');
              }
              attr.operator = operator + "=";
              pos++;
              skipWhitespace();
              var attrValue = "";
              attr.valueType = "string";
              if (chr === '"') {
                attrValue = getStr('"', utils_1.doubleQuotesEscapeChars);
              } else if (chr === "'") {
                attrValue = getStr("'", utils_1.singleQuoteEscapeChars);
              } else if (substitutesEnabled && chr === "$") {
                pos++;
                attrValue = getIdent();
                attr.valueType = "substitute";
              } else {
                while (pos < l) {
                  if (chr === "]") {
                    break;
                  }
                  attrValue += chr;
                  pos++;
                  chr = str.charAt(pos);
                }
                attrValue = attrValue.trim();
              }
              skipWhitespace();
              if (pos >= l) {
                throw Error('Expected "]" but end of file reached.');
              }
              if (chr !== "]") {
                throw Error('Expected "]" but "' + chr + '" found.');
              }
              pos++;
              attr.value = attrValue;
            }
            rule = rule || {};
            (rule.attrs = rule.attrs || []).push(attr);
          } else if (chr === ":") {
            pos++;
            var pseudoName = getIdent();
            var pseudo = {
              name: pseudoName
            };
            if (chr === "(") {
              pos++;
              var value = "";
              skipWhitespace();
              if (pseudos[pseudoName] === "selector") {
                pseudo.valueType = "selector";
                value = parseSelector();
              } else {
                pseudo.valueType = pseudos[pseudoName] || "string";
                if (chr === '"') {
                  value = getStr('"', utils_1.doubleQuotesEscapeChars);
                } else if (chr === "'") {
                  value = getStr("'", utils_1.singleQuoteEscapeChars);
                } else if (substitutesEnabled && chr === "$") {
                  pos++;
                  value = getIdent();
                  pseudo.valueType = "substitute";
                } else {
                  while (pos < l) {
                    if (chr === ")") {
                      break;
                    }
                    value += chr;
                    pos++;
                    chr = str.charAt(pos);
                  }
                  value = value.trim();
                }
                skipWhitespace();
              }
              if (pos >= l) {
                throw Error('Expected ")" but end of file reached.');
              }
              if (chr !== ")") {
                throw Error('Expected ")" but "' + chr + '" found.');
              }
              pos++;
              pseudo.value = value;
            }
            rule = rule || {};
            (rule.pseudos = rule.pseudos || []).push(pseudo);
          } else {
            break;
          }
        }
        return rule;
      }
      return parse();
    }
    exports.parseCssSelector = parseCssSelector;
  });

  // ../../node_modules/css-selector-parser/lib/render.js
  var require_render = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    var utils_1 = require_utils();
    function renderEntity(entity) {
      var res = "";
      switch (entity.type) {
        case "ruleSet":
          var currentEntity = entity.rule;
          var parts = [];
          while (currentEntity) {
            if (currentEntity.nestingOperator) {
              parts.push(currentEntity.nestingOperator);
            }
            parts.push(renderEntity(currentEntity));
            currentEntity = currentEntity.rule;
          }
          res = parts.join(" ");
          break;
        case "selectors":
          res = entity.selectors.map(renderEntity).join(", ");
          break;
        case "rule":
          if (entity.tagName) {
            if (entity.tagName === "*") {
              res = "*";
            } else {
              res = utils_1.escapeIdentifier(entity.tagName);
            }
          }
          if (entity.id) {
            res += "#" + utils_1.escapeIdentifier(entity.id);
          }
          if (entity.classNames) {
            res += entity.classNames.map(function(cn) {
              return "." + utils_1.escapeIdentifier(cn);
            }).join("");
          }
          if (entity.attrs) {
            res += entity.attrs.map(function(attr) {
              if ("operator" in attr) {
                if (attr.valueType === "substitute") {
                  return "[" + utils_1.escapeIdentifier(attr.name) + attr.operator + "$" + attr.value + "]";
                } else {
                  return "[" + utils_1.escapeIdentifier(attr.name) + attr.operator + utils_1.escapeStr(attr.value) + "]";
                }
              } else {
                return "[" + utils_1.escapeIdentifier(attr.name) + "]";
              }
            }).join("");
          }
          if (entity.pseudos) {
            res += entity.pseudos.map(function(pseudo) {
              if (pseudo.valueType) {
                if (pseudo.valueType === "selector") {
                  return ":" + utils_1.escapeIdentifier(pseudo.name) + "(" + renderEntity(pseudo.value) + ")";
                } else if (pseudo.valueType === "substitute") {
                  return ":" + utils_1.escapeIdentifier(pseudo.name) + "($" + pseudo.value + ")";
                } else if (pseudo.valueType === "numeric") {
                  return ":" + utils_1.escapeIdentifier(pseudo.name) + "(" + pseudo.value + ")";
                } else {
                  return ":" + utils_1.escapeIdentifier(pseudo.name) + "(" + utils_1.escapeIdentifier(pseudo.value) + ")";
                }
              } else {
                return ":" + utils_1.escapeIdentifier(pseudo.name);
              }
            }).join("");
          }
          break;
        default:
          throw Error('Unknown entity type: "' + entity.type + '".');
      }
      return res;
    }
    exports.renderEntity = renderEntity;
  });

  // ../../node_modules/css-selector-parser/lib/index.js
  var require_lib = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    var parser_context_1 = require_parser_context();
    var render_1 = require_render();
    var CssSelectorParser2 = function() {
      function CssSelectorParser3() {
        this.pseudos = {};
        this.attrEqualityMods = {};
        this.ruleNestingOperators = {};
        this.substitutesEnabled = false;
      }
      CssSelectorParser3.prototype.registerSelectorPseudos = function() {
        var pseudos = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          pseudos[_i] = arguments[_i];
        }
        for (var _a = 0, pseudos_1 = pseudos; _a < pseudos_1.length; _a++) {
          var pseudo = pseudos_1[_a];
          this.pseudos[pseudo] = "selector";
        }
        return this;
      };
      CssSelectorParser3.prototype.unregisterSelectorPseudos = function() {
        var pseudos = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          pseudos[_i] = arguments[_i];
        }
        for (var _a = 0, pseudos_2 = pseudos; _a < pseudos_2.length; _a++) {
          var pseudo = pseudos_2[_a];
          delete this.pseudos[pseudo];
        }
        return this;
      };
      CssSelectorParser3.prototype.registerNumericPseudos = function() {
        var pseudos = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          pseudos[_i] = arguments[_i];
        }
        for (var _a = 0, pseudos_3 = pseudos; _a < pseudos_3.length; _a++) {
          var pseudo = pseudos_3[_a];
          this.pseudos[pseudo] = "numeric";
        }
        return this;
      };
      CssSelectorParser3.prototype.unregisterNumericPseudos = function() {
        var pseudos = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          pseudos[_i] = arguments[_i];
        }
        for (var _a = 0, pseudos_4 = pseudos; _a < pseudos_4.length; _a++) {
          var pseudo = pseudos_4[_a];
          delete this.pseudos[pseudo];
        }
        return this;
      };
      CssSelectorParser3.prototype.registerNestingOperators = function() {
        var operators = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          operators[_i] = arguments[_i];
        }
        for (var _a = 0, operators_1 = operators; _a < operators_1.length; _a++) {
          var operator = operators_1[_a];
          this.ruleNestingOperators[operator] = true;
        }
        return this;
      };
      CssSelectorParser3.prototype.unregisterNestingOperators = function() {
        var operators = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          operators[_i] = arguments[_i];
        }
        for (var _a = 0, operators_2 = operators; _a < operators_2.length; _a++) {
          var operator = operators_2[_a];
          delete this.ruleNestingOperators[operator];
        }
        return this;
      };
      CssSelectorParser3.prototype.registerAttrEqualityMods = function() {
        var mods = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          mods[_i] = arguments[_i];
        }
        for (var _a = 0, mods_1 = mods; _a < mods_1.length; _a++) {
          var mod = mods_1[_a];
          this.attrEqualityMods[mod] = true;
        }
        return this;
      };
      CssSelectorParser3.prototype.unregisterAttrEqualityMods = function() {
        var mods = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          mods[_i] = arguments[_i];
        }
        for (var _a = 0, mods_2 = mods; _a < mods_2.length; _a++) {
          var mod = mods_2[_a];
          delete this.attrEqualityMods[mod];
        }
        return this;
      };
      CssSelectorParser3.prototype.enableSubstitutes = function() {
        this.substitutesEnabled = true;
        return this;
      };
      CssSelectorParser3.prototype.disableSubstitutes = function() {
        this.substitutesEnabled = false;
        return this;
      };
      CssSelectorParser3.prototype.parse = function(str) {
        return parser_context_1.parseCssSelector(str, 0, this.pseudos, this.attrEqualityMods, this.ruleNestingOperators, this.substitutesEnabled);
      };
      CssSelectorParser3.prototype.render = function(path) {
        return render_1.renderEntity(path).trim();
      };
      return CssSelectorParser3;
    }();
    exports.CssSelectorParser = CssSelectorParser2;
  });

  // ../../node_modules/dedent/dist/dedent.js
  var require_dedent = __commonJS((exports, module) => {
    "use strict";
    function dedent3(strings) {
      var raw = void 0;
      if (typeof strings === "string") {
        raw = [strings];
      } else {
        raw = strings.raw;
      }
      var result = "";
      for (var i = 0; i < raw.length; i++) {
        result += raw[i].replace(/\\\n[ \t]*/g, "").replace(/\\`/g, "`");
        if (i < (arguments.length <= 1 ? 0 : arguments.length - 1)) {
          result += arguments.length <= i + 1 ? void 0 : arguments[i + 1];
        }
      }
      var lines = result.split("\n");
      var mindent = null;
      lines.forEach(function(l) {
        var m = l.match(/^(\s+)\S+/);
        if (m) {
          var indent = m[1].length;
          if (!mindent) {
            mindent = indent;
          } else {
            mindent = Math.min(mindent, indent);
          }
        }
      });
      if (mindent !== null) {
        result = lines.map(function(l) {
          return l[0] === " " ? l.slice(mindent) : l;
        }).join("\n");
      }
      result = result.trim();
      return result.replace(/\\n/g, "\n");
    }
    if (typeof module !== "undefined") {
      module.exports = dedent3;
    }
  });

  // ../../packages/css/src/validateSelector.ts
  function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  }
  var import_css_selector_parser, import_cssesc, import_dedent, parser, validateSelector;
  var init_validateSelector = __esm(() => {
    import_css_selector_parser = __toModule(require_lib());
    import_cssesc = __toModule(require_cssesc());
    import_dedent = __toModule(require_dedent());
    parser = new import_css_selector_parser.CssSelectorParser();
    parser.registerSelectorPseudos("has");
    parser.registerNestingOperators(">", "+", "~");
    parser.registerAttrEqualityMods("^", "$", "*", "~");
    parser.enableSubstitutes();
    validateSelector = (selector, targetClassName) => {
      const replaceTarget = () => {
        const targetRegex = new RegExp(`.${escapeRegex((0, import_cssesc.default)(targetClassName, {isIdentifier: true}))}`, "g");
        return selector.replace(targetRegex, "&");
      };
      return selector.split(",").map((selectorPart) => {
        if (selectorPart.indexOf(targetClassName) === -1) {
          throw new Error(import_dedent.default`
          Invalid selector: ${replaceTarget()}
      
          Selectors must target the ampersand character ('&'), which refers to the generated class name, e.g. '&:nth-child(2n)'
        `);
        }
        let currentRule;
        try {
          const result = parser.parse(selectorPart);
          if (result.type === "ruleSet") {
            currentRule = result.rule;
          } else {
            throw new Error();
          }
        } catch (err) {
          throw new Error(`Invalid selector: ${replaceTarget()}`);
        }
        while (currentRule.rule) {
          currentRule = currentRule.rule;
        }
        const targetRule = currentRule;
        if (!Array.isArray(targetRule.classNames) || !targetRule.classNames.find((className) => className === targetClassName)) {
          throw new Error(import_dedent.default`
          Invalid selector: ${replaceTarget()}
      
          Style selectors must end with the '&' character (along with any modifiers), e.g. ${"`${parent} &`"} or ${"`${parent} &:hover`"}.
          
          This is to ensure that each style block only affects the styling of a single class.
          
          If your selector is targeting another class, you should move it to the style definition for that class, e.g. given we have styles for 'parent' and 'child' elements, instead of adding a selector of ${"`& ${child}`"}) to 'parent', you should add ${"`${parent} &`"} to 'child').
          
          If your selector is targeting something global, use the 'globalStyle' function instead, e.g. if you wanted to write ${"`& h1`"}, you should instead write 'globalStyle(${"`${parent} h1`"}, { ... })'
        `);
        }
      });
    };
  });

  // ../../packages/css/src/transformCss.ts
  function dashify(str) {
    return str.replace(/([A-Z])/g, "-$1").replace(/^ms-/, "-ms-").toLowerCase();
  }
  function transformCss({localClassNames: localClassNames2, cssObjs}) {
    const stylesheet = new Stylesheet(localClassNames2);
    for (const root2 of cssObjs) {
      stylesheet.processCssObj(root2);
    }
    return stylesheet.toCss();
  }
  var import_cssesc2, UNITLESS, simplePseudos, DOUBLE_SPACE, simplePseudoSet, specialKeys, Stylesheet;
  var init_transformCss = __esm(() => {
    import_cssesc2 = __toModule(require_cssesc());
    init_validateSelector();
    init_utils();
    UNITLESS = {
      boxFlex: true,
      boxFlexGroup: true,
      columnCount: true,
      flex: true,
      flexGrow: true,
      flexPositive: true,
      flexShrink: true,
      flexNegative: true,
      fontWeight: true,
      lineClamp: true,
      lineHeight: true,
      opacity: true,
      order: true,
      orphans: true,
      tabSize: true,
      widows: true,
      zIndex: true,
      zoom: true,
      fillOpacity: true,
      strokeDashoffset: true,
      strokeOpacity: true,
      strokeWidth: true
    };
    simplePseudos = [
      ":-moz-any-link",
      ":-moz-full-screen",
      ":-moz-placeholder",
      ":-moz-read-only",
      ":-moz-read-write",
      ":-ms-fullscreen",
      ":-ms-input-placeholder",
      ":-webkit-any-link",
      ":-webkit-full-screen",
      "::-moz-placeholder",
      "::-moz-progress-bar",
      "::-moz-range-progress",
      "::-moz-range-thumb",
      "::-moz-range-track",
      "::-moz-selection",
      "::-ms-backdrop",
      "::-ms-browse",
      "::-ms-check",
      "::-ms-clear",
      "::-ms-fill",
      "::-ms-fill-lower",
      "::-ms-fill-upper",
      "::-ms-reveal",
      "::-ms-thumb",
      "::-ms-ticks-after",
      "::-ms-ticks-before",
      "::-ms-tooltip",
      "::-ms-track",
      "::-ms-value",
      "::-webkit-backdrop",
      "::-webkit-input-placeholder",
      "::-webkit-progress-bar",
      "::-webkit-progress-inner-value",
      "::-webkit-progress-value",
      "::-webkit-slider-runnable-track",
      "::-webkit-slider-thumb",
      "::after",
      "::backdrop",
      "::before",
      "::cue",
      "::first-letter",
      "::first-line",
      "::grammar-error",
      "::placeholder",
      "::selection",
      "::spelling-error",
      ":active",
      ":after",
      ":any-link",
      ":before",
      ":blank",
      ":checked",
      ":default",
      ":defined",
      ":disabled",
      ":empty",
      ":enabled",
      ":first",
      ":first-child",
      ":first-letter",
      ":first-line",
      ":first-of-type",
      ":focus",
      ":focus-visible",
      ":focus-within",
      ":fullscreen",
      ":hover",
      ":in-range",
      ":indeterminate",
      ":invalid",
      ":last-child",
      ":last-of-type",
      ":left",
      ":link",
      ":only-child",
      ":only-of-type",
      ":optional",
      ":out-of-range",
      ":placeholder-shown",
      ":read-only",
      ":read-write",
      ":required",
      ":right",
      ":root",
      ":scope",
      ":target",
      ":valid",
      ":visited"
    ];
    DOUBLE_SPACE = "  ";
    simplePseudoSet = new Set(simplePseudos);
    specialKeys = [...simplePseudos, "@media", "@supports", "selectors"];
    Stylesheet = class {
      constructor(localClassNames2) {
        this.rules = [];
        this.conditionalRules = [];
        this.fontFaceRules = [];
        this.keyframesRules = [];
        this.localClassNameRegex = localClassNames2.length > 0 ? RegExp(`(${localClassNames2.join("|")})`, "g") : null;
      }
      processCssObj(root2) {
        if (root2.type === "fontFace") {
          this.fontFaceRules.push(root2.rule);
          return;
        }
        if (root2.type === "keyframes") {
          this.keyframesRules.push(root2);
          return;
        }
        const mainRule = omit(root2.rule, specialKeys);
        this.addRule({
          selector: root2.selector,
          rule: mainRule
        });
        this.transformSimplePsuedos(root2, root2.rule);
        this.transformMedia(root2, root2.rule["@media"]);
        this.transformSupports(root2, root2.rule["@supports"]);
        this.transformSelectors(root2, root2.rule);
      }
      addRule(cssRule) {
        const rule = this.transformVars(this.pixelifyProperties(cssRule.rule));
        const selector = this.transformSelector(cssRule.selector);
        if (cssRule.conditions) {
          this.conditionalRules.push({
            selector,
            rule,
            conditions: cssRule.conditions.sort()
          });
        } else {
          this.rules.push({
            selector,
            rule
          });
        }
      }
      pixelifyProperties(cssRule) {
        forEach(cssRule, (value, key) => {
          if (typeof value === "number" && value !== 0 && !UNITLESS[key]) {
            cssRule[key] = `${value}px`;
          }
        });
        return cssRule;
      }
      transformVars({vars: vars2, ...rest}) {
        if (!vars2) {
          return rest;
        }
        return {
          ...mapKeys(vars2, (_value, key) => {
            const matches = key.match(/^var\((.*)\)$/);
            if (matches) {
              return matches[1];
            }
            return key;
          }),
          ...rest
        };
      }
      transformSelector(selector) {
        return this.localClassNameRegex ? selector.replace(this.localClassNameRegex, (_, className, index) => {
          if (index > 0 && selector[index - 1] === ".") {
            return className;
          }
          return `.${(0, import_cssesc2.default)(className, {isIdentifier: true})}`;
        }) : selector;
      }
      transformSelectors(root2, rule, conditions) {
        forEach(rule.selectors, (selectorRule, selector) => {
          if (root2.type !== "local") {
            throw new Error(`Selectors are not allowed within ${root2.type === "global" ? '"globalStyle"' : '"selectors"'}`);
          }
          const transformedSelector = this.transformSelector(selector.replace(RegExp("&", "g"), root2.selector));
          validateSelector(transformedSelector, root2.selector);
          this.addRule({
            conditions,
            selector: transformedSelector,
            rule: omit(selectorRule, specialKeys)
          });
          const selectorRoot = {
            type: "selector",
            selector: transformedSelector,
            rule: selectorRule
          };
          this.transformSupports(selectorRoot, selectorRule["@supports"], conditions);
          this.transformMedia(selectorRoot, selectorRule["@media"], conditions);
        });
      }
      transformMedia(root2, rules, parentConditions = []) {
        forEach(rules, (mediaRule, query) => {
          const conditions = [`@media ${query}`, ...parentConditions];
          this.addRule({
            conditions,
            selector: root2.selector,
            rule: omit(mediaRule, specialKeys)
          });
          if (root2.type === "local") {
            this.transformSimplePsuedos(root2, mediaRule, conditions);
            this.transformSelectors(root2, mediaRule, conditions);
          }
          this.transformSupports(root2, mediaRule["@supports"], conditions);
        });
      }
      transformSupports(root2, rules, parentConditions = []) {
        forEach(rules, (supportsRule, query) => {
          const conditions = [`@supports ${query}`, ...parentConditions];
          this.addRule({
            conditions,
            selector: root2.selector,
            rule: omit(supportsRule, specialKeys)
          });
          if (root2.type === "local") {
            this.transformSimplePsuedos(root2, supportsRule, conditions);
            this.transformSelectors(root2, supportsRule, conditions);
          }
          this.transformMedia(root2, supportsRule["@media"], conditions);
        });
      }
      transformSimplePsuedos(root2, rule, conditions) {
        for (const key of Object.keys(rule)) {
          if (simplePseudoSet.has(key)) {
            if (root2.type !== "local") {
              throw new Error(`Simple pseudos are not valid in ${root2.type === "global" ? '"globalStyle"' : '"selectors"'}`);
            }
            this.addRule({
              conditions,
              selector: `${root2.selector}${key}`,
              rule: rule[key]
            });
          }
        }
      }
      toPostcssJs() {
        const styles = {};
        if (this.fontFaceRules.length > 0) {
          styles["@font-face"] = this.fontFaceRules;
        }
        this.keyframesRules.forEach((rule) => {
          styles[`@keyframes ${rule.name}`] = rule.rule;
        });
        for (const rule of [...this.rules, ...this.conditionalRules]) {
          if (rule.conditions && isEqual(styles[rule.selector], rule.rule)) {
            continue;
          }
          if (Object.keys(rule.rule).length === 0) {
            continue;
          }
          let styleNode = styles;
          for (const condition of rule.conditions || []) {
            if (!styleNode[condition]) {
              styleNode[condition] = {};
            }
            styleNode = styleNode[condition];
          }
          styleNode[rule.selector] = {
            ...styleNode[rule.selector],
            ...rule.rule
          };
        }
        return styles;
      }
      toCss() {
        const styles = this.toPostcssJs();
        function walkCss(v, indent = "") {
          const rules = [];
          for (const key of Object.keys(v)) {
            const value = v[key];
            if (value && Array.isArray(value)) {
              rules.push(...value.map((v2) => walkCss({[key]: v2}, indent).join("\n")));
            } else if (value && typeof value === "object") {
              rules.push(`${indent}${key} {
${walkCss(value, indent + DOUBLE_SPACE).join("\n")}
${indent}}`);
            } else {
              rules.push(`${indent}${key.startsWith("--") ? key : dashify(key)}: ${value};`);
            }
          }
          return rules;
        }
        return walkCss(styles);
      }
    };
  });

  // ../../packages/css/src/adapter.ts
  var adapter, setAdapter, appendCss, registerClassName;
  var init_adapter = __esm(() => {
    adapter = {
      appendCss: () => {
      },
      registerClassName: () => {
      },
      onEndFileScope: () => {
      }
    };
    setAdapter = (newAdapter) => {
      adapter = newAdapter;
    };
    appendCss = (...props) => {
      return adapter.appendCss(...props);
    };
    registerClassName = (...props) => {
      return adapter.registerClassName(...props);
    };
  });

  // ../../packages/css/src/runtimeAdapter.ts
  function getStylesheet(fileScope) {
    if (stylesheets[fileScope]) {
      return stylesheets[fileScope];
    }
    const styleEl = document.createElement("style");
    document.head.appendChild(styleEl);
    if (!styleEl.sheet) {
      throw new Error(`Couldn't create stylesheet`);
    }
    stylesheets[fileScope] = styleEl.sheet;
    return styleEl.sheet;
  }
  var stylesheets, localClassNames, bufferedCSSObjs, browserRuntimeAdapter;
  var init_runtimeAdapter = __esm(() => {
    init_transformCss();
    init_adapter();
    stylesheets = {};
    localClassNames = new Set();
    bufferedCSSObjs = [];
    browserRuntimeAdapter = {
      appendCss: (cssObj) => {
        bufferedCSSObjs.push(cssObj);
      },
      registerClassName: (className) => {
        localClassNames.add(className);
      },
      onEndFileScope: (fileScope) => {
        const css = transformCss({
          localClassNames: Array.from(localClassNames),
          cssObjs: bufferedCSSObjs
        });
        const stylesheet = getStylesheet(fileScope);
        const existingRuleCount = stylesheet.cssRules.length;
        let ruleIndex = 0;
        for (const rule of css) {
          try {
            if (ruleIndex < existingRuleCount) {
              stylesheet.deleteRule(ruleIndex);
            }
            stylesheet.insertRule(rule, ruleIndex++);
          } catch (e) {
            console.warn(`Failed to insert rule
${rule}`);
            stylesheet.insertRule(".--placeholder-rule--{}", ruleIndex - 1);
          }
        }
        while (ruleIndex < existingRuleCount) {
          stylesheet.deleteRule(ruleIndex++);
        }
        bufferedCSSObjs = [];
      }
    };
    if (typeof window !== "undefined") {
      setAdapter(browserRuntimeAdapter);
    }
  });

  // ../../node_modules/@emotion/hash/dist/hash.browser.esm.js
  function murmur2(str) {
    var h = 0;
    var k, i = 0, len = str.length;
    for (; len >= 4; ++i, len -= 4) {
      k = str.charCodeAt(i) & 255 | (str.charCodeAt(++i) & 255) << 8 | (str.charCodeAt(++i) & 255) << 16 | (str.charCodeAt(++i) & 255) << 24;
      k = (k & 65535) * 1540483477 + ((k >>> 16) * 59797 << 16);
      k ^= k >>> 24;
      h = (k & 65535) * 1540483477 + ((k >>> 16) * 59797 << 16) ^ (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
    }
    switch (len) {
      case 3:
        h ^= (str.charCodeAt(i + 2) & 255) << 16;
      case 2:
        h ^= (str.charCodeAt(i + 1) & 255) << 8;
      case 1:
        h ^= str.charCodeAt(i) & 255;
        h = (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
    }
    h ^= h >>> 13;
    h = (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
    return ((h ^ h >>> 15) >>> 0).toString(36);
  }
  var hash_browser_esm_default;
  var init_hash_browser_esm = __esm(() => {
    hash_browser_esm_default = murmur2;
  });

  // ../../packages/css/src/fileScope.ts
  function getFileScope() {
    if (fileScopes.length === 0) {
      throw new Error("New styles cannot be registered dynamically after initial boot. This is to ensure that styles are statically extractible.");
    }
    return fileScopes[0];
  }
  function getAndIncrementRefCounter() {
    return refCounter++;
  }
  var refCounter, fileScopes;
  var init_fileScope = __esm(() => {
    init_adapter();
    refCounter = 0;
    fileScopes = [];
  });

  // ../../packages/css/src/identifier.ts
  function getShortFileName() {
    const fileScope = getFileScope();
    const matches = fileScope.match(/.*\/(.*)\..*\..*$/);
    if (matches && matches[1]) {
      return matches[1];
    }
    return "";
  }
  function generateIdentifier(debugId) {
    const refCount = getAndIncrementRefCounter();
    const identifier = process.env.NODE_ENV !== "production" && debugId ? `${getShortFileName()}_${debugId}__${hash_browser_esm_default(getFileScope())}${refCount}` : `${hash_browser_esm_default(getFileScope())}${refCount}`;
    return identifier.match(/^[0-9]/) ? `_${identifier}` : identifier;
  }
  var init_identifier = __esm(() => {
    init_hash_browser_esm();
    init_fileScope();
  });

  // ../../packages/css/src/vars.ts
  function createVar(debugId) {
    const refCount = getAndIncrementRefCounter();
    const varName = process.env.NODE_ENV !== "production" && debugId ? `${debugId}__${hash_browser_esm_default(getFileScope())}${refCount}` : `${hash_browser_esm_default(getFileScope())}${refCount}`;
    const cssVarName = (0, import_cssesc3.default)(varName.match(/^[0-9]/) ? `_${varName}` : varName, {
      isIdentifier: true
    }).replace(/([A-Z])/g, "-$1").toLowerCase();
    return `var(--${cssVarName})`;
  }
  function fallbackVar(...values) {
    let finalValue = "";
    values.reverse().forEach((value) => {
      if (finalValue === "") {
        finalValue = String(value);
      } else {
        if (typeof value !== "string" || !/^var\(--.*\)$/.test(value)) {
          throw new Error(`Invalid variable name: ${value}`);
        }
        finalValue = value.replace(/\)$/, `, ${finalValue})`);
      }
    });
    return finalValue;
  }
  function assignVars(varContract, tokens) {
    const varSetters = {};
    walkObject(tokens, (value, path) => {
      varSetters[get(varContract, path)] = String(value);
    });
    return varSetters;
  }
  function createThemeVars(themeContract) {
    return walkObject(themeContract, (_value, path) => {
      return createVar(path.join("-"));
    });
  }
  var import_cssesc3;
  var init_vars = __esm(() => {
    init_hash_browser_esm();
    import_cssesc3 = __toModule(require_cssesc());
    init_fileScope();
    init_utils();
  });

  // ../../packages/css/src/theme.ts
  function createGlobalTheme(selector, arg2, arg3) {
    const shouldCreateVars = Boolean(!arg3);
    const themeVars = shouldCreateVars ? createThemeVars(arg2) : arg2;
    const tokens = shouldCreateVars ? arg2 : arg3;
    appendCss({
      type: "global",
      selector,
      rule: {vars: assignVars(themeVars, tokens)}
    }, getFileScope());
    if (shouldCreateVars) {
      return themeVars;
    }
  }
  function createTheme(arg1, arg2, arg3) {
    const themeClassName = generateIdentifier(typeof arg2 === "object" ? arg3 : arg2);
    registerClassName(themeClassName);
    const vars2 = typeof arg2 === "object" ? createGlobalTheme(themeClassName, arg1, arg2) : createGlobalTheme(themeClassName, arg1);
    return vars2 ? [themeClassName, vars2] : themeClassName;
  }
  var init_theme = __esm(() => {
    init_adapter();
    init_fileScope();
    init_identifier();
    init_vars();
  });

  // ../../packages/css/src/style.ts
  function style(rule, debugId) {
    const className = generateIdentifier(debugId);
    registerClassName(className);
    appendCss({type: "local", selector: className, rule}, getFileScope());
    return className;
  }
  function globalStyle(selector, rule) {
    appendCss({type: "global", selector, rule}, getFileScope());
  }
  function fontFace(rule, debugId) {
    const fontFamily = `"${(0, import_cssesc4.default)(generateIdentifier(debugId), {
      quotes: "double"
    })}"`;
    if ("fontFamily" in rule) {
      throw new Error(import_dedent2.default`
          This function creates and returns a hashed font-family name, so the "fontFamily" property should not be provided.
  
          If you'd like to define a globally scoped custom font, you can use the "globalFontFace" function instead.
        `);
    }
    appendCss({type: "fontFace", rule: {...rule, fontFamily}}, getFileScope());
    return fontFamily;
  }
  function globalFontFace(fontFamily, rule) {
    appendCss({type: "fontFace", rule: {...rule, fontFamily}}, getFileScope());
  }
  function keyframes(rule, debugId) {
    const name = (0, import_cssesc4.default)(generateIdentifier(debugId), {
      isIdentifier: true
    });
    appendCss({type: "keyframes", name, rule}, getFileScope());
    return name;
  }
  function globalKeyframes(name, rule) {
    appendCss({type: "keyframes", name, rule}, getFileScope());
  }
  function mapToStyles(...args) {
    if (typeof args[1] === "function") {
      const data = args[0];
      const mapData = args[1];
      const debugId2 = args[2];
      const classMap2 = {};
      for (const key in data) {
        classMap2[key] = style(mapData(data[key], key), debugId2 ? `${debugId2}_${key}` : key);
      }
      return classMap2;
    }
    const styleMap = args[0];
    const debugId = args[1];
    const classMap = {};
    for (const key in styleMap) {
      classMap[key] = style(styleMap[key], debugId ? `${debugId}_${key}` : key);
    }
    return classMap;
  }
  var import_cssesc4, import_dedent2;
  var init_style = __esm(() => {
    import_cssesc4 = __toModule(require_cssesc());
    import_dedent2 = __toModule(require_dedent());
    init_adapter();
    init_fileScope();
    init_identifier();
  });

  // ../../packages/css/src/index.ts
  var init_src = __esm(() => {
    init_runtimeAdapter();
    init_identifier();
    init_theme();
    init_style();
    init_vars();
  });

  // src/themes.css.ts
  var theme, vars, altTheme, responsiveTheme;
  var init_themes_css = __esm(() => {
    init_src();
    theme = style({});
    vars = createGlobalTheme(`:root, ${theme}`, {
      colors: {
        backgroundColor: "blue",
        text: "white"
      },
      space: {
        1: "4px",
        2: "8px",
        3: "12px"
      }
    });
    altTheme = createTheme(vars, {
      colors: {
        backgroundColor: "green",
        text: "white"
      },
      space: {
        1: "8px",
        2: "12px",
        3: "16px"
      }
    });
    responsiveTheme = style({
      vars: assignVars(vars, {
        colors: {
          backgroundColor: "pink",
          text: "purple"
        },
        space: {
          1: "6px",
          2: "12px",
          3: "18px"
        }
      }),
      "@media": {
        "screen and (min-width: 768px)": {
          vars: assignVars(vars.colors, {
            backgroundColor: "purple",
            text: "pink"
          })
        }
      }
    });
  });

  // src/shared.css.ts
  var shadow;
  var init_shared_css = __esm(() => {
    init_src();
    shadow = style({
      boxShadow: "0 0 5px red"
    });
    globalStyle("body", {
      backgroundColor: "skyblue"
    });
  });

  // src/styles.css.ts
  var impact, slide, container, button, undefinedVar1, undefinedVar2, opacity;
  var init_styles_css = __esm(() => {
    init_src();
    init_shared_css();
    init_themes_css();
    impact = fontFace({
      src: 'local("Impact")'
    });
    globalFontFace("MyGlobalComicSans", {
      src: 'local("Comic Sans MS")'
    });
    slide = keyframes({
      "0%": {
        transform: "translateY(-4px)"
      },
      "100%": {
        transform: "translateY(4px)"
      }
    });
    globalKeyframes("globalSlide", {
      "0%": {
        transform: "translateY(-4px)"
      },
      "100%": {
        transform: "translateY(4px)"
      }
    });
    container = style({
      animation: `3s infinite alternate globalSlide ease-in-out`,
      display: "flex",
      flexDirection: "column",
      gap: vars.space[2],
      padding: vars.space[3],
      "@media": {
        "only screen and (min-width: 500px)": {
          border: `1px solid ${vars.colors.backgroundColor}`
        }
      }
    });
    button = [
      style({
        animation: `3s infinite alternate ${slide} ease-in-out`,
        fontFamily: impact,
        backgroundColor: fallbackVar(vars.colors.backgroundColor, '"THIS FALLBACK VALUE SHOULD NEVER BE USED"'),
        color: vars.colors.text,
        "@media": {
          "only screen and (min-width: 500px)": {
            borderRadius: "9999px"
          }
        },
        selectors: {
          [`${altTheme} ${theme} ${container} &`]: {
            fontFamily: "MyGlobalComicSans",
            outline: "5px solid red"
          }
        }
      }),
      shadow
    ];
    undefinedVar1 = createVar();
    undefinedVar2 = createVar();
    opacity = mapToStyles({
      "1/2": fallbackVar(undefinedVar1, "0.5"),
      "1/4": fallbackVar(undefinedVar1, undefinedVar2, "0.25")
    }, (value) => ({opacity: value}));
  });

  // test-nodes.json
  var root, rootContainer, rootButton, altContainer, altButton, nestedRootContainer, nestedRootButton, inlineThemeContainer, inlineThemeButton, responsiveThemeContainer, responsiveThemeButton, test_nodes_default;
  var init_test_nodes = __esm(() => {
    root = "root";
    rootContainer = "rootContainer";
    rootButton = "rootButton";
    altContainer = "altContainer";
    altButton = "altButton";
    nestedRootContainer = "nestedRootContainer";
    nestedRootButton = "nestedRootButton";
    inlineThemeContainer = "inlineThemeContainer";
    inlineThemeButton = "inlineThemeButton";
    responsiveThemeContainer = "responsiveThemeContainer";
    responsiveThemeButton = "responsiveThemeButton";
    test_nodes_default = {
      root,
      rootContainer,
      rootButton,
      altContainer,
      altButton,
      nestedRootContainer,
      nestedRootButton,
      inlineThemeContainer,
      inlineThemeButton,
      responsiveThemeContainer,
      responsiveThemeButton
    };
  });

  // src/index.ts
  var require_src = __commonJS((exports, module) => {
    init_createInlineTheme();
    init_themes_css();
    init_styles_css();
    init_shared_css();
    init_test_nodes();
    var inlineTheme = createInlineTheme(vars, {
      colors: {
        backgroundColor: "orange",
        text: "black"
      },
      space: {
        1: "4px",
        2: "8px",
        3: "12px"
      }
    });
    function render() {
      document.body.innerHTML = `
  <div id="${test_nodes_default.root}" class="${shadow}"> 
    Root theme
    <div id="${test_nodes_default.rootContainer}" class="${container}">
      <button id="${test_nodes_default.rootButton}" class="${button.join(" ")}">Main theme button</button>
      <div class="${altTheme}"> 
        Alt theme
        <div id="${test_nodes_default.altContainer}" class="${container}">
          <button id="${test_nodes_default.altButton}" class="${button.join(" ")}">Alt theme button</button>
          <div class="${theme}"> 
            Back to root theme
            <div id="${test_nodes_default.nestedRootContainer}" class="${container}">
              <button id="${test_nodes_default.nestedRootButton}" class="${button.join(" ")}">Main theme button</button>
            <div style="${inlineTheme}">
              Inline theme
                <div id="${test_nodes_default.inlineThemeContainer}" class="${container}">
                  <button id="${test_nodes_default.inlineThemeButton}" class="${button.join(" ")} ${opacity["1/2"]}">Inline theme button</button>
                  <div class="${responsiveTheme}">
              Responsive theme
                <div id="${test_nodes_default.responsiveThemeContainer}" class="${container}">
                  <button id="${test_nodes_default.responsiveThemeButton}" class="${button.join(" ")}">Responsive theme button</button>
                </div>
              </div>
            </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
    }
    render();
    if (module.hot) {
      module.hot.accept(["./shared.css", "./styles.css", "./themes.css"], () => {
        render();
      });
    }
  });
  require_src();
})();
