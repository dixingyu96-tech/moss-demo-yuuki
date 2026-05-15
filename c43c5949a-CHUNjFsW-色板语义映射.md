# CDS 原始色板与语义色映射

> 来源文件：`/Users/yuki/Desktop/c43c5949a-CHUNjFsW.css`（`.cds-root` 设计令牌）
> 说明：**原始色板**为 `--cds-{hue}-{step}` 等固定色值；**语义色**为 `--cds-fill-*`、`--cds-text-*` 等，通常通过 `var()` 指向原始色或透明叠色。浅色默认为 `.cds-root`；深色为 `[data-mode=dark] .cds-root` / `.cds-root[data-mode=dark]` 覆盖。

## 一、原始色板（Primitives）

下列为文件中直接给出的十六进制色值（不随明暗模式改变）。`--cds-gray-740` / `--cds-gray-780` 为别名，分别等于 `--cds-gray-750` / `--cds-gray-800`。

| 原始变量 | 色值 |
| --- | --- |
| `--cds-aqua-0` | #ffffff |
| `--cds-aqua-10` | #f9fdfb |
| `--cds-aqua-20` | #f3fbf8 |
| `--cds-aqua-30` | #edf9f4 |
| `--cds-aqua-40` | #e8f7f1 |
| `--cds-aqua-50` | #e2f4ed |
| `--cds-aqua-60` | #dcf2ea |
| `--cds-aqua-70` | #d5f0e6 |
| `--cds-aqua-80` | #ceefe2 |
| `--cds-aqua-90` | #c7eddf |
| `--cds-aqua-100` | #bfebdb |
| `--cds-aqua-150` | #a0e1c9 |
| `--cds-aqua-200` | #7ad7b4 |
| `--cds-aqua-250` | #5acba0 |
| `--cds-aqua-300` | #3bbd8c |
| `--cds-aqua-350` | #1baf7a |
| `--cds-aqua-400` | #199e70 |
| `--cds-aqua-450` | #138e65 |
| `--cds-aqua-500` | #0f7e5c |
| `--cds-aqua-550` | #0e6e53 |
| `--cds-aqua-600` | #065f49 |
| `--cds-aqua-650` | #095040 |
| `--cds-aqua-700` | #034235 |
| `--cds-aqua-750` | #02342b |
| `--cds-aqua-800` | #022720 |
| `--cds-aqua-810` | #02241e |
| `--cds-aqua-820` | #02221c |
| `--cds-aqua-830` | #021f1a |
| `--cds-aqua-840` | #031c18 |
| `--cds-aqua-850` | #051a16 |
| `--cds-aqua-860` | #071713 |
| `--cds-aqua-870` | #081411 |
| `--cds-aqua-880` | #0a110f |
| `--cds-aqua-890` | #0b0e0d |
| `--cds-aqua-900` | #0b0b0b |
| `--cds-blue-0` | #ffffff |
| `--cds-blue-10` | #fafcff |
| `--cds-blue-20` | #f5f9fe |
| `--cds-blue-30` | #f0f7fe |
| `--cds-blue-40` | #ebf4fc |
| `--cds-blue-50` | #e7f1fb |
| `--cds-blue-60` | #e2eefa |
| `--cds-blue-70` | #ddebfa |
| `--cds-blue-80` | #d7e8fa |
| `--cds-blue-90` | #d2e5fa |
| `--cds-blue-100` | #cde2fb |
| `--cds-blue-150` | #b7d3f6 |
| `--cds-blue-200` | #9ec5f4 |
| `--cds-blue-250` | #86b6ef |
| `--cds-blue-300` | #6da7ec |
| `--cds-blue-350` | #5598e7 |
| `--cds-blue-400` | #3987e5 |
| `--cds-blue-450` | #2a78d6 |
| `--cds-blue-500` | #256abf |
| `--cds-blue-550` | #1c5cab |
| `--cds-blue-600` | #184f95 |
| `--cds-blue-650` | #104281 |
| `--cds-blue-700` | #0d366b |
| `--cds-blue-750` | #062b57 |
| `--cds-blue-800` | #032042 |
| `--cds-blue-810` | #031e3d |
| `--cds-blue-820` | #021c39 |
| `--cds-blue-830` | #021a36 |
| `--cds-blue-840` | #021831 |
| `--cds-blue-850` | #03162c |
| `--cds-blue-860` | #051426 |
| `--cds-blue-870` | #07121f |
| `--cds-blue-880` | #091018 |
| `--cds-blue-890` | #0a0d11 |
| `--cds-blue-900` | #0b0b0b |
| `--cds-gray-0` | #ffffff |
| `--cds-gray-10` | #fcfcfb |
| `--cds-gray-20` | #f9f9f7 |
| `--cds-gray-30` | #f6f6f4 |
| `--cds-gray-40` | #f3f3f0 |
| `--cds-gray-50` | #f0efec |
| `--cds-gray-60` | #edece8 |
| `--cds-gray-70` | #eae9e4 |
| `--cds-gray-80` | #e7e6e1 |
| `--cds-gray-90` | #e4e3dd |
| `--cds-gray-100` | #e1e0d9 |
| `--cds-gray-150` | #d2d1c7 |
| `--cds-gray-200` | #c3c2b7 |
| `--cds-gray-250` | #b4b3a8 |
| `--cds-gray-300` | #a5a49a |
| `--cds-gray-350` | #97958d |
| `--cds-gray-400` | #898781 |
| `--cds-gray-450` | #7b7974 |
| `--cds-gray-500` | #6d6b67 |
| `--cds-gray-550` | #5f5e5a |
| `--cds-gray-600` | #52514e |
| `--cds-gray-650` | #454442 |
| `--cds-gray-700` | #383835 |
| `--cds-gray-740` | var(--cds-gray-750) |
| `--cds-gray-750` | #2c2c2a |
| `--cds-gray-780` | var(--cds-gray-800) |
| `--cds-gray-800` | #20201f |
| `--cds-gray-810` | #1e1e1d |
| `--cds-gray-820` | #1c1c1b |
| `--cds-gray-830` | #1a1a19 |
| `--cds-gray-840` | #181817 |
| `--cds-gray-850` | #151515 |
| `--cds-gray-860` | #131313 |
| `--cds-gray-870` | #111111 |
| `--cds-gray-880` | #0f0f0f |
| `--cds-gray-890` | #0d0d0d |
| `--cds-gray-900` | #0b0b0b |
| `--cds-green-0` | #ffffff |
| `--cds-green-10` | #fafdfa |
| `--cds-green-20` | #f5fbf4 |
| `--cds-green-30` | #f0f9ef |
| `--cds-green-40` | #ebf7e9 |
| `--cds-green-50` | #e5f4e4 |
| `--cds-green-60` | #e0f2de |
| `--cds-green-70` | #dbf0d8 |
| `--cds-green-80` | #d5eed3 |
| `--cds-green-90` | #d0eccd |
| `--cds-green-100` | #caeac7 |
| `--cds-green-150` | #aee0a9 |
| `--cds-green-200` | #91d68b |
| `--cds-green-250` | #73cb6d |
| `--cds-green-300` | #55bf50 |
| `--cds-green-350` | #35b231 |
| `--cds-green-400` | #0ca30c |
| `--cds-green-450` | #009300 |
| `--cds-green-500` | #008300 |
| `--cds-green-550` | #007300 |
| `--cds-green-600` | #006300 |
| `--cds-green-650` | #005400 |
| `--cds-green-700` | #074506 |
| `--cds-green-750` | #0f350d |
| `--cds-green-800` | #11260f |
| `--cds-green-810` | #10230f |
| `--cds-green-820` | #10210f |
| `--cds-green-830` | #101e0f |
| `--cds-green-840` | #101b0f |
| `--cds-green-850` | #0f180e |
| `--cds-green-860` | #0e160e |
| `--cds-green-870` | #0e130d |
| `--cds-green-880` | #0d100d |
| `--cds-green-890` | #0c0e0c |
| `--cds-green-900` | #0b0b0b |
| `--cds-magenta-0` | #ffffff |
| `--cds-magenta-10` | #fefbfc |
| `--cds-magenta-20` | #fef6f9 |
| `--cds-magenta-30` | #fdf2f6 |
| `--cds-magenta-40` | #fbeff3 |
| `--cds-magenta-50` | #faebf0 |
| `--cds-magenta-60` | #f9e6ed |
| `--cds-magenta-70` | #f9e2eb |
| `--cds-magenta-80` | #f9dee8 |
| `--cds-magenta-90` | #f9d9e5 |
| `--cds-magenta-100` | #f9d4e2 |
| `--cds-magenta-150` | #f3c0d3 |
| `--cds-magenta-200` | #f3a8c3 |
| `--cds-magenta-250` | #ed93b4 |
| `--cds-magenta-300` | #e87ba4 |
| `--cds-magenta-350` | #e46191 |
| `--cds-magenta-400` | #d55181 |
| `--cds-magenta-450` | #c04873 |
| `--cds-magenta-500` | #ad3d66 |
| `--cds-magenta-550` | #993458 |
| `--cds-magenta-600` | #862a4c |
| `--cds-magenta-650` | #722340 |
| `--cds-magenta-700` | #5e1c34 |
| `--cds-magenta-750` | #4c1429 |
| `--cds-magenta-800` | #390f1f |
| `--cds-magenta-810` | #360d1c |
| `--cds-magenta-820` | #320c1a |
| `--cds-magenta-830` | #2f0b18 |
| `--cds-magenta-840` | #2b0a16 |
| `--cds-magenta-850` | #270a14 |
| `--cds-magenta-860` | #220a12 |
| `--cds-magenta-870` | #1c0b11 |
| `--cds-magenta-880` | #170b0f |
| `--cds-magenta-890` | #110b0d |
| `--cds-magenta-900` | #0b0b0b |
| `--cds-orange-0` | #ffffff |
| `--cds-orange-10` | #fefbfa |
| `--cds-orange-20` | #fdf7f5 |
| `--cds-orange-30` | #fcf4f0 |
| `--cds-orange-40` | #faf0ec |
| `--cds-orange-50` | #f9ece7 |
| `--cds-orange-60` | #f8e9e2 |
| `--cds-orange-70` | #f7e5dd |
| `--cds-orange-80` | #f7e1d7 |
| `--cds-orange-90` | #f7dcd1 |
| `--cds-orange-100` | #f7d8cb |
| `--cds-orange-150` | #f3c5b2 |
| `--cds-orange-200` | #f4ae94 |
| `--cds-orange-250` | #f09978 |
| `--cds-orange-300` | #ec835a |
| `--cds-orange-350` | #eb6834 |
| `--cds-orange-400` | #d95926 |
| `--cds-orange-450` | #c25124 |
| `--cds-orange-500` | #ae461c |
| `--cds-orange-550` | #993d19 |
| `--cds-orange-600` | #863311 |
| `--cds-orange-650` | #712b0f |
| `--cds-orange-700` | #5d230b |
| `--cds-orange-750` | #4b1b08 |
| `--cds-orange-800` | #371407 |
| `--cds-orange-810` | #341307 |
| `--cds-orange-820` | #301106 |
| `--cds-orange-830` | #2d1006 |
| `--cds-orange-840` | #290f06 |
| `--cds-orange-850` | #240e07 |
| `--cds-orange-860` | #1f0e08 |
| `--cds-orange-870` | #1a0e09 |
| `--cds-orange-880` | #150d0a |
| `--cds-orange-890` | #100c0b |
| `--cds-orange-900` | #0b0b0b |
| `--cds-red-0` | #ffffff |
| `--cds-red-10` | #fffbfb |
| `--cds-red-20` | #fef7f7 |
| `--cds-red-30` | #fef3f3 |
| `--cds-red-40` | #fdefef |
| `--cds-red-50` | #fbebeb |
| `--cds-red-60` | #fae7e7 |
| `--cds-red-70` | #fae3e3 |
| `--cds-red-80` | #fadfdf |
| `--cds-red-90` | #fadada |
| `--cds-red-100` | #fad6d6 |
| `--cds-red-150` | #f7c1c1 |
| `--cds-red-200` | #f4abab |
| `--cds-red-250` | #f09595 |
| `--cds-red-300` | #ec7e7e |
| `--cds-red-350` | #e66767 |
| `--cds-red-400` | #e34948 |
| `--cds-red-450` | #d03b3b |
| `--cds-red-500` | #b93535 |
| `--cds-red-550` | #a32c2c |
| `--cds-red-600` | #8e2626 |
| `--cds-red-650` | #791e1e |
| `--cds-red-700` | #641919 |
| `--cds-red-750` | #511212 |
| `--cds-red-800` | #3c0e0e |
| `--cds-red-810` | #380d0d |
| `--cds-red-820` | #340c0c |
| `--cds-red-830` | #310b0b |
| `--cds-red-840` | #2d0a0a |
| `--cds-red-850` | #280a0a |
| `--cds-red-860` | #230b0a |
| `--cds-red-870` | #1d0b0a |
| `--cds-red-880` | #170c0b |
| `--cds-red-890` | #110c0b |
| `--cds-red-900` | #0b0b0b |
| `--cds-violet-0` | #ffffff |
| `--cds-violet-10` | #fcfbff |
| `--cds-violet-20` | #f8f8ff |
| `--cds-violet-30` | #f5f4ff |
| `--cds-violet-40` | #f2f1ff |
| `--cds-violet-50` | #efedff |
| `--cds-violet-60` | #ebeafe |
| `--cds-violet-70` | #e8e6fe |
| `--cds-violet-80` | #e5e2fd |
| `--cds-violet-90` | #e2dffd |
| `--cds-violet-100` | #dfdbfd |
| `--cds-violet-150` | #cfcafb |
| `--cds-violet-200` | #bfb9f5 |
| `--cds-violet-250` | #b0a7f2 |
| `--cds-violet-300` | #a096eb |
| `--cds-violet-350` | #9085e9 |
| `--cds-violet-400` | #8173e3 |
| `--cds-violet-450` | #7161e0 |
| `--cds-violet-500` | #6250d6 |
| `--cds-violet-550` | #5645be |
| `--cds-violet-600` | #4a3aa7 |
| `--cds-violet-650` | #3e318e |
| `--cds-violet-700` | #322777 |
| `--cds-violet-750` | #271e60 |
| `--cds-violet-800` | #1d1649 |
| `--cds-violet-810` | #1b1544 |
| `--cds-violet-820` | #19133f |
| `--cds-violet-830` | #17123b |
| `--cds-violet-840` | #151036 |
| `--cds-violet-850` | #130f32 |
| `--cds-violet-860` | #110e2b |
| `--cds-violet-870` | #0f0e23 |
| `--cds-violet-880` | #0e0d1b |
| `--cds-violet-890` | #0c0c13 |
| `--cds-violet-900` | #0b0b0b |
| `--cds-yellow-0` | #ffffff |
| `--cds-yellow-10` | #fefcf8 |
| `--cds-yellow-20` | #fcf8f1 |
| `--cds-yellow-30` | #fbf5ea |
| `--cds-yellow-40` | #f9f2e4 |
| `--cds-yellow-50` | #f9eeda |
| `--cds-yellow-60` | #faebce |
| `--cds-yellow-70` | #fae7c2 |
| `--cds-yellow-80` | #fae3b8 |
| `--cds-yellow-90` | #f9e0b0 |
| `--cds-yellow-100` | #f9dca4 |
| `--cds-yellow-150` | #f9c868 |
| `--cds-yellow-200` | #fab219 |
| `--cds-yellow-250` | #eda100 |
| `--cds-yellow-300` | #db9300 |
| `--cds-yellow-350` | #c98500 |
| `--cds-yellow-400` | #b77700 |
| `--cds-yellow-450` | #a66a00 |
| `--cds-yellow-500` | #945d00 |
| `--cds-yellow-550` | #835100 |
| `--cds-yellow-600` | #734500 |
| `--cds-yellow-650` | #623900 |
| `--cds-yellow-700` | #512e00 |
| `--cds-yellow-750` | #412400 |
| `--cds-yellow-800` | #311a00 |
| `--cds-yellow-810` | #2e1800 |
| `--cds-yellow-820` | #2b1700 |
| `--cds-yellow-830` | #271500 |
| `--cds-yellow-840` | #231402 |
| `--cds-yellow-850` | #1f1204 |
| `--cds-yellow-860` | #1b1106 |
| `--cds-yellow-870` | #171007 |
| `--cds-yellow-880` | #130e09 |
| `--cds-yellow-890` | #0f0d0a |
| `--cds-yellow-900` | #0b0b0b |
| `--cds-clay` | #d97757 |
| `--cds-clay-emphasized` | #c6613f |

