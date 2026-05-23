# Moss Token 映射手册

> 自动生成自 `src/tokens/*.css`，反映工程当前实际 token 层级与引用关系。
> 生成时间：2026-05-22

## 1. Token 层级与加载顺序

```
palette.css（原始色板，十六进制 / rgba）
    ↓
theme.css（尺寸、字号、圆角、阴影、间距）
    ↓
semantic.css（语义色：Primary / Success / Text / Fill / Bg …）
    ↓
component.css（组件 token：sidebar / composer / button / files-panel …）
    ↓
styles.css（页面样式，引用上述 CSS Variables）
```

入口 `src/main.tsx` 引入顺序：

1. `palette.css`
2. `theme.css`
3. `semantic.css`
4. `component.css`
5. `styles.css`

## 2. 原始色板（palette.css）

共 **329** 个基础色变量；其中 **68** 个经样式引用链被 Moss 工程使用。

命名规则：`--color-{色系}-light-{1-11}`（1 最浅，11 最深）。

**标记说明**（追踪范围：`styles.css` → `component.css` → `semantic.css` → `theme.css`）：

- 色系标题带 `🏷️ 工程未使用`：该色系**所有阶**均未被引用
- 表格列「工程使用」：`✓` 已引用，`—` 未引用

<details>
<summary>完全未使用的色系一览（20 个）</summary>

- `ai-color-1`
- `ai-color-2`
- `ai-color-3`
- `ai-color-4`
- `blue-gray`
- `coral-red`
- `corn-yellow`
- `cornflower-blue`
- `cyan`
- `duck-green`
- `indigo`
- `leaf-green`
- `lemon-green`
- `lilac`
- `magenta`
- `pink`
- `purple`
- `sea-green`
- `sky-blue`
- `spring-green`

</details>

### 2.1 brand

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-brand-light-1` | `#F9ECE7` | — |
| `--color-brand-light-2` | `#F7D8CB` | — |
| `--color-brand-light-3` | `#F4AE94` | ✓ |
| `--color-brand-light-4` | `#EE8866` | ✓ |
| `--color-brand-light-5` | `#E3704B` | ✓ |
| `--color-brand-light-6` | `#D35B33` | ✓ |
| `--color-brand-light-7` | `#C25124` | ✓ |
| `--color-brand-light-8` | `#AE461C` | — |
| `--color-brand-light-9` | `#863311` | — |
| `--color-brand-light-10` | `#5D230B` | — |
| `--color-brand-light-11` | `#371407` | — |

### 2.2 orange

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-orange-light-1` | `#F9ECE7` | ✓ |
| `--color-orange-light-2` | `#F7D8CB` | ✓ |
| `--color-orange-light-3` | `#F4AE94` | — |
| `--color-orange-light-4` | `#EE8866` | — |
| `--color-orange-light-5` | `#E3704B` | ✓ |
| `--color-orange-light-6` | `#D35B33` | ✓ |
| `--color-orange-light-7` | `#C25124` | — |
| `--color-orange-light-8` | `#AE461C` | — |
| `--color-orange-light-9` | `#863311` | — |
| `--color-orange-light-10` | `#5D230B` | — |
| `--color-orange-light-11` | `#371407` | — |

### 2.3 red

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-red-light-1` | `#FBEBEB` | ✓ |
| `--color-red-light-2` | `#FAD6D6` | ✓ |
| `--color-red-light-3` | `#F4ABAB` | ✓ |
| `--color-red-light-4` | `#F09595` | ✓ |
| `--color-red-light-5` | `#EC7E7E` | ✓ |
| `--color-red-light-6` | `#E34948` | ✓ |
| `--color-red-light-7` | `#D03B3B` | ✓ |
| `--color-red-light-8` | `#B93535` | — |
| `--color-red-light-9` | `#8E2626` | — |
| `--color-red-light-10` | `#641919` | — |
| `--color-red-light-11` | `#3C0E0E` | — |

### 2.4 yellow

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-yellow-light-1` | `#FFF8E4` | ✓ |
| `--color-yellow-light-2` | `#FFF3D1` | ✓ |
| `--color-yellow-light-3` | `#FFEAB0` | ✓ |
| `--color-yellow-light-4` | `#FFDA85` | ✓ |
| `--color-yellow-light-5` | `#FCC65B` | ✓ |
| `--color-yellow-light-6` | `#F5A927` | ✓ |
| `--color-yellow-light-7` | `#CF8517` | ✓ |
| `--color-yellow-light-8` | `#A8640A` | — |
| `--color-yellow-light-9` | `#824A01` | — |
| `--color-yellow-light-10` | `#4D2B00` | — |
| `--color-yellow-light-11` | `#261700` | — |

### 2.5 green

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-green-light-1` | `#E5F4E4` | ✓ |
| `--color-green-light-2` | `#CAEAC7` | ✓ |
| `--color-green-light-3` | `#91D68B` | ✓ |
| `--color-green-light-4` | `#73CB6D` | ✓ |
| `--color-green-light-5` | `#55BF50` | ✓ |
| `--color-green-light-6` | `#0CA30C` | ✓ |
| `--color-green-light-7` | `#009300` | ✓ |
| `--color-green-light-8` | `#008300` | — |
| `--color-green-light-9` | `#006300` | — |
| `--color-green-light-10` | `#074506` | — |
| `--color-green-light-11` | `#11260F` | — |

### 2.6 blue

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-blue-light-1` | `#E7F1FB` | ✓ |
| `--color-blue-light-2` | `#CDE2FB` | ✓ |
| `--color-blue-light-3` | `#9EC5F4` | ✓ |
| `--color-blue-light-4` | `#86B6EF` | ✓ |
| `--color-blue-light-5` | `#6DA7EC` | ✓ |
| `--color-blue-light-6` | `#3987E5` | ✓ |
| `--color-blue-light-7` | `#2A78D6` | ✓ |
| `--color-blue-light-8` | `#256ABF` | — |
| `--color-blue-light-9` | `#184F95` | — |
| `--color-blue-light-10` | `#0D366B` | — |
| `--color-blue-light-11` | `#032042` | — |

### 2.7 neutral

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-neutral-light-0` | `#FFFFFF` | ✓ |
| `--color-neutral-light-1` | `#FCFCFB` | ✓ |
| `--color-neutral-light-2` | `#F9F9F7` | ✓ |
| `--color-neutral-light-3` | `#F0EFEC` | ✓ |
| `--color-neutral-light-4` | `#E4E3DD` | ✓ |
| `--color-neutral-light-5` | `#C3C2B7` | — |
| `--color-neutral-light-6` | `#A5A49A` | — |
| `--color-neutral-light-7` | `#898781` | ✓ |
| `--color-neutral-light-8` | `#6D6B67` | ✓ |
| `--color-neutral-light-9` | `#52514E` | ✓ |
| `--color-neutral-light-10` | `#383835` | ✓ |
| `--color-neutral-light-11` | `#20201F` | ✓ |
| `--color-neutral-light-12` | `#0B0B0B` | ✓ |

### 2.8 black-alpha

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-black-alpha-light-1` | `#0B0B0B` | ✓ |
| `--color-black-alpha-light-2` | `rgba(11, 11, 11, 0.95)` | — |
| `--color-black-alpha-light-3` | `rgba(11, 11, 11, 0.85)` | ✓ |
| `--color-black-alpha-light-4` | `rgba(11, 11, 11, 0.7)` | ✓ |
| `--color-black-alpha-light-5` | `rgba(11, 11, 11, 0.6)` | — |
| `--color-black-alpha-light-6` | `rgba(11, 11, 11, 0.5)` | ✓ |
| `--color-black-alpha-light-7` | `rgba(11, 11, 11, 0.4)` | ✓ |
| `--color-black-alpha-light-8` | `rgba(11, 11, 11, 0.35)` | ✓ |
| `--color-black-alpha-light-9` | `rgba(11, 11, 11, 0.3)` | ✓ |
| `--color-black-alpha-light-10` | `rgba(11, 11, 11, 0.2)` | ✓ |
| `--color-black-alpha-light-11` | `rgba(11, 11, 11, 0.1)` | ✓ |
| `--color-black-alpha-light-12` | `rgba(11, 11, 11, 0.05)` | ✓ |
| `--color-black-alpha-light-13` | `rgba(11, 11, 11, 0)` | ✓ |

### 2.9 white-alpha

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-white-alpha-light-1` | `#FFFFFF` | ✓ |
| `--color-white-alpha-light-2` | `rgba(255, 255, 255, 0.95)` | — |
| `--color-white-alpha-light-3` | `rgba(255, 255, 255, 0.85)` | ✓ |
| `--color-white-alpha-light-4` | `rgba(255, 255, 255, 0.7)` | ✓ |
| `--color-white-alpha-light-5` | `rgba(255, 255, 255, 0.6)` | — |
| `--color-white-alpha-light-6` | `rgba(255, 255, 255, 0.5)` | ✓ |
| `--color-white-alpha-light-7` | `rgba(255, 255, 255, 0.4)` | — |
| `--color-white-alpha-light-8` | `rgba(255, 255, 255, 0.35)` | — |
| `--color-white-alpha-light-9` | `rgba(255, 255, 255, 0.3)` | — |
| `--color-white-alpha-light-10` | `rgba(255, 255, 255, 0.2)` | — |
| `--color-white-alpha-light-11` | `rgba(255, 255, 255, 0.1)` | — |
| `--color-white-alpha-light-12` | `rgba(255, 255, 255, 0.05)` | — |

