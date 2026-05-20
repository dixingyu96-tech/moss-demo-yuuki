import fs from "node:fs";
import path from "node:path";

const workspaceRoot = process.cwd();
const lightPath = process.argv[2] ?? "/Users/yuki/Downloads/Light.tokens.json";
const mossPath = process.argv[3] ?? "/Users/yuki/Downloads/Moss.tokens.json";

const lightJson = JSON.parse(fs.readFileSync(lightPath, "utf8"));
const mossJson = JSON.parse(fs.readFileSync(mossPath, "utf8"));
const lightMoss = lightJson["00 Moss"];

function pickLightGroup(root, groupName) {
  return (
    root?.[groupName] ??
    root?.[`*${groupName}`] ??
    root?.[groupName.replace(/^\*/, "")] ??
    root?.[`*${groupName.replace(/^\*/, "")}`] ??
    null
  );
}

const rawGroupMap = {
  "品牌色": "brand-light",
  "红色": "red-light",
  "橙色": "orange-light",
  "黄色": "yellow-light",
  "*玉米黄": "corn-yellow-light",
  "*柠檬绿": "lemon-green-light",
  "*叶绿": "leaf-green-light",
  "绿色": "green-light",
  "鸭绿色": "duck-green-light",
  "青色": "cyan-light",
  "蓝色": "blue-light",
  "靛蓝": "indigo-light",
  "紫色": "purple-light",
  "紫红色": "magenta-light",
  "*丁香紫": "lilac-light",
  "*粉色": "pink-light",
  "蓝灰色": "blue-gray-light"
};

const aiGroupMap = {
  "AI Color 1": "ai-color-1-light",
  "AI Color 2": "ai-color-2-light",
  "AI Color 3": "ai-color-3-light",
  "AI Color 4": "ai-color-4-light"
};

function tokenValue(token) {
  return token?.$value ?? token?.value;
}

function getPath(root, pathParts) {
  return pathParts.reduce((current, part) => current?.[part], root);
}

function getToken(pathParts) {
  const token = getPath(mossJson, pathParts);
  const value = tokenValue(token);
  if (value === undefined) {
    throw new Error(`Missing token: ${pathParts.join(".")}`);
  }
  return value;
}

function walkTokens(obj, pathParts = [], out = []) {
  if (!obj || typeof obj !== "object") return out;
  const value = tokenValue(obj);
  if (value !== undefined) {
    out.push({ path: pathParts, name: pathParts.at(-1), value });
    return out;
  }
  for (const [key, child] of Object.entries(obj)) {
    if (!key.startsWith("$")) walkTokens(child, [...pathParts, key], out);
  }
  return out;
}

const mossEntries = walkTokens(mossJson);

function findTokenByName(name) {
  const entry = mossEntries.find((item) => item.name === name);
  if (!entry) throw new Error(`Missing Moss token named: ${name}`);
  return entry.value;
}

function roundAlpha(alpha) {
  return Number(alpha.toFixed(2)).toString();
}

function rgbaFromValue(value) {
  const [r, g, b] = value.components.map((component) => Math.round(component * 255));
  return `rgba(${r}, ${g}, ${b}, ${roundAlpha(value.alpha)})`;
}

function colorToCss(value) {
  if (typeof value === "string") return referenceToCss(value);
  if (value?.components && typeof value.alpha === "number") {
    return value.alpha === 1 ? value.hex.toUpperCase() : rgbaFromValue(value);
  }
  return String(value);
}

function cssColor(value) {
  if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) {
    return referenceToCss(value);
  }
  return colorToCss(value);
}

function px(value) {
  return `${Number(value)}px`;
}

function cssNameFromReferenceName(name) {
  return name
    .replace(/\(.+?\)/g, "")
    .replace(/^colorBgTexActive$/, "colorBgTextActive");
}