### 1.1 品牌/紫色/粉色语义别名 → 原始色阶

| 语义别名变量 | 引用（即对应原始色板变量） |
| --- | --- |
| `--cds-brand-100` | `--cds-orange-100` |
| `--cds-brand-200` | `--cds-orange-200` |
| `--cds-brand-300` | `--cds-orange-300` |
| `--cds-brand-400` | `--cds-orange-400` |
| `--cds-brand-450` | `--cds-orange-450` |
| `--cds-brand-50` | `--cds-orange-50` |
| `--cds-brand-500` | `--cds-orange-500` |
| `--cds-brand-600` | `--cds-orange-600` |
| `--cds-brand-700` | `--cds-orange-700` |
| `--cds-brand-800` | `--cds-orange-800` |
| `--cds-purple-100` | `--cds-violet-100` |
| `--cds-purple-200` | `--cds-violet-200` |
| `--cds-purple-250` | `--cds-violet-250` |
| `--cds-purple-300` | `--cds-violet-300` |
| `--cds-purple-400` | `--cds-violet-400` |
| `--cds-purple-450` | `--cds-violet-450` |
| `--cds-purple-50` | `--cds-violet-50` |
| `--cds-purple-500` | `--cds-violet-500` |
| `--cds-purple-600` | `--cds-violet-600` |
| `--cds-purple-700` | `--cds-violet-700` |
| `--cds-purple-750` | `--cds-violet-750` |
| `--cds-purple-800` | `--cds-violet-800` |
| `--cds-pink-100` | `--cds-magenta-100` |
| `--cds-pink-200` | `--cds-magenta-200` |
| `--cds-pink-300` | `--cds-magenta-300` |
| `--cds-pink-400` | `--cds-magenta-400` |
| `--cds-pink-450` | `--cds-magenta-450` |
| `--cds-pink-50` | `--cds-magenta-50` |
| `--cds-pink-500` | `--cds-magenta-500` |
| `--cds-pink-600` | `--cds-magenta-600` |
| `--cds-pink-700` | `--cds-magenta-700` |
| `--cds-pink-750` | `--cds-magenta-750` |
| `--cds-pink-800` | `--cds-magenta-800` |