### 2.10 shadow-alpha

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-shadow-alpha-1` | `rgba(11, 11, 11, 0.02)` | ✓ |
| `--color-shadow-alpha-2` | `rgba(11, 11, 11, 0.04)` | ✓ |
| `--color-shadow-alpha-3` | `rgba(11, 11, 11, 0.05)` | ✓ |
| `--color-shadow-alpha-4` | `rgba(11, 11, 11, 0.06)` | ✓ |
| `--color-shadow-alpha-5` | `rgba(11, 11, 11, 0.1)` | ✓ |

### 2.11 ai-color-1 🏷️ 工程未使用

> 本色系在 Moss 工程样式链路中**没有任何一阶**被引用。

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-ai-color-1-light-1` | `#ECF4FF` | — |
| `--color-ai-color-1-light-2` | `#DDE9FF` | — |
| `--color-ai-color-1-light-3` | `#BFD1FF` | — |
| `--color-ai-color-1-light-4` | `#99B5FF` | — |
| `--color-ai-color-1-light-5` | `#5F8CFF` | — |
| `--color-ai-color-1-light-6` | `#2562FF` | — |
| `--color-ai-color-1-light-7` | `#0047FD` | — |
| `--color-ai-color-1-light-8` | `#003CD7` | — |
| `--color-ai-color-1-light-9` | `#0031B0` | — |
| `--color-ai-color-1-light-10` | `#00278A` | — |
| `--color-ai-color-1-light-11` | `#001C63` | — |

### 2.12 ai-color-2 🏷️ 工程未使用

> 本色系在 Moss 工程样式链路中**没有任何一阶**被引用。

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-ai-color-2-light-1` | `#FBF4FF` | — |
| `--color-ai-color-2-light-2` | `#ECE0FF` | — |
| `--color-ai-color-2-light-3` | `#DAC9FF` | — |
| `--color-ai-color-2-light-4` | `#BA9EFF` | — |
| `--color-ai-color-2-light-5` | `#AC8AFF` | — |
| `--color-ai-color-2-light-6` | `#8C5DF7` | — |
| `--color-ai-color-2-light-7` | `#7A49E4` | — |
| `--color-ai-color-2-light-8` | `#6834D2` | — |
| `--color-ai-color-2-light-9` | `#571BC1` | — |
| `--color-ai-color-2-light-10` | `#4600A7` | — |
| `--color-ai-color-2-light-11` | `#340081` | — |

### 2.13 ai-color-3 🏷️ 工程未使用

> 本色系在 Moss 工程样式链路中**没有任何一阶**被引用。

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-ai-color-3-light-1` | `#FBF4FF` | — |
| `--color-ai-color-3-light-2` | `#ECE0FF` | — |
| `--color-ai-color-3-light-3` | `#DAC9FF` | — |
| `--color-ai-color-3-light-4` | `#BA9EFF` | — |
| `--color-ai-color-3-light-5` | `#AC8AFF` | — |
| `--color-ai-color-3-light-6` | `#8C5DF7` | — |
| `--color-ai-color-3-light-7` | `#7A49E4` | — |
| `--color-ai-color-3-light-8` | `#6834D2` | — |
| `--color-ai-color-3-light-9` | `#571BC1` | — |
| `--color-ai-color-3-light-10` | `#4600A7` | — |
| `--color-ai-color-3-light-11` | `#340081` | — |

### 2.14 ai-color-4 🏷️ 工程未使用

> 本色系在 Moss 工程样式链路中**没有任何一阶**被引用。

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-ai-color-4-light-1` | `#E8F9FF` | — |
| `--color-ai-color-4-light-2` | `#CAF1FC` | — |
| `--color-ai-color-4-light-3` | `#A2EBFF` | — |
| `--color-ai-color-4-light-4` | `#50DAF9` | — |
| `--color-ai-color-4-light-5` | `#3BCCEA` | — |
| `--color-ai-color-4-light-6` | `#00B0D4` | — |
| `--color-ai-color-4-light-7` | `#009CB6` | — |
| `--color-ai-color-4-light-8` | `#008399` | — |
| `--color-ai-color-4-light-9` | `#00687A` | — |
| `--color-ai-color-4-light-10` | `#00515F` | — |
| `--color-ai-color-4-light-11` | `#003B46` | — |

### 2.15 blue-gray 🏷️ 工程未使用

> 本色系在 Moss 工程样式链路中**没有任何一阶**被引用。

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-blue-gray-light-1` | `#E8EFFA` | — |
| `--color-blue-gray-light-2` | `#DCE4F2` | — |
| `--color-blue-gray-light-3` | `#B4BDCF` | — |
| `--color-blue-gray-light-4` | `#8B9BB6` | — |
| `--color-blue-gray-light-5` | `#687EA1` | — |
| `--color-blue-gray-light-6` | `#516685` | — |
| `--color-blue-gray-light-7` | `#445774` | — |
| `--color-blue-gray-light-8` | `#384861` | — |
| `--color-blue-gray-light-9` | `#2C3B53` | — |
| `--color-blue-gray-light-10` | `#1F2E47` | — |
| `--color-blue-gray-light-11` | `#152237` | — |

### 2.16 coral-red 🏷️ 工程未使用

> 本色系在 Moss 工程样式链路中**没有任何一阶**被引用。

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-coral-red-light-1` | `#FBEBEB` | — |
| `--color-coral-red-light-2` | `#FAD6D6` | — |
| `--color-coral-red-light-3` | `#F4ABAB` | — |
| `--color-coral-red-light-4` | `#F09595` | — |
| `--color-coral-red-light-5` | `#EC7E7E` | — |
| `--color-coral-red-light-6` | `#E34948` | — |
| `--color-coral-red-light-7` | `#D03B3B` | — |
| `--color-coral-red-light-8` | `#B93535` | — |
| `--color-coral-red-light-9` | `#8E2626` | — |
| `--color-coral-red-light-10` | `#641919` | — |
| `--color-coral-red-light-11` | `#3C0E0E` | — |

### 2.17 corn-yellow 🏷️ 工程未使用

> 本色系在 Moss 工程样式链路中**没有任何一阶**被引用。

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-corn-yellow-light-1` | `#FBF9E6` | — |
| `--color-corn-yellow-light-2` | `#F3EEB4` | — |
| `--color-corn-yellow-light-3` | `#EFE89B` | — |
| `--color-corn-yellow-light-4` | `#EBE282` | — |
| `--color-corn-yellow-light-5` | `#E2D64F` | — |
| `--color-corn-yellow-light-6` | `#D6C504` | — |
| `--color-corn-yellow-light-7` | `#AB9E03` | — |
| `--color-corn-yellow-light-8` | `#807602` | — |
| `--color-corn-yellow-light-9` | `#564F02` | — |
| `--color-corn-yellow-light-10` | `#403B01` | — |
| `--color-corn-yellow-light-11` | `#403B01` | — |

### 2.18 cornflower-blue 🏷️ 工程未使用

> 本色系在 Moss 工程样式链路中**没有任何一阶**被引用。

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-cornflower-blue-light-1` | `#EDF3FF` | — |
| `--color-cornflower-blue-light-2` | `#D6E3FF` | — |
| `--color-cornflower-blue-light-3` | `#B3C8F5` | — |
| `--color-cornflower-blue-light-4` | `#8AA6ED` | — |
| `--color-cornflower-blue-light-5` | `#6C8DE0` | — |
| `--color-cornflower-blue-light-6` | `#4E74D4` | — |
| `--color-cornflower-blue-light-7` | `#3A61C2` | — |
| `--color-cornflower-blue-light-8` | `#2B4EA6` | — |
| `--color-cornflower-blue-light-9` | `#243F8A` | — |
| `--color-cornflower-blue-light-10` | `#162C69` | — |
| `--color-cornflower-blue-light-11` | `#122252` | — |

### 2.19 cyan 🏷️ 工程未使用

> 本色系在 Moss 工程样式链路中**没有任何一阶**被引用。

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-cyan-light-1` | `#E8F9FF` | — |
| `--color-cyan-light-2` | `#CAF1FC` | — |
| `--color-cyan-light-3` | `#A2EBFF` | — |
| `--color-cyan-light-4` | `#50DAF9` | — |
| `--color-cyan-light-5` | `#3BCCEA` | — |
| `--color-cyan-light-6` | `#00B0D4` | — |
| `--color-cyan-light-7` | `#009CB6` | — |
| `--color-cyan-light-8` | `#008399` | — |
| `--color-cyan-light-9` | `#00687A` | — |
| `--color-cyan-light-10` | `#00515F` | — |
| `--color-cyan-light-11` | `#003B46` | — |

### 2.20 duck-green 🏷️ 工程未使用

> 本色系在 Moss 工程样式链路中**没有任何一阶**被引用。

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-duck-green-light-1` | `#D6FFF6` | — |
| `--color-duck-green-light-2` | `#8AFFEC` | — |
| `--color-duck-green-light-3` | `#6DF5E1` | — |
| `--color-duck-green-light-4` | `#4FDBC8` | — |
| `--color-duck-green-light-5` | `#30C5B2` | — |
| `--color-duck-green-light-6` | `#10B7A5` | — |
| `--color-duck-green-light-7` | `#009D8D` | — |
| `--color-duck-green-light-8` | `#008376` | — |
| `--color-duck-green-light-9` | `#006B5F` | — |
| `--color-duck-green-light-10` | `#00534A` | — |
| `--color-duck-green-light-11` | `#003A33` | — |

### 2.21 indigo 🏷️ 工程未使用