function referenceToCss(reference) {
  if (!reference.startsWith("{") || !reference.endsWith("}")) return reference;
  const rawPath = reference.slice(1, -1);
  const name = rawPath.split(".").at(-1);

  const paletteMap = [
    [/^colorBrand-(\d+)$/, (_, step) => `var(--color-brand-light-${step})`],
    [/^colorWarning-(\d+)$/, (_, step) => `var(--color-yellow-light-${step})`],
    [/^colorError-(\d+)$/, (_, step) => `var(--color-red-light-${step})`],
    [/^colorSuccess-(\d+)$/, (_, step) => `var(--color-green-light-${step})`],
    [/^colorInfo-(\d+)$/, (_, step) => `var(--color-blue-light-${step})`],
    [/^colorGrey-(\d+)$/, (_, step) => `var(--color-neutral-light-${Number(step) - 1})`],
    [/^colorTransparent-(\d+)$/, (_, step) => `var(--color-black-alpha-light-${step})`],
    [/^colorTransWhite-(\d+)$/, (_, step) => `var(--color-white-alpha-light-${step})`]
  ];

  for (const [regex, toVar] of paletteMap) {
    const match = name.match(regex);
    if (match) return toVar(...match);
  }

  return `var(--${cssNameFromReferenceName(name)})`;
}

function addColorToken(store, key, token) {
  store[key] = colorToCss(tokenValue(token));
}

const palette = {};

for (const [groupName, prefix] of Object.entries(rawGroupMap)) {
  const group = pickLightGroup(lightMoss, groupName);
  if (!group) {
    throw new Error(`Missing Light token group: ${groupName}`);
  }
  for (const [step, value] of Object.entries(group)) {
    addColorToken(palette, `${prefix}-${step}`, value);
  }
}

for (const [groupName, prefix] of Object.entries(aiGroupMap)) {
  const group = lightMoss?.AI?.[groupName];
  if (!group) {
    throw new Error(`Missing Light AI token group: ${groupName}`);
  }
  for (const [step, value] of Object.entries(group)) {
    addColorToken(palette, `${prefix}-${step}`, value);
  }
}

for (const [step, value] of Object.entries(lightMoss["灰度色"])) {
  addColorToken(palette, `neutral-light-${Number(step) - 1}`, value);
}

for (const [step, value] of Object.entries(lightMoss["透明色-黑"])) {
  addColorToken(palette, `black-alpha-light-${step}`, value);
}

for (const [step, value] of Object.entries(lightMoss["透明色-白"])) {
  addColorToken(palette, `white-alpha-light-${step}`, value);
}

const shadowGroup = lightMoss["投影"] ?? lightMoss["阴影"];
if (!shadowGroup) {
  throw new Error("Missing Light shadow group: 投影/阴影");
}
for (const [step, value] of Object.entries(shadowGroup)) {
  addColorToken(palette, `shadow-alpha-${step}`, value);
}

const legacyAliases = {
  ...Object.fromEntries(Array.from({ length: 11 }, (_, index) => [`spring-green-light-${index + 1}`, palette[`green-light-${index + 1}`]])),
  ...Object.fromEntries(Array.from({ length: 11 }, (_, index) => [`sea-green-light-${index + 1}`, palette[`duck-green-light-${index + 1}`]])),
  ...Object.fromEntries(Array.from({ length: 11 }, (_, index) => [`sky-blue-light-${index + 1}`, palette[`cyan-light-${index + 1}`]])),
  ...Object.fromEntries(Array.from({ length: 11 }, (_, index) => [`cornflower-blue-light-${index + 1}`, palette[`indigo-light-${index + 1}`]])),
  ...Object.fromEntries(Array.from({ length: 11 }, (_, index) => [`coral-red-light-${index + 1}`, palette[`red-light-${index + 1}`]]))
};

Object.assign(palette, legacyAliases);