**解读**：`brand-*` 与 `orange-*` 同名阶一一对应；`purple-*` 对应 `violet-*`；`pink-*` 对应 `magenta-*`。

## 二、中性语义阶（`neutral-*`）与灰阶映射

浅色模式：`neutral-*` 直接等于 `gray-*` 同名阶。深色模式：`neutral-0`↔最深灰、`neutral-900`↔最浅灰（整体反转），用于文本与表面在暗色下的可读性。

| 变量 | 浅色 → 原始灰 | 深色 → 原始灰（覆盖后） |
| --- | --- | --- |
| `--cds-neutral-0` | `--cds-gray-0` → #ffffff | `--cds-gray-900` → #0b0b0b |
| `--cds-neutral-10` | `--cds-gray-10` → #fcfcfb | `--cds-gray-890` → #0d0d0d |
| `--cds-neutral-20` | `--cds-gray-20` → #f9f9f7 | `--cds-gray-880` → #0f0f0f |
| `--cds-neutral-30` | `--cds-gray-30` → #f6f6f4 | `--cds-gray-870` → #111111 |
| `--cds-neutral-40` | `--cds-gray-40` → #f3f3f0 | `--cds-gray-860` → #131313 |
| `--cds-neutral-50` | `--cds-gray-50` → #f0efec | `--cds-gray-850` → #151515 |
| `--cds-neutral-60` | `--cds-gray-60` → #edece8 | `--cds-gray-840` → #181817 |
| `--cds-neutral-70` | `--cds-gray-70` → #eae9e4 | `--cds-gray-830` → #1a1a19 |
| `--cds-neutral-80` | `--cds-gray-80` → #e7e6e1 | `--cds-gray-820` → #1c1c1b |
| `--cds-neutral-90` | `--cds-gray-90` → #e4e3dd | `--cds-gray-810` → #1e1e1d |
| `--cds-neutral-100` | `--cds-gray-100` → #e1e0d9 | `--cds-gray-800` → #20201f |
| `--cds-neutral-150` | `--cds-gray-150` → #d2d1c7 | `--cds-gray-750` → #2c2c2a |
| `--cds-neutral-200` | `--cds-gray-200` → #c3c2b7 | `--cds-gray-700` → #383835 |
| `--cds-neutral-250` | `--cds-gray-250` → #b4b3a8 | `--cds-gray-650` → #454442 |
| `--cds-neutral-300` | `--cds-gray-300` → #a5a49a | `--cds-gray-600` → #52514e |
| `--cds-neutral-350` | `--cds-gray-350` → #97958d | `--cds-gray-550` → #5f5e5a |
| `--cds-neutral-400` | `--cds-gray-400` → #898781 | `--cds-gray-500` → #6d6b67 |
| `--cds-neutral-450` | `--cds-gray-450` → #7b7974 | `--cds-gray-450` → #7b7974 |
| `--cds-neutral-500` | `--cds-gray-500` → #6d6b67 | `--cds-gray-400` → #898781 |
| `--cds-neutral-550` | `--cds-gray-550` → #5f5e5a | `--cds-gray-350` → #97958d |
| `--cds-neutral-600` | `--cds-gray-600` → #52514e | `--cds-gray-300` → #a5a49a |
| `--cds-neutral-650` | `--cds-gray-650` → #454442 | `--cds-gray-250` → #b4b3a8 |
| `--cds-neutral-700` | `--cds-gray-700` → #383835 | `--cds-gray-200` → #c3c2b7 |
| `--cds-neutral-740` | `--cds-neutral-750` → var(--cds-gray-750) | `--cds-neutral-750` → var(--cds-gray-750) |
| `--cds-neutral-750` | `--cds-gray-750` → #2c2c2a | `--cds-gray-150` → #d2d1c7 |
| `--cds-neutral-780` | `--cds-neutral-800` → var(--cds-gray-800) | `--cds-neutral-800` → var(--cds-gray-800) |
| `--cds-neutral-800` | `--cds-gray-800` → #20201f | `--cds-gray-100` → #e1e0d9 |
| `--cds-neutral-810` | `--cds-gray-810` → #1e1e1d | `--cds-gray-90` → #e4e3dd |
| `--cds-neutral-820` | `--cds-gray-820` → #1c1c1b | `--cds-gray-80` → #e7e6e1 |
| `--cds-neutral-830` | `--cds-gray-830` → #1a1a19 | `--cds-gray-70` → #eae9e4 |
| `--cds-neutral-840` | `--cds-gray-840` → #181817 | `--cds-gray-60` → #edece8 |
| `--cds-neutral-850` | `--cds-gray-850` → #151515 | `--cds-gray-50` → #f0efec |
| `--cds-neutral-860` | `--cds-gray-860` → #131313 | `--cds-gray-40` → #f3f3f0 |
| `--cds-neutral-870` | `--cds-gray-870` → #111111 | `--cds-gray-30` → #f6f6f4 |
| `--cds-neutral-880` | `--cds-gray-880` → #0f0f0f | `--cds-gray-20` → #f9f9f7 |
| `--cds-neutral-890` | `--cds-gray-890` → #0d0d0d | `--cds-gray-10` → #fcfcfb |
| `--cds-neutral-900` | `--cds-gray-900` → #0b0b0b | `--cds-gray-0` → #ffffff |