> 本色系在 Moss 工程样式链路中**没有任何一阶**被引用。

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-indigo-light-1` | `#EDF3FF` | — |
| `--color-indigo-light-2` | `#D6E3FF` | — |
| `--color-indigo-light-3` | `#B3C8F5` | — |
| `--color-indigo-light-4` | `#8AA6ED` | — |
| `--color-indigo-light-5` | `#6C8DE0` | — |
| `--color-indigo-light-6` | `#4E74D4` | — |
| `--color-indigo-light-7` | `#3A61C2` | — |
| `--color-indigo-light-8` | `#2B4EA6` | — |
| `--color-indigo-light-9` | `#243F8A` | — |
| `--color-indigo-light-10` | `#162C69` | — |
| `--color-indigo-light-11` | `#122252` | — |

### 2.22 leaf-green 🏷️ 工程未使用

> 本色系在 Moss 工程样式链路中**没有任何一阶**被引用。

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-leaf-green-light-1` | `#F0F9EC` | — |
| `--color-leaf-green-light-2` | `#D2EEC5` | — |
| `--color-leaf-green-light-3` | `#C3E9B1` | — |
| `--color-leaf-green-light-4` | `#B5E39E` | — |
| `--color-leaf-green-light-5` | `#97D877` | — |
| `--color-leaf-green-light-6` | `#6AC73C` | — |
| `--color-leaf-green-light-7` | `#559F30` | — |
| `--color-leaf-green-light-8` | `#407724` | — |
| `--color-leaf-green-light-9` | `#2A5018` | — |
| `--color-leaf-green-light-10` | `#203C12` | — |
| `--color-leaf-green-light-11` | `#203C12` | — |

### 2.23 lemon-green 🏷️ 工程未使用

> 本色系在 Moss 工程样式链路中**没有任何一阶**被引用。

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-lemon-green-light-1` | `#F2FACA` | — |
| `--color-lemon-green-light-2` | `#E3EDB4` | — |
| `--color-lemon-green-light-3` | `#D2E593` | — |
| `--color-lemon-green-light-4` | `#AECF04` | — |
| `--color-lemon-green-light-5` | `#98B504` | — |
| `--color-lemon-green-light-6` | `#829B03` | — |
| `--color-lemon-green-light-7` | `#6C8102` | — |
| `--color-lemon-green-light-8` | `#617402` | — |
| `--color-lemon-green-light-9` | `#414E02` | — |
| `--color-lemon-green-light-10` | `#313A01` | — |
| `--color-lemon-green-light-11` | `#313A01` | — |

### 2.24 lilac 🏷️ 工程未使用

> 本色系在 Moss 工程样式链路中**没有任何一阶**被引用。

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-lilac-light-1` | `#FBECF9` | — |
| `--color-lilac-light-2` | `#F4C6EC` | — |
| `--color-lilac-light-3` | `#F0B3E6` | — |
| `--color-lilac-light-4` | `#ECA0E0` | — |
| `--color-lilac-light-5` | `#E47AD3` | — |
| `--color-lilac-light-6` | `#D941C0` | — |
| `--color-lilac-light-7` | `#AE349A` | — |
| `--color-lilac-light-8` | `#822773` | — |
| `--color-lilac-light-9` | `#571A4D` | — |
| `--color-lilac-light-10` | `#261547` | — |
| `--color-lilac-light-11` | `#261547` | — |

### 2.25 magenta 🏷️ 工程未使用

> 本色系在 Moss 工程样式链路中**没有任何一阶**被引用。

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-magenta-light-1` | `#FAF0FE` | — |
| `--color-magenta-light-2` | `#F6DFFF` | — |
| `--color-magenta-light-3` | `#EEC5FF` | — |
| `--color-magenta-light-4` | `#E5A4FF` | — |
| `--color-magenta-light-5` | `#D97EFC` | — |
| `--color-magenta-light-6` | `#C847F2` | — |
| `--color-magenta-light-7` | `#AD2BD8` | — |
| `--color-magenta-light-8` | `#8A27AB` | — |
| `--color-magenta-light-9` | `#6C1B86` | — |
| `--color-magenta-light-10` | `#472355` | — |
| `--color-magenta-light-11` | `#33173E` | — |

### 2.26 pink 🏷️ 工程未使用

> 本色系在 Moss 工程样式链路中**没有任何一阶**被引用。

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-pink-light-1` | `#FAEBF0` | — |
| `--color-pink-light-2` | `#F9D4E2` | — |
| `--color-pink-light-3` | `#F3A8C3` | — |
| `--color-pink-light-4` | `#ED93B4` | — |
| `--color-pink-light-5` | `#E87BA4` | — |
| `--color-pink-light-6` | `#D55181` | — |
| `--color-pink-light-7` | `#C04873` | — |
| `--color-pink-light-8` | `#AD3D66` | — |
| `--color-pink-light-9` | `#862A4C` | — |
| `--color-pink-light-10` | `#5E1C34` | — |
| `--color-pink-light-11` | `#390F1F` | — |

### 2.27 purple 🏷️ 工程未使用

> 本色系在 Moss 工程样式链路中**没有任何一阶**被引用。

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-purple-light-1` | `#EFEDFF` | — |
| `--color-purple-light-2` | `#DFDBFD` | — |
| `--color-purple-light-3` | `#BFB9F5` | — |
| `--color-purple-light-4` | `#B0A7F2` | — |
| `--color-purple-light-5` | `#A096EB` | — |
| `--color-purple-light-6` | `#8173E3` | — |
| `--color-purple-light-7` | `#7161E0` | — |
| `--color-purple-light-8` | `#6250D6` | — |
| `--color-purple-light-9` | `#4A3AA7` | — |
| `--color-purple-light-10` | `#322777` | — |
| `--color-purple-light-11` | `#1D1649` | — |

### 2.28 sea-green 🏷️ 工程未使用

> 本色系在 Moss 工程样式链路中**没有任何一阶**被引用。

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-sea-green-light-1` | `#D6FFF6` | — |
| `--color-sea-green-light-2` | `#8AFFEC` | — |
| `--color-sea-green-light-3` | `#6DF5E1` | — |
| `--color-sea-green-light-4` | `#4FDBC8` | — |
| `--color-sea-green-light-5` | `#30C5B2` | — |
| `--color-sea-green-light-6` | `#10B7A5` | — |
| `--color-sea-green-light-7` | `#009D8D` | — |
| `--color-sea-green-light-8` | `#008376` | — |
| `--color-sea-green-light-9` | `#006B5F` | — |
| `--color-sea-green-light-10` | `#00534A` | — |
| `--color-sea-green-light-11` | `#003A33` | — |

### 2.29 sky-blue 🏷️ 工程未使用

> 本色系在 Moss 工程样式链路中**没有任何一阶**被引用。

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-sky-blue-light-1` | `#E8F9FF` | — |
| `--color-sky-blue-light-2` | `#CAF1FC` | — |
| `--color-sky-blue-light-3` | `#A2EBFF` | — |
| `--color-sky-blue-light-4` | `#50DAF9` | — |
| `--color-sky-blue-light-5` | `#3BCCEA` | — |
| `--color-sky-blue-light-6` | `#00B0D4` | — |
| `--color-sky-blue-light-7` | `#009CB6` | — |
| `--color-sky-blue-light-8` | `#008399` | — |
| `--color-sky-blue-light-9` | `#00687A` | — |
| `--color-sky-blue-light-10` | `#00515F` | — |
| `--color-sky-blue-light-11` | `#003B46` | — |

### 2.30 spring-green 🏷️ 工程未使用

> 本色系在 Moss 工程样式链路中**没有任何一阶**被引用。

| Token | 色值 | 工程使用 |
|-------|------|----------|
| `--color-spring-green-light-1` | `#E5F4E4` | — |
| `--color-spring-green-light-2` | `#CAEAC7` | — |
| `--color-spring-green-light-3` | `#91D68B` | — |
| `--color-spring-green-light-4` | `#73CB6D` | — |
| `--color-spring-green-light-5` | `#55BF50` | — |
| `--color-spring-green-light-6` | `#0CA30C` | — |
| `--color-spring-green-light-7` | `#009300` | — |
| `--color-spring-green-light-8` | `#008300` | — |
| `--color-spring-green-light-9` | `#006300` | — |
| `--color-spring-green-light-10` | `#074506` | — |
| `--color-spring-green-light-11` | `#11260F` | — |

### 色阶语义（通用）

| 阶 | 典型用途 |
|----|----------|
| light-1 ~ 2 | 浅色背景（Bg） |
| light-3 ~ 4 | 描边 / 悬停边框 |
| light-5 ~ 6 | 主色 / 文本强调 |
| light-7 ~ 8 | Active / 深色悬停 |
| light-9 ~ 11 | 深色文本 / 强调背景 |

## 3. 语义色（semantic.css）

### 3.1 品牌 Primary

| 语义 Token | 直接引用 | 解析到色板 |
|-----------|----------|------------|
| `--colorPrimary` | `var(--color-neutral-light-12)` | `#0B0B0B` |
| `--colorPrimaryActive` | `var(--color-neutral-light-12)` | `#0B0B0B` |
| `--colorPrimaryBg` | `var(--color-black-alpha-light-12)` | `rgba(11, 11, 11, 0.05)` |
| `--colorPrimaryBgActive` | `var(--color-black-alpha-light-10)` | `rgba(11, 11, 11, 0.2)` |
| `--colorPrimaryBgHover` | `var(--color-black-alpha-light-11)` | `rgba(11, 11, 11, 0.1)` |
| `--colorPrimaryBorder` | `var(--color-brand-light-3)` | `#F4AE94` |
| `--colorPrimaryBorderHover` | `var(--color-brand-light-4)` | `#EE8866` |
| `--colorPrimaryHover` | `var(--color-neutral-light-10)` | `#383835` |
| `--colorPrimaryText` | `var(--color-brand-light-6)` | `#D35B33` |
| `--colorPrimaryTextActive` | `var(--color-brand-light-7)` | `#C25124` |
| `--colorPrimaryTextHover` | `var(--color-brand-light-5)` | `#E3704B` |