const orderedPaletteKeys = [
  ...Object.keys(rawGroupMap).flatMap((groupName) => {
    const group = pickLightGroup(lightMoss, groupName);
    if (!group) throw new Error(`Missing Light token group for ordered keys: ${groupName}`);
    return Object.keys(group).map((step) => `${rawGroupMap[groupName]}-${step}`);
  }),
  ...Object.keys(aiGroupMap).flatMap((groupName) =>
    Object.keys(lightMoss.AI[groupName]).map((step) => `${aiGroupMap[groupName]}-${step}`)
  ),
  ...Object.keys(lightMoss["灰度色"]).map((step) => `neutral-light-${Number(step) - 1}`),
  ...Object.keys(lightMoss["透明色-黑"]).map((step) => `black-alpha-light-${step}`),
  ...Object.keys(lightMoss["透明色-白"]).map((step) => `white-alpha-light-${step}`),
  ...Object.keys(shadowGroup).map((step) => `shadow-alpha-${step}`),
  ...Object.keys(legacyAliases)
];

function cssVarsFromObject(groupName, values) {
  return Object.entries(values).map(([key, value]) => {
    const normalizedValue = groupName === "shadow" ? normalizeShadowCssValue(value) : value;
    const varName = groupName === "shadow" && key === "shadow" ? "--shadow" : `--${groupName}-${key}`;
    return `  ${varName}: ${normalizedValue};`;
  });
}

function normalizeShadowCssValue(value) {
  const shadowAlphaVars = {
    "rgba(11, 11, 11, 0.02)": "var(--color-shadow-alpha-1)",
    "rgba(11, 11, 11, 0.04)": "var(--color-shadow-alpha-2)",
    "rgba(11, 11, 11, 0.05)": "var(--color-shadow-alpha-3)",
    "rgba(11, 11, 11, 0.06)": "var(--color-shadow-alpha-4)",
    "rgba(11, 11, 11, 0.1)": "var(--color-shadow-alpha-5)"
  };

  return Object.entries(shadowAlphaVars).reduce(
    (current, [rawColor, token]) => current.replaceAll(rawColor, token),
    value
  );
}

function toPxMap(input) {
  return Object.fromEntries(Object.entries(input).map(([key, value]) => [key, px(value)]));
}

const fontSize = {
  xs: px(findTokenByName("fontSizeSM")),
  sm: px(findTokenByName("fontSize")),
  md: px(findTokenByName("fontSize")),
  lg: px(findTokenByName("fontSizeLG")),
  xl: px(findTokenByName("fontSizeXL")),
  xxl: px(findTokenByName("fontSize2XL")),
  xxml: px(findTokenByName("fontSizeHeading3")),
  xxxl: px(findTokenByName("fontSizeHeading1"))
};

const fontSizeNative = {
  sm: px(findTokenByName("fontSizeSM")),
  msm: px(findTokenByName("fontSizeMSM")),
  md: px(findTokenByName("fontSize")),
  lg: px(findTokenByName("fontSizeLG")),
  xl: px(findTokenByName("fontSizeXL")),
  "2xl": px(findTokenByName("fontSize2XL"))
};

const headingFontSize = {
  h5: px(findTokenByName("fontSizeHeading5")),
  h4: px(findTokenByName("fontSizeHeading4")),
  h3: px(findTokenByName("fontSizeHeading3")),
  h2: px(findTokenByName("fontSizeHeading2")),
  h1: px(findTokenByName("fontSizeHeading1"))
};

const iconSize = {
  xxs: px(findTokenByName("iconSize2SM")),
  sm: px(findTokenByName("iconSizeSM")),
  md: px(findTokenByName("iconSize")),
  lg: px(findTokenByName("iconSizeLG"))
};

const fontWeight = {
  300: "300",
  400: "400",
  500: "500",
  600: "600",
  700: "700"
};

const lineHeight = {
  sm: px(findTokenByName("lineHeightSM")),
  md: px(findTokenByName("lineHeight")),
  lg: px(findTokenByName("lineHeightLG")),
  xl: px(findTokenByName("lineHeightXL")),
  xxl: px(findTokenByName("lineHeight2XL")),
  xxml: px(findTokenByName("lineHeightHeading3")),
  xxxl: px(findTokenByName("lineHeightHeading1"))
};