## 三、表面与页面（随模式变化）

| 语义变量 | 浅色解析结果 | 深色解析结果 | 典型场景 |
| --- | --- | --- | --- |
| `--cds-surface-0` | #f9f9f7 | #0d0d0d | 页面/容器最底层表面色（背景层级 0） |
| `--cds-surface-1` | #fcfcfb | #1a1a19 | 表面层级 1（略浮起的区域背景） |
| `--cds-surface-2` | #ffffff | #2c2c2a | 表面层级 2（卡片等） |
| `--cds-surface-3` | #ffffff | #383835 | 表面层级 3（与页面反差最大的顶层表面） |
| `--cds-page-bg` | #f9f9f7 | #0d0d0d | 整页背景 |
| `--cds-surface-popover` | #ffffff | #383835 | Popover、下拉等浮层容器背景 |
| `--cds-surface-panel` | #ffffff | #2c2c2a | 侧栏/面板类容器背景 |

## 四、语义色 → 原始色 / 解析值（浅色 `.cds-root`）

| 语义变量 | 解析链（var 展开顺序） | 最终值 / 原始引用 | 使用场景说明 |
| --- | --- | --- | --- |
| `--cds-alpha-0` | --cds-alpha-0 | hsl(from var(--cds-neutral-900) h s l / 0%) | 基于 neutral-900 的透明覆盖 0% |
| `--cds-alpha-1` | --cds-alpha-1 | hsl(from var(--cds-neutral-900) h s l / 5%) | 约 5% 透明中性叠色 |
| `--cds-alpha-2` | --cds-alpha-2 | hsl(from var(--cds-neutral-900) h s l / 10%) | 约 10% 透明（默认边框等） |
| `--cds-alpha-3` | --cds-alpha-3 | hsl(from var(--cds-neutral-900) h s l / 20%) | 约 20% 透明 |
| `--cds-alpha-4` | --cds-alpha-4 | hsl(from var(--cds-neutral-900) h s l / 35%) | 约 35% 透明（禁用文字等） |
| `--cds-alpha-5` | --cds-alpha-5 | hsl(from var(--cds-neutral-900) h s l / 50%) | 约 50% 透明 |
| `--cds-alpha-6` | --cds-alpha-6 | hsl(from var(--cds-neutral-900) h s l / 60%) | 约 60% 透明 |
| `--cds-alpha-7` | --cds-alpha-7 | hsl(from var(--cds-neutral-900) h s l / 70%) | 约 70% 透明 |
| `--cds-alpha-8` | --cds-alpha-8 | hsl(from var(--cds-neutral-900) h s l / 85%) | 约 85% 透明 |
| `--cds-alpha-9` | --cds-alpha-9 | hsl(from var(--cds-neutral-900) h s l / 95%) | 约 95% 透明 |
| `--cds-backdrop` | --cds-backdrop | rgb(0 0 0 / .4) | 模态遮罩 |
| `--cds-bg-accent` | --cds-bg-accent → --cds-blue-100 | #cde2fb（原始变量 --cds-blue-100） | 强调色浅背景（提示条、信息块） |
| `--cds-bg-accent-chip` | --cds-bg-accent-chip → --cds-blue-100 | #cde2fb（原始变量 --cds-blue-100） | 强调色标签/芯片背景 |
| `--cds-bg-danger` | --cds-bg-danger → --cds-red-100 | #fad6d6（原始变量 --cds-red-100） | 错误/危险状态浅背景 |
| `--cds-bg-danger-chip` | --cds-bg-danger-chip → --cds-red-100 | #fad6d6（原始变量 --cds-red-100） | 错误标签/芯片背景 |
| `--cds-bg-neutral-chip` | --cds-bg-neutral-chip → --cds-alpha-1 | hsl(from var(--cds-neutral-900) h s l / 5%) | 中性标签/芯片背景 |
| `--cds-bg-neutral-chip-hover` | --cds-bg-neutral-chip-hover → --cds-alpha-2 | hsl(from var(--cds-neutral-900) h s l / 10%) | 中性芯片悬停 |
| `--cds-bg-pink` | --cds-bg-pink → --cds-pink-50 → --cds-magenta-50 | #faebf0（原始变量 --cds-magenta-50） | 粉色信息浅背景 |
| `--cds-bg-pink-chip` | --cds-bg-pink-chip → --cds-pink-100 → --cds-magenta-100 | #f9d4e2（原始变量 --cds-magenta-100） | 粉色标签背景 |
| `--cds-bg-pro` | --cds-bg-pro → --cds-purple-100 → --cds-violet-100 | #dfdbfd（原始变量 --cds-violet-100） | Pro 浅背景 |
| `--cds-bg-pro-chip` | --cds-bg-pro-chip → --cds-purple-100 → --cds-violet-100 | #dfdbfd（原始变量 --cds-violet-100） | Pro 标签背景 |
| `--cds-bg-success` | --cds-bg-success → --cds-green-100 | #caeac7（原始变量 --cds-green-100） | 成功状态浅背景 |
| `--cds-bg-success-chip` | --cds-bg-success-chip → --cds-green-100 | #caeac7（原始变量 --cds-green-100） | 成功标签背景 |
| `--cds-bg-warning` | --cds-bg-warning → --cds-yellow-100 | #f9dca4（原始变量 --cds-yellow-100） | 警告浅背景 |
| `--cds-bg-warning-chip` | --cds-bg-warning-chip → --cds-yellow-100 | #f9dca4（原始变量 --cds-yellow-100） | 警告标签背景 |
| `--cds-border` | --cds-border → --cds-alpha-2 | hsl(from var(--cds-neutral-900) h s l / 10%) | 默认组件描边 |
| `--cds-border-accent` | --cds-border-accent → --cds-blue-250 | #86b6ef（原始变量 --cds-blue-250） | 强调色相关描边 |
| `--cds-border-danger` | --cds-border-danger → --cds-red-250 | #f09595（原始变量 --cds-red-250） | 错误相关描边 |
| `--cds-border-pro` | --cds-border-pro → --cds-purple-250 → --cds-violet-250 | #b0a7f2（原始变量 --cds-violet-250） | Pro 描边 |
| `--cds-border-strong` | --cds-border-strong → --cds-alpha-3 | hsl(from var(--cds-neutral-900) h s l / 20%) | 较强描边 |
| `--cds-border-stronger` | --cds-border-stronger | hsl(from var(--cds-neutral-900) h s l / 40%) | 更强分隔描边 |
| `--cds-border-success` | --cds-border-success → --cds-green-250 | #73cb6d（原始变量 --cds-green-250） | 成功相关描边 |
| `--cds-border-warning` | --cds-border-warning → --cds-yellow-250 | #eda100（原始变量 --cds-yellow-250） | 警告描边 |
| `--cds-brand-100` | --cds-brand-100 → --cds-orange-100 | #f7d8cb（原始变量 --cds-orange-100） | 品牌色阶（语义别名，引用 orange 原始色阶同名阶） |
| `--cds-brand-200` | --cds-brand-200 → --cds-orange-200 | #f4ae94（原始变量 --cds-orange-200） | 品牌色阶（语义别名，引用 orange 原始色阶同名阶） |
| `--cds-brand-300` | --cds-brand-300 → --cds-orange-300 | #ec835a（原始变量 --cds-orange-300） | 品牌色阶（语义别名，引用 orange 原始色阶同名阶） |
| `--cds-brand-400` | --cds-brand-400 → --cds-orange-400 | #d95926（原始变量 --cds-orange-400） | 品牌色阶（语义别名，引用 orange 原始色阶同名阶） |
| `--cds-brand-450` | --cds-brand-450 → --cds-orange-450 | #c25124（原始变量 --cds-orange-450） | 品牌色阶（语义别名，引用 orange 原始色阶同名阶） |
| `--cds-brand-50` | --cds-brand-50 → --cds-orange-50 | #f9ece7（原始变量 --cds-orange-50） | 品牌色阶（语义别名，引用 orange 原始色阶同名阶） |
| `--cds-brand-500` | --cds-brand-500 → --cds-orange-500 | #ae461c（原始变量 --cds-orange-500） | 品牌色阶（语义别名，引用 orange 原始色阶同名阶） |
| `--cds-brand-600` | --cds-brand-600 → --cds-orange-600 | #863311（原始变量 --cds-orange-600） | 品牌色阶（语义别名，引用 orange 原始色阶同名阶） |
| `--cds-brand-700` | --cds-brand-700 → --cds-orange-700 | #5d230b（原始变量 --cds-orange-700） | 品牌色阶（语义别名，引用 orange 原始色阶同名阶） |
| `--cds-brand-800` | --cds-brand-800 → --cds-orange-800 | #371407（原始变量 --cds-orange-800） | 品牌色阶（语义别名，引用 orange 原始色阶同名阶） |
| `--cds-fill-accent` | --cds-fill-accent → --cds-blue-450 | #2a78d6（原始变量 --cds-blue-450） | 强调色实心填充（主操作、链接型按钮） |
| `--cds-fill-accent-hover` | --cds-fill-accent-hover → --cds-blue-400 | #3987e5（原始变量 --cds-blue-400） | 强调色填充悬停态 |
| `--cds-fill-brand` | --cds-fill-brand → --cds-clay-emphasized | #c6613f（原始变量 --cds-clay-emphasized） | 品牌色实心填充（品牌主按钮） |
| `--cds-fill-brand-hover` | --cds-fill-brand-hover → --cds-clay | #d97757（原始变量 --cds-clay） | 品牌色填充悬停 |
| `--cds-fill-control` | --cds-fill-control → --cds-alpha-2 | hsl(from var(--cds-neutral-900) h s l / 10%) | 开关轨道等控件浅填充 |
| `--cds-fill-control-hover` | --cds-fill-control-hover → --cds-alpha-3 | hsl(from var(--cds-neutral-900) h s l / 20%) | 控件填充悬停 |
| `--cds-fill-danger` | --cds-fill-danger → --cds-red-450 | #d03b3b（原始变量 --cds-red-450） | 危险操作实心填充 |
| `--cds-fill-danger-hover` | --cds-fill-danger-hover → --cds-red-400 | #e34948（原始变量 --cds-red-400） | 危险按钮悬停 |
| `--cds-fill-disabled` | --cds-fill-disabled → --cds-alpha-1 | hsl(from var(--cds-neutral-900) h s l / 5%) | 禁用控件填充 |
| `--cds-fill-field` | --cds-fill-field | hsl(0 0% 100% / .5) | 输入框等控件填充底色 |
| `--cds-fill-ghost-hover` | --cds-fill-ghost-hover → --cds-alpha-1 | hsl(from var(--cds-neutral-900) h s l / 5%) | 幽灵按钮悬停铺底 |
| `--cds-fill-primary` | --cds-fill-primary → --cds-neutral-900 → --cds-gray-900 | #0b0b0b（原始变量 --cds-gray-900） | 中性主按钮深色填充 |
| `--cds-fill-primary-hover` | --cds-fill-primary-hover → --cds-neutral-750 → --cds-gray-750 | #2c2c2a（原始变量 --cds-gray-750） | 主按钮悬停 |
| `--cds-fill-pro` | --cds-fill-pro → --cds-purple-450 → --cds-violet-450 | #7161e0（原始变量 --cds-violet-450） | Pro/付费相关实心填充 |
| `--cds-fill-pro-hover` | --cds-fill-pro-hover → --cds-purple-400 → --cds-violet-400 | #8173e3（原始变量 --cds-violet-400） | Pro 按钮悬停 |
| `--cds-fill-secondary` | --cds-fill-secondary | hsl(0 0% 100% / .1) | 次级/半透明按钮填充 |
| `--cds-fill-secondary-hover` | --cds-fill-secondary-hover → --cds-alpha-1 | hsl(from var(--cds-neutral-900) h s l / 5%) | 次级按钮悬停铺底 |
| `--cds-fill-secondary-ring` | --cds-fill-secondary-ring → --cds-border → --cds-alpha-2 | hsl(from var(--cds-neutral-900) h s l / 10%) | 次级按钮焦点环参考 |
| `--cds-fill-success` | --cds-fill-success → --cds-green-450 | #009300（原始变量 --cds-green-450） | 成功态实心填充 |
| `--cds-fill-success-hover` | --cds-fill-success-hover → --cds-green-400 | #0ca30c（原始变量 --cds-green-400） | 成功按钮悬停 |
| `--cds-fill-warning` | --cds-fill-warning → --cds-yellow-200 | #fab219（原始变量 --cds-yellow-200） | 警告态实心/高对比填充 |
| `--cds-fill-warning-hover` | --cds-fill-warning-hover → --cds-yellow-250 | #eda100（原始变量 --cds-yellow-250） | 警告填充悬停 |
| `--cds-focus-shadow` | --cds-focus-shadow | inset 0 0 0 1px var(--cds-page-bg), 0 0 0 1px var(--cds-fill-accent), 0 0 6px 1px var(--cds-bg-accent-chip) | 聚焦 ring 组合阴影 |
| `--cds-on-accent` | --cds-on-accent → --cds-gray-0 | #ffffff（原始变量 --cds-gray-0） | 强调色表面上的前景 |
| `--cds-on-brand` | --cds-on-brand → --cds-gray-0 | #ffffff（原始变量 --cds-gray-0） | 品牌色表面上的前景 |
| `--cds-on-danger` | --cds-on-danger → --cds-gray-0 | #ffffff（原始变量 --cds-gray-0） | 危险色表面上的前景 |
| `--cds-on-primary` | --cds-on-primary → --cds-neutral-0 → --cds-gray-0 | #ffffff（原始变量 --cds-gray-0） | 深色主按钮上的前景（字/图标） |
| `--cds-on-pro` | --cds-on-pro → --cds-gray-0 | #ffffff（原始变量 --cds-gray-0） | Pro 色表面上的前景 |
| `--cds-on-success` | --cds-on-success → --cds-gray-900 | #0b0b0b（原始变量 --cds-gray-900） | 成功色表面上的前景 |
| `--cds-on-warning` | --cds-on-warning → --cds-gray-900 | #0b0b0b（原始变量 --cds-gray-900） | 警告色表面上的前景 |
| `--cds-pictogram-100` | --cds-pictogram-100 | hsl(50 20.7% 88.6%) | 图示/插画调色板 100 |
| `--cds-pictogram-200` | --cds-pictogram-200 | hsl(51 16.5% 84.5%) | 图示/插画调色板 200 |
| `--cds-pictogram-300` | --cds-pictogram-300 | #ffffff | 图示/插画调色板 300 |
| `--cds-pictogram-400` | --cds-pictogram-400 | hsl(48 33.3% 97.1%) | 图示/插画调色板 400 |
| `--cds-pink-100` | --cds-pink-100 → --cds-magenta-100 | #f9d4e2（原始变量 --cds-magenta-100） | 粉色阶语义别名（引用 magenta 原始色阶） |
| `--cds-pink-200` | --cds-pink-200 → --cds-magenta-200 | #f3a8c3（原始变量 --cds-magenta-200） | 粉色阶语义别名（引用 magenta 原始色阶） |
| `--cds-pink-300` | --cds-pink-300 → --cds-magenta-300 | #e87ba4（原始变量 --cds-magenta-300） | 粉色阶语义别名（引用 magenta 原始色阶） |
| `--cds-pink-400` | --cds-pink-400 → --cds-magenta-400 | #d55181（原始变量 --cds-magenta-400） | 粉色阶语义别名（引用 magenta 原始色阶） |
| `--cds-pink-450` | --cds-pink-450 → --cds-magenta-450 | #c04873（原始变量 --cds-magenta-450） | 粉色阶语义别名（引用 magenta 原始色阶） |
| `--cds-pink-50` | --cds-pink-50 → --cds-magenta-50 | #faebf0（原始变量 --cds-magenta-50） | 粉色阶语义别名（引用 magenta 原始色阶） |
| `--cds-pink-500` | --cds-pink-500 → --cds-magenta-500 | #ad3d66（原始变量 --cds-magenta-500） | 粉色阶语义别名（引用 magenta 原始色阶） |
| `--cds-pink-600` | --cds-pink-600 → --cds-magenta-600 | #862a4c（原始变量 --cds-magenta-600） | 粉色阶语义别名（引用 magenta 原始色阶） |
| `--cds-pink-700` | --cds-pink-700 → --cds-magenta-700 | #5e1c34（原始变量 --cds-magenta-700） | 粉色阶语义别名（引用 magenta 原始色阶） |
| `--cds-pink-750` | --cds-pink-750 → --cds-magenta-750 | #4c1429（原始变量 --cds-magenta-750） | 粉色阶语义别名（引用 magenta 原始色阶） |
| `--cds-pink-800` | --cds-pink-800 → --cds-magenta-800 | #390f1f（原始变量 --cds-magenta-800） | 粉色阶语义别名（引用 magenta 原始色阶） |
| `--cds-purple-100` | --cds-purple-100 → --cds-violet-100 | #dfdbfd（原始变量 --cds-violet-100） | 紫色阶语义别名（引用 violet 原始色阶） |
| `--cds-purple-200` | --cds-purple-200 → --cds-violet-200 | #bfb9f5（原始变量 --cds-violet-200） | 紫色阶语义别名（引用 violet 原始色阶） |
| `--cds-purple-250` | --cds-purple-250 → --cds-violet-250 | #b0a7f2（原始变量 --cds-violet-250） | 紫色阶语义别名（引用 violet 原始色阶） |
| `--cds-purple-300` | --cds-purple-300 → --cds-violet-300 | #a096eb（原始变量 --cds-violet-300） | 紫色阶语义别名（引用 violet 原始色阶） |
| `--cds-purple-400` | --cds-purple-400 → --cds-violet-400 | #8173e3（原始变量 --cds-violet-400） | 紫色阶语义别名（引用 violet 原始色阶） |
| `--cds-purple-450` | --cds-purple-450 → --cds-violet-450 | #7161e0（原始变量 --cds-violet-450） | 紫色阶语义别名（引用 violet 原始色阶） |
| `--cds-purple-50` | --cds-purple-50 → --cds-violet-50 | #efedff（原始变量 --cds-violet-50） | 紫色阶语义别名（引用 violet 原始色阶） |
| `--cds-purple-500` | --cds-purple-500 → --cds-violet-500 | #6250d6（原始变量 --cds-violet-500） | 紫色阶语义别名（引用 violet 原始色阶） |
| `--cds-purple-600` | --cds-purple-600 → --cds-violet-600 | #4a3aa7（原始变量 --cds-violet-600） | 紫色阶语义别名（引用 violet 原始色阶） |
| `--cds-purple-700` | --cds-purple-700 → --cds-violet-700 | #322777（原始变量 --cds-violet-700） | 紫色阶语义别名（引用 violet 原始色阶） |
| `--cds-purple-750` | --cds-purple-750 → --cds-violet-750 | #271e60（原始变量 --cds-violet-750） | 紫色阶语义别名（引用 violet 原始色阶） |
| `--cds-purple-800` | --cds-purple-800 → --cds-violet-800 | #1d1649（原始变量 --cds-violet-800） | 紫色阶语义别名（引用 violet 原始色阶） |
| `--cds-ring-color` | --cds-ring-color → --cds-border → --cds-alpha-2 | hsl(from var(--cds-neutral-900) h s l / 10%) | 焦点环颜色 |
| `--cds-segment-thumb` | --cds-segment-thumb → --cds-surface-popover → --cds-surface-3 → --cds-gray-0 | #ffffff（原始变量 --cds-gray-0） | 分段控件滑块 |
| `--cds-segment-track` | --cds-segment-track → --cds-alpha-1 | hsl(from var(--cds-neutral-900) h s l / 5%) | 分段控件轨道 |
| `--cds-shadow-color` | --cds-shadow-color | hsl(from var(--cds-gray-900) h s l / 8%) | Elevation 阴影混色 |
| `--cds-shadow-lg` | --cds-shadow-lg | 0 4px 8px 0 hsl(from var(--cds-gray-900) h s l / 8%), 0 12px 28px -2px var(--cds-shadow-color) | 大 elevation 阴影 |
| `--cds-shadow-md` | --cds-shadow-md | 0 2px 4px 0 hsl(from var(--cds-gray-900) h s l / 7%), 0 6px 16px 0 var(--cds-shadow-color) | 中 elevation 阴影 |
| `--cds-shadow-popover` | --cds-shadow-popover | 0 8px 24px rgb(0 0 0 / .12), 0 2px 6px rgb(0 0 0 / .08) | 浮层专用阴影 |
| `--cds-shadow-sm` | --cds-shadow-sm | 0 1px 2px 0 hsl(from var(--cds-gray-900) h s l / 6%), 0 2px 8px 0 var(--cds-shadow-color) | 小 elevation 阴影 |
| `--cds-skeleton-base` | --cds-skeleton-base → --cds-alpha-2 | hsl(from var(--cds-neutral-900) h s l / 10%) | 骨架屏基础条 |
| `--cds-skeleton-sheen` | --cds-skeleton-sheen → --cds-alpha-2 | hsl(from var(--cds-neutral-900) h s l / 10%) | 骨架屏光泽动画条 |
| `--cds-switch-knob` | --cds-switch-knob → --cds-gray-0 | #ffffff（原始变量 --cds-gray-0） | 开关滑钮 |
| `--cds-switch-track` | --cds-switch-track → --cds-alpha-3 | hsl(from var(--cds-neutral-900) h s l / 20%) | 开关轨道 |
| `--cds-switch-track-hover` | --cds-switch-track-hover → --cds-alpha-4 | hsl(from var(--cds-neutral-900) h s l / 35%) | 开关轨道悬停 |
| `--cds-text-accent` | --cds-text-accent → --cds-blue-600 | #184f95（原始变量 --cds-blue-600） | 强调色文案与图标（链接、高亮） |
| `--cds-text-danger` | --cds-text-danger → --cds-red-600 | #8e2626（原始变量 --cds-red-600） | 错误提示文字 |
| `--cds-text-disabled` | --cds-text-disabled → --cds-alpha-4 | hsl(from var(--cds-neutral-900) h s l / 35%) | 禁用态文字 |
| `--cds-text-muted` | --cds-text-muted → --cds-neutral-400 → --cds-gray-400 | #898781（原始变量 --cds-gray-400） | 弱化说明文字 |
| `--cds-text-pink` | --cds-text-pink → --cds-pink-600 → --cds-magenta-600 | #862a4c（原始变量 --cds-magenta-600） | 粉色文案色 |
| `--cds-text-primary` | --cds-text-primary → --cds-neutral-900 → --cds-gray-900 | #0b0b0b（原始变量 --cds-gray-900） | 主文案色 |
| `--cds-text-pro` | --cds-text-pro → --cds-purple-600 → --cds-violet-600 | #4a3aa7（原始变量 --cds-violet-600） | Pro 文案色 |
| `--cds-text-secondary` | --cds-text-secondary → --cds-neutral-600 → --cds-gray-600 | #52514e（原始变量 --cds-gray-600） | 次级文案 |
| `--cds-text-success` | --cds-text-success → --cds-green-600 | #006300（原始变量 --cds-green-600） | 成功提示文字 |
| `--cds-text-warning` | --cds-text-warning → --cds-yellow-600 | #734500（原始变量 --cds-yellow-600） | 警告文字 |