### 3.2 成功 Success

| 语义 Token | 直接引用 | 解析到色板 |
|-----------|----------|------------|
| `--colorSuccess` | `var(--color-green-light-6)` | `#0CA30C` |
| `--colorSuccessActive` | `var(--color-green-light-7)` | `#009300` |
| `--colorSuccessBg` | `var(--color-green-light-1)` | `#E5F4E4` |
| `--colorSuccessBgHover` | `var(--color-green-light-2)` | `#CAEAC7` |
| `--colorSuccessBorder` | `var(--color-green-light-3)` | `#91D68B` |
| `--colorSuccessBorderHover` | `var(--color-green-light-4)` | `#73CB6D` |
| `--colorSuccessHover` | `var(--color-green-light-4)` | `#73CB6D` |
| `--colorSuccessText` | `var(--color-green-light-6)` | `#0CA30C` |
| `--colorSuccessTextActive` | `var(--color-green-light-7)` | `#009300` |
| `--colorSuccessTextHover` | `var(--color-green-light-5)` | `#55BF50` |

### 3.3 警告 Warning

| 语义 Token | 直接引用 | 解析到色板 |
|-----------|----------|------------|
| `--colorWarning` | `var(--color-yellow-light-6)` | `#F5A927` |
| `--colorWarningActive` | `var(--color-yellow-light-7)` | `#CF8517` |
| `--colorWarningBg` | `var(--color-yellow-light-1)` | `#FFF8E4` |
| `--colorWarningBgHover` | `var(--color-yellow-light-2)` | `#FFF3D1` |
| `--colorWarningBorder` | `var(--color-yellow-light-3)` | `#FFEAB0` |
| `--colorWarningBorderHover` | `var(--color-yellow-light-4)` | `#FFDA85` |
| `--colorWarningHover` | `var(--color-yellow-light-4)` | `#FFDA85` |
| `--colorWarningText` | `var(--color-yellow-light-6)` | `#F5A927` |
| `--colorWarningTextActive` | `var(--color-yellow-light-7)` | `#CF8517` |
| `--colorWarningTextHover` | `var(--color-yellow-light-5)` | `#FCC65B` |

### 3.4 错误 Error

| 语义 Token | 直接引用 | 解析到色板 |
|-----------|----------|------------|
| `--colorError` | `var(--color-red-light-6)` | `#E34948` |
| `--colorErrorActive` | `var(--color-red-light-7)` | `#D03B3B` |
| `--colorErrorBg` | `var(--color-red-light-1)` | `#FBEBEB` |
| `--colorErrorBgActive` | `var(--color-red-light-3)` | `#F4ABAB` |
| `--colorErrorBgHover` | `var(--color-red-light-2)` | `#FAD6D6` |
| `--colorErrorBorder` | `var(--color-red-light-3)` | `#F4ABAB` |
| `--colorErrorBorderHover` | `var(--color-red-light-4)` | `#F09595` |
| `--colorErrorHover` | `var(--color-red-light-5)` | `#EC7E7E` |
| `--colorErrorText` | `var(--color-red-light-6)` | `#E34948` |
| `--colorErrorTextActive` | `var(--color-red-light-7)` | `#D03B3B` |
| `--colorErrorTextHover` | `var(--color-red-light-5)` | `#EC7E7E` |

### 3.5 信息 Info

| 语义 Token | 直接引用 | 解析到色板 |
|-----------|----------|------------|
| `--colorInfo` | `var(--color-blue-light-6)` | `#3987E5` |
| `--colorInfoActive` | `var(--color-blue-light-7)` | `#2A78D6` |
| `--colorInfoBg` | `var(--color-blue-light-1)` | `#E7F1FB` |
| `--colorInfoBgHover` | `var(--color-blue-light-2)` | `#CDE2FB` |
| `--colorInfoBorder` | `var(--color-blue-light-3)` | `#9EC5F4` |
| `--colorInfoBorderHover` | `var(--color-blue-light-4)` | `#86B6EF` |
| `--colorInfoHover` | `var(--color-blue-light-4)` | `#86B6EF` |
| `--colorInfoText` | `var(--color-blue-light-6)` | `#3987E5` |
| `--colorInfoTextActive` | `var(--color-blue-light-7)` | `#2A78D6` |
| `--colorInfoTextHover` | `var(--color-blue-light-5)` | `#6DA7EC` |

### 3.6 文本 Text

| 语义 Token | 直接引用 | 解析到色板 |
|-----------|----------|------------|
| `--colorText` | `var(--color-black-alpha-light-1)` | `#0B0B0B` |
| `--colorTextDataDisabled` | `var(--colorTextDisabled)` | `rgba(11, 11, 11, 0.35)` |
| `--colorTextDescription` | `var(--colorTextTertiary)` | `rgba(11, 11, 11, 0.7)` |
| `--colorTextDisabled` | `var(--color-black-alpha-light-8)` | `rgba(11, 11, 11, 0.35)` |
| `--colorTextHeading` | `var(--colorText)` | `#0B0B0B` |
| `--colorTextLabel` | `var(--colorTextSecondary)` | `rgba(11, 11, 11, 0.85)` |
| `--colorTextPlaceholder` | `var(--colorTextQuaternary)` | `rgba(11, 11, 11, 0.5)` |
| `--colorTextQuaternary` | `var(--color-black-alpha-light-6)` | `rgba(11, 11, 11, 0.5)` |
| `--colorTextSecondary` | `var(--color-black-alpha-light-3)` | `rgba(11, 11, 11, 0.85)` |
| `--colorTextTertiary` | `var(--color-black-alpha-light-4)` | `rgba(11, 11, 11, 0.7)` |
| `--colorTextWhite` | `var(--colorWhite)` | `#FFFFFF` |
| `--colorTextWhiteFixation` | `var(--colorWhiteFixation)` | `#FFFFFF` |

### 3.7 图标 Icon

| 语义 Token | 直接引用 | 解析到色板 |
|-----------|----------|------------|
| `--colorIcon` | `var(--colorTextTertiary)` | `rgba(11, 11, 11, 0.7)` |
| `--colorIconActive` | `var(--colorText)` | `#0B0B0B` |
| `--colorIconDisabled` | `var(--color-black-alpha-light-9)` | `rgba(11, 11, 11, 0.3)` |
| `--colorIconHover` | `var(--colorTextSecondary)` | `rgba(11, 11, 11, 0.85)` |
| `--colorIconNormal` | `var(--colorTextSecondary)` | `rgba(11, 11, 11, 0.85)` |

### 3.8 边框 Border / Split

| 语义 Token | 直接引用 | 解析到色板 |
|-----------|----------|------------|
| `--colorBorder` | `var(--color-black-alpha-light-9)` | `rgba(11, 11, 11, 0.3)` |
| `--colorBorderPrimary` | `var(--color-black-alpha-light-7)` | `rgba(11, 11, 11, 0.4)` |
| `--colorBorderSecondary` | `var(--color-black-alpha-light-10)` | `rgba(11, 11, 11, 0.2)` |
| `--colorBorderTertiary` | `var(--color-black-alpha-light-11)` | `rgba(11, 11, 11, 0.1)` |
| `--colorSplit` | `var(--colorBorderSecondary)` | `rgba(11, 11, 11, 0.2)` |
| `--colorSplitWhite` | `var(--color-white-alpha-light-3)` | `rgba(255, 255, 255, 0.85)` |

### 3.9 填充 Fill

| 语义 Token | 直接引用 | 解析到色板 |
|-----------|----------|------------|
| `--colorFill` | `var(--color-black-alpha-light-8)` | `rgba(11, 11, 11, 0.35)` |
| `--colorFillAlter` | `var(--colorFillQuaternary)` | `rgba(11, 11, 11, 0.05)` |
| `--colorFillContent` | `var(--colorFillSecondary)` | `rgba(11, 11, 11, 0.3)` |
| `--colorFillQuaternary` | `var(--color-black-alpha-light-12)` | `rgba(11, 11, 11, 0.05)` |
| `--colorFillSecondary` | `var(--color-black-alpha-light-9)` | `rgba(11, 11, 11, 0.3)` |
| `--colorFillTertiary` | `var(--color-black-alpha-light-11)` | `rgba(11, 11, 11, 0.1)` |

### 3.10 背景 Bg

| 语义 Token | 直接引用 | 解析到色板 |
|-----------|----------|------------|
| `--colorBgContainer` | `var(--colorWhite)` | `#FFFFFF` |
| `--colorBgContainerDisabled` | `var(--colorFillQuaternary)` | `rgba(11, 11, 11, 0.05)` |
| `--colorBgContainerGrey` | `var(--color-neutral-light-1)` | `#FCFCFB` |
| `--colorBgContainerGreySecondary` | `var(--color-neutral-light-2)` | `#F9F9F7` |
| `--colorBgContainerGreyTertiary` | `var(--color-neutral-light-3)` | `#F0EFEC` |
| `--colorBgContainerSecondary` | `var(--color-white-alpha-light-4)` | `rgba(255, 255, 255, 0.7)` |
| `--colorBgContainerTertiary` | `var(--color-white-alpha-light-6)` | `rgba(255, 255, 255, 0.5)` |
| `--colorBgElevated` | `var(--colorWhite)` | `#FFFFFF` |
| `--colorBgElevaterFixation` | `var(--colorWhiteFixation)` | `#FFFFFF` |
| `--colorBgMaskWhite` | `var(--color-white-alpha-light-4)` | `rgba(255, 255, 255, 0.7)` |
| `--colorBgShape` | `var(--color-black-alpha-light-10)` | `rgba(11, 11, 11, 0.2)` |
| `--colorBgSpotlight` | `var(--color-neutral-light-10)` | `#383835` |
| `--colorBgTextActive` | `var(--colorFillTertiary)` | `rgba(11, 11, 11, 0.1)` |
| `--colorBgTextErrorActive` | `var(--color-red-light-2)` | `#FAD6D6` |
| `--colorBgTextErrorHover` | `var(--color-red-light-1)` | `#FBEBEB` |
| `--colorBgTextHover` | `var(--colorFillQuaternary)` | `rgba(11, 11, 11, 0.05)` |
| `--colorBgTextNormalActive` | `var(--colorFillTertiary)` | `rgba(11, 11, 11, 0.1)` |
| `--colorBgTextNormalHover` | `var(--colorFillQuaternary)` | `rgba(11, 11, 11, 0.05)` |

