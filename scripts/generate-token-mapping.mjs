import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function parseCssVars(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const vars = {};
  for (const line of content.split("\n")) {
    const match = line.match(/^\s*(--[\w-]+)\s*:\s*(.+?);\s*$/);
    if (match) vars[match[1]] = match[2].trim();
  }
  return vars;
}

function resolve(value, maps, depth = 0, seen = new Set()) {
  if (depth > 12) return value;
  const varMatch = value.match(/^var\((--[\w-]+)\)$/);
  if (!varMatch) return value;
  const key = varMatch[1];
  if (seen.has(key)) return `var(${key}) /* cycle */`;
  for (const map of maps) {
    if (map[key]) {
      seen.add(key);
      return resolve(map[key], maps, depth + 1, seen);
    }
  }
  return `var(${key}) /* unresolved */`;
}

function extractVarRefs(value) {
  const refs = [];
  const pattern = /var\((--[\w-]+)\)/g;
  let match;
  while ((match = pattern.exec(value))) refs.push(match[1]);
  return refs;
}

function collectUsedPaletteTokens({ palette, semantic, theme, component, stylesVars, stylesContent }) {
  const allMaps = { ...palette, ...semantic, ...theme, ...component, ...stylesVars };
  const used = new Set();

  for (const value of [
    ...Object.values(stylesVars),
    ...Object.values(component),
    ...Object.values(semantic),
    ...Object.values(theme)
  ]) {
    for (const ref of extractVarRefs(value)) used.add(ref);
  }

  for (const token of stylesContent.match(/var\((--[\w-]+)\)/g) ?? []) {
    const match = token.match(/var\((--[\w-]+)\)/);
    if (match) used.add(match[1]);
  }

  const queue = [...used];
  while (queue.length) {
    const key = queue.pop();
    const value = allMaps[key];
    if (!value) continue;
    for (const ref of extractVarRefs(value)) {
      if (!used.has(ref)) {
        used.add(ref);
        queue.push(ref);
      }
    }
  }

  const usedPalette = new Set(Object.keys(palette).filter((key) => used.has(key)));
  return usedPalette;
}

function resolveChain(value, maps) {
  const chain = [];
  let current = value;
  let guard = 0;
  while (guard++ < 15) {
    chain.push(current);
    const match = current.match(/^var\((--[\w-]+)\)$/);
    if (!match) break;
    let next = null;
    for (const map of maps) {
      if (map[match[1]]) {
        next = map[match[1]];
        break;
      }
    }
    if (!next) break;
    current = next;
  }
  return chain;
}

const palettePath = path.join(workspaceRoot, "src/tokens/palette.css");
const semanticPath = path.join(workspaceRoot, "src/tokens/semantic.css");
const themePath = path.join(workspaceRoot, "src/tokens/theme.css");
const componentPath = path.join(workspaceRoot, "src/tokens/component.css");
const stylesPath = path.join(workspaceRoot, "src/styles.css");

const palette = parseCssVars(palettePath);
const semantic = parseCssVars(semanticPath);
const theme = parseCssVars(themePath);
const component = parseCssVars(componentPath);
const stylesVars = parseCssVars(stylesPath);
const stylesContent = fs.readFileSync(stylesPath, "utf8");
const maps = [component, semantic, theme, palette];

const usedPalette = collectUsedPaletteTokens({
  palette,
  semantic,
  theme,
  component,
  stylesVars,
  stylesContent
});

const paletteFamilies = {};
for (const [key, value] of Object.entries(palette)) {
  const match = key.match(/^--color-([a-z0-9-]+)-(light-\d+|alpha-light-\d+)$/);
  const group = match ? match[1] : key.includes("shadow") ? "shadow-alpha" : "other";
  if (!paletteFamilies[group]) paletteFamilies[group] = [];
  paletteFamilies[group].push({ name: key, value });
}

const semanticColor = Object.entries(semantic).filter(([key]) =>
  /color|Text|Icon|Border|Fill|Bg|brand|text|icon|surface|border|shadow|dot|mask|clay|ink|line|paper/i.test(key)
);