## 五、深色模式覆盖项（相对浅色发生变化）

下列变量在 `[data-mode=dark] .cds-root` 中被重新赋值；表格给出**深色下**解析链与最终观感来源。

| 语义变量 | 深色解析链 | 深色最终值说明 | 场景（同浅色语义，对比度随模式调整） |
| --- | --- | --- | --- |
| `--cds-backdrop` | --cds-backdrop | rgb(0 0 0 / .5) | 模态遮罩 |
| `--cds-bg-accent` | --cds-bg-accent → --cds-blue-800 | #032042（原始变量 --cds-blue-800） | 强调色浅背景（提示条、信息块） |
| `--cds-bg-accent-chip` | --cds-bg-accent-chip → --cds-blue-750 | #062b57（原始变量 --cds-blue-750） | 强调色标签/芯片背景 |
| `--cds-bg-danger` | --cds-bg-danger → --cds-red-800 | #3c0e0e（原始变量 --cds-red-800） | 错误/危险状态浅背景 |
| `--cds-bg-danger-chip` | --cds-bg-danger-chip → --cds-red-750 | #511212（原始变量 --cds-red-750） | 错误标签/芯片背景 |
| `--cds-bg-pink` | --cds-bg-pink → --cds-pink-800 → --cds-magenta-800 | #390f1f（原始变量 --cds-magenta-800） | 粉色信息浅背景 |
| `--cds-bg-pink-chip` | --cds-bg-pink-chip → --cds-pink-750 → --cds-magenta-750 | #4c1429（原始变量 --cds-magenta-750） | 粉色标签背景 |
| `--cds-bg-pro` | --cds-bg-pro → --cds-purple-800 → --cds-violet-800 | #1d1649（原始变量 --cds-violet-800） | Pro 浅背景 |
| `--cds-bg-pro-chip` | --cds-bg-pro-chip → --cds-purple-750 → --cds-violet-750 | #271e60（原始变量 --cds-violet-750） | Pro 标签背景 |
| `--cds-bg-success` | --cds-bg-success → --cds-green-800 | #11260f（原始变量 --cds-green-800） | 成功状态浅背景 |
| `--cds-bg-success-chip` | --cds-bg-success-chip → --cds-green-750 | #0f350d（原始变量 --cds-green-750） | 成功标签背景 |
| `--cds-bg-warning` | --cds-bg-warning → --cds-yellow-800 | #311a00（原始变量 --cds-yellow-800） | 警告浅背景 |
| `--cds-bg-warning-chip` | --cds-bg-warning-chip → --cds-yellow-750 | #412400（原始变量 --cds-yellow-750） | 警告标签背景 |
| `--cds-border-accent` | --cds-border-accent → --cds-blue-700 | #0d366b（原始变量 --cds-blue-700） | 强调色相关描边 |
| `--cds-border-danger` | --cds-border-danger → --cds-red-700 | #641919（原始变量 --cds-red-700） | 错误相关描边 |
| `--cds-border-pro` | --cds-border-pro → --cds-purple-700 → --cds-violet-700 | #322777（原始变量 --cds-violet-700） | Pro 描边 |
| `--cds-border-success` | --cds-border-success → --cds-green-700 | #074506（原始变量 --cds-green-700） | 成功相关描边 |
| `--cds-border-warning` | --cds-border-warning → --cds-yellow-700 | #512e00（原始变量 --cds-yellow-700） | 警告描边 |
| `--cds-fill-field` | --cds-fill-field → --cds-fill-secondary → --cds-alpha-2 | hsl(from var(--cds-neutral-900) h s l / 10%) | 输入框等控件填充底色 |
| `--cds-fill-primary-hover` | --cds-fill-primary-hover → --cds-gray-100 | #e1e0d9（原始变量 --cds-gray-100） | 主按钮悬停 |
| `--cds-fill-secondary` | --cds-fill-secondary → --cds-alpha-2 | hsl(from var(--cds-neutral-900) h s l / 10%) | 次级/半透明按钮填充 |
| `--cds-fill-secondary-hover` | --cds-fill-secondary-hover | hsl(0 0% 100% / .14) | 次级按钮悬停铺底 |
| `--cds-fill-secondary-ring` | --cds-fill-secondary-ring | transparent | 次级按钮焦点环参考 |
| `--cds-focus-shadow` | --cds-focus-shadow | inset 0 0 0 1px var(--cds-page-bg), 0 0 0 1px var(--cds-fill-accent), 0 0 6px 1px hsl(from var(--cds-blue-600) h s l / 60%) | 聚焦 ring 组合阴影 |
| `--cds-neutral-0` | --cds-neutral-0 → --cds-gray-900 | #0b0b0b（原始变量 --cds-gray-900） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-10` | --cds-neutral-10 → --cds-gray-890 | #0d0d0d（原始变量 --cds-gray-890） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-100` | --cds-neutral-100 → --cds-gray-800 | #20201f（原始变量 --cds-gray-800） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-150` | --cds-neutral-150 → --cds-gray-750 | #2c2c2a（原始变量 --cds-gray-750） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-20` | --cds-neutral-20 → --cds-gray-880 | #0f0f0f（原始变量 --cds-gray-880） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-200` | --cds-neutral-200 → --cds-gray-700 | #383835（原始变量 --cds-gray-700） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-250` | --cds-neutral-250 → --cds-gray-650 | #454442（原始变量 --cds-gray-650） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-30` | --cds-neutral-30 → --cds-gray-870 | #111111（原始变量 --cds-gray-870） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-300` | --cds-neutral-300 → --cds-gray-600 | #52514e（原始变量 --cds-gray-600） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-350` | --cds-neutral-350 → --cds-gray-550 | #5f5e5a（原始变量 --cds-gray-550） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-40` | --cds-neutral-40 → --cds-gray-860 | #131313（原始变量 --cds-gray-860） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-400` | --cds-neutral-400 → --cds-gray-500 | #6d6b67（原始变量 --cds-gray-500） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-50` | --cds-neutral-50 → --cds-gray-850 | #151515（原始变量 --cds-gray-850） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-500` | --cds-neutral-500 → --cds-gray-400 | #898781（原始变量 --cds-gray-400） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-550` | --cds-neutral-550 → --cds-gray-350 | #97958d（原始变量 --cds-gray-350） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-60` | --cds-neutral-60 → --cds-gray-840 | #181817（原始变量 --cds-gray-840） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-600` | --cds-neutral-600 → --cds-gray-300 | #a5a49a（原始变量 --cds-gray-300） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-650` | --cds-neutral-650 → --cds-gray-250 | #b4b3a8（原始变量 --cds-gray-250） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-70` | --cds-neutral-70 → --cds-gray-830 | #1a1a19（原始变量 --cds-gray-830） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-700` | --cds-neutral-700 → --cds-gray-200 | #c3c2b7（原始变量 --cds-gray-200） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-750` | --cds-neutral-750 → --cds-gray-150 | #d2d1c7（原始变量 --cds-gray-150） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-80` | --cds-neutral-80 → --cds-gray-820 | #1c1c1b（原始变量 --cds-gray-820） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-800` | --cds-neutral-800 → --cds-gray-100 | #e1e0d9（原始变量 --cds-gray-100） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-810` | --cds-neutral-810 → --cds-gray-90 | #e4e3dd（原始变量 --cds-gray-90） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-820` | --cds-neutral-820 → --cds-gray-80 | #e7e6e1（原始变量 --cds-gray-80） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-830` | --cds-neutral-830 → --cds-gray-70 | #eae9e4（原始变量 --cds-gray-70） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-840` | --cds-neutral-840 → --cds-gray-60 | #edece8（原始变量 --cds-gray-60） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-850` | --cds-neutral-850 → --cds-gray-50 | #f0efec（原始变量 --cds-gray-50） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-860` | --cds-neutral-860 → --cds-gray-40 | #f3f3f0（原始变量 --cds-gray-40） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-870` | --cds-neutral-870 → --cds-gray-30 | #f6f6f4（原始变量 --cds-gray-30） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-880` | --cds-neutral-880 → --cds-gray-20 | #f9f9f7（原始变量 --cds-gray-20） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-890` | --cds-neutral-890 → --cds-gray-10 | #fcfcfb（原始变量 --cds-gray-10） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-90` | --cds-neutral-90 → --cds-gray-810 | #1e1e1d（原始变量 --cds-gray-810） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-neutral-900` | --cds-neutral-900 → --cds-gray-0 | #ffffff（原始变量 --cds-gray-0） | 中性语义阶：浅色模式映射灰阶由浅到深，深色模式反转（高键对应浅灰） |
| `--cds-pictogram-100` | --cds-pictogram-100 | hsl(48 3.4% 29.2%) | 图示/插画调色板 100 |
| `--cds-pictogram-200` | --cds-pictogram-200 | hsl(60 2.5% 23.3%) | 图示/插画调色板 200 |
| `--cds-pictogram-300` | --cds-pictogram-300 | hsl(60 2.1% 18.4%) | 图示/插画调色板 300 |
| `--cds-pictogram-400` | --cds-pictogram-400 | hsl(60 2.7% 14.5%) | 图示/插画调色板 400 |
| `--cds-ring-color` | --cds-ring-color → --cds-alpha-2 | hsl(from var(--cds-neutral-900) h s l / 10%) | 焦点环颜色 |
| `--cds-segment-thumb` | --cds-segment-thumb → --cds-alpha-3 | hsl(from var(--cds-neutral-900) h s l / 20%) | 分段控件滑块 |
| `--cds-shadow-color` | --cds-shadow-color | hsl(0 0% 0% / .24) | Elevation 阴影混色 |
| `--cds-surface-0` | --cds-surface-0 → --cds-gray-890 | #0d0d0d（原始变量 --cds-gray-890） | 页面/容器最底层表面色（背景层级 0） |
| `--cds-surface-1` | --cds-surface-1 → --cds-gray-830 | #1a1a19（原始变量 --cds-gray-830） | 表面层级 1（略浮起的区域背景） |
| `--cds-surface-2` | --cds-surface-2 → --cds-gray-750 | #2c2c2a（原始变量 --cds-gray-750） | 表面层级 2（卡片等） |
| `--cds-surface-3` | --cds-surface-3 → --cds-gray-700 | #383835（原始变量 --cds-gray-700） | 表面层级 3（与页面反差最大的顶层表面） |
| `--cds-text-accent` | --cds-text-accent → --cds-blue-300 | #6da7ec（原始变量 --cds-blue-300） | 强调色文案与图标（链接、高亮） |
| `--cds-text-danger` | --cds-text-danger → --cds-red-300 | #ec7e7e（原始变量 --cds-red-300） | 错误提示文字 |
| `--cds-text-muted` | --cds-text-muted → --cds-gray-400 | #898781（原始变量 --cds-gray-400） | 弱化说明文字 |
| `--cds-text-pink` | --cds-text-pink → --cds-pink-400 → --cds-magenta-400 | #d55181（原始变量 --cds-magenta-400） | 粉色文案色 |
| `--cds-text-pro` | --cds-text-pro → --cds-purple-300 → --cds-violet-300 | #a096eb（原始变量 --cds-violet-300） | Pro 文案色 |
| `--cds-text-secondary` | --cds-text-secondary → --cds-gray-200 | #c3c2b7（原始变量 --cds-gray-200） | 次级文案 |
| `--cds-text-success` | --cds-text-success → --cds-green-400 | #0ca30c（原始变量 --cds-green-400） | 成功提示文字 |
| `--cds-text-warning` | --cds-text-warning → --cds-yellow-300 | #db9300（原始变量 --cds-yellow-300） | 警告文字 |

