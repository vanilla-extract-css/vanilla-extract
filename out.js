var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __exportStar = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __exportStar(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};

// fixtures/themed/src/styles.css.ts
__markAsModule(exports);
__export(exports, {
  button: () => button,
  container: () => container,
  opacity: () => opacity
});
var import_css3 = __toModule(require("@vanilla-extract/css"));

// fixtures/themed/src/shared.css.ts
var import_css = __toModule(require("@vanilla-extract/css"));
var shadow = (0, import_css.style)({
  boxShadow: "0 0 5px red"
});
(0, import_css.globalStyle)("body", {
  backgroundColor: "skyblue"
});

// fixtures/themed/src/themes.css.ts
var import_css2 = __toModule(require("@vanilla-extract/css"));
var theme = (0, import_css2.style)({});
var vars = (0, import_css2.createGlobalTheme)(`:root, ${theme}`, {
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
var altTheme = (0, import_css2.createTheme)(vars, {
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
var responsiveTheme = (0, import_css2.style)({
  vars: (0, import_css2.assignVars)(vars, {
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
      vars: (0, import_css2.assignVars)(vars.colors, {
        backgroundColor: "purple",
        text: "pink"
      })
    }
  }
});

// fixtures/themed/src/styles.css.ts
var impact = (0, import_css3.fontFace)({
  src: 'local("Impact")'
});
(0, import_css3.globalFontFace)("MyGlobalComicSans", {
  src: 'local("Comic Sans MS")'
});
var slide = (0, import_css3.keyframes)({
  "0%": {
    transform: "translateY(-4px)"
  },
  "100%": {
    transform: "translateY(4px)"
  }
});
(0, import_css3.globalKeyframes)("globalSlide", {
  "0%": {
    transform: "translateY(-4px)"
  },
  "100%": {
    transform: "translateY(4px)"
  }
});
var container = (0, import_css3.style)({
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
var button = [
  (0, import_css3.style)({
    animation: `3s infinite alternate ${slide} ease-in-out`,
    fontFamily: impact,
    backgroundColor: (0, import_css3.fallbackVar)(vars.colors.backgroundColor, '"THIS FALLBACK VALUE SHOULD NEVER BE USED"'),
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
var undefinedVar1 = (0, import_css3.createVar)();
var undefinedVar2 = (0, import_css3.createVar)();
var opacity = (0, import_css3.mapToStyles)({
  "1/2": (0, import_css3.fallbackVar)(undefinedVar1, "0.5"),
  "1/4": (0, import_css3.fallbackVar)(undefinedVar1, undefinedVar2, "0.25")
}, (value) => ({opacity: value}));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  button,
  container,
  opacity
});