### 3.11 控件 Control

| 语义 Token | 直接引用 | 解析到色板 |
|-----------|----------|------------|
| `--controlItemBgActive` | `var(--colorPrimaryBg)` | `rgba(11, 11, 11, 0.05)` |
| `--controlItemBgActiveDisabled` | `var(--colorFillSecondary)` | `rgba(11, 11, 11, 0.3)` |
| `--controlItemBgActiveHover` | `var(--colorPrimaryBgHover)` | `rgba(11, 11, 11, 0.1)` |
| `--controlItemTextActive` | `var(--colorText)` | `#0B0B0B` |

### 3.12 项目兼容别名

| 语义 Token | 直接引用 | 解析到色板 |
|-----------|----------|------------|
| `--border-brand-soft` | `var(--colorPrimaryBorder)` | `#F4AE94` |
| `--border-muted` | `var(--colorSplit)` | `rgba(11, 11, 11, 0.2)` |
| `--border-regular` | `var(--colorSplit)` | `rgba(11, 11, 11, 0.2)` |
| `--border-subtle` | `var(--colorSplit)` | `rgba(11, 11, 11, 0.2)` |
| `--brand-border-soft` | `var(--colorPrimaryBorder)` | `#F4AE94` |
| `--brand-primary` | `var(--colorPrimary)` | `#0B0B0B` |
| `--brand-primary-ghost` | `var(--colorPrimaryBg)` | `rgba(11, 11, 11, 0.05)` |
| `--brand-primary-muted` | `var(--colorPrimaryBgHover)` | `rgba(11, 11, 11, 0.1)` |
| `--brand-primary-soft` | `var(--colorPrimaryBg)` | `rgba(11, 11, 11, 0.05)` |
| `--clay-soft` | `var(--brand-primary-soft)` | `rgba(11, 11, 11, 0.05)` |
| `--clay-strong` | `var(--brand-primary)` | `#0B0B0B` |
| `--dot-active` | `color-mix(in srgb, var(--color-neutral-light-7) 52%, transparent)` | `color-mix(in srgb, var(--color-neutral-light-7) 52%, transparent)` |
| `--dot-base` | `color-mix(in srgb, var(--color-neutral-light-4) 86%, transparent)` | `color-mix(in srgb, var(--color-neutral-light-4) 86%, transparent)` |
| `--icon-accent` | `var(--colorControlOutline)` | `color-mix(in srgb, var(--color-neutral-light-12) 15%, transparent)` |
| `--icon-default` | `var(--colorIconNormal)` | `rgba(11, 11, 11, 0.85)` |
| `--icon-strong` | `var(--colorIconActive)` | `#0B0B0B` |
| `--ink-500` | `var(--text-tertiary)` | `rgba(11, 11, 11, 0.7)` |
| `--ink-700` | `var(--text-secondary)` | `rgba(11, 11, 11, 0.85)` |
| `--ink-900` | `var(--text-primary)` | `#0B0B0B` |
| `--line-200` | `var(--border-muted)` | `rgba(11, 11, 11, 0.2)` |
| `--line-300` | `var(--border-regular)` | `rgba(11, 11, 11, 0.2)` |
| `--mask-faint` | `color-mix(in srgb, var(--color-neutral-light-11) 16%, transparent)` | `color-mix(in srgb, var(--color-neutral-light-11) 16%, transparent)` |
| `--mask-medium` | `color-mix(in srgb, var(--color-neutral-light-11) 64%, transparent)` | `color-mix(in srgb, var(--color-neutral-light-11) 64%, transparent)` |
| `--mask-soft` | `color-mix(in srgb, var(--color-neutral-light-11) 26%, transparent)` | `color-mix(in srgb, var(--color-neutral-light-11) 26%, transparent)` |
| `--mask-strong` | `var(--color-black-alpha-light-1)` | `#0B0B0B` |
| `--paper-000` | `var(--surface-base)` | `#FFFFFF` |
| `--paper-010` | `var(--surface-canvas)` | `#FCFCFB` |
| `--paper-040` | `var(--surface-subtle)` | `#F9F9F7` |
| `--paper-050` | `var(--surface-subtle)` | `#F9F9F7` |
| `--shadow-line` | `var(--colorBgShape)` | `rgba(11, 11, 11, 0.2)` |
| `--shadow-soft` | `var(--color-shadow-alpha-4)` | `rgba(11, 11, 11, 0.06)` |
| `--surface-base` | `var(--colorBgContainer)` | `#FFFFFF` |
| `--surface-brand-ghost` | `var(--colorPrimaryBg)` | `rgba(11, 11, 11, 0.05)` |
| `--surface-brand-muted` | `var(--colorPrimaryBgHover)` | `rgba(11, 11, 11, 0.1)` |
| `--surface-brand-soft` | `var(--colorPrimaryBg)` | `rgba(11, 11, 11, 0.05)` |
| `--surface-canvas` | `var(--colorBgContainerGrey)` | `#FCFCFB` |
| `--surface-disabled` | `var(--colorBgContainerDisabled)` | `rgba(11, 11, 11, 0.05)` |
| `--surface-hover` | `var(--colorBgContainerGreySecondary)` | `#F9F9F7` |
| `--surface-info` | `var(--colorInfoBg)` | `#E7F1FB` |
| `--surface-soft` | `var(--colorBgContainerGreyTertiary)` | `#F0EFEC` |
| `--surface-subtle` | `var(--colorBgContainerGreySecondary)` | `#F9F9F7` |
| `--text-muted` | `var(--colorTextDescription)` | `rgba(11, 11, 11, 0.7)` |
| `--text-primary` | `var(--colorText)` | `#0B0B0B` |
| `--text-secondary` | `var(--colorTextSecondary)` | `rgba(11, 11, 11, 0.85)` |
| `--text-tertiary` | `var(--colorTextTertiary)` | `rgba(11, 11, 11, 0.7)` |

### 语义色 → 色板 速查

| 语义角色 | Token | 最终色值 |
|----------|-------|----------|
| 主色 | `--colorPrimary` | `#0B0B0B` |
| 主色背景 | `--colorPrimaryBg` | `rgba(11, 11, 11, 0.05)` |
| 主色文本 | `--colorPrimaryText` | `#D35B33` |
| 正文 | `--colorText` | `#0B0B0B` |
| 次级正文 | `--colorTextSecondary` | `rgba(11, 11, 11, 0.85)` |
| 占位符 | `--colorTextPlaceholder` | `rgba(11, 11, 11, 0.5)` |
| 页面背景 | `--colorBgContainer` | `#FFFFFF` |
| 四级填充 | `--colorFillQuaternary` | `rgba(11, 11, 11, 0.05)` |
| 成功 | `--colorSuccess` | `#0CA30C` |
| 警告 | `--colorWarning` | `#F5A927` |
| 错误 | `--colorError` | `#E34948` |
| 信息 | `--colorInfo` | `#3987E5` |
| Hero 品牌强调 | `--moss-hero-brand` | `#D35B33` |

## 4. 组件 Token（component.css · 颜色相关）

### 应用 / 侧栏 / 主区域