## 六、未映射到单一色阶的特例

| 变量 | 浅色定义 | 说明 |
| --- | --- | --- |
| `--cds-fill-secondary` | `hsl(0 0% 100% / .1)` | 半透明白，叠在表面之上，不对应单一灰阶步进。 |
| `--cds-fill-field`（浅色） | `hsl(0 0% 100% / .5)` | 半透明白输入底。 |
| `--cds-fill-secondary`（深色覆盖） | `var(--cds-alpha-2)` | 深色下改为 alpha-2。 |
| `--cds-fill-field`（深色覆盖） | `var(--cds-fill-secondary)` | 深色下等同次级填充。 |
| `--cds-border-stronger` | `hsl(from var(--cds-neutral-900) h s l / 40%)` | 自 neutral-900 派生 40% 透明边框。 |
| `--cds-alpha-*` | `hsl(from var(--cds-neutral-900) ...)` | 叠色透明度随 neutral-900 所指灰阶在深浅模式变化。 |
| `--cds-focus-shadow` | 复合 box-shadow | 组合 `page-bg`、`fill-accent` 与强调浅底/发光。 |
| `:root` 中 `--cds-oncolor-200/300` | HSL 半透明 | 彩色表面上的通用「之上」文字色（非 .cds-root 块内）。 |

