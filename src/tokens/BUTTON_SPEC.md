# Moss 按钮规范（对齐 Figma `98:90369`）

本项目按钮规范基于 Figma「默认 / 悬浮 / 按下(激活) / 禁用」状态矩阵，对应 token 定义在 `component.css`：

- 尺寸与排版：`--moss-button-height`、`--moss-button-radius`、`--moss-button-padding-inline`、`--moss-button-font-size`、`--moss-button-line-height`、`--moss-button-font-weight`
- 主按钮：`--moss-button-primary-*`
- 次按钮：`--moss-button-secondary-*`
- 线框按钮：`--moss-button-outline-*`
- 文字 / 链接按钮：`--moss-button-link-*`
- 禁用态：`--moss-button-disabled-*`

## 代码映射

- 主按钮（Primary）
  - `.files-detail-quote-button`
  - `.markdown-editor-button.primary`
  - `.file-rename-button.primary`
- 次按钮（Secondary）
  - `.markdown-editor-button`
  - `.file-rename-button.secondary`
- 菜单按钮（文本容器型按钮，对齐统一尺寸与排版）
  - `.history-item-menu-option`
  - `.file-card-menu-option`

## 说明

- `send-btn`、`new-chat` 属于业务强化按钮（含定制色与圆形结构），保留业务态颜色策略，但可继续复用上述 token 做进一步统一。
- icon-only 按钮（如 `.icon-btn`、`.tabs-more`、`.file-card-action`）维持当前交互结构，不强制改为矩形按钮形态。