const headingLineHeight = {
  h5: px(findTokenByName("lineHeightHeading5")),
  h4: px(findTokenByName("lineHeightHeading4")),
  h3: px(findTokenByName("lineHeightHeading3")),
  h2: px(findTokenByName("lineHeightHeading2")),
  h1: px(findTokenByName("lineHeightHeading1"))
};

const borderRadius = {
  xs: px(findTokenByName("borderRadiusXS")),
  sm: px(findTokenByName("borderRadiusSM")),
  md: px(findTokenByName("borderRadius")),
  lg: px(findTokenByName("borderRadiusLG")),
  xl: px(findTokenByName("borderRadiusXL")),
  xxl: "24px"
};

const spacing = toPxMap({
  xxs: findTokenByName("gapXS"),
  xs: findTokenByName("gapSM"),
  sm: findTokenByName("gap"),
  md: findTokenByName("gapXL"),
  lg: findTokenByName("gap2XL"),
  xl: findTokenByName("gap3XL"),
  xxl: findTokenByName("gap4XL"),
  xxxl: findTokenByName("gap5XL"),
  "4xl": 48
});

const layoutPadding = toPxMap({
  "3xs": findTokenByName("paddingLayout3XS"),
  "2xs": findTokenByName("paddingLayout2XS"),
  xs: findTokenByName("paddingLayoutXS"),
  sm: findTokenByName("paddingLayoutSM"),
  md: findTokenByName("paddingLayout"),
  lg: findTokenByName("paddingLayoutLG"),
  xl: findTokenByName("paddingLayoutXL"),
  "2xl": findTokenByName("paddingLayout2XL"),
  "3xl": findTokenByName("paddingLayout3XL")
});

const padding = toPxMap({
  zero: findTokenByName("paddingZero"),
  xxs: findTokenByName("padding2XS"),
  xs: findTokenByName("paddingXS"),
  sm: findTokenByName("paddingSM"),
  md: findTokenByName("padding"),
  lg: findTokenByName("paddingLG"),
  xl: findTokenByName("paddingXL"),
  xxl: findTokenByName("padding2XL"),
  xxxl: findTokenByName("padding3XL"),
  xxxxl: findTokenByName("padding4XL")
});

const gap = toPxMap({
  xs: findTokenByName("gapXS"),
  sm: findTokenByName("gapSM"),
  md: findTokenByName("gap"),
  lg: findTokenByName("gapLG"),
  xl: findTokenByName("gapXL"),
  xxl: findTokenByName("gap2XL"),
  xxxl: findTokenByName("gap3XL"),
  xxxxl: findTokenByName("gap4XL"),
  "5xl": findTokenByName("gap5XL")
});

const margin = { ...gap };

const lineWidth = {
  regular: px(findTokenByName("lineWidth")),
  bold: px(findTokenByName("lineWidthBold")),
  outline: px(findTokenByName("controlOutlineWidth")),
  focus: px(findTokenByName("lineWidthFocus"))
};

const height = {
  md: px(findTokenByName("lineHeightSM")),
  "control-xs": px(findTokenByName("controlHeightXS")),
  "control-sm": px(findTokenByName("controlHeightSM")),
  "control-msm": px(findTokenByName("controlHeightMSM")),
  "control-md": px(findTokenByName("controlHeight")),
  "control-mlg": px(findTokenByName("controlHeightMLG")),
  "control-lg": px(findTokenByName("controlHeightLG"))
};