| 组件 Token | 引用链 | 最终色值 |
|-----------|--------|----------|
| `--moss-app-bg` | var(--surface-canvas) → var(--colorBgContainerGrey) → var(--color-neutral-light-1) → #FCFCFB | `#FCFCFB` |
| `--moss-main-bg-bottom` | var(--surface-canvas) → var(--colorBgContainerGrey) → var(--color-neutral-light-1) → #FCFCFB | `#FCFCFB` |
| `--moss-main-bg-top` | var(--surface-canvas) → var(--colorBgContainerGrey) → var(--color-neutral-light-1) → #FCFCFB | `#FCFCFB` |
| `--moss-main-dot-active` | var(--dot-active) → color-mix(in srgb, var(--color-neutral-light-7) 52%, transparent) | `color-mix(in srgb, var(--color-neutral-light-7) 52%, transparent)` |
| `--moss-main-dot-base` | var(--dot-base) → color-mix(in srgb, var(--color-neutral-light-4) 86%, transparent) | `color-mix(in srgb, var(--color-neutral-light-4) 86%, transparent)` |
| `--moss-main-mask-faint` | var(--mask-faint) → color-mix(in srgb, var(--color-neutral-light-11) 16%, transparent) | `color-mix(in srgb, var(--color-neutral-light-11) 16%, transparent)` |
| `--moss-main-mask-medium` | var(--mask-medium) → color-mix(in srgb, var(--color-neutral-light-11) 64%, transparent) | `color-mix(in srgb, var(--color-neutral-light-11) 64%, transparent)` |
| `--moss-main-mask-soft` | var(--mask-soft) → color-mix(in srgb, var(--color-neutral-light-11) 26%, transparent) | `color-mix(in srgb, var(--color-neutral-light-11) 26%, transparent)` |
| `--moss-main-mask-strong` | var(--mask-strong) → var(--color-black-alpha-light-1) → #0B0B0B | `#0B0B0B` |
| `--moss-sidebar-active-bg` | var(--colorFillQuaternary) → var(--color-black-alpha-light-12) → rgba(11, 11, 11, 0.05) | `rgba(11, 11, 11, 0.05)` |
| `--moss-sidebar-bg` | var(--surface-canvas) → var(--colorBgContainerGrey) → var(--color-neutral-light-1) → #FCFCFB | `#FCFCFB` |
| `--moss-sidebar-border` | var(--border-subtle) → var(--colorSplit) → var(--colorBorderSecondary) → var(--color-black-alpha-light-10) → … | `rgba(11, 11, 11, 0.2)` |
| `--moss-sidebar-brand-bg` | var(--colorPrimaryBg) → var(--color-black-alpha-light-12) → rgba(11, 11, 11, 0.05) | `rgba(11, 11, 11, 0.05)` |
| `--moss-sidebar-brand-hover-bg` | var(--colorPrimaryBgHover) → var(--color-black-alpha-light-11) → rgba(11, 11, 11, 0.1) | `rgba(11, 11, 11, 0.1)` |
| `--moss-sidebar-collapsed-popover-shadow` | var(--shadow-secondary) → 0 0 6px 0 var(--color-shadow-alpha-3), 0 4px 12px 0 var(--color-shadow-alpha-4), 0 4px 24px 6px var(--color-shadow-alpha-2) | `0 0 6px 0 var(--color-shadow-alpha-3), 0 4px 12px 0 var(--color-shadow-alpha-4), 0 4px 24px 6px var(--color-shadow-alpha-2)` |
| `--moss-sidebar-collapsed-tooltip-bg` | var(--colorBgSpotlight) → var(--color-neutral-light-10) → #383835 | `#383835` |
| `--moss-sidebar-collapsed-tooltip-shadow` | var(--shadow-secondary) → 0 0 6px 0 var(--color-shadow-alpha-3), 0 4px 12px 0 var(--color-shadow-alpha-4), 0 4px 24px 6px var(--color-shadow-alpha-2) | `0 0 6px 0 var(--color-shadow-alpha-3), 0 4px 12px 0 var(--color-shadow-alpha-4), 0 4px 24px 6px var(--color-shadow-alpha-2)` |
| `--moss-sidebar-collapsed-tooltip-text` | var(--colorWhite) → var(--color-neutral-light-0) → #FFFFFF | `#FFFFFF` |
| `--moss-sidebar-divider` | var(--colorBorderSecondary) → var(--color-black-alpha-light-10) → rgba(11, 11, 11, 0.2) | `rgba(11, 11, 11, 0.2)` |
| `--moss-sidebar-feedback-bg` | var(--colorBgElevated) → var(--colorWhite) → var(--color-neutral-light-0) → #FFFFFF | `#FFFFFF` |
| `--moss-sidebar-feedback-border` | var(--colorBorderSecondary) → var(--color-black-alpha-light-10) → rgba(11, 11, 11, 0.2) | `rgba(11, 11, 11, 0.2)` |
| `--moss-sidebar-feedback-danger` | var(--colorError) → var(--color-red-light-6) → #E34948 | `#E34948` |
| `--moss-sidebar-feedback-danger-bg` | var(--colorErrorBg) → var(--color-red-light-1) → #FBEBEB | `#FBEBEB` |
| `--moss-sidebar-feedback-danger-border` | var(--colorErrorBorder) → var(--color-red-light-3) → #F4ABAB | `#F4ABAB` |
| `--moss-sidebar-feedback-success` | var(--colorPrimaryText) → var(--color-brand-light-6) → #D35B33 | `#D35B33` |
| `--moss-sidebar-feedback-success-bg` | var(--colorPrimaryBg) → var(--color-black-alpha-light-12) → rgba(11, 11, 11, 0.05) | `rgba(11, 11, 11, 0.05)` |
| `--moss-sidebar-feedback-success-border` | var(--colorPrimaryBorder) → var(--color-brand-light-3) → #F4AE94 | `#F4AE94` |
| `--moss-sidebar-feedback-text` | var(--colorTextHeading) → var(--colorText) → var(--color-black-alpha-light-1) → #0B0B0B | `#0B0B0B` |
| `--moss-sidebar-history-hover-bg` | var(--colorFillTertiary) → var(--color-black-alpha-light-11) → rgba(11, 11, 11, 0.1) | `rgba(11, 11, 11, 0.1)` |
| `--moss-sidebar-hover-bg` | var(--colorFillTertiary) → var(--color-black-alpha-light-11) → rgba(11, 11, 11, 0.1) | `rgba(11, 11, 11, 0.1)` |
| `--moss-sidebar-hover-muted-bg` | var(--colorFillTertiary) → var(--color-black-alpha-light-11) → rgba(11, 11, 11, 0.1) | `rgba(11, 11, 11, 0.1)` |
| `--moss-sidebar-icon` | var(--colorIconNormal) → var(--colorTextSecondary) → var(--color-black-alpha-light-3) → rgba(11, 11, 11, 0.85) | `rgba(11, 11, 11, 0.85)` |
| `--moss-sidebar-icon-accent` | var(--icon-accent) → var(--colorControlOutline) → color-mix(in srgb, var(--color-neutral-light-12) 15%, transparent) | `color-mix(in srgb, var(--color-neutral-light-12) 15%, transparent)` |
| `--moss-sidebar-item-text` | var(--text-secondary) → var(--colorTextSecondary) → var(--color-black-alpha-light-3) → rgba(11, 11, 11, 0.85) | `rgba(11, 11, 11, 0.85)` |
| `--moss-sidebar-label` | var(--colorTextPlaceholder) → var(--colorTextQuaternary) → var(--color-black-alpha-light-6) → rgba(11, 11, 11, 0.5) | `rgba(11, 11, 11, 0.5)` |
| `--moss-sidebar-label-hover` | var(--colorTextDescription) → var(--colorTextTertiary) → var(--color-black-alpha-light-4) → rgba(11, 11, 11, 0.7) | `rgba(11, 11, 11, 0.7)` |
| `--moss-sidebar-menu-bg` | var(--colorBgElevated) → var(--colorWhite) → var(--color-neutral-light-0) → #FFFFFF | `#FFFFFF` |
| `--moss-sidebar-menu-border` | var(--colorBorderSecondary) → var(--color-black-alpha-light-10) → rgba(11, 11, 11, 0.2) | `rgba(11, 11, 11, 0.2)` |
| `--moss-sidebar-menu-danger` | var(--colorError) → var(--color-red-light-6) → #E34948 | `#E34948` |
| `--moss-sidebar-menu-danger-hover-bg` | var(--colorErrorBg) → var(--color-red-light-1) → #FBEBEB | `#FBEBEB` |
| `--moss-sidebar-menu-focus-ring` | var(--colorPrimaryBorder) → var(--color-brand-light-3) → #F4AE94 | `#F4AE94` |
| `--moss-sidebar-menu-hover-bg` | var(--colorBgTextNormalHover) → var(--colorFillQuaternary) → var(--color-black-alpha-light-12) → rgba(11, 11, 11, 0.05) | `rgba(11, 11, 11, 0.05)` |
| `--moss-sidebar-menu-shadow` | var(--shadow-secondary) → 0 0 6px 0 var(--color-shadow-alpha-3), 0 4px 12px 0 var(--color-shadow-alpha-4), 0 4px 24px 6px var(--color-shadow-alpha-2) | `0 0 6px 0 var(--color-shadow-alpha-3), 0 4px 12px 0 var(--color-shadow-alpha-4), 0 4px 24px 6px var(--color-shadow-alpha-2)` |
| `--moss-sidebar-menu-text` | var(--colorTextHeading) → var(--colorText) → var(--color-black-alpha-light-1) → #0B0B0B | `#0B0B0B` |
| `--moss-sidebar-more-button-hover-bg` | var(--colorFillTertiary) → var(--color-black-alpha-light-11) → rgba(11, 11, 11, 0.1) | `rgba(11, 11, 11, 0.1)` |
| `--moss-sidebar-more-button-icon-size` | var(--icon-size-sm) → 14px | `14px` |
| `--moss-sidebar-more-button-open-bg` | var(--colorFillTertiary) → var(--color-black-alpha-light-11) → rgba(11, 11, 11, 0.1) | `rgba(11, 11, 11, 0.1)` |
| `--moss-sidebar-more-button-open-shadow` | var(--shadow-subtle) → 0 0 2px 0 var(--color-shadow-alpha-1), 0 1px 4px 0 var(--color-shadow-alpha-4) | `0 0 2px 0 var(--color-shadow-alpha-1), 0 1px 4px 0 var(--color-shadow-alpha-4)` |
| `--moss-sidebar-secondary-icon-active-bg` | var(--moss-sidebar-hover-bg) → var(--colorFillTertiary) → var(--color-black-alpha-light-11) → rgba(11, 11, 11, 0.1) | `rgba(11, 11, 11, 0.1)` |
| `--moss-sidebar-secondary-icon-hover-bg` | var(--moss-sidebar-active-bg) → var(--colorFillQuaternary) → var(--color-black-alpha-light-12) → rgba(11, 11, 11, 0.05) | `rgba(11, 11, 11, 0.05)` |
| `--moss-sidebar-selected-text` | var(--colorTextHeading) → var(--colorText) → var(--color-black-alpha-light-1) → #0B0B0B | `#0B0B0B` |
| `--moss-sidebar-title` | var(--colorBlack) → var(--color-neutral-light-12) → #0B0B0B | `#0B0B0B` |
| `--moss-sidebar-user-border` | var(--colorBorderSecondary) → var(--color-black-alpha-light-10) → rgba(11, 11, 11, 0.2) | `rgba(11, 11, 11, 0.2)` |
| `--moss-sidebar-user-text` | var(--colorTextHeading) → var(--colorText) → var(--color-black-alpha-light-1) → #0B0B0B | `#0B0B0B` |

