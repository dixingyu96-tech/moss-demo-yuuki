# Moss Tokens

## Sources

- Light palette: `/Users/yuki/Desktop/Light.tokens.json`
- Moss semantics: `/Users/yuki/Desktop/Moss.tokens.json`
- Generator: `scripts/sync-figma-tokens.mjs`

## Layers

- `palette.ts`: 基础调色板源码，适合在 TS / TSX 中读取原始颜色值。
- `palette.css`: 基础色 CSS Variables，包含 Figma 原生色板和兼容别名。
- `theme.ts`: 尺寸、字号、行高、圆角、阴影等主题基础 token，并导出 `TAILWIND_THEME`。
- `theme.css`: 将 `theme.ts` 中的主题 token 暴露为 CSS Variables，供样式文件直接使用。
- `semantic.css`: 基于 Figma Moss 语义变量整理出的语义 token，并保留当前项目兼容别名。
- `component.css`: Moss 当前项目的组件层 token，例如 `sidebar / card / composer / background`，该文件保留手工维护，不由同步脚本覆盖。
- `BUTTON_SPEC.md`: 按钮规范与代码映射（对齐 Figma `98:90369`）。
- `TOKEN_MAPPING.md`: 原始色板 → 语义色 → 组件 token 的完整映射手册（运行 `node scripts/generate-token-mapping.mjs` 可重新生成）。

## Usage Order

在项目入口按下面顺序引入：
1. `palette.css`
2. `theme.css`
3. `semantic.css`
4. `component.css`
5. 页面样式文件

## Update Workflow

1. 从 Figma 导出最新的 `Light.tokens.json` 和 `Moss.tokens.json`
2. 运行：

```bash
node scripts/sync-figma-tokens.mjs /path/to/Light.tokens.json /path/to/Moss.tokens.json
```

3. 执行 `npm run build` 验证

## Usage Rules

- 新的基础色：优先更新 Figma Light palette，再同步生成 `palette.ts` 与 `palette.css`
- 新的主题尺寸或阴影：优先更新 Figma Moss variables，再同步生成 `theme.ts` 与 `theme.css`
- 新的语义色：优先更新 Figma Moss variables，再同步生成 `semantic.css`
- Moss 组件专用色：补到 `component.css`
- 业务样式优先使用组件 token，其次使用语义 token，避免直接引用基础色