const shadowColor = (shadowName, colorName) => colorToCss(getToken(["🔵基础", "盒子阴影", shadowName, colorName]));
const boxShadow = {
  subtle: `0 0 2px 0 ${shadowColor("boxShadowSubtle", "Color 1")}, 0 1px 4px 0 ${shadowColor("boxShadowSubtle", "Color 2")}`,
  shadow: `0 0 2px 0 ${shadowColor("boxShadow", "Color 1")}, 0 4px 8px 0 ${shadowColor("boxShadow", "Color 2")}, 0 4px 24px 6px ${shadowColor("boxShadow", "Color 3")}`,
  secondary: `0 0 6px 0 ${shadowColor("boxShadowSecondary", "Color 1")}, 0 4px 12px 0 ${shadowColor("boxShadowSecondary", "Color 2")}, 0 4px 24px 6px ${shadowColor("boxShadowSecondary", "Color 3")}`,
  tertiary: "0 0 5px 0 var(--color-shadow-alpha-4), 0 10px 24px -2px var(--color-shadow-alpha-5), 0 10px 48px 12px var(--color-shadow-alpha-2)",
  warningOutline: `0 0 0 ${lineWidth.outline} ${cssColor(findTokenByName("colorControlWarningOutline"))}`,
  errorOutline: `0 0 0 ${lineWidth.outline} ${cssColor(findTokenByName("colorControlErrorOutline"))}`
};

const textColor = {
  default: "var(--colorText)",
  secondary: "var(--colorTextSecondary)",
  description: "var(--colorTextDescription)",
  disabled: "var(--colorTextDisabled)",
  quaternary: "var(--colorTextQuaternary)",
  "icon-normal": "var(--colorIconNormal)"
};

const opacity = {
  loading: String(Number(findTokenByName("opacityLoading")) / 100)
};

const themeTokens = {
  fontSize,
  fontSizeNative,
  headingFontSize,
  iconSize,
  fontWeight,
  lineHeight,
  headingLineHeight,
  borderRadius,
  spacing,
  layoutPadding,
  padding,
  gap,
  margin,
  flex: { 0: "0 0 auto" },
  lineWidth,
  boxShadow,
  textColor,
  height,
  opacity
};

function objectToTs(obj, indent = 2) {
  return JSON.stringify(obj, null, indent)
    .replace(/"([A-Za-z_$][\w$]*)":/g, "$1:")
    .replace(/"0":/g, "0:");
}

const semanticPairs = [
  ["Brand", ["colorPrimary", "colorPrimaryActive", "colorPrimaryHover", "colorPrimaryBg", "colorPrimaryBgActive", "colorPrimaryBgHover", "colorPrimaryBorder", "colorPrimaryBorderHover", "colorPrimaryText", "colorPrimaryTextActive", "colorPrimaryTextHover", "colorControlOutline"]],
  ["Success", ["colorSuccess", "colorSuccessActive", "colorSuccessHover", "colorSuccessBg", "colorSuccessBgHover", "colorSuccessBorder", "colorSuccessBorderHover", "colorSuccessText", "colorSuccessTextActive", "colorSuccessTextHover"]],
  ["Warning", ["colorWarning", "colorWarningActive", "colorWarningHover", "colorWarningBg", "colorWarningBgHover", "colorWarningBorder", "colorWarningBorderHover", "colorWarningText", "colorWarningTextActive", "colorWarningTextHover", "colorControlWarningOutline"]],
  ["Error", ["colorError", "colorErrorActive", "colorErrorHover", "colorErrorBg", "colorErrorBgActive", "colorErrorBgHover", "colorErrorBorder", "colorErrorBorderHover", "colorErrorText", "colorErrorTextActive", "colorErrorTextHover", "colorControlErrorOutline"]],
  ["Info", ["colorInfo", "colorInfoActive", "colorInfoHover", "colorInfoBg", "colorInfoBgHover", "colorInfoBorder", "colorInfoBorderHover", "colorInfoText", "colorInfoTextActive", "colorInfoTextHover"]]
];