### Hero / 卡片 / Tab / Prompt

| 组件 Token | 引用链 | 最终色值 |
|-----------|--------|----------|
| `--moss-card-bg` | var(--surface-base) → var(--colorBgContainer) → var(--colorWhite) → var(--color-neutral-light-0) → … | `#FFFFFF` |
| `--moss-card-border` | var(--colorBorderSecondary) → var(--color-black-alpha-light-10) → rgba(11, 11, 11, 0.2) | `rgba(11, 11, 11, 0.2)` |
| `--moss-card-divider` | var(--colorBorderSecondary) → var(--color-black-alpha-light-10) → rgba(11, 11, 11, 0.2) | `rgba(11, 11, 11, 0.2)` |
| `--moss-hero-brand` | var(--color-orange-light-6) → #D35B33 | `#D35B33` |
| `--moss-hero-title` | var(--text-primary) → var(--colorText) → var(--color-black-alpha-light-1) → #0B0B0B | `#0B0B0B` |
| `--moss-prompt-hover-bg` | var(--colorFillQuaternary) → var(--color-black-alpha-light-12) → rgba(11, 11, 11, 0.05) | `rgba(11, 11, 11, 0.05)` |
| `--moss-prompt-text` | var(--colorTextSecondary) → var(--color-black-alpha-light-3) → rgba(11, 11, 11, 0.85) | `rgba(11, 11, 11, 0.85)` |
| `--moss-tab-active-border` | var(--moss-tab-active-text) → var(--colorText) → var(--color-black-alpha-light-1) → #0B0B0B | `#0B0B0B` |
| `--moss-tab-active-text` | var(--colorText) → var(--color-black-alpha-light-1) → #0B0B0B | `#0B0B0B` |
| `--moss-tab-text` | var(--colorTextHeading) → var(--colorText) → var(--color-black-alpha-light-1) → #0B0B0B | `#0B0B0B` |

### 输入框

| 组件 Token | 引用链 | 最终色值 |
|-----------|--------|----------|
| `--moss-input-bg` | var(--colorBgContainer) → var(--colorWhite) → var(--color-neutral-light-0) → #FFFFFF | `#FFFFFF` |
| `--moss-input-border` | var(--colorBorder) → var(--color-black-alpha-light-9) → rgba(11, 11, 11, 0.3) | `rgba(11, 11, 11, 0.3)` |
| `--moss-input-border-focus` | var(--color-neutral-light-9) → #52514E | `#52514E` |
| `--moss-input-border-hover` | var(--color-neutral-light-8) → #6D6B67 | `#6D6B67` |
| `--moss-input-caret` | var(--colorTextHeading) → var(--colorText) → var(--color-black-alpha-light-1) → #0B0B0B | `#0B0B0B` |
| `--moss-input-icon` | var(--color-neutral-light-7) → #898781 | `#898781` |
| `--moss-input-placeholder` | var(--color-neutral-light-7) → #898781 | `#898781` |
| `--moss-input-shadow-focus` | 0 0 0 2px color-mix(in srgb, var(--color-neutral-light-9) 15%, transparent) | `0 0 0 2px color-mix(in srgb, var(--color-neutral-light-9) 15%, transparent)` |
| `--moss-input-text` | var(--colorText) → var(--color-black-alpha-light-1) → #0B0B0B | `#0B0B0B` |

### 按钮

| 组件 Token | 引用链 | 最终色值 |
|-----------|--------|----------|
| `--moss-button-disabled-bg` | var(--colorFillQuaternary) → var(--color-black-alpha-light-12) → rgba(11, 11, 11, 0.05) | `rgba(11, 11, 11, 0.05)` |
| `--moss-button-disabled-border` | var(--colorFillQuaternary) → var(--color-black-alpha-light-12) → rgba(11, 11, 11, 0.05) | `rgba(11, 11, 11, 0.05)` |
| `--moss-button-disabled-text` | var(--colorTextDisabled) → var(--color-black-alpha-light-8) → rgba(11, 11, 11, 0.35) | `rgba(11, 11, 11, 0.35)` |
| `--moss-button-link-bg-active` | var(--colorBgTextActive) → var(--colorFillTertiary) → var(--color-black-alpha-light-11) → rgba(11, 11, 11, 0.1) | `rgba(11, 11, 11, 0.1)` |
| `--moss-button-link-bg-hover` | var(--colorBgTextHover) → var(--colorFillQuaternary) → var(--color-black-alpha-light-12) → rgba(11, 11, 11, 0.05) | `rgba(11, 11, 11, 0.05)` |
| `--moss-button-link-muted-text` | var(--colorTextSecondary) → var(--color-black-alpha-light-3) → rgba(11, 11, 11, 0.85) | `rgba(11, 11, 11, 0.85)` |
| `--moss-button-link-text` | var(--colorInfo) → var(--color-blue-light-6) → #3987E5 | `#3987E5` |
| `--moss-button-outline-bg-active` | var(--colorFillTertiary) → var(--color-black-alpha-light-11) → rgba(11, 11, 11, 0.1) | `rgba(11, 11, 11, 0.1)` |
| `--moss-button-outline-bg-hover` | var(--colorFillQuaternary) → var(--color-black-alpha-light-12) → rgba(11, 11, 11, 0.05) | `rgba(11, 11, 11, 0.05)` |
| `--moss-button-outline-border` | var(--colorBorder) → var(--color-black-alpha-light-9) → rgba(11, 11, 11, 0.3) | `rgba(11, 11, 11, 0.3)` |
| `--moss-button-outline-border-hover` | var(--colorBorderPrimary) → var(--color-black-alpha-light-7) → rgba(11, 11, 11, 0.4) | `rgba(11, 11, 11, 0.4)` |
| `--moss-button-outline-text` | var(--colorText) → var(--color-black-alpha-light-1) → #0B0B0B | `#0B0B0B` |
| `--moss-button-primary-bg` | var(--colorPrimary) → var(--color-neutral-light-12) → #0B0B0B | `#0B0B0B` |
| `--moss-button-primary-bg-active` | var(--colorPrimaryActive) → var(--color-neutral-light-12) → #0B0B0B | `#0B0B0B` |
| `--moss-button-primary-bg-hover` | var(--colorPrimaryHover) → var(--color-neutral-light-10) → #383835 | `#383835` |
| `--moss-button-primary-text` | var(--colorTextWhite) → var(--colorWhite) → var(--color-neutral-light-0) → #FFFFFF | `#FFFFFF` |
| `--moss-button-secondary-bg` | var(--colorFillQuaternary) → var(--color-black-alpha-light-12) → rgba(11, 11, 11, 0.05) | `rgba(11, 11, 11, 0.05)` |
| `--moss-button-secondary-bg-active` | var(--colorFillSecondary) → var(--color-black-alpha-light-9) → rgba(11, 11, 11, 0.3) | `rgba(11, 11, 11, 0.3)` |
| `--moss-button-secondary-bg-hover` | var(--colorFillTertiary) → var(--color-black-alpha-light-11) → rgba(11, 11, 11, 0.1) | `rgba(11, 11, 11, 0.1)` |
| `--moss-button-secondary-text` | var(--colorText) → var(--color-black-alpha-light-1) → #0B0B0B | `#0B0B0B` |

### Composer / 文件引用