## 七、:root 级全局色（在 `.cds-root` 外）

| 变量 | 值 | 说明 |
| --- | --- | --- |
| `--cds-black` | #000000 | 全局令牌；oncolor 用于彩色底上的次级/弱化前景。 |
| `--cds-border` | currentColor | 全局令牌；oncolor 用于彩色底上的次级/弱化前景。 |
| `--cds-ease-out` | cubic-bezier(0, 0, .2, 1) | 全局令牌；oncolor 用于彩色底上的次级/弱化前景。 |
| `--cds-font-mono` | ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace | 全局令牌；oncolor 用于彩色底上的次级/弱化前景。 |
| `--cds-font-sans` | ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif | 全局令牌；oncolor 用于彩色底上的次级/弱化前景。 |
| `--cds-oncolor-200` | hsl(60 6.7% 97.1% / .75) | 全局令牌；oncolor 用于彩色底上的次级/弱化前景。 |
| `--cds-radius` | .25rem | 全局令牌；oncolor 用于彩色底上的次级/弱化前景。 |
| `--cds-shadow-lg` | 0 10px 15px -3px rgb(0 0 0 / .1), 0 4px 6px -4px rgb(0 0 0 / .1) | 全局令牌；oncolor 用于彩色底上的次级/弱化前景。 |
| `--cds-shadow-md` | 0 4px 6px -1px rgb(0 0 0 / .1), 0 2px 4px -2px rgb(0 0 0 / .1) | 全局令牌；oncolor 用于彩色底上的次级/弱化前景。 |
| `--cds-shadow-sm` | 0 1px 2px 0 rgb(0 0 0 / .05) | 全局令牌；oncolor 用于彩色底上的次级/弱化前景。 |
