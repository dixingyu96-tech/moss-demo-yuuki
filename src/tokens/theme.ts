import { PALETTE_COLORS } from "./palette";

/**
 * 主题基础 token。
 * Source: Moss.tokens.json
 */
export const THEME_TOKENS = {
  fontSize: {
    xs: "12px",
    sm: "14px",
    md: "14px",
    lg: "16px",
    xl: "18px",
    xxl: "20px",
    xxml: "24px",
    xxxl: "38px"
  },
  fontSizeNative: {
    sm: "12px",
    msm: "13px",
    md: "14px",
    lg: "16px",
    xl: "18px",
    "2xl": "20px"
  },
  headingFontSize: {
    h5: "16px",
    h4: "20px",
    h3: "24px",
    h2: "30px",
    h1: "38px"
  },
  iconSize: {
    xxs: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px"
  },
  fontWeight: {
    "300": "300",
    "400": "400",
    "500": "500",
    "600": "600",
    "700": "700"
  },
  lineHeight: {
    sm: "20px",
    md: "22px",
    lg: "24px",
    xl: "26px",
    xxl: "28px",
    xxml: "32px",
    xxxl: "46px"
  },
  headingLineHeight: {
    h5: "24px",
    h4: "28px",
    h3: "32px",
    h2: "38px",
    h1: "46px"
  },
  borderRadius: {
    xs: "4px",
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    xxl: "24px"
  },
  spacing: {
    xxs: "2px",
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    xxl: "24px",
    xxxl: "32px",
    "4xl": "48px"
  },
  layoutPadding: {
    "3xs": "2px",
    "2xs": "4px",
    xs: "8px",
    sm: "12px",
    md: "16px",
    lg: "20px",
    xl: "24px",
    "2xl": "32px",
    "3xl": "48px"
  },
  padding: {
    zero: "0px",
    xxs: "2px",
    xs: "4px",
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    xxl: "20px",
    xxxl: "24px",
    xxxxl: "32px"
  },
  gap: {
    xs: "2px",
    sm: "4px",
    md: "8px",
    lg: "10px",
    xl: "12px",
    xxl: "16px",
    xxxl: "20px",
    xxxxl: "24px",
    "5xl": "32px"
  },
  margin: {
    xs: "2px",
    sm: "4px",
    md: "8px",
    lg: "10px",
    xl: "12px",
    xxl: "16px",
    xxxl: "20px",
    xxxxl: "24px",
    "5xl": "32px"
  },
  flex: {
    0: "0 0 auto"
  },
  lineWidth: {
    regular: "1px",
    bold: "2px",
    outline: "2px",
    focus: "4px"
  },
  boxShadow: {
    subtle: "0 0 2px 0 rgba(11, 11, 11, 0.02), 0 1px 4px 0 rgba(11, 11, 11, 0.06)",
    shadow: "0 0 2px 0 rgba(11, 11, 11, 0.02), 0 4px 8px 0 rgba(11, 11, 11, 0.06), 0 4px 24px 6px rgba(11, 11, 11, 0.04)",
    secondary: "0 0 6px 0 rgba(11, 11, 11, 0.05), 0 4px 12px 0 rgba(11, 11, 11, 0.06), 0 4px 24px 6px rgba(11, 11, 11, 0.04)",
    tertiary: "0 0 5px 0 var(--color-shadow-alpha-4), 0 10px 24px -2px var(--color-shadow-alpha-5), 0 10px 48px 12px var(--color-shadow-alpha-2)",
    warningOutline: "0 0 0 2px var(--colorControlWarningOutline)",
    errorOutline: "0 0 0 2px var(--colorControlErrorOutline)"
  },
  textColor: {
    default: "var(--colorText)",
    secondary: "var(--colorTextSecondary)",
    description: "var(--colorTextDescription)",
    disabled: "var(--colorTextDisabled)",
    quaternary: "var(--colorTextQuaternary)",
    "icon-normal": "var(--colorIconNormal)"
  },
  height: {
    md: "20px",
    "control-xs": "16px",
    "control-sm": "24px",
    "control-msm": "28px",
    "control-md": "32px",
    "control-mlg": "36px",
    "control-lg": "40px"
  },
  opacity: {
    loading: "0.65"
  }
} as const;

export const TAILWIND_THEME = {
  extend: {
    colors: PALETTE_COLORS,
    ...THEME_TOKENS
  }
} as const;

export type ThemeTokenGroupKey = keyof typeof THEME_TOKENS;