const neutralPairs = [
  ["colorZero", "colorZero"],
  ["colorWhite", "colorWhite"],
  ["colorWhiteFixation", "colorWhiteFixation"],
  ["colorBlack", "colorBlack"],
  ["colorText", "colorText(T1)"],
  ["colorTextSecondary", "colorTextSecondary(T2)"],
  ["colorTextTertiary", "colorTextTertiary(T3)"],
  ["colorTextQuaternary", "colorTextQuaternary(T4)"],
  ["colorTextPlaceholder", "colorTextPlaceholder"],
  ["colorTextDescription", "colorTextDescription"],
  ["colorTextDisabled", "colorTextDisabled"],
  ["colorTextDataDisabled", "colorTextDataDisabled"],
  ["colorTextHeading", "colorTextHeading"],
  ["colorTextWhite", "colorTextWhite"],
  ["colorTextWhiteFixation", "colorTextWhiteFixation"],
  ["colorTextLabel", "colorTextLabel"],
  ["colorIcon", "colorIcon"],
  ["colorIconHover", "colorIconHover"],
  ["colorIconActive", "colorIconActive"],
  ["colorIconNormal", "colorIconNormal"],
  ["colorIconDisabled", "colorIconDisabled"],
  ["colorBorderPrimary", "colorBorderPrimary"],
  ["colorBorder", "colorBorder"],
  ["colorBorderSecondary", "colorBorderSecondary"],
  ["colorBorderTertiary", "colorBorderTertiary"],
  ["colorSplit", "colorSplit"],
  ["colorSplitWhite", "colorSplitWhite"],
  ["colorFill", "colorFill"],
  ["colorFillSecondary", "colorFillSecondary"],
  ["colorFillTertiary", "colorFillTertiary"],
  ["colorFillQuaternary", "colorFillQuaternary"],
  ["colorBgContainer", "colorBgContainer"],
  ["colorBgContainerSecondary", "colorBgContainerSecondary"],
  ["colorBgContainerTertiary", "colorBgContainerTertiary"],
  ["colorBgContainerGrey", "colorBgContainerGrey"],
  ["colorBgContainerGreySecondary", "colorBgContainerGreySecondary"],
  ["colorBgContainerGreyTertiary", "colorBgContainerGreyTertiary"],
  ["colorBgContainerDisabled", "colorBgContainerDisabled"],
  ["colorBgElevated", "colorBgElevated"],
  ["colorBgElevaterFixation", "colorBgElevaterFixation"],
  ["colorBgSpotlight", "colorBgSpotlight"],
  ["colorBgShape", "colorBgShape"],
  ["colorBgMaskWhite", "colorBgMaskWhite"]
];

const foundationPairs = [
  ["colorFillAlter", "colorFillAlter"],
  ["colorFillContent", "colorFillContent"],
  ["colorBgTextNormalHover", "colorBgTextNormalHover"],
  ["colorBgTextNormalActive", "colorBgTextNormalActive"],
  ["colorBgTextHover", "colorBgTextHover"],
  ["colorBgTextActive", "colorBgTexActive"],
  ["colorBgTextErrorHover", "colorBgTextErrorHover"],
  ["colorBgTextErrorActive", "colorBgTextErrorActive"],
  ["controlItemBgActive", "controlItemBgActive"],
  ["controlItemBgActiveHover", "controlItemBgActiveHover"],
  ["controlItemBgActiveDisabled", "controlItemBgActiveDisabled"],
  ["controlItemTextActive", "controlItemTextActive"]
];

function semanticLine(cssName, sourceName = cssName) {
  return `  --${cssName}: ${cssColor(findTokenByName(sourceName))};`;
}