| 组件 Token | 引用链 | 最终色值 |
|-----------|--------|----------|
| `--moss-composer-bg` | var(--surface-base) → var(--colorBgContainer) → var(--colorWhite) → var(--color-neutral-light-0) → … | `#FFFFFF` |
| `--moss-composer-border` | var(--colorBorderSecondary) → var(--color-black-alpha-light-10) → rgba(11, 11, 11, 0.2) | `rgba(11, 11, 11, 0.2)` |
| `--moss-composer-border-focus` | var(--colorBorderPrimary) → var(--color-black-alpha-light-7) → rgba(11, 11, 11, 0.4) | `rgba(11, 11, 11, 0.4)` |
| `--moss-composer-border-hover` | var(--colorBorderPrimary) → var(--color-black-alpha-light-7) → rgba(11, 11, 11, 0.4) | `rgba(11, 11, 11, 0.4)` |
| `--moss-composer-disabled` | var(--surface-disabled) → var(--colorBgContainerDisabled) → var(--colorFillQuaternary) → var(--color-black-alpha-light-12) → … | `rgba(11, 11, 11, 0.05)` |
| `--moss-composer-file-tag-bg` | var(--colorFillQuaternary) → var(--color-black-alpha-light-12) → rgba(11, 11, 11, 0.05) | `rgba(11, 11, 11, 0.05)` |
| `--moss-composer-file-tag-bg-hover` | var(--colorFillTertiary) → var(--color-black-alpha-light-11) → rgba(11, 11, 11, 0.1) | `rgba(11, 11, 11, 0.1)` |
| `--moss-composer-file-tag-progress-fill` | var(--colorFillQuaternary) → var(--color-black-alpha-light-12) → rgba(11, 11, 11, 0.05) | `rgba(11, 11, 11, 0.05)` |
| `--moss-composer-file-tag-size-text` | var(--colorTextPlaceholder) → var(--colorTextQuaternary) → var(--color-black-alpha-light-6) → rgba(11, 11, 11, 0.5) | `rgba(11, 11, 11, 0.5)` |
| `--moss-composer-file-tag-text` | var(--colorTextSecondary) → var(--color-black-alpha-light-3) → rgba(11, 11, 11, 0.85) | `rgba(11, 11, 11, 0.85)` |
| `--moss-composer-placeholder` | var(--colorTextDescription) → var(--colorTextTertiary) → var(--color-black-alpha-light-4) → rgba(11, 11, 11, 0.7) | `rgba(11, 11, 11, 0.7)` |
| `--moss-composer-placeholder-rest` | var(--colorTextPlaceholder) → var(--colorTextQuaternary) → var(--color-black-alpha-light-6) → rgba(11, 11, 11, 0.5) | `rgba(11, 11, 11, 0.5)` |
| `--moss-composer-reference-bg` | var(--colorInfoBg) → var(--color-blue-light-1) → #E7F1FB | `#E7F1FB` |
| `--moss-composer-reference-text` | var(--colorInfo) → var(--color-blue-light-6) → #3987E5 | `#3987E5` |
| `--moss-composer-send-bg` | var(--brand-primary) → var(--colorPrimary) → var(--color-neutral-light-12) → #0B0B0B | `#0B0B0B` |
| `--moss-composer-send-bg-active` | var(--colorPrimaryActive) → var(--color-neutral-light-12) → #0B0B0B | `#0B0B0B` |
| `--moss-composer-send-bg-hover` | var(--colorPrimaryHover) → var(--color-neutral-light-10) → #383835 | `#383835` |
| `--moss-composer-send-text` | var(--colorWhite) → var(--color-neutral-light-0) → #FFFFFF | `#FFFFFF` |
| `--moss-composer-shadow-focus` | var(--shadow) → 0 0 2px 0 var(--color-shadow-alpha-1), 0 4px 8px 0 var(--color-shadow-alpha-4), 0 4px 24px 6px var(--color-shadow-alpha-2) | `0 0 2px 0 var(--color-shadow-alpha-1), 0 4px 8px 0 var(--color-shadow-alpha-4), 0 4px 24px 6px var(--color-shadow-alpha-2)` |
| `--moss-composer-shadow-normal` | var(--shadow-subtle) → 0 0 2px 0 var(--color-shadow-alpha-1), 0 1px 4px 0 var(--color-shadow-alpha-4) | `0 0 2px 0 var(--color-shadow-alpha-1), 0 1px 4px 0 var(--color-shadow-alpha-4)` |
| `--moss-composer-stop-bg` | var(--colorBlack) → var(--color-neutral-light-12) → #0B0B0B | `#0B0B0B` |
| `--moss-composer-stop-bg-hover` | var(--colorPrimaryHover) → var(--color-neutral-light-10) → #383835 | `#383835` |
| `--moss-composer-stop-text` | var(--colorWhite) → var(--color-neutral-light-0) → #FFFFFF | `#FFFFFF` |
| `--moss-composer-text` | var(--colorTextHeading) → var(--colorText) → var(--color-black-alpha-light-1) → #0B0B0B | `#0B0B0B` |
| `--moss-composer-upload-bg-active` | var(--colorBgTextNormalActive) → var(--colorFillTertiary) → var(--color-black-alpha-light-11) → rgba(11, 11, 11, 0.1) | `rgba(11, 11, 11, 0.1)` |
| `--moss-composer-upload-bg-hover` | var(--colorBgTextNormalHover) → var(--colorFillQuaternary) → var(--color-black-alpha-light-12) → rgba(11, 11, 11, 0.05) | `rgba(11, 11, 11, 0.05)` |
| `--moss-composer-upload-text` | var(--colorIconNormal) → var(--colorTextSecondary) → var(--color-black-alpha-light-3) → rgba(11, 11, 11, 0.85) | `rgba(11, 11, 11, 0.85)` |
| `--moss-composer-upload-text-hover` | var(--colorIconActive) → var(--colorText) → var(--color-black-alpha-light-1) → #0B0B0B | `#0B0B0B` |
| `--moss-composer-upload-tooltip-bg` | var(--colorBgSpotlight) → var(--color-neutral-light-10) → #383835 | `#383835` |
| `--moss-composer-upload-tooltip-text` | var(--colorWhite) → var(--color-neutral-light-0) → #FFFFFF | `#FFFFFF` |
| `--moss-file-mention-divider` | var(--colorBorderSecondary) → var(--color-black-alpha-light-10) → rgba(11, 11, 11, 0.2) | `rgba(11, 11, 11, 0.2)` |
| `--moss-file-mention-item-hover-bg` | var(--colorFillQuaternary) → var(--color-black-alpha-light-12) → rgba(11, 11, 11, 0.05) | `rgba(11, 11, 11, 0.05)` |
| `--moss-file-mention-panel-bg` | var(--colorBgElevated) → var(--colorWhite) → var(--color-neutral-light-0) → #FFFFFF | `#FFFFFF` |
| `--moss-file-mention-panel-shadow` | var(--shadow-secondary) → 0 0 6px 0 var(--color-shadow-alpha-3), 0 4px 12px 0 var(--color-shadow-alpha-4), 0 4px 24px 6px var(--color-shadow-alpha-2) | `0 0 6px 0 var(--color-shadow-alpha-3), 0 4px 12px 0 var(--color-shadow-alpha-4), 0 4px 24px 6px var(--color-shadow-alpha-2)` |
| `--moss-file-mention-text` | var(--colorTextSecondary) → var(--color-black-alpha-light-3) → rgba(11, 11, 11, 0.85) | `rgba(11, 11, 11, 0.85)` |
| `--moss-file-mention-title` | var(--colorTextPlaceholder) → var(--colorTextQuaternary) → var(--color-black-alpha-light-6) → rgba(11, 11, 11, 0.5) | `rgba(11, 11, 11, 0.5)` |
| `--moss-sent-bg` | var(--surface-brand-ghost) → var(--colorPrimaryBg) → var(--color-black-alpha-light-12) → rgba(11, 11, 11, 0.05) | `rgba(11, 11, 11, 0.05)` |
| `--moss-sent-border` | var(--border-brand-soft) → var(--colorPrimaryBorder) → var(--color-brand-light-3) → #F4AE94 | `#F4AE94` |
| `--moss-sent-text` | var(--text-secondary) → var(--colorTextSecondary) → var(--color-black-alpha-light-3) → rgba(11, 11, 11, 0.85) | `rgba(11, 11, 11, 0.85)` |

### 文件面板

| 组件 Token | 引用链 | 最终色值 |
|-----------|--------|----------|
| `--moss-files-panel-bg` | var(--colorBgContainer) → var(--colorWhite) → var(--color-neutral-light-0) → #FFFFFF | `#FFFFFF` |
| `--moss-files-panel-border` | var(--colorFillQuaternary) → var(--color-black-alpha-light-12) → rgba(11, 11, 11, 0.05) | `rgba(11, 11, 11, 0.05)` |
| `--moss-files-panel-divider` | var(--colorBorderSecondary) → var(--color-black-alpha-light-10) → rgba(11, 11, 11, 0.2) | `rgba(11, 11, 11, 0.2)` |
| `--moss-files-panel-resizer-color` | var(--color-black-alpha-light-8) → rgba(11, 11, 11, 0.35) | `rgba(11, 11, 11, 0.35)` |
| `--moss-files-panel-shadow` | var(--shadow-subtle) → 0 0 2px 0 var(--color-shadow-alpha-1), 0 1px 4px 0 var(--color-shadow-alpha-4) | `0 0 2px 0 var(--color-shadow-alpha-1), 0 1px 4px 0 var(--color-shadow-alpha-4)` |

## 5. 主题基础 Token（theme.css · 非颜色）

| 分类 | 变量 | 值 |
|------|------|----|
| 字号 | `--font-size-xs` | `12px` |
| 字号 | `--font-size-sm` | `14px` |
| 字号 | `--font-size-lg` | `16px` |
| 字号 | `--font-size-xl` | `18px` |
| 行高 | `--line-height-sm` | `20px` |
| 行高 | `--line-height-md` | `22px` |
| 行高 | `--line-height-xl` | `26px` |
| 圆角 | `--radius-xs` | `4px` |
| 圆角 | `--radius-sm` | `6px` |
| 圆角 | `--radius-md` | `8px` |
| 圆角 | `--radius-xl` | `16px` |
| 间距 | `--padding-xs` | `4px` |
| 间距 | `--padding-md` | `8px` |
| 间距 | `--padding-xl` | `16px` |
| 间距 | `--padding-xxxxl` | `32px` |
| 控件高度 | `--height-control-xs` | `16px` |
| 控件高度 | `--height-control-md` | `32px` |
| 控件高度 | `--height-control-lg` | `40px` |
| 阴影 | `--shadow-subtle` | `0 0 2px 0 var(--color-shadow-alpha-1), 0 1px 4px 0 var(--color-shadow-alpha-4)` |
| 阴影 | `--shadow` | `0 0 2px 0 var(--color-shadow-alpha-1), 0 4px 8px 0 var(--color-shadow-alpha-4), 0 4px 24px 6px var(--color-shadow-alpha-2)` |
| 阴影 | `--shadow-secondary` | `0 0 6px 0 var(--color-shadow-alpha-3), 0 4px 12px 0 var(--color-shadow-alpha-4), 0 4px 24px 6px var(--color-shadow-alpha-2)` |

## 6. 维护说明

- 改基础色：更新 Figma 后运行 `node scripts/sync-figma-tokens.mjs`。
- 改组件色：手工维护 `component.css`。
- 重新生成本文档：`node scripts/generate-token-mapping.mjs`。