const componentColor = Object.entries(component).filter(
  ([, value]) => /var\(/.test(value) && /color|bg|text|border|shadow|fill|icon|surface|brand|dot|mask|hero|composer|button|sidebar|main|card|tab|prompt|input|file|sent/i.test(value)
);

let md = "";
md += "# Moss Token 映射手册\n\n";
md += "> 自动生成自 `src/tokens/*.css`，反映工程当前实际 token 层级与引用关系。\n";
md += `> 生成时间：${new Date().toISOString().slice(0, 10)}\n\n`;

md += "## 1. Token 层级与加载顺序\n\n";
md += "```\n";
md += "palette.css（原始色板，十六进制 / rgba）\n";
md += "    ↓\n";
md += "theme.css（尺寸、字号、圆角、阴影、间距）\n";
md += "    ↓\n";
md += "semantic.css（语义色：Primary / Success / Text / Fill / Bg …）\n";
md += "    ↓\n";
md += "component.css（组件 token：sidebar / composer / button / files-panel …）\n";
md += "    ↓\n";
md += "styles.css（页面样式，引用上述 CSS Variables）\n";
md += "```\n\n";
md += "入口 `src/main.tsx` 引入顺序：\n\n";
md += "1. `palette.css`\n2. `theme.css`\n3. `semantic.css`\n4. `component.css`\n5. `styles.css`\n\n";

md += "## 2. 原始色板（palette.css）\n\n";
md += `共 **${Object.keys(palette).length}** 个基础色变量；其中 **${usedPalette.size}** 个经样式引用链被 Moss 工程使用。\n\n`;
md += "命名规则：`--color-{色系}-light-{1-11}`（1 最浅，11 最深）。\n\n";
md += "**标记说明**（追踪范围：`styles.css` → `component.css` → `semantic.css` → `theme.css`）：\n\n";
md += "- 色系标题带 `🏷️ 工程未使用`：该色系**所有阶**均未被引用\n";
md += "- 表格列「工程使用」：`✓` 已引用，`—` 未引用\n\n";

const familyOrder = ["brand", "orange", "red", "yellow", "green", "blue", "neutral", "black-alpha", "white-alpha", "shadow-alpha"];
const sortedGroups = Object.keys(paletteFamilies).sort((a, b) => {
  const ai = familyOrder.indexOf(a);
  const bi = familyOrder.indexOf(b);
  if (ai >= 0 && bi >= 0) return ai - bi;
  if (ai >= 0) return -1;
  if (bi >= 0) return 1;
  return a.localeCompare(b);
});

const fullyUnusedFamilies = sortedGroups.filter((group) =>
  paletteFamilies[group].every((item) => !usedPalette.has(item.name))
);

if (fullyUnusedFamilies.length > 0) {
  md += "<details>\n<summary>完全未使用的色系一览（" + fullyUnusedFamilies.length + " 个）</summary>\n\n";
  md += fullyUnusedFamilies.map((family) => `- \`${family}\``).join("\n");
  md += "\n\n</details>\n\n";
}

sortedGroups.forEach((group, index) => {
  const items = paletteFamilies[group].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  const familyUnused = items.every((item) => !usedPalette.has(item.name));
  const familyLabel = familyUnused ? `${group} 🏷️ 工程未使用` : group;
  md += `### 2.${index + 1} ${familyLabel}\n\n`;
  if (familyUnused) {
    md += "> 本色系在 Moss 工程样式链路中**没有任何一阶**被引用。\n\n";
  }
  md += "| Token | 色值 | 工程使用 |\n|-------|------|----------|\n";
  for (const { name, value } of items) {
    const usage = usedPalette.has(name) ? "✓" : "—";
    md += `| \`${name}\` | \`${value}\` | ${usage} |\n`;
  }
  md += "\n";
});

md += "### 色阶语义（通用）\n\n";
md += "| 阶 | 典型用途 |\n|----|----------|\n";
md += "| light-1 ~ 2 | 浅色背景（Bg） |\n";
md += "| light-3 ~ 4 | 描边 / 悬停边框 |\n";
md += "| light-5 ~ 6 | 主色 / 文本强调 |\n";
md += "| light-7 ~ 8 | Active / 深色悬停 |\n";
md += "| light-9 ~ 11 | 深色文本 / 强调背景 |\n\n";

const semanticGroups = {
  "品牌 Primary": /^--colorPrimary/,
  "成功 Success": /^--colorSuccess/,
  "警告 Warning": /^--colorWarning/,
  "错误 Error": /^--colorError/,
  "信息 Info": /^--colorInfo/,
  "文本 Text": /^--colorText/,
  "图标 Icon": /^--colorIcon/,
  "边框 Border / Split": /^--colorBorder|^--colorSplit/,
  "填充 Fill": /^--colorFill/,
  "背景 Bg": /^--colorBg/,
  "控件 Control": /^--control/,
  "项目兼容别名": /^--(brand|text|icon|surface|border|shadow|dot|mask|clay|ink|line|paper)-/
};

md += "## 3. 语义色（semantic.css）\n\n";
Object.entries(semanticGroups).forEach(([title, pattern], index) => {
  const rows = semanticColor.filter(([key]) => pattern.test(key));
  if (!rows.length) return;
  md += `### 3.${index + 1} ${title}\n\n`;
  md += "| 语义 Token | 直接引用 | 解析到色板 |\n|-----------|----------|------------|\n";
  for (const [key, value] of rows.sort((a, b) => a[0].localeCompare(b[0]))) {
    md += `| \`${key}\` | \`${value}\` | \`${resolve(value, [semantic, palette])}\` |\n`;
  }
  md += "\n";
});

md += "### 语义色 → 色板 速查\n\n";
md += "| 语义角色 | Token | 最终色值 |\n|----------|-------|----------|\n";
const quickTokens = [
  ["主色", "--colorPrimary"],
  ["主色背景", "--colorPrimaryBg"],
  ["主色文本", "--colorPrimaryText"],
  ["正文", "--colorText"],
  ["次级正文", "--colorTextSecondary"],
  ["占位符", "--colorTextPlaceholder"],
  ["页面背景", "--colorBgContainer"],
  ["四级填充", "--colorFillQuaternary"],
  ["成功", "--colorSuccess"],
  ["警告", "--colorWarning"],
  ["错误", "--colorError"],
  ["信息", "--colorInfo"],
  ["Hero 品牌强调", "--moss-hero-brand"]
];
for (const [role, token] of quickTokens) {
  const source = semantic[token] ?? component[token];
  if (!source) continue;
  md += `| ${role} | \`${token}\` | \`${resolve(source, maps)}\` |\n`;
}
md += "\n";

md += "## 4. 组件 Token（component.css · 颜色相关）\n\n";
const componentGroups = {
  "应用 / 侧栏 / 主区域": /^--moss-(app|sidebar|main)/,
  "Hero / 卡片 / Tab / Prompt": /^--moss-(hero|card|tab|prompt)/,
  输入框: /^--moss-input/,
  按钮: /^--moss-button/,
  "Composer / 文件引用": /^--moss-(composer|file-mention|sent)/,
  文件面板: /^--moss-files-panel/
};
Object.entries(componentGroups).forEach(([title, pattern]) => {
  const rows = componentColor.filter(([key]) => pattern.test(key));
  if (!rows.length) return;
  md += `### ${title}\n\n`;
  md += "| 组件 Token | 引用链 | 最终色值 |\n|-----------|--------|----------|\n";
  for (const [key, value] of rows.sort((a, b) => a[0].localeCompare(b[0]))) {
    const chain = resolveChain(value, maps);
    md += `| \`${key}\` | ${chain.slice(0, 4).join(" → ")}${chain.length > 4 ? " → …" : ""} | \`${resolve(value, maps)}\` |\n`;
  }
  md += "\n";
});

md += "## 5. 主题基础 Token（theme.css · 非颜色）\n\n";
md += "| 分类 | 变量 | 值 |\n|------|------|----|\n";
const themeSamples = {
  字号: ["--font-size-xs", "--font-size-sm", "--font-size-lg", "--font-size-xl"],
  行高: ["--line-height-sm", "--line-height-md", "--line-height-xl"],
  圆角: ["--radius-xs", "--radius-sm", "--radius-md", "--radius-xl"],
  间距: ["--padding-xs", "--padding-md", "--padding-xl", "--padding-xxxxl"],
  控件高度: ["--height-control-xs", "--height-control-md", "--height-control-lg"],
  阴影: ["--shadow-subtle", "--shadow", "--shadow-secondary"]
};
for (const [category, keys] of Object.entries(themeSamples)) {
  for (const key of keys) {
    if (theme[key]) md += `| ${category} | \`${key}\` | \`${theme[key]}\` |\n`;
  }
}

md += "\n## 6. 维护说明\n\n";
md += "- 改基础色：更新 Figma 后运行 `node scripts/sync-figma-tokens.mjs`。\n";
md += "- 改组件色：手工维护 `component.css`。\n";
md += "- 重新生成本文档：`node scripts/generate-token-mapping.mjs`（会按引用链标注色板使用情况）。\n";

const outputPath = path.join(workspaceRoot, "src/tokens/TOKEN_MAPPING.md");
fs.writeFileSync(outputPath, md);
console.log(`Wrote ${outputPath} (${md.length} bytes)`);