const semanticLines = [":root {"];
for (const [section, names] of semanticPairs) {
  semanticLines.push(`  /* ${section} */`);
  semanticLines.push(...names.map((name) => semanticLine(name)));
  semanticLines.push("");
}
semanticLines.push("  /* Neutral */");
semanticLines.push(...neutralPairs.map(([cssName, sourceName]) => semanticLine(cssName, sourceName)));
semanticLines.push("");
semanticLines.push("  /* Foundation aliases from Moss */");
semanticLines.push(...foundationPairs.map(([cssName, sourceName]) => semanticLine(cssName, sourceName)));
semanticLines.push("", "  /* Backward-compatible aliases for current project */");
semanticLines.push(
  "  --brand-primary: var(--colorPrimary);",
  "  --brand-primary-soft: var(--colorPrimaryBg);",
  "  --brand-primary-muted: var(--colorPrimaryBgHover);",
  "  --brand-primary-ghost: var(--colorPrimaryBg);",
  "  --brand-border-soft: var(--colorPrimaryBorder);",
  "",
  "  --text-primary: var(--colorText);",
  "  --text-secondary: var(--colorTextSecondary);",
  "  --text-tertiary: var(--colorTextTertiary);",
  "  --text-muted: var(--colorTextDescription);",
  "",
  "  --icon-default: var(--colorIconNormal);",
  "  --icon-strong: var(--colorIconActive);",
  "  --icon-accent: var(--colorControlOutline);",
  "",
  "  --surface-base: var(--colorBgContainer);",
  "  --surface-canvas: var(--colorBgContainerGrey);",
  "  --surface-subtle: var(--colorBgContainerGreySecondary);",
  "  --surface-soft: var(--colorBgContainerGreyTertiary);",
  "  --surface-hover: var(--colorBgContainerGreySecondary);",
  "  --surface-info: var(--colorInfoBg);",
  "  --surface-brand-soft: var(--colorPrimaryBg);",
  "  --surface-brand-muted: var(--colorPrimaryBgHover);",
  "  --surface-brand-ghost: var(--colorPrimaryBg);",
  "  --surface-disabled: var(--colorBgContainerDisabled);",
  "",
  "  --border-subtle: var(--colorSplit);",
  "  --border-muted: var(--colorSplit);",
  "  --border-regular: var(--colorSplit);",
  "  --border-brand-soft: var(--colorPrimaryBorder);",
  "",
  "  --shadow-line: var(--colorBgShape);",
  `  --shadow-soft: ${shadowColor("boxShadowSubtle", "Color 2")};`,
  "",
  "  --dot-base: color-mix(in srgb, var(--color-neutral-light-3) 86%, transparent);",
  "  --dot-active: color-mix(in srgb, var(--color-neutral-light-6) 52%, transparent);",
  "  --mask-strong: var(--color-black-alpha-light-1);",
  "  --mask-medium: color-mix(in srgb, var(--color-neutral-light-11) 64%, transparent);",
  "  --mask-soft: color-mix(in srgb, var(--color-neutral-light-11) 26%, transparent);",
  "  --mask-faint: color-mix(in srgb, var(--color-neutral-light-11) 16%, transparent);",
  "",
  "  --clay-strong: var(--brand-primary);",
  "  --clay-soft: var(--brand-primary-soft);",
  "  --ink-900: var(--text-primary);",
  "  --ink-700: var(--text-secondary);",
  "  --ink-500: var(--text-tertiary);",
  "  --line-200: var(--border-muted);",
  "  --line-300: var(--border-regular);",
  "  --paper-000: var(--surface-base);",
  "  --paper-010: var(--surface-canvas);",
  "  --paper-040: var(--surface-subtle);",
  "  --paper-050: var(--surface-subtle);",
  "}",
  ""
);

const themeTs = `import { PALETTE_COLORS } from "./palette";\n\n/**\n * 主题基础 token。\n * Source: ${path.basename(mossPath)}\n */\nexport const THEME_TOKENS = ${objectToTs(themeTokens)} as const;\n\nexport const TAILWIND_THEME = {\n  extend: {\n    colors: PALETTE_COLORS,\n    ...THEME_TOKENS\n  }\n} as const;\n\nexport type ThemeTokenGroupKey = keyof typeof THEME_TOKENS;\n`;

const themeCssLines = [":root {"];
for (const [group, prefix] of [
  [fontSize, "font-size"],
  [fontSizeNative, "font-size-native"],
  [headingFontSize, "heading-font-size"],
  [iconSize, "icon-size"],
  [fontWeight, "font-weight"],
  [lineHeight, "line-height"],
  [headingLineHeight, "heading-line-height"],
  [borderRadius, "radius"],
  [spacing, "spacing"],
  [layoutPadding, "layout-padding"],
  [padding, "padding"],
  [gap, "gap"],
  [margin, "margin"],
  [themeTokens.flex, "flex"],
  [lineWidth, "line-width"],
  [boxShadow, "shadow"],
  [textColor, "text-color"],
  [height, "height"],
  [opacity, "opacity"]
]) {
  themeCssLines.push(...cssVarsFromObject(prefix, group), "");
}
themeCssLines.push("}", "");

const paletteTsLines = [
  "/**",
  " * 调色板，所有基础色都从这里取。",
  ` * Source: ${path.basename(lightPath)} -> 00 Moss`,
  " */",
  "export const PALETTE_COLORS = {",
  ...orderedPaletteKeys.map((key) => `  "${key}": "${palette[key]}",`),
  "} as const;",
  "",
  "export type PaletteColorKey = keyof typeof PALETTE_COLORS;",
  ""
];

const paletteCssLines = [
  ":root {",
  ...orderedPaletteKeys.map((key) => `  --color-${key}: ${palette[key]};`),
  "}",
  ""
];

const readme = `# Moss Tokens\n\n## Sources\n\n- Light palette: \`${lightPath}\`\n- Moss semantics: \`${mossPath}\`\n- Generator: \`scripts/sync-figma-tokens.mjs\`\n\n## Layers\n\n- \`palette.ts\`: 基础调色板源码，适合在 TS / TSX 中读取原始颜色值。\n- \`palette.css\`: 基础色 CSS Variables，包含 Figma 原生色板和兼容别名。\n- \`theme.ts\`: 尺寸、字号、行高、圆角、阴影等主题基础 token，并导出 \`TAILWIND_THEME\`。\n- \`theme.css\`: 将 \`theme.ts\` 中的主题 token 暴露为 CSS Variables，供样式文件直接使用。\n- \`semantic.css\`: 基于 Figma Moss 语义变量整理出的语义 token，并保留当前项目兼容别名。\n- \`component.css\`: Moss 当前项目的组件层 token，例如 \`sidebar / card / composer / background\`，该文件保留手工维护，不由同步脚本覆盖。\n\n## Usage Order\n\n在项目入口按下面顺序引入：\n1. \`palette.css\`\n2. \`theme.css\`\n3. \`semantic.css\`\n4. \`component.css\`\n5. 页面样式文件\n\n## Update Workflow\n\n1. 从 Figma 导出最新的 \`Light.tokens.json\` 和 \`Moss.tokens.json\`\n2. 运行：\n\n\`\`\`bash\nnode scripts/sync-figma-tokens.mjs /path/to/Light.tokens.json /path/to/Moss.tokens.json\n\`\`\`\n\n3. 执行 \`npm run build\` 验证\n\n## Usage Rules\n\n- 新的基础色：优先更新 Figma Light palette，再同步生成 \`palette.ts\` 与 \`palette.css\`\n- 新的主题尺寸或阴影：优先更新 Figma Moss variables，再同步生成 \`theme.ts\` 与 \`theme.css\`\n- 新的语义色：优先更新 Figma Moss variables，再同步生成 \`semantic.css\`\n- Moss 组件专用色：补到 \`component.css\`\n- 业务样式优先使用组件 token，其次使用语义 token，避免直接引用基础色\n`;

fs.writeFileSync(path.join(workspaceRoot, "src/tokens/palette.ts"), paletteTsLines.join("\n"));
fs.writeFileSync(path.join(workspaceRoot, "src/tokens/palette.css"), paletteCssLines.join("\n"));
fs.writeFileSync(path.join(workspaceRoot, "src/tokens/theme.ts"), themeTs);
fs.writeFileSync(path.join(workspaceRoot, "src/tokens/theme.css"), themeCssLines.join("\n"));
fs.writeFileSync(path.join(workspaceRoot, "src/tokens/semantic.css"), semanticLines.join("\n"));
fs.writeFileSync(path.join(workspaceRoot, "src/tokens/README.md"), readme);

console.log("Figma tokens synced from:");
console.log(`- ${lightPath}`);
console.log(`- ${mossPath}`);
console.log("Preserved src/tokens/component.css");
