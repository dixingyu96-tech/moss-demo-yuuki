import {
  ChangeEvent as ReactChangeEvent,
  CSSProperties,
  FormEvent as ReactFormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  UIEvent as ReactUIEvent,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";
import { DEFAULT_FILE_MARKDOWN, INITIAL_FILE_MARKDOWN } from "./data/fileContents";
import fileCoverArchiveIcon from "./assets/文件封面_zip.png";
import fileCoverDocIcon from "./assets/文件封面_doc.png";
import fileCoverHtmlIcon from "./assets/文件封面_html.png";
import fileCoverImageIcon from "./assets/文件封面_pic.png";
import fileCoverMdIcon from "./assets/文件封面_md.png";
import fileCoverPdfIcon from "./assets/文件封面_pdf.png";
import fileCoverPptIcon from "./assets/文件封面_ppt.png";
import fileCoverUnknownIcon from "./assets/文件封面_未知文件.png";
import fileCoverVideoIcon from "./assets/文件封面_video.png";
import fileCoverXlsIcon from "./assets/文件封面_xls.png";
import uploadFileArchiveIcon from "./assets/上传文件_zip.png";
import uploadFileDocIcon from "./assets/上传文件_doc.png";
import uploadFileHtmlIcon from "./assets/上传文件_html.png";
import uploadFileImageIcon from "./assets/上传文件_pic.png";
import uploadFileMdIcon from "./assets/上传文件_md.png";
import uploadFilePdfIcon from "./assets/上传文件_pdf.png";
import uploadFilePptIcon from "./assets/上传文件_ppt.png";
import uploadFileUnknownIcon from "./assets/上传文件_未知文件.png";
import uploadFileVideoIcon from "./assets/上传文件_video.png";
import uploadFileXlsIcon from "./assets/上传文件_xls.png";
import agentOpportunityMiningIcon from "./assets/商机挖掘.png";
import agentCustomerInsightIcon from "./assets/客户洞察.png";
import agentPublicOpinionIcon from "./assets/舆情监控.png";
import agentRiskManagementIcon from "./assets/风险管理.png";
import resolutionPartialSelectedIcon from "./assets/满意度_部分解决_选中.png";
import resolutionResolvedSelectedIcon from "./assets/满意度_已解决_选中.png";
import resolutionUnresolvedSelectedIcon from "./assets/满意度_未解决_选中.png";
import myFilesColorIcon from "./assets/my-files-color.png";
import source21stIcon from "./assets/source-21st.png";
import sourceBaiduIcon from "./assets/source-baidu.png";
import sourceBingIcon from "./assets/source-bing.png";
import sourceHuabanIcon from "./assets/source-huaban.png";
import userAvatar from "./assets/user-avatar.jpg";

type TabKey = "portrait" | "company" | "finance" | "news" | "people" | "market";

type PromptMap = Record<TabKey, string[]>;
type HistoryCategory = "today" | "yesterday" | "earlier";
type HistoryGroupKey = "favorites" | HistoryCategory;
type HistorySession = {
  id: string;
  title: string;
  question?: string;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
};
type HistoryGroups = Record<HistoryGroupKey, HistorySession[]>;
type HistoryMenuState = {
  sessionId: string;
  left: number;
  top: number;
} | null;
type HistoryRenameState = {
  sessionId: string;
  value: string;
} | null;
type CollapsedPopoverType = "agent" | "favorites" | "history";
type CollapsedTooltipState = {
  label: string;
  left: number;
  top: number;
} | null;
type CollapsedPopoverState = {
  type: CollapsedPopoverType;
  left: number;
  top: number;
} | null;
type FloatingPointState = {
  left: number;
  top: number;
} | null;
type FileMenuState = {
  fileName: string;
  left: number;
  top: number;
} | null;
type FileRenamePopoverState = {
  fileName: string;
  value: string;
  left: number;
  top: number;
} | null;
type FileMentionRange = {
  start: number;
  end: number;
  query: string;
} | null;
type ComposerFileAttachment = {
  id: string;
  name: string;
  icon: string;
  size?: string;
  uploadProgress?: number;
  isUploading?: boolean;
  source: "upload" | "reference";
};
type UtilityPanel = "files" | "automation" | null;
type FileItem = {
  name: string;
  size: string;
  icon: string;
};
type FilesPanelScope = "all" | "current";
type ConversationRun = {
  id: string;
  question: string;
  createdAt: string;
  completedAt?: string;
  conclusionMarkdown: string;
  conclusionVisibleLength: number;
  stage: "thinking" | "processing" | "done";
  visibleSteps: number;
  responseStarted: boolean;
  isThinkingExpanded: boolean;
  isStopped?: boolean;
  actionVariant: "feedback" | "resolution";
};
type AnswerFeedback = "liked" | "disliked" | null;
type AnswerResolutionFeedback = "resolved" | "partial" | "unresolved" | null;
type ResolutionPopconfirmValue = Extract<AnswerResolutionFeedback, "partial" | "unresolved">;
type ResolutionPopconfirmPlacement = "top" | "bottom";
type ResolutionPopconfirmPosition = {
  left: number;
  top: number;
  arrowLeft: number;
  placement: ResolutionPopconfirmPlacement;
} | null;
type GlobalToastState = {
  id: number;
  message: string;
} | null;

const COMPOSER_REFERENCE_START = "\u2063";
const COMPOSER_REFERENCE_END = "\u2064";
const COMPOSER_REFERENCE_PATTERN = /\u2063([^\u2064]+)\u2064/g;

type TabOption = {
  key: TabKey;
  label: string;
};

const TABS: TabOption[] = [
  { key: "portrait", label: "客户背景画像" },
  { key: "company", label: "市场线索开拓" },
  { key: "finance", label: "公司信息查询" },
  { key: "news", label: "上市公司财务" },
  { key: "people", label: "关键人物洞察" }
];
const CUSTOMER_INSIGHT_TABS: TabOption[] = [...TABS, { key: "market", label: "公司与市场洞察" }];
const RISK_MANAGEMENT_TABS: TabOption[] = [
  { key: "portrait", label: "通用风险尽调" },
  { key: "company", label: "客户合作风险" },
  { key: "finance", label: "供应商风险评估" },
  { key: "news", label: "风险监控与预警" }
];
const PUBLIC_OPINION_TABS: TabOption[] = [
  { key: "portrait", label: "品牌健康监控" },
  { key: "company", label: "危机识别与相应" },
  { key: "finance", label: "竞品与行业洞察" },
  { key: "news", label: "公关发声与简报" }
];

const PROMPTS: PromptMap = {
  portrait: [
    "我想开发华润集团，从销售拓客视角给我一份3分钟速读，重点说说他们的数字化转型痛点和数据治理现状。",
    "帮我分析下中国石化。如果我要把帆软的BI产品卖给他们，哪3个业务场景最适合作为切入点来打动客户？",
    "给我出一份招商银行的简报，把信息拆成“机会、风险、建议行动”三部分，我需要快速决策要不要跟进这个金融大客户。",
    "海尔智家是一家什么样的公司？请结合其智能制造背景，介绍他们在数据分析方面的整体需求和潜在合作空间。",
    "我想把【公司】当潜在客户：请给3个最可能的切入点（场景/部门/话术），并说明理由。"
  ],
  company: [
    "请梳理【公司】近3年的营收、利润、员工规模变化，并标注可能拐点",
    "围绕【公司】给我一份竞争格局：主要竞品、差异化能力、潜在风险",
    "从管理层与组织视角，判断【公司】未来12个月最可能推进的战略优先级",
    "给出【公司】所在赛道的政策、技术、需求三条主线变化及机会",
    "针对【公司】设计一套“首次接触到商机推进”的访谈提纲"
  ],
  finance: [
    "请拆解【公司】近3年的营收结构、利润水平与增长质量，并指出最值得关注的变化",
    "结合公开年报/财报，判断【公司】当前现金流、负债压力和投入重点分别如何",
    "如果把【公司】作为潜在客户，请从预算能力角度判断它更可能在哪些项目上投入",
    "请用财务视角评估【公司】的经营韧性：收入稳定性、毛利空间、费用效率分别怎么样",
    "请标出【公司】近3年财务表现中的风险信号，并给出对应的业务解释"
  ],
  news: [
    "请梳理【公司】近6个月的重要新闻、公告和公开动作，并总结背后的经营信号",
    "围绕【公司】近期的市场动态，判断它当前最关注的增长、组织或产品主题是什么",
    "请筛选【公司】近一年的里程碑事件，并说明哪些最值得销售或合作团队重点关注",
    "从新闻舆情角度，整理【公司】当前的正向机会、潜在争议和外部风险",
    "请按时间线总结【公司】最近的重要变化，并推测接下来可能出现的动作"
  ],
  people: [
    "请梳理【公司】的创始人、核心高管和关键负责人，并总结各自可能负责的重点方向",
    "从公开信息判断，【公司】当前真正推动业务增长和数字化决策的关键人物有哪些",
    "请给出【公司】管理层画像：背景、分工、关注点，以及可能影响采购决策的因素",
    "如果要接触【公司】，请判断优先沟通哪些角色最有效，并说明原因",
    "请结合公开任职、采访和组织信息，总结【公司】核心人物的经营风格与决策倾向"
  ],
  market: [
    "请从公司基本面与市场趋势两个维度，判断【公司】未来12个月的增长机会",
    "结合行业竞争、客户结构和产品能力，分析【公司】当前的市场位置",
    "请梳理【公司】所在市场的需求变化，并指出最值得关注的商业机会",
    "从公开信息判断，【公司】与主要竞争对手相比有哪些优势和短板",
    "请给我一份【公司】的公司与市场洞察速读，重点突出机会、风险和建议动作"
  ]
};
const RISK_MANAGEMENT_PROMPTS: Partial<PromptMap> = {
  portrait: [
    "帮我看看华为技术有限公司的整体经营风险，特别是供应链稳定性。",
    "分析一下阿里云的合规风险，重点看数据安全与隐私保护方面。",
    "腾讯云计算有限责任公司的股权穿透结构复杂吗？有无实控人变更风险？"
  ]
};
const OPPORTUNITY_MINING_PROMPTS: Partial<PromptMap> = {
  portrait: [
    "检索帆软过去24小时是否有“软件崩溃”、“数据泄露”或“售后推诿”等高敏感投诉，重点标记KOL发声。",
    "针对近期FineReport版本更新后的用户反馈，精读是否存在“兼容性问题”或“Bug频发”的攻击论点并分级。",
    "将帆软过去半年的服务类危机事件整理成PPT复盘报告，包含响应时效、舆情峰值曲线及改进建议。"
  ]
};

const AGENTS = ["客户洞察", "风险管理", "舆情监控"] as const;
type AgentKey = (typeof AGENTS)[number];
type AgentHistoryMap = Record<AgentKey, HistorySession[]>;
type SidebarAgentName = AgentKey | "商机挖掘";
type SidebarAgentItem = {
  name: SidebarAgentName;
  icon: string;
  disabled?: boolean;
};

const SIDEBAR_AGENT_ITEMS: SidebarAgentItem[] = [
  { name: "客户洞察", icon: agentCustomerInsightIcon },
  { name: "风险管理", icon: agentRiskManagementIcon },
  { name: "舆情监控", icon: agentPublicOpinionIcon },
  { name: "商机挖掘", icon: agentOpportunityMiningIcon, disabled: true }
];
const AGENT_ICON_MAP: Record<SidebarAgentName, string> = SIDEBAR_AGENT_ITEMS.reduce(
  (iconMap, item) => ({
    ...iconMap,
    [item.name]: item.icon
  }),
  {} as Record<SidebarAgentName, string>
);

const INITIAL_FILES: FileItem[] = [
  { name: "市场调研报告.doc", size: "10.3 KB", icon: getFileCoverIcon("市场调研报告.doc") },
  {
    name: "国内金融行业商业智能软件市场调研报告.md",
    size: "10.3 KB",
    icon: getFileCoverIcon("国内金融行业商业智能软件市场调研报告.md")
  },
  { name: "华为技术有限公司风险洞察报告.pdf", size: "10.3 KB", icon: getFileCoverIcon("华为技术有限公司风险洞察报告.pdf") }
];

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const SIDEBAR_AUTO_COLLAPSE_BREAKPOINT = 1080;
const FILES_PANEL_DEFAULT_WIDTH = 396;
const FILES_PANEL_DEFAULT_RATIO = 0.5;
const FILES_PANEL_MIN_RATIO = 0.4;
const FILES_PANEL_MAX_RATIO = 0.7;
const FILES_PANEL_INSET = 8;
const FILES_PANEL_RESIZE_STEP = 24;
const FILE_CARD_MENU_WIDTH = 112;
const CONCLUSION_STREAM_MIN_CHUNK_SIZE = 3;
const CONCLUSION_STREAM_MAX_CHUNK_SIZE = 9;
const CHAT_BOTTOM_THRESHOLD = 24;
const DEFAULT_THINKING_CHAIN_STEPS = [
  "阅读 \"skills/customer-insight/SKILL.md\"",
  "解析问题意图：客户洞察",
  "MOSS-企业画像库：帆软软件",
  "MOSS-AI搜索：帆软软件",
  "搜索网络：帆软软件",
  "交叉验证公开来源",
  "生成销售拓客速读"
];
const DEFAULT_FOLLOW_UP_QUESTIONS = [
  "继续拆解关键部门与负责人，生成下一步拜访清单",
  "对比同类客户的成功案例，寻找可复用切入点",
  "生成一份面向销售推进的行动计划与话术"
];
const DISLIKE_FEEDBACK_OPTIONS = ["不够直接", "答非所问", "不知所云", "鸡同鸭讲", "其他其他"];
const INTERNAL_SOURCE_GROUPS = [
  {
    title: "Moss商业智能库",
    items: ["MOSS企业股权信息库", "MOSS************库"]
  }
];
const EXTERNAL_SOURCES = [
  {
    domain: "www.baidu.com",
    title: "帆软软件经营信息与客户行业分布概览",
    summary: "公开信息显示，帆软长期服务制造、零售、金融、地产等行业客户，并围绕BI与报表场景沉淀解决方案。",
    icon: sourceBaiduIcon
  },
  {
    domain: "www.bing.com",
    title: "帆软商业智能产品能力与典型应用场景",
    summary: "资料提到FineBI、FineReport等产品覆盖自助分析、可视化看板和经营管理报表，适配多部门协同分析。",
    icon: sourceBingIcon
  },
  {
    domain: "huaban.com/discovery",
    title: "企业数字化转型中的数据治理与分析需求",
    summary: "相关案例显示，集团型客户通常关注指标统一、权限治理、看板复用以及业务人员自主分析能力建设。",
    icon: sourceHuabanIcon
  },
  {
    domain: "www.bing.com",
    title: "BI采购决策链与销售切入路径参考",
    summary: "信息源指向CIO、数据负责人和业务部门共同参与评估，试点验证与标杆复制是常见推进方式。",
    icon: sourceBingIcon
  },
  {
    domain: "https://21st.dev/home",
    title: "交互与组件动效设计参考",
    summary: "页面交互参考侧边抽屉、弱蒙版、来源卡片与分组展示模式，用于提升结果可追溯信息的阅读效率。",
    icon: source21stIcon
  }
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function createRelativeTimestamp(daysAgo: number, hour: number, minute = 0) {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

function createSession(
  id: string,
  title: string,
  daysAgo: number,
  hour: number,
  minute: number,
  isFavorite = false
): HistorySession {
  const timestamp = createRelativeTimestamp(daysAgo, hour, minute);
  return {
    id,
    title,
    question: title,
    createdAt: timestamp,
    updatedAt: timestamp,
    isFavorite
  };
}

function getHistorySessionQuestion(session: HistorySession) {
  return session.question ?? session.title;
}

function getStableHash(seed: string) {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function getStableActionVariant(seed: string): ConversationRun["actionVariant"] {
  const hash = getStableHash(seed);
  return hash % 2 === 0 ? "resolution" : "feedback";
}

function createActionVariant(): ConversationRun["actionVariant"] {
  return Math.random() < 0.5 ? "resolution" : "feedback";
}

function inferCompanyName(question: string) {
  const normalized = buildSessionTitle(question);
  const explicitCompany = normalized.match(/([\u4e00-\u9fa5A-Za-z0-9]{2,24}(?:集团|公司|软件|银行|科技|股份|有限|华润|帆软|FineReport|FineBI))/)?.[1];
  if (explicitCompany) return explicitCompany;
  if (/帆软|FineReport|FineBI/i.test(normalized)) return "帆软软件";
  if (/华润/.test(normalized)) return "华润集团";
  return "目标客户";
}

function inferThinkingTopic(question: string) {
  if (/销售额|营收|收入|财务|利润|年报|上市/.test(question)) return "财务与经营表现";
  if (/行业|客户|集中|分布|画像|客群/.test(question)) return "客户行业分布";
  if (/竞争|竞品|对手|替代/.test(question)) return "竞争格局";
  if (/规划|战略|未来|发展|五年|趋势/.test(question)) return "发展规划";
  if (/年龄|员工|同事|团队|组织|负责人/.test(question)) return "组织与关键人";
  if (/风险|尽调|合规|供应商|合作/.test(question)) return "风险尽调";
  if (/舆情|投诉|危机|负面|口碑/.test(question)) return "舆情监控";
  return "销售拓客洞察";
}

function buildThinkingChainSteps(agent: AgentKey, question: string) {
  if (!buildSessionTitle(question)) return DEFAULT_THINKING_CHAIN_STEPS;

  const companyName = inferCompanyName(question);
  const topic = inferThinkingTopic(question);
  const hash = getStableHash(`${agent}-${question}`);
  const skillPath =
    agent === "风险管理"
      ? "skills/risk-management/SKILL.md"
      : agent === "舆情监控"
        ? "skills/public-opinion/SKILL.md"
        : "skills/customer-insight/SKILL.md";
  const openingSteps = [`阅读 "${skillPath}"`, `解析问题意图：${topic}`];
  const scenarioSteps: Record<string, string[]> = {
    财务与经营表现: [
      `MOSS-企业经营库：${companyName}`,
      `MOSS-财务指标检索：${companyName}`,
      `搜索网络：${companyName} 销售额 营收`,
      "交叉核验年报、新闻与公开披露",
      "提炼收入口径与可信度说明"
    ],
    客户行业分布: [
      `MOSS-客户案例库：${companyName}`,
      `MOSS-行业样本聚类：${companyName}`,
      `搜索网络：${companyName} 客户 行业 分布`,
      "归并客户行业标签与典型场景",
      "生成销售切入优先级"
    ],
    竞争格局: [
      `MOSS-竞品图谱：${companyName}`,
      `MOSS-AI搜索：${companyName} 竞争对手`,
      `搜索网络：${companyName} 替代产品 竞品`,
      "对比产品能力、客群与价格带",
      "输出竞争应对要点"
    ],
    发展规划: [
      `MOSS-战略动态库：${companyName}`,
      `MOSS-AI搜索：${companyName} 未来规划`,
      `搜索网络：${companyName} 战略 发展 规划`,
      "梳理管理层表态与业务扩张线索",
      "推演未来机会与合作窗口"
    ],
    组织与关键人: [
      `MOSS-组织与人员库：${companyName}`,
      `MOSS-AI搜索：${companyName} 员工 团队`,
      `搜索网络：${companyName} 招聘 管理层`,
      "估算组织结构与岗位年龄线索",
      "整理关键部门与拜访路径"
    ],
    风险尽调: [
      `MOSS-企业风险库：${companyName}`,
      `MOSS-司法与合规检索：${companyName}`,
      `搜索网络：${companyName} 风险 合规 舆情`,
      "识别高风险事件与影响范围",
      "生成风险等级与缓释建议"
    ],
    舆情监控: [
      `MOSS-舆情信号库：${companyName}`,
      `MOSS-AI搜索：${companyName} 投诉 负面`,
      `搜索网络：${companyName} 舆情 危机`,
      "聚合近24小时高敏感信号",
      "生成响应优先级与话术建议"
    ],
    销售拓客洞察: [
      `MOSS-企业画像库：${companyName}`,
      `MOSS-AI搜索：${companyName}`,
      `搜索网络：${companyName}`,
      "交叉验证公开来源",
      "生成销售拓客速读"
    ]
  };
  const optionalSteps = [
    "加载行业口径与指标规范",
    "过滤低可信来源与重复信息",
    "补充可落地拜访动作",
    "整理引用来源与证据链"
  ];
  const selectedOptionalStep = optionalSteps[hash % optionalSteps.length];

  return [...openingSteps, ...(scenarioSteps[topic] ?? scenarioSteps.销售拓客洞察), selectedOptionalStep];
}

function getThinkingStartDelay(run: ConversationRun) {
  return 720 + (getStableHash(`${run.id}-start`) % 420);
}

function getThinkingTransitionDelay(run: ConversationRun) {
  return 1800 + (getStableHash(`${run.question}-transition`) % 900);
}

function getThinkingStepDelay(run: ConversationRun) {
  return 880 + (getStableHash(`${run.id}-${run.visibleSteps}`) % 620);
}

function getThinkingFinishDelay(run: ConversationRun) {
  return 1200 + (getStableHash(`${run.id}-finish`) % 700);
}

function deriveHistoryCategory(timestamp: string): HistoryCategory {
  const now = new Date();
  const target = new Date(timestamp);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - ONE_DAY_IN_MS;
  const targetTime = target.getTime();

  if (targetTime >= startOfToday) return "today";
  if (targetTime >= startOfYesterday) return "yesterday";
  return "earlier";
}

function buildSessionTitle(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function buildConversationHeaderTitle(text: string) {
  const normalized = buildSessionTitle(text);
  if (!normalized) return "新会话";

  let compact = normalized
    .replace(/^(我想|请|帮我|麻烦|想请你|请你)/, "")
    .replace(/从[^，,。！？!?；;]{1,24}视角/g, "")
    .replace(/给我一份[^，,。！？!?；;]{1,24}/g, "")
    .replace(/重点[说讲]说?/, "")
    .replace(/他们的|它的/g, "")
    .replace(/^[,，、\s]+/, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!compact) compact = normalized;

  const sentence = compact.split(/[。！？!?]/).find(Boolean)?.trim() ?? compact;
  const parts = sentence
    .split(/[，,；;：:]/)
    .map((part) => part.trim())
    .filter(Boolean);

  let title = parts.length >= 2 ? `${parts[0]} ${parts[1]}` : (parts[0] ?? sentence);
  title = title.replace(/\s+/g, " ").trim();

  const maxLen = 28;
  if (title.length > maxLen) {
    return `${title.slice(0, maxLen)}…`;
  }
  return title;
}

function formatRunElapsedSeconds(run: ConversationRun) {
  const startedAt = new Date(run.createdAt).getTime();
  const finishedAt = new Date(run.completedAt ?? run.createdAt).getTime();
  const elapsedInSeconds = Math.max(0, (finishedAt - startedAt) / 1000);
  return Number(elapsedInSeconds.toFixed(1)).toString();
}

function buildConversationConclusionMarkdown(agent: AgentKey, question: string) {
  const normalizedQuestion = buildSessionTitle(question).replace(/[。！？!?]+$/, "");
  if (agent === "客户洞察" && /华润集团|华润/.test(normalizedQuestion)) {
    return `# 华润集团销售拓客速读

**一句话判断**：华润集团是多元化央企巨头，数字化转型已进入深水区，"智慧华润"战略下各板块数据能力参差不齐，**帆软可从板块级渗透切入，重点瞄准华润啤酒这类已具备数据基础但自主分析能力待提升的板块**。

---

## 一、客户画像关键信息

| 维度 | 关键事实 |
|------|----------|
| **规模体量** | 香港央企，业务遍及大消费、综合能源、城市建设运营、大健康、产业金融、科技及新兴产业6大领域，25个一级利润中心，6家香港上市公司 |
| **数字化组织** | 2021年成立**华润数科**作为数字化转型主力，承接"智慧华润"愿景；自建华润云平台，布局数据中台+业务中台架构 |
| **战略节奏** | 十四五期间全面推进数字化转型，目标"各产业板块全面数字化、数据资产初步变现" |
| **典型板块** | 华润啤酒（雪花全球销量第一，国内市占率超30%）、华润置地（地产龙头）、华润电力（新能源装机4159万千瓦）、华润微电子（半导体IDM龙头） |

---

## 二、数字化转型痛点（来自一线调研）

**痛点1：多业态数据孤岛严重**
- 集团横跨零售、啤酒、电力、地产、医药、金融等25个板块，各业务系统独立建设
- 华润啤酒案例显示：历经"报表→看板→自主分析"三阶段迭代，仍面临**用户操作能力不足、看板管理混乱、模式可持续性待验证**

**痛点2：自建平台能力与业务需求有差距**
- 华润云/华润数科侧重基础设施，但一线业务场景的**报表开发能力、自助分析易用性**仍有瓶颈
- 华润啤酒引入ChatBI智能问数工具，表明对**降低分析门槛的AI化工具**有明显需求

**痛点3：分析人才断层**
- 华润啤酒实践显示：团队"正向全民数据科学家目标迈进"，但**业务人员自主分析能力不足**是核心障碍
- 培训与工具推广模式虽成熟，但"让普通员工具备专家级分析能力"仍需外部赋能

---

## 三、数据治理现状（来自华润啤酒标杆实践）

**已具备的基础**：
- 数仓覆盖营销、营运、财务等多领域
- 指标与数据集实现标准化管理
- 平台支撑**上万用户查询、BI赋能超千人**

**当前阶段**：
- 数据能力处于**资产化与业务化并行阶段**
- 分析能力已完成自主分析推广，2025年启动智能分析与预算模型探索

**待补强的缺口**：
- 看板管理混乱、缺乏统一治理框架
- 用户培训后仍难独立完成复杂分析
- AI智能分析预测功能待完善

---

## 四、帆软切入机会点

| 切入角度 | 机会分析 | 推荐动作 |
|----------|----------|----------|
| **板块级渗透** | 华润啤酒已搭建数仓基础但自主分析有瓶颈，是帆软FineBI自助分析的典型场景；华润置地、华润电力等同样存在报表复杂、数据分散问题 | 先攻克华润啤酒或华润置地一个标杆，用案例撬动其他板块 |
| **补充华润数科能力** | 华润数科侧重基础设施，帆软可在报表工具层、自助分析层形成互补，作为"华润云生态合作伙伴"入场 | 探索与华润数科的合作模式，切入华润云数字化平台生态 |
| **AI智能分析需求** | 华润啤酒已引入ChatBI，表明对AI降低分析门槛的需求明确；帆软FineBI的AI分析能力可精准对位 | 强调帆软AI分析能力，与华润啤酒ChatBI形成互补或升级方案 |
| **培训赋能缺口** | 华润啤酒培训体系成熟但用户仍难独立分析，帆软"人人都是数据分析师"理念+成熟培训体系可补位 | 提供培训赋能服务，从"工具+培训"组合拳切入 |

---

## 五、销售推进建议

**优先级判断**：华润啤酒 > 华润置地 > 华润电力 > 华润微电子

**理由**：
- 华润啤酒公开案例显示其**数据应用实践最成熟、痛点最清晰**，已从报表迭代到自主分析阶段，是帆软产品能力的精准匹配点
- 华润置地地产属性强，复杂报表、营销费用管控、应收账款监管等场景多，与帆软文旅地产方案高度契合
- 华润电力、华润微电子偏工业制造，工业互联网场景更多，需结合华润数科Resolink平台策略

**关键联系人方向**：
- 华润啤酒：数据应用团队/智慧雪花中心项目组（公开案例显示有明确负责人）
- 华润数科：政企数字化服务业务线（探索生态合作）
- 各板块CIO/数据负责人（需进一步定向）

---

**风险提示**：华润数科作为集团数字化主力，有自建BI能力的倾向；帆软需明确"工具层补充"定位，避免正面竞争，强调生态协同而非替代。`;
  }

  const reportTitle = agent === "风险管理" ? "企业风险管理速读" : agent === "舆情监控" ? "舆情监控速读" : "销售拓客速读";
  const oneLine =
    agent === "风险管理"
      ? "一句话判断：当前问题可优先从合规、运营、舆情三条风险线并行拆解，先识别高风险暴露，再推进可执行缓释动作。"
      : agent === "舆情监控"
        ? "一句话判断：当前问题适合用“板块优先级+场景切入点+关键联系人”三段式推进，先做标杆再做复制。"
        : "一句话判断：该问题可从客户画像、转型痛点、数据治理与切入机会四层展开，先形成可验证场景，再放大复制。";

  return `# ${reportTitle}
${oneLine}

---

## 一、问题聚焦
${normalizedQuestion}

### 关键事实表
| 维度 | 关键事实 |
| --- | --- |
| 业务背景 | 当前问题聚焦在组织转型与数据能力提升，目标是找到可落地的推进抓手 |
| 数据现状 | 现有数据能力具备基础，但跨系统协同、分析效率与治理机制仍有提升空间 |
| 组织条件 | 业务与数据角色已具备协同基础，适合先做小范围试点再逐步扩面 |

---

## 二、核心洞察
### 洞察1：问题拆解应先定优先级
- 先从影响范围与落地成本两个维度排序，避免并行推进导致资源分散。
- 建议优先处理“高影响、可快速落地”的问题项，形成阶段性成果。

### 洞察2：能力建设需要场景牵引
- 仅做平台建设难以持续见效，需要绑定业务场景验证价值。
- 建议通过示范场景沉淀方法，再复制到相邻业务单元。

### 洞察3：治理与执行要同步推进
- 指标口径、看板管理、权限机制应与执行节奏同步设计。
- 建议建立周度复盘机制，确保方案迭代可追踪。

---

## 三、建议动作
### 优先级判断
高优先：明确目标指标与评估口径  
中优先：搭建场景化分析方案并完成试点  
持续项：沉淀治理规范与推广机制

### 落地路径
1. 2周内完成问题清单与优先级排序，统一评估标准。
2. 4周内完成1个重点场景试点，输出量化结果。
3. 8周内形成可复制模板，推动跨团队复用。

### 风险提示
- 若缺少统一口径，结论会出现偏差，影响后续决策准确性。
- 若试点范围过大，执行效率会下降，难以形成正向反馈。`;
}

function getComposerPlainText(text: string, files: ComposerFileAttachment[]) {
  return text.replace(COMPOSER_REFERENCE_PATTERN, (_, name: string) => {
    return files.find((file) => file.source === "reference" && file.name === name)?.name ?? name;
  });
}

function getComposerReferenceAtCursor(text: string, cursor: number, mode: "backspace" | "delete") {
  const pattern = new RegExp(COMPOSER_REFERENCE_PATTERN.source, "g");
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    const start = match.index;
    const end = start + match[0].length;
    const isBackspaceTarget = mode === "backspace" && cursor > start && cursor <= end;
    const isDeleteTarget = mode === "delete" && cursor >= start && cursor < end;

    if (isBackspaceTarget || isDeleteTarget) {
      return {
        start,
        end,
        name: match[1]
      };
    }
  }

  return null;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getComposerReferenceNames(text: string) {
  const names = new Set<string>();
  text.replace(COMPOSER_REFERENCE_PATTERN, (_match, name: string) => {
    names.add(name);
    return _match;
  });
  return names;
}

function removeComposerReferenceFromText(text: string, fileName: string) {
  return text.replace(
    new RegExp(`${COMPOSER_REFERENCE_START}${escapeRegExp(fileName)}${COMPOSER_REFERENCE_END}`, "g"),
    ""
  );
}

type FileType = "archive" | "doc" | "html" | "image" | "md" | "pdf" | "ppt" | "unknown" | "video" | "xls";

function getFileType(fileName: string): FileType {
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (["doc", "docx"].includes(extension ?? "")) return "doc";
  if (["md", "markdown"].includes(extension ?? "")) return "md";
  if (extension === "pdf") return "pdf";
  if (["html", "htm", "css", "js", "jsx", "ts", "tsx", "json", "txt", "text"].includes(extension ?? "")) return "html";
  if (["ppt", "pptx"].includes(extension ?? "")) return "ppt";
  if (["xls", "xlsx", "csv"].includes(extension ?? "")) return "xls";
  if (["zip", "rar", "7z", "tar", "gz", "bz2"].includes(extension ?? "")) return "archive";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "tif", "tiff"].includes(extension ?? "")) return "image";
  if (["mp4", "mov", "avi", "mkv", "webm", "wmv", "flv"].includes(extension ?? "")) return "video";
  return "unknown";
}

function getFileCoverIcon(fileName: string) {
  const fileType = getFileType(fileName);
  const iconMap: Record<FileType, string> = {
    archive: fileCoverArchiveIcon,
    doc: fileCoverDocIcon,
    html: fileCoverHtmlIcon,
    image: fileCoverImageIcon,
    md: fileCoverMdIcon,
    pdf: fileCoverPdfIcon,
    ppt: fileCoverPptIcon,
    unknown: fileCoverUnknownIcon,
    video: fileCoverVideoIcon,
    xls: fileCoverXlsIcon
  };

  return iconMap[fileType];
}

function getUploadFileIcon(fileName: string) {
  const fileType = getFileType(fileName);
  const iconMap: Record<FileType, string> = {
    archive: uploadFileArchiveIcon,
    doc: uploadFileDocIcon,
    html: uploadFileHtmlIcon,
    image: uploadFileImageIcon,
    md: uploadFileMdIcon,
    pdf: uploadFilePdfIcon,
    ppt: uploadFilePptIcon,
    unknown: uploadFileUnknownIcon,
    video: uploadFileVideoIcon,
    xls: uploadFileXlsIcon
  };

  return iconMap[fileType];
}

function isFileEditable(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();
  return ["md", "markdown", "txt", "text", "csv", "html", "htm", "css", "js", "jsx", "ts", "tsx", "json"].includes(
    extension ?? ""
  );
}

function getFileMimeType(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (extension === "pdf") return "application/pdf";
  if (extension === "doc") return "application/msword";
  if (extension === "docx") return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (extension === "csv") return "text/csv;charset=utf-8";
  if (extension === "html" || extension === "htm") return "text/html;charset=utf-8";
  if (extension === "json") return "application/json;charset=utf-8";
  if (["md", "markdown"].includes(extension ?? "")) return "text/markdown;charset=utf-8";
  return "text/plain;charset=utf-8";
}

function splitFileNameExtension(fileName: string) {
  const extensionIndex = fileName.lastIndexOf(".");
  if (extensionIndex <= 0) {
    return {
      baseName: fileName,
      extension: ""
    };
  }

  return {
    baseName: fileName.slice(0, extensionIndex),
    extension: fileName.slice(extensionIndex)
  };
}

function normalizeRenameBaseName(value: string, fallback: string) {
  const trimmedValue = value.replace(/\s+/g, " ").trim();
  if (!trimmedValue) return fallback;

  return splitFileNameExtension(trimmedValue).baseName || fallback;
}

function getUniqueFileName(fileName: string, existingNames: Set<string>) {
  const { baseName, extension } = splitFileNameExtension(fileName);
  let candidate = fileName;
  let serial = 1;

  while (existingNames.has(candidate.toLowerCase())) {
    candidate = `${baseName} (${serial})${extension}`;
    serial += 1;
  }

  return candidate;
}

function renderHighlightedFileName(fileName: string, query: string) {
  const keyword = query.trim();
  if (!keyword) return fileName;

  const lowerFileName = fileName.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  const parts: Array<{ text: string; highlighted: boolean }> = [];
  let cursor = 0;
  let matchIndex = lowerFileName.indexOf(lowerKeyword, cursor);

  while (matchIndex !== -1) {
    if (matchIndex > cursor) {
      parts.push({ text: fileName.slice(cursor, matchIndex), highlighted: false });
    }

    const matchEnd = matchIndex + keyword.length;
    parts.push({ text: fileName.slice(matchIndex, matchEnd), highlighted: true });
    cursor = matchEnd;
    matchIndex = lowerFileName.indexOf(lowerKeyword, cursor);
  }

  if (cursor < fileName.length) {
    parts.push({ text: fileName.slice(cursor), highlighted: false });
  }

  return parts.map((part, index) =>
    part.highlighted ? (
      <mark key={`${part.text}-${index}`} className="file-card-name-highlight">
        {part.text}
      </mark>
    ) : (
      <span key={`${part.text}-${index}`}>{part.text}</span>
    )
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function parseFileSize(size: string) {
  const match = size.trim().match(/^([\d.]+)\s*(B|KB|MB|GB)$/i);
  if (!match) return 0;

  const value = Number(match[1]);
  if (!Number.isFinite(value)) return 0;

  const unit = match[2].toUpperCase();
  const multiplier = unit === "GB" ? 1024 ** 3 : unit === "MB" ? 1024 ** 2 : unit === "KB" ? 1024 : 1;
  return value * multiplier;
}

function formatFileSummarySize(bytes: number) {
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

function formatFilesPanelSummary(files: FileItem[]) {
  const totalBytes = files.reduce((total, file) => total + parseFileSize(file.size), 0);
  return `${files.length}个文件，${formatFileSummarySize(totalBytes)}`;
}

function getUploadSimulationDuration(bytes: number) {
  return clamp(1000 + Math.sqrt(bytes / 1024) * 35, 1100, 7000);
}

function getRenamePopoverPosition(left: number, top: number) {
  const popoverWidth = 240;
  const inset = 8;

  return {
    left: clamp(left - popoverWidth + 112, inset, window.innerWidth - popoverWidth - inset),
    top: clamp(top + 64, inset, window.innerHeight - 104)
  };
}

function getFileCardMenuPosition(rect: DOMRect) {
  const inset = 8;
  const leftAligned = rect.left;
  const rightAligned = rect.right - FILE_CARD_MENU_WIDTH;
  const shouldRightAlign = leftAligned + FILE_CARD_MENU_WIDTH > window.innerWidth - inset;

  return {
    left: clamp(shouldRightAlign ? rightAligned : leftAligned, inset, window.innerWidth - FILE_CARD_MENU_WIDTH - inset),
    top: rect.bottom + 4
  };
}

function getFileMentionRange(text: string, cursor: number): FileMentionRange {
  const beforeCursor = text.slice(0, cursor);
  const match = beforeCursor.match(/@([^\s@]*)$/);
  if (!match) return null;

  return {
    start: beforeCursor.length - match[1].length - 1,
    end: cursor,
    query: match[1]
  };
}

function renderMarkdownInline(text: string) {
  const parts: ReactNode[] = [];
  const pattern = /\*\*(.+?)\*\*/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    if (match.index > cursor) {
      parts.push(text.slice(cursor, match.index));
    }

    parts.push(<strong key={`${match[1]}-${match.index}`}>{match[1]}</strong>);
    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return parts;
}

function parseMarkdownTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isMarkdownTableSeparator(line: string) {
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line.trim());
}

function isMarkdownBlockStart(line: string, nextLine = "") {
  const trimmed = line.trim();
  return (
    trimmed === "" ||
    /^#{1,6}\s+/.test(trimmed) ||
    /^-{3,}$/.test(trimmed) ||
    /^-\s+/.test(trimmed) ||
    /^\d+\.\s+/.test(trimmed) ||
    (trimmed.startsWith("|") && isMarkdownTableSeparator(nextLine))
  );
}

function renderMarkdown(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    if (/^-{3,}$/.test(trimmed)) {
      blocks.push(<hr key={`hr-${index}`} />);
      index += 1;
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = renderMarkdownInline(headingMatch[2]);
      if (level === 1) blocks.push(<h4 key={`h-${index}`}>{content}</h4>);
      else if (level === 2) blocks.push(<h5 key={`h-${index}`}>{content}</h5>);
      else blocks.push(<h6 key={`h-${index}`}>{content}</h6>);
      index += 1;
      continue;
    }

    if (trimmed.startsWith("|") && isMarkdownTableSeparator(lines[index + 1] ?? "")) {
      const headers = parseMarkdownTableRow(trimmed);
      const rows: string[][] = [];
      index += 2;

      while (index < lines.length && lines[index].trim().startsWith("|")) {
        rows.push(parseMarkdownTableRow(lines[index]));
        index += 1;
      }

      blocks.push(
        <div className="markdown-table-wrap" key={`table-${index}`}>
          <table>
            <thead>
              <tr>
                {headers.map((header, headerIndex) => (
                  <th key={`${header}-${headerIndex}`}>{renderMarkdownInline(header)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${cell}-${cellIndex}`}>{renderMarkdownInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    if (/^-\s+/.test(trimmed)) {
      const items: string[] = [];
      while (index < lines.length && /^-\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^-\s+/, ""));
        index += 1;
      }
      blocks.push(
        <ul key={`ul-${index}`}>
          {items.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`}>{renderMarkdownInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
        index += 1;
      }
      blocks.push(
        <ol key={`ol-${index}`}>
          {items.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`}>{renderMarkdownInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    const paragraphLines: string[] = [];
    while (index < lines.length && !isMarkdownBlockStart(lines[index], lines[index + 1] ?? "")) {
      paragraphLines.push(lines[index].replace(/\s{2}$/, ""));
      index += 1;
    }

    blocks.push(
      <p key={`p-${index}`}>
        {paragraphLines.map((paragraphLine, lineIndex) => (
          <span key={`${paragraphLine}-${lineIndex}`}>
            {renderMarkdownInline(paragraphLine)}
            {lineIndex < paragraphLines.length - 1 ? <br /> : null}
          </span>
        ))}
      </p>
    );
  }

  return blocks;
}

function getMarkdownTitle(markdown: string) {
  return markdown.match(/^#\s+(.+)$/m)?.[1] ?? "Markdown 文档";
}

function getConclusionStreamAdvance(markdown: string, visibleLength: number) {
  const remaining = markdown.length - visibleLength;
  if (remaining <= 0) return { chunkSize: 0, delayMs: 0 };

  const nextText = markdown.slice(visibleLength);
  const nextBoundary = nextText.search(/[。！？；：，、,.!?;:\n|]/);
  const chunkSize =
    nextBoundary > 0 && nextBoundary <= CONCLUSION_STREAM_MAX_CHUNK_SIZE
      ? nextBoundary + 1
      : Math.min(remaining, CONCLUSION_STREAM_MIN_CHUNK_SIZE + Math.floor(Math.random() * 5));
  const char = markdown[visibleLength + chunkSize - 1] ?? "";
  const delayMs =
    char === "\n"
      ? 260
      : /[。！？!?]/.test(char)
        ? 240
        : /[，、,；;：:|]/.test(char)
          ? 150
          : 72 + Math.floor(Math.random() * 55);

  return { chunkSize, delayMs };
}

function buildFollowUpQuestions(agent: AgentKey, question: string) {
  const normalizedQuestion = buildSessionTitle(question);

  if (agent === "客户洞察" && /华润集团|华润/.test(normalizedQuestion)) {
    return [
      "深挖华润啤酒财务与人员结构，评估其BI采购预算潜力",
      "对比金蝶/用友在华润体系的渗透情况，寻找差异化切入点",
      "生成华润集团专项拓客报告，整合痛点分析与行动建议"
    ];
  }

  if (agent === "风险管理") {
    return [
      "继续追踪该公司的政策合规风险与监管变化",
      "整理该公司近半年负面舆情与风险事件",
      "生成一份风险处置优先级与跟进清单"
    ];
  }

  if (agent === "舆情监控") {
    return [
      "深挖目标客户近期采购与招投标线索",
      "对比竞品切入路径，寻找差异化突破口",
      "生成下一轮销售推进话术和拜访计划"
    ];
  }

  return DEFAULT_FOLLOW_UP_QUESTIONS;
}

const INITIAL_AGENT_HISTORIES: AgentHistoryMap = {
  客户洞察: [
    createSession("insight-1", "帆软25年的销售额是多少", 0, 9, 12, true),
    createSession("insight-2", "公司同事的平均年齡大概在多大", 0, 11, 6, true),
    createSession("insight-3", "帆软的客户主要集中在哪些行业？帆软未来五年的发展规划是什么？", 0, 14, 18, true),
    createSession("insight-4", "帆软的主要竞争对手有哪些?", 1, 16, 24),
    createSession("insight-5", "帆软在未来十年的发展战略是什么", 4, 10, 15),
    createSession("insight-6", "帆软在数据安全方面有哪些措施?", 7, 15, 42)
  ],
  风险管理: [
    createSession("risk-1", "梳理帆软近两年的合规与数据安全风险点", 0, 9, 36),
    createSession("risk-2", "帆软在客户交付过程中最可能遇到的风险是什么", 0, 13, 8),
    createSession("risk-3", "请评估帆软海外拓展的政策与经营风险", 1, 8, 54, true),
    createSession("risk-4", "帆软在组织扩张阶段的管理风险有哪些", 1, 17, 30),
    createSession("risk-5", "帆软未来三年的核心风险敞口与应对建议", 5, 19, 10)
  ],
  舆情监控: [
    createSession("oppty-1", "帆软最适合优先切入的行业客户有哪些", 0, 10, 5),
    createSession("oppty-2", "围绕帆软现有客户，找出可二次销售的机会点", 0, 15, 28),
    createSession("oppty-3", "判断帆软近期最可能推进的商业合作方向", 1, 11, 42),
    createSession("oppty-4", "为帆软设计一套从首次接触到商机确认的话术", 3, 9, 20, true),
    createSession("oppty-5", "列出帆软在制造业和零售业的潜在突破口", 6, 14, 16)
  ]
};

const ICON_NAME_OVERRIDES: Record<string, string> = {
  guanbi: "guanbi1",
  yinyongdaohuihua: "yinyongdaohuihua1"
};

function Icon({ name }: { name: string }) {
  const resolvedName = ICON_NAME_OVERRIDES[name] ?? name;
  return <i className={`iconfont icon-${resolvedName}`} aria-hidden="true" />;
}

const RESOLUTION_SELECTED_ICONS: Record<"resolved" | "partial" | "unresolved", string> = {
  resolved: resolutionResolvedSelectedIcon,
  partial: resolutionPartialSelectedIcon,
  unresolved: resolutionUnresolvedSelectedIcon
};

const RESOLUTION_DEFAULT_ICON_NAMES: Record<"resolved" | "partial" | "unresolved", string> = {
  resolved: "yijiejue",
  partial: "bufenjiejue",
  unresolved: "weijiejue"
};

function ResolutionIcon({ type, selected = false }: { type: "resolved" | "partial" | "unresolved"; selected?: boolean }) {
  if (selected) {
    return (
      <img
        className="chat-resolution-icon chat-resolution-icon-selected"
        src={RESOLUTION_SELECTED_ICONS[type]}
        alt=""
        data-resolution-selected-icon={`满意度_${type}`}
      />
    );
  }

  return (
    <span className="chat-resolution-icon">
      <Icon name={RESOLUTION_DEFAULT_ICON_NAMES[type]} />
    </span>
  );
}

function LoadingSpinnerIcon() {
  return (
    <span className="chat-loading-spinner">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="chat-loading-spinner-gradient-1" x1="50%" x2="50%" y1="5.271%" y2="91.793%">
            <stop offset="0%" stopColor="currentColor" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="chat-loading-spinner-gradient-2" x1="50%" x2="50%" y1="15.24%" y2="87.15%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <g fill="none">
          <path
            d="M8.749.021a1.5 1.5 0 0 1 .497 2.958A7.5 7.5 0 0 0 3 10.375a7.5 7.5 0 0 0 7.5 7.5v3c-5.799 0-10.5-4.7-10.5-10.5C0 5.23 3.726.865 8.749.021"
            fill="url(#chat-loading-spinner-gradient-1)"
            transform="translate(1.5 1.625)"
          />
          <path
            d="M15.392 2.673a1.5 1.5 0 0 1 2.119-.115A10.48 10.48 0 0 1 21 10.375c0 5.8-4.701 10.5-10.5 10.5v-3a7.5 7.5 0 0 0 5.007-13.084a1.5 1.5 0 0 1-.115-2.118"
            fill="url(#chat-loading-spinner-gradient-2)"
            transform="translate(1.5 1.625)"
          />
        </g>
      </svg>
    </span>
  );
}

function getThinkingStepIcon(step: string) {
  if (step.includes("阅读")) return "yuedu";
  if (step.includes("解析") || step.includes("过滤") || step.includes("整理")) return "jiazaishejiguifan";
  if (step.includes("搜索网络") || step.includes("AI搜索")) return "sousuowaibu";
  if (step.includes("MOSS-")) return "sousuoneibu";
  if (step.includes("生成") || step.includes("输出") || step.includes("提炼") || step.includes("推演")) return "huizhi";
  return "gongju";
}

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [isAutoCollapsed, setIsAutoCollapsed] = useState(() =>
    typeof window === "undefined" ? false : window.innerWidth < SIDEBAR_AUTO_COLLAPSE_BREAKPOINT
  );
  const [activeTab, setActiveTab] = useState<TabKey>("portrait");
  const [draft, setDraft] = useState("");
  const [activePrompt, setActivePrompt] = useState(1);
  const [activeAgentIndex, setActiveAgentIndex] = useState(0);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [isNewChatActive, setIsNewChatActive] = useState(true);
  const [conversationRuns, setConversationRuns] = useState<ConversationRun[]>([]);
  const [answerFeedback, setAnswerFeedback] = useState<AnswerFeedback>(null);
  const [answerResolutionFeedback, setAnswerResolutionFeedback] = useState<AnswerResolutionFeedback>(null);
  const [pendingResolutionFeedback, setPendingResolutionFeedback] = useState<ResolutionPopconfirmValue | null>(null);
  const [resolutionPopconfirmPosition, setResolutionPopconfirmPosition] = useState<ResolutionPopconfirmPosition>(null);
  const [selectedResolutionReasons, setSelectedResolutionReasons] = useState<string[]>([]);
  const [resolutionFeedbackText, setResolutionFeedbackText] = useState("");
  const [isResolutionThanksVisible, setIsResolutionThanksVisible] = useState(false);
  const [agentHistories, setAgentHistories] = useState<AgentHistoryMap>(INITIAL_AGENT_HISTORIES);
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [fileMarkdownByName, setFileMarkdownByName] = useState<Record<string, string>>(INITIAL_FILE_MARKDOWN);
  const [expandedHistoryGroups, setExpandedHistoryGroups] = useState<Record<HistoryGroupKey, boolean>>({
    favorites: true,
    today: true,
    yesterday: true,
    earlier: true
  });
  const [openHistoryMenu, setOpenHistoryMenu] = useState<HistoryMenuState>(null);
  const [renamingHistory, setRenamingHistory] = useState<HistoryRenameState>(null);
  const [collapsedTooltip, setCollapsedTooltip] = useState<CollapsedTooltipState>(null);
  const [openCollapsedPopover, setOpenCollapsedPopover] = useState<CollapsedPopoverState>(null);
  const [activeUtilityPanel, setActiveUtilityPanel] = useState<UtilityPanel>(null);
  const [isFilesPanelExpanded, setIsFilesPanelExpanded] = useState(false);
  const [filesPanelWidth, setFilesPanelWidth] = useState(FILES_PANEL_DEFAULT_WIDTH);
  const [isFilesPanelResizing, setIsFilesPanelResizing] = useState(false);
  const [isFilesSearchActive, setIsFilesSearchActive] = useState(false);
  const [filesSearchQuery, setFilesSearchQuery] = useState("");
  const [filesPanelScope, setFilesPanelScope] = useState<FilesPanelScope>("all");
  const [currentConversationFileNames, setCurrentConversationFileNames] = useState<string[]>([]);
  const [activeFileDetailName, setActiveFileDetailName] = useState<string | null>(null);
  const [inlineFileRename, setInlineFileRename] = useState<FileRenamePopoverState>(null);
  const [editingFileName, setEditingFileName] = useState<string | null>(null);
  const [editingFileDraft, setEditingFileDraft] = useState("");
  const [fileMentionRange, setFileMentionRange] = useState<FileMentionRange>(null);
  const [activeFileMentionIndex, setActiveFileMentionIndex] = useState(0);
  const [composerFiles, setComposerFiles] = useState<ComposerFileAttachment[]>([]);
  const [showTabsMore, setShowTabsMore] = useState(false);
  const [isChatAtBottom, setIsChatAtBottom] = useState(true);
  const [conversationComposerHeight, setConversationComposerHeight] = useState(126);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [isSourceDrawerOpen, setIsSourceDrawerOpen] = useState(false);
  const [isExternalSourcesExpanded, setIsExternalSourcesExpanded] = useState(true);
  const [selectedFeedbackReasons, setSelectedFeedbackReasons] = useState<string[]>([]);
  const [feedbackText, setFeedbackText] = useState("");
  const [openFileMenu, setOpenFileMenu] = useState<FileMenuState>(null);
  const [openFileRenamePopover, setOpenFileRenamePopover] = useState<FileRenamePopoverState>(null);
  const [uploadTooltip, setUploadTooltip] = useState<FloatingPointState>(null);
  const [globalToast, setGlobalToast] = useState<GlobalToastState>(null);
  const mainRef = useRef<HTMLElement | null>(null);
  const spotlightFrameRef = useRef<number | null>(null);
  const spotlightCurrentRef = useRef({ x: 0, y: 0, opacity: 0 });
  const spotlightTargetRef = useRef({ x: 0, y: 0, opacity: 0 });
  const historyMenuRef = useRef<HTMLDivElement | null>(null);
  const historyRenameInputRef = useRef<HTMLInputElement | null>(null);
  const shouldSkipHistoryRenameBlurRef = useRef(false);
  const fileMenuRef = useRef<HTMLDivElement | null>(null);
  const fileRenamePopoverRef = useRef<HTMLFormElement | null>(null);
  const fileRenameInputRef = useRef<HTMLInputElement | null>(null);
  const uploadButtonRef = useRef<HTMLButtonElement | null>(null);
  const uploadProgressTimersRef = useRef<Record<string, number>>({});
  const collapsedPopoverRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLElement | null>(null);
  const chatStageBodyRef = useRef<HTMLDivElement | null>(null);
  const shouldFollowChatRef = useRef(true);
  const isAutoScrollingChatRef = useRef(false);
  const hasUserInterruptedChatScrollRef = useRef(false);
  const fileMentionPanelRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const filesPanelFileInputRef = useRef<HTMLInputElement | null>(null);
  const filesSearchRef = useRef<HTMLLabelElement | null>(null);
  const filesSearchInputRef = useRef<HTMLInputElement | null>(null);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const tabsTrackRef = useRef<HTMLDivElement | null>(null);
  const globalToastTimerRef = useRef<number | null>(null);

  const activeAgent = AGENTS[activeAgentIndex];
  const visibleTabs = useMemo(() => {
    if (activeAgent === "客户洞察") return CUSTOMER_INSIGHT_TABS;
    if (activeAgent === "风险管理") return RISK_MANAGEMENT_TABS;
    if (activeAgent === "舆情监控") return PUBLIC_OPINION_TABS;
    return TABS;
  }, [activeAgent]);
  const prompts = useMemo(() => {
    if (activeAgent === "风险管理") {
      return RISK_MANAGEMENT_PROMPTS[activeTab] ?? PROMPTS[activeTab];
    }
    if (activeAgent === "舆情监控") {
      return OPPORTUNITY_MINING_PROMPTS[activeTab] ?? PROMPTS[activeTab];
    }
    return PROMPTS[activeTab];
  }, [activeAgent, activeTab]);
  const activeAgentHistories = useMemo(() => agentHistories[activeAgent], [activeAgent, agentHistories]);
  const activeRun = conversationRuns[conversationRuns.length - 1] ?? null;
  const hasConversation = conversationRuns.length > 0;
  const setActiveRun = (
    nextRun: ConversationRun | null | ((current: ConversationRun | null) => ConversationRun | null)
  ) => {
    setConversationRuns((currentRuns) => {
      const currentRun = currentRuns[currentRuns.length - 1] ?? null;
      const resolvedRun = typeof nextRun === "function" ? nextRun(currentRun) : nextRun;

      if (!resolvedRun) return [];
      if (currentRuns.length === 0) return [resolvedRun];

      return currentRuns.map((run, index) => (index === currentRuns.length - 1 ? resolvedRun : run));
    });
  };
  const isSidebarCollapsed = collapsed || isAutoCollapsed;
  const visibleFiles = useMemo(() => {
    const currentFileNames = new Set([...currentConversationFileNames, ...composerFiles.map((file) => file.name)]);
    const scopedFiles = filesPanelScope === "current" ? files.filter((file) => currentFileNames.has(file.name)) : files;
    const query = filesSearchQuery.trim().toLowerCase();
    if (!query) return scopedFiles;

    return scopedFiles.filter((file) => file.name.toLowerCase().includes(query));
  }, [composerFiles, currentConversationFileNames, files, filesPanelScope, filesSearchQuery]);
  const filesPanelSummary = useMemo(() => formatFilesPanelSummary(visibleFiles), [visibleFiles]);
  const activeFileDetail = useMemo(
    () => files.find((file) => file.name === activeFileDetailName) ?? null,
    [activeFileDetailName, files]
  );
  const activeFileDetailDisplayName = activeFileDetail ? splitFileNameExtension(activeFileDetail.name).baseName : "";
  const activeFileMarkdown = activeFileDetail ? fileMarkdownByName[activeFileDetail.name] ?? DEFAULT_FILE_MARKDOWN : "";
  const mentionFiles = useMemo(() => {
    const query = fileMentionRange?.query.trim().toLowerCase() ?? "";
    if (!query) return files;

    return files.filter((file) => file.name.toLowerCase().includes(query));
  }, [fileMentionRange?.query, files]);
  const uploadComposerFiles = useMemo(() => composerFiles.filter((file) => file.source === "upload"), [composerFiles]);
  const referenceComposerFiles = useMemo(
    () => composerFiles.filter((file) => file.source === "reference"),
    [composerFiles]
  );
  const historyGroups = useMemo<HistoryGroups>(() => {
    const sessions = [...activeAgentHistories].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    return {
      favorites: sessions.filter((session) => session.isFavorite),
      today: sessions.filter((session) => !session.isFavorite && deriveHistoryCategory(session.updatedAt) === "today"),
      yesterday: sessions.filter((session) => !session.isFavorite && deriveHistoryCategory(session.updatedAt) === "yesterday"),
      earlier: sessions.filter((session) => !session.isFavorite && deriveHistoryCategory(session.updatedAt) === "earlier")
    };
  }, [activeAgentHistories]);
  const activeHistorySession = useMemo(
    () => (activeHistoryId ? activeAgentHistories.find((session) => session.id === activeHistoryId) ?? null : null),
    [activeAgentHistories, activeHistoryId]
  );
  const isCurrentSessionFavorite = Boolean(activeHistorySession?.isFavorite);
  const isGeneratingResponse = Boolean(
    activeRun &&
      !activeRun.isStopped &&
      (activeRun.stage !== "done" || activeRun.conclusionVisibleLength < activeRun.conclusionMarkdown.length)
  );
  const shouldShowScrollToBottom = Boolean(hasConversation && !isChatAtBottom);
  const conversationContentStyle = hasConversation
    ? ({
        "--moss-conversation-composer-height": `${conversationComposerHeight}px`
      } as CSSProperties)
    : undefined;
  const canSubmitDislikeFeedback = selectedFeedbackReasons.length > 0 || feedbackText.trim().length > 0;
  const isCollapsedFavoritesSelected = Boolean(activeHistorySession?.isFavorite);
  const isCollapsedHistorySelected = Boolean(activeHistorySession && !activeHistorySession.isFavorite);
  const collapsedNavItems = useMemo(
    () =>
      [
        { icon: "xinhuihua", label: "新会话" },
        historyGroups.favorites.length > 0 ? { icon: "shoucang", label: "收藏" } : null,
        { icon: "lishihuihua", label: "历史会话" }
      ].filter(Boolean) as Array<{ icon: "xinhuihua" | "shoucang" | "lishihuihua"; label: string }>,
    [historyGroups.favorites.length]
  );

  const applySpotlightVars = (x: number, y: number, opacity: number) => {
    if (!mainRef.current) return;
    mainRef.current.style.setProperty("--mx", `${x}px`);
    mainRef.current.style.setProperty("--my", `${y}px`);
    mainRef.current.style.setProperty("--dot-opacity", opacity.toFixed(3));
  };

  const animateSpotlight = () => {
    const current = spotlightCurrentRef.current;
    const target = spotlightTargetRef.current;

    current.x += (target.x - current.x) * 0.14;
    current.y += (target.y - current.y) * 0.14;
    current.opacity += (target.opacity - current.opacity) * 0.12;

    applySpotlightVars(current.x, current.y, current.opacity);

    const isSettled =
      Math.abs(target.x - current.x) < 0.35 &&
      Math.abs(target.y - current.y) < 0.35 &&
      Math.abs(target.opacity - current.opacity) < 0.015;

    if (isSettled) {
      current.x = target.x;
      current.y = target.y;
      current.opacity = target.opacity;
      applySpotlightVars(current.x, current.y, current.opacity);
      spotlightFrameRef.current = null;
      return;
    }

    spotlightFrameRef.current = window.requestAnimationFrame(animateSpotlight);
  };

  const startSpotlightAnimation = () => {
    if (spotlightFrameRef.current !== null) return;
    spotlightFrameRef.current = window.requestAnimationFrame(animateSpotlight);
  };

  const updateSpotlightTarget = (x: number, y: number, opacity: number) => {
    const current = spotlightCurrentRef.current;
    const target = spotlightTargetRef.current;
    const isDormant = current.opacity < 0.01 && target.opacity < 0.01;

    if (isDormant) {
      current.x = x;
      current.y = y;
      target.x = x;
      target.y = y;
      applySpotlightVars(x, y, current.opacity);
    } else {
      target.x = x;
      target.y = y;
    }

    target.opacity = opacity;
    startSpotlightAnimation();
  };

  useEffect(() => {
    setActivePrompt(1);
  }, [activeTab]);

  useEffect(() => {
    if (visibleTabs.some((tab) => tab.key === activeTab)) return;
    setActiveTab(visibleTabs[0]?.key ?? "portrait");
  }, [activeTab, visibleTabs]);

  useEffect(() => {
    setIsResolutionThanksVisible(false);
    if (!answerResolutionFeedback) return;

    const timerId = window.setTimeout(() => {
      setIsResolutionThanksVisible(true);
    }, 1600);

    return () => window.clearTimeout(timerId);
  }, [answerResolutionFeedback]);


  useEffect(() => {
    if (activeUtilityPanel !== "files") {
      setIsFilesPanelExpanded(false);
      setOpenFileMenu(null);
      setOpenFileRenamePopover(null);
      setIsFilesSearchActive(false);
      setFilesSearchQuery("");
      setActiveFileDetailName(null);
      setInlineFileRename(null);
      setEditingFileName(null);
      setEditingFileDraft("");
    }
  }, [activeUtilityPanel, visibleTabs]);

  useEffect(() => {
    if (!activeFileDetailName) return;
    if (files.some((file) => file.name === activeFileDetailName)) return;

    setActiveFileDetailName(null);
    setInlineFileRename(null);
    setEditingFileName(null);
    setEditingFileDraft("");
  }, [activeFileDetailName, files]);

  useEffect(() => {
    if (!isFilesSearchActive) return;

    const focusFrame = window.requestAnimationFrame(() => {
      filesSearchInputRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(focusFrame);
  }, [isFilesSearchActive]);

  useEffect(() => {
    if (!isFilesSearchActive) return;

    const closeFilesSearch = (event: MouseEvent) => {
      const target = event.target as Node;
      if (filesSearchRef.current?.contains(target)) return;
      if (fileRenamePopoverRef.current?.contains(target)) return;

      setIsFilesSearchActive(false);
      setFilesSearchQuery("");
    };

    document.addEventListener("mousedown", closeFilesSearch);
    return () => document.removeEventListener("mousedown", closeFilesSearch);
  }, [isFilesSearchActive]);

  useEffect(() => {
    const tabs = tabsRef.current;
    const track = tabsTrackRef.current;
    if (!tabs || !track) return;

    const updateTabsOverflow = () => {
      const tabsWidth = tabs.getBoundingClientRect().width;
      setShowTabsMore(track.scrollWidth > tabsWidth + 1);
    };

    updateTabsOverflow();

    const resizeObserver = new ResizeObserver(updateTabsOverflow);
    resizeObserver.observe(tabs);
    resizeObserver.observe(track);
    window.addEventListener("resize", updateTabsOverflow);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateTabsOverflow);
    };
  }, [activeUtilityPanel]);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "60px";
    const nextHeight = Math.min(textareaRef.current.scrollHeight, 200);
    textareaRef.current.style.height = `${Math.max(nextHeight, 60)}px`;
    textareaRef.current.style.overflowY = textareaRef.current.scrollHeight > 200 ? "auto" : "hidden";
  }, [draft]);

  useEffect(() => {
    const composer = composerRef.current;
    if (!composer) return;

    const updateComposerHeight = () => {
      const nextHeight = Number(composer.getBoundingClientRect().height.toFixed(2));
      setConversationComposerHeight((currentHeight) => (currentHeight === nextHeight ? currentHeight : nextHeight));
    };

    updateComposerHeight();

    const resizeObserver = new ResizeObserver(updateComposerHeight);
    resizeObserver.observe(composer);
    window.addEventListener("resize", updateComposerHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateComposerHeight);
    };
  }, [activeAgent]);

  useEffect(() => {
    if (!fileMentionRange) return;
    setActiveFileMentionIndex(0);
  }, [fileMentionRange?.query]);

  useEffect(() => {
    if (!fileMentionRange) return;

    const closeFileMentionPanel = (event: MouseEvent) => {
      const target = event.target as Node;
      if (composerRef.current?.contains(target)) return;
      if (fileMentionPanelRef.current?.contains(target)) return;

      setFileMentionRange(null);
    };

    document.addEventListener("mousedown", closeFileMentionPanel);
    return () => document.removeEventListener("mousedown", closeFileMentionPanel);
  }, [fileMentionRange]);

  useEffect(() => {
    const clearSpotlight = () => {
      spotlightTargetRef.current.opacity = 0;
      startSpotlightAnimation();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        clearSpotlight();
      }
    };

    window.addEventListener("blur", clearSpotlight);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      if (spotlightFrameRef.current !== null) {
        window.cancelAnimationFrame(spotlightFrameRef.current);
      }
      window.removeEventListener("blur", clearSpotlight);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    return () => {
      Object.values(uploadProgressTimersRef.current).forEach((timerId) => window.clearInterval(timerId));
      uploadProgressTimersRef.current = {};
      if (globalToastTimerRef.current !== null) {
        window.clearTimeout(globalToastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (historyMenuRef.current?.contains(target)) return;
      if (fileMenuRef.current?.contains(target)) return;
      if (fileRenamePopoverRef.current?.contains(target)) return;
      if (uploadButtonRef.current?.contains(target)) return;
      if (collapsedPopoverRef.current?.contains(target)) return;

      setOpenHistoryMenu(null);
      setOpenFileMenu(null);
      setOpenFileRenamePopover(null);
      setUploadTooltip(null);
      setOpenCollapsedPopover(null);
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, []);

  useEffect(() => {
    if (!openHistoryMenu) return;

    const focusFrame = window.requestAnimationFrame(() => {
      historyMenuRef.current
        ?.querySelector<HTMLButtonElement>(".history-item-menu-option")
        ?.focus();
    });

    const closeMenu = () => {
      setOpenHistoryMenu(null);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      closeMenu();
    };

    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", closeMenu);
    window.addEventListener("scroll", closeMenu, true);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", closeMenu);
      window.removeEventListener("scroll", closeMenu, true);
    };
  }, [openHistoryMenu]);

  useEffect(() => {
    if (!renamingHistory) return;

    const focusFrame = window.requestAnimationFrame(() => {
      historyRenameInputRef.current?.focus();
      historyRenameInputRef.current?.select();
    });

    return () => window.cancelAnimationFrame(focusFrame);
  }, [renamingHistory?.sessionId]);

  useEffect(() => {
    if (!openCollapsedPopover) return;

    const focusFrame = window.requestAnimationFrame(() => {
      collapsedPopoverRef.current
        ?.querySelector<HTMLButtonElement>(".collapsed-popover-item, .collapsed-history-item")
        ?.focus();
    });

    const closePopover = () => {
      setOpenCollapsedPopover(null);
      setCollapsedTooltip(null);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      closePopover();
    };

    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", closePopover);
    window.addEventListener("scroll", closePopover, true);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", closePopover);
      window.removeEventListener("scroll", closePopover, true);
    };
  }, [openCollapsedPopover]);

  useEffect(() => {
    if (!openFileMenu) return;

    const focusFrame = window.requestAnimationFrame(() => {
      fileMenuRef.current?.querySelector<HTMLButtonElement>(".file-card-menu-option")?.focus();
    });

    const closeFileMenu = () => {
      setOpenFileMenu(null);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      closeFileMenu();
    };

    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", closeFileMenu);
    window.addEventListener("scroll", closeFileMenu, true);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", closeFileMenu);
      window.removeEventListener("scroll", closeFileMenu, true);
    };
  }, [openFileMenu]);

  useEffect(() => {
    if (!openFileRenamePopover) return;

    const focusFrame = window.requestAnimationFrame(() => {
      fileRenameInputRef.current?.focus();
      fileRenameInputRef.current?.select();
    });

    const closePopover = () => {
      setOpenFileRenamePopover(null);
    };

    const closePopoverOnExternalScroll = (event: Event) => {
      const target = event.target as Node | null;
      if (target && fileRenamePopoverRef.current?.contains(target)) return;
      closePopover();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      closePopover();
    };

    window.addEventListener("resize", closePopover);
    window.addEventListener("scroll", closePopoverOnExternalScroll, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("resize", closePopover);
      window.removeEventListener("scroll", closePopoverOnExternalScroll, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openFileRenamePopover]);

  useEffect(() => {
    if (!activeHistoryId) return;
    const existsInCurrentAgent = activeAgentHistories.some((session) => session.id === activeHistoryId);
    if (!existsInCurrentAgent) {
      setActiveHistoryId(null);
      setIsNewChatActive(true);
      setOpenHistoryMenu(null);
      setRenamingHistory(null);
      setIsSourceDrawerOpen(false);
    }
  }, [activeAgentHistories, activeHistoryId]);

  useEffect(() => {
    setIsNewChatActive(true);
    setActiveHistoryId(null);
    setActiveRun(null);
    shouldFollowChatRef.current = true;
    hasUserInterruptedChatScrollRef.current = false;
    setIsChatAtBottom(true);
    setAnswerFeedback(null);
    setAnswerResolutionFeedback(null);
    setIsFeedbackDialogOpen(false);
    setSelectedFeedbackReasons([]);
    setFeedbackText("");
    setDraft("");
    setComposerFiles([]);
    setFileMentionRange(null);
    setOpenHistoryMenu(null);
    setRenamingHistory(null);
    setIsSourceDrawerOpen(false);
    setOpenCollapsedPopover(null);
    setCollapsedTooltip(null);
  }, [activeAgent]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${SIDEBAR_AUTO_COLLAPSE_BREAKPOINT - 0.02}px)`);
    const syncAutoCollapse = () => setIsAutoCollapsed(mediaQuery.matches);

    syncAutoCollapse();
    mediaQuery.addEventListener("change", syncAutoCollapse);

    return () => mediaQuery.removeEventListener("change", syncAutoCollapse);
  }, []);

  useEffect(() => {
    if (!isSidebarCollapsed) {
      setOpenCollapsedPopover(null);
      setCollapsedTooltip(null);
    }
  }, [isSidebarCollapsed]);

  useEffect(() => {
    if (!activeRun) return;
    if (!activeRun.responseStarted) {
      const startTimerId = window.setTimeout(() => {
        setActiveRun((current) => {
          if (!current || current.id !== activeRun.id || current.responseStarted || current.isStopped) return current;
          return {
            ...current,
            responseStarted: true
          };
        });
      }, getThinkingStartDelay(activeRun));

      return () => window.clearTimeout(startTimerId);
    }

    const totalSteps = buildThinkingChainSteps(activeAgent, activeRun.question).length;

    if (activeRun.stage === "thinking") {
      const thinkingTimerId = window.setTimeout(() => {
        setActiveRun((current) => {
          if (!current || current.id !== activeRun.id || current.stage !== "thinking" || current.isStopped) return current;
          return {
            ...current,
            stage: "processing"
          };
        });
      }, getThinkingTransitionDelay(activeRun));

      return () => window.clearTimeout(thinkingTimerId);
    }

    if (activeRun.stage === "done") return;

    const timerId = window.setTimeout(() => {
      setActiveRun((current) => {
        if (!current || current.id !== activeRun.id || current.isStopped) return current;

        if (current.stage === "processing" && current.visibleSteps < totalSteps) {
          return { ...current, visibleSteps: current.visibleSteps + 1 };
        }
        if (current.stage === "processing") {
          return {
            ...current,
            stage: "done",
            completedAt: new Date().toISOString(),
            isThinkingExpanded: false
          };
        }
        return current;
      });
    }, activeRun.visibleSteps < totalSteps ? getThinkingStepDelay(activeRun) : getThinkingFinishDelay(activeRun));

    return () => window.clearTimeout(timerId);
  }, [activeRun, activeAgent]);

  useEffect(() => {
    if (!activeRun || activeRun.stage !== "done") return;
    if (activeRun.isStopped) return;
    if (activeRun.conclusionVisibleLength >= activeRun.conclusionMarkdown.length) return;

    const { chunkSize, delayMs } = getConclusionStreamAdvance(
      activeRun.conclusionMarkdown,
      activeRun.conclusionVisibleLength
    );

    const streamTimerId = window.setTimeout(() => {
      setActiveRun((current) => {
        if (!current || current.id !== activeRun.id || current.stage !== "done" || current.isStopped) return current;

        return {
          ...current,
          conclusionVisibleLength: Math.min(
            current.conclusionMarkdown.length,
            current.conclusionVisibleLength + chunkSize
          )
        };
      });
    }, delayMs);

    return () => window.clearTimeout(streamTimerId);
  }, [activeRun]);

  useEffect(() => {
    if (!activeRun) return;
    if (activeRun.isStopped) return;
    const isOutputting =
      activeRun.stage !== "done" || activeRun.conclusionVisibleLength < activeRun.conclusionMarkdown.length;
    if (!isOutputting) return;

    const scrollFrameId = window.requestAnimationFrame(() => {
      if (!shouldFollowChatRef.current) return;

      const stageBody = chatStageBodyRef.current;
      if (!stageBody) return;

      isAutoScrollingChatRef.current = true;
      stageBody.scrollTo({
        top: stageBody.scrollHeight,
        behavior: "auto"
      });
      setIsChatAtBottom(true);

      window.requestAnimationFrame(() => {
        isAutoScrollingChatRef.current = false;
      });
    });

    return () => window.cancelAnimationFrame(scrollFrameId);
  }, [
    activeRun?.id,
    activeRun?.stage,
    activeRun?.isStopped,
    activeRun?.visibleSteps,
    activeRun?.responseStarted,
    activeRun?.conclusionVisibleLength,
    activeRun?.conclusionMarkdown.length
  ]);

  useEffect(() => {
    if (!isFilesPanelResizing) return;

    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const onPointerMove = (event: PointerEvent) => {
      event.preventDefault();
      setFilesPanelWidth(getFilesPanelWidthFromClientX(event.clientX));
    };

    const onPointerUp = () => {
      setIsFilesPanelResizing(false);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp, { once: true });

    return () => {
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [isFilesPanelResizing]);

  const activateNewChat = () => {
    setIsNewChatActive(true);
    setActiveHistoryId(null);
    setActiveRun(null);
    shouldFollowChatRef.current = true;
    hasUserInterruptedChatScrollRef.current = false;
    setIsChatAtBottom(true);
    setAnswerFeedback(null);
    setAnswerResolutionFeedback(null);
    setIsFeedbackDialogOpen(false);
    setSelectedFeedbackReasons([]);
    setFeedbackText("");
    setOpenHistoryMenu(null);
    setRenamingHistory(null);
    setIsSourceDrawerOpen(false);
    setOpenCollapsedPopover(null);
    setCurrentConversationFileNames([]);
  };

  const submitQuestion = (questionText: string) => {
    const normalizedText = buildSessionTitle(questionText);
    if (!normalizedText) return;

    const shouldCreateSession = isNewChatActive || !activeHistoryId;
    shouldFollowChatRef.current = true;
    hasUserInterruptedChatScrollRef.current = false;
    setIsChatAtBottom(true);
    setAnswerFeedback(null);
    setAnswerResolutionFeedback(null);
    setIsFeedbackDialogOpen(false);
    setSelectedFeedbackReasons([]);
    setFeedbackText("");
    setOpenHistoryMenu(null);
    setRenamingHistory(null);
    setIsSourceDrawerOpen(false);
    if (activeUtilityPanel === "files") {
      setFilesPanelWidth((currentWidth) => Math.max(currentWidth, getFilesPanelDefaultWidth()));
    }
    const now = new Date().toISOString();

    if (shouldCreateSession) {
      const sessionId = `session-${Date.now()}`;
      const nextSession: HistorySession = {
        id: sessionId,
        title: normalizedText,
        question: normalizedText,
        createdAt: now,
        updatedAt: now,
        isFavorite: false
      };

      setAgentHistories((prev) => ({
        ...prev,
        [activeAgent]: [nextSession, ...prev[activeAgent]]
      }));
      setActiveHistoryId(sessionId);
      setIsNewChatActive(false);
    } else {
      setAgentHistories((prev) => ({
        ...prev,
        [activeAgent]: prev[activeAgent].map((session) =>
          session.id === activeHistoryId ? { ...session, updatedAt: now } : session
        )
      }));
    }

    const nextRun: ConversationRun = {
      id: `run-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      question: normalizedText,
      createdAt: now,
      conclusionMarkdown: buildConversationConclusionMarkdown(activeAgent, normalizedText),
      conclusionVisibleLength: 0,
      stage: "thinking",
      visibleSteps: 0,
      responseStarted: false,
      isThinkingExpanded: true,
      isStopped: false,
      actionVariant: createActionVariant()
    };

    setConversationRuns((currentRuns) => (shouldCreateSession ? [nextRun] : [...currentRuns, nextRun]));
  };

  const onSend = () => {
    const text = getComposerPlainText(draft, composerFiles).trim();
    if (!text && uploadComposerFiles.length === 0) return;
    const titleText = text || uploadComposerFiles.map((file) => file.name).join("、");
    setCurrentConversationFileNames((current) => Array.from(new Set([...current, ...composerFiles.map((file) => file.name)])));
    submitQuestion(titleText);

    setDraft("");
    setFileMentionRange(null);
    setComposerFiles([]);
  };

  const stopGeneratingResponse = () => {
    setActiveRun((current) => {
      if (!current) return current;

      return {
        ...current,
        stage: "done",
        completedAt: current.completedAt ?? new Date().toISOString(),
        visibleSteps: current.visibleSteps,
        responseStarted: true,
        isThinkingExpanded: current.visibleSteps > 0,
        conclusionVisibleLength: current.conclusionVisibleLength,
        isStopped: true
      };
    });
  };

  const syncChatBottomState = (target: HTMLDivElement) => {
    const distanceToBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
    const isAtBottom = distanceToBottom <= CHAT_BOTTOM_THRESHOLD;

    if (isAutoScrollingChatRef.current) {
      if (isAtBottom) shouldFollowChatRef.current = true;
      setIsChatAtBottom(isAtBottom);
      return;
    }

    if (isAtBottom) {
      shouldFollowChatRef.current = true;
      hasUserInterruptedChatScrollRef.current = false;
    } else if (hasUserInterruptedChatScrollRef.current) {
      shouldFollowChatRef.current = false;
    }

    setIsChatAtBottom(isAtBottom);
  };

  const handleChatStageScroll = (event: ReactUIEvent<HTMLDivElement>) => {
    syncChatBottomState(event.currentTarget);
  };

  const markChatScrollInterrupted = () => {
    hasUserInterruptedChatScrollRef.current = true;
  };

  const scrollChatToBottom = () => {
    shouldFollowChatRef.current = true;
    hasUserInterruptedChatScrollRef.current = false;
    const stageBody = chatStageBodyRef.current;
    if (!stageBody) return;

    isAutoScrollingChatRef.current = true;
    stageBody.scrollTo({
      top: stageBody.scrollHeight,
      behavior: "auto"
    });
    setIsChatAtBottom(true);
    window.requestAnimationFrame(() => {
      isAutoScrollingChatRef.current = false;
    });
  };

  const toggleLikeFeedback = () => {
    setAnswerResolutionFeedback(null);
    setAnswerFeedback((current) => (current === "liked" ? null : "liked"));
    setIsFeedbackDialogOpen(false);
    setSelectedFeedbackReasons([]);
    setFeedbackText("");
  };

  const toggleDislikeFeedback = () => {
    setAnswerResolutionFeedback(null);
    if (answerFeedback === "disliked") {
      setAnswerFeedback(null);
      return;
    }

    setIsFeedbackDialogOpen(true);
    setSelectedFeedbackReasons([]);
    setFeedbackText("");
  };

  const closeFeedbackDialog = () => {
    setIsFeedbackDialogOpen(false);
    setSelectedFeedbackReasons([]);
    setFeedbackText("");
  };

  const closeResolutionPopconfirm = () => {
    setPendingResolutionFeedback(null);
    setResolutionPopconfirmPosition(null);
    setSelectedResolutionReasons([]);
    setResolutionFeedbackText("");
  };

  const getResolutionPopconfirmPosition = (triggerElement: HTMLButtonElement): Exclude<ResolutionPopconfirmPosition, null> => {
    const triggerRect = triggerElement.getBoundingClientRect();
    const popconfirmWidth = 300;
    const estimatedPopconfirmHeight = 214;
    const safePadding = 8;
    const triggerGap = 8;
    const triggerCenterX = triggerRect.left + triggerRect.width / 2;
    const maxLeft = Math.max(safePadding, window.innerWidth - popconfirmWidth - safePadding);
    const left = clamp(triggerCenterX - popconfirmWidth / 2, safePadding, maxLeft);
    const composerTop = composerRef.current?.getBoundingClientRect().top;
    const bottomBoundary =
      typeof composerTop === "number" && composerTop > triggerRect.bottom
        ? Math.min(window.innerHeight - safePadding, composerTop - safePadding)
        : window.innerHeight - safePadding;
    const bottomTop = triggerRect.bottom + triggerGap;
    const spaceBelow = bottomBoundary - bottomTop;
    const spaceAbove = triggerRect.top - safePadding - triggerGap;
    const placement: ResolutionPopconfirmPlacement =
      spaceBelow < estimatedPopconfirmHeight && spaceAbove > spaceBelow ? "top" : "bottom";
    const top =
      placement === "top"
        ? Math.max(safePadding, triggerRect.top - triggerGap - estimatedPopconfirmHeight)
        : Math.min(bottomTop, window.innerHeight - estimatedPopconfirmHeight - safePadding);

    return {
      left,
      top,
      arrowLeft: clamp(triggerCenterX - left, 14, popconfirmWidth - 14),
      placement
    };
  };

  const selectResolutionFeedback = (
    value: Exclude<AnswerResolutionFeedback, null>,
    triggerElement?: HTMLButtonElement
  ) => {
    setAnswerFeedback(null);
    setIsFeedbackDialogOpen(false);
    setSelectedFeedbackReasons([]);
    setFeedbackText("");
    if (value === "resolved") {
      closeResolutionPopconfirm();
      setAnswerResolutionFeedback((current) => (current === value ? null : value));
      return;
    }

    if (triggerElement && typeof window !== "undefined") {
      setResolutionPopconfirmPosition(getResolutionPopconfirmPosition(triggerElement));
    }

    setPendingResolutionFeedback(value);
    setSelectedResolutionReasons([]);
    setResolutionFeedbackText("");
  };

  const confirmResolutionFeedback = () => {
    if (!pendingResolutionFeedback) return;
    setAnswerResolutionFeedback(pendingResolutionFeedback);
    closeResolutionPopconfirm();
  };

  const toggleResolutionReason = (reason: string) => {
    setSelectedResolutionReasons((current) =>
      current.includes(reason) ? current.filter((item) => item !== reason) : [...current, reason]
    );
  };

  const toggleFeedbackReason = (reason: string) => {
    setSelectedFeedbackReasons((current) =>
      current.includes(reason) ? current.filter((item) => item !== reason) : [...current, reason]
    );
  };

  const submitDislikeFeedback = (event: ReactFormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmitDislikeFeedback) return;

    setAnswerFeedback("disliked");
    setIsFeedbackDialogOpen(false);
    setSelectedFeedbackReasons([]);
    setFeedbackText("");
  };

  const showGlobalToast = (message: string) => {
    if (globalToastTimerRef.current !== null) {
      window.clearTimeout(globalToastTimerRef.current);
    }

    setGlobalToast({
      id: Date.now(),
      message
    });

    globalToastTimerRef.current = window.setTimeout(() => {
      setGlobalToast(null);
      globalToastTimerRef.current = null;
    }, 1800);
  };

  const writeMarkdownToClipboard = async (markdown: string) => {
    const writePlainTextWithSelection = () => {
      const textarea = document.createElement("textarea");
      textarea.value = markdown;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.top = "-9999px";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    };

    if (!navigator.clipboard) {
      writePlainTextWithSelection();
      return;
    }

    if (typeof ClipboardItem !== "undefined" && navigator.clipboard.write) {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/markdown": new Blob([markdown], { type: "text/markdown" }),
            "text/plain": new Blob([markdown], { type: "text/plain" })
          })
        ]);
        return;
      } catch {
        // Some browsers reject custom clipboard MIME types; plain markdown text still supports direct paste.
      }
    }

    try {
      await navigator.clipboard.writeText(markdown);
    } catch {
      writePlainTextWithSelection();
    }
  };

  const copyActiveAnswer = async (run = activeRun) => {
    if (!run) return;

    await writeMarkdownToClipboard(run.conclusionMarkdown);
    showGlobalToast("复制成功");
  };

  const regenerateActiveAnswer = (run = activeRun) => {
    if (!run) return;

    const now = new Date().toISOString();
    shouldFollowChatRef.current = true;
    hasUserInterruptedChatScrollRef.current = false;
    setIsChatAtBottom(true);
    setAnswerFeedback(null);
    setAnswerResolutionFeedback(null);
    setIsFeedbackDialogOpen(false);
    setSelectedFeedbackReasons([]);
    setFeedbackText("");
    setPendingResolutionFeedback(null);
    setResolutionPopconfirmPosition(null);
    setSelectedResolutionReasons([]);
    setResolutionFeedbackText("");
    setIsResolutionThanksVisible(false);
    setIsSourceDrawerOpen(false);

    setConversationRuns((currentRuns) =>
      currentRuns.map((currentRun) =>
        currentRun.id === run.id
          ? {
              ...currentRun,
              createdAt: now,
              completedAt: undefined,
              conclusionMarkdown: buildConversationConclusionMarkdown(activeAgent, currentRun.question),
              conclusionVisibleLength: 0,
              stage: "thinking",
              visibleSteps: 0,
              responseStarted: false,
              isThinkingExpanded: true,
              isStopped: false
            }
          : currentRun
      )
    );
  };

  const fillFollowUpQuestion = (question: string) => {
    setDraft(question);
    setFileMentionRange(null);
    setComposerFiles([]);
    window.requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const getFilesPanelAvailableWidth = () => {
    const mainLeft = mainRef.current?.getBoundingClientRect().left ?? 0;
    return Math.max(0, window.innerWidth - mainLeft - FILES_PANEL_INSET * 2);
  };

  const getFilesPanelWidthByRatio = (ratio: number) => Math.round(getFilesPanelAvailableWidth() * ratio);

  const getFilesPanelMinWidth = () => getFilesPanelWidthByRatio(FILES_PANEL_MIN_RATIO);

  const getFilesPanelMaxWidth = () => getFilesPanelWidthByRatio(FILES_PANEL_MAX_RATIO);

  const getFilesPanelDefaultWidth = () => {
    return clamp(getFilesPanelWidthByRatio(FILES_PANEL_DEFAULT_RATIO), getFilesPanelMinWidth(), getFilesPanelMaxWidth());
  };

  const getFilesPanelWidthFromClientX = (clientX: number) => {
    const nextWidth = window.innerWidth - clientX - FILES_PANEL_INSET;
    return clamp(nextWidth, getFilesPanelMinWidth(), getFilesPanelMaxWidth());
  };

  const mainStyle = {
    "--mx": "50%",
    "--my": "50%",
    "--dot-opacity": 0,
    "--moss-files-panel-width": `${filesPanelWidth}px`
  } as CSSProperties;

  const toggleHistoryGroup = (group: HistoryGroupKey) => {
    setExpandedHistoryGroups((prev) => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const toggleFavoriteSession = (sessionId: string) => {
    const targetSession = activeAgentHistories.find((session) => session.id === sessionId);
    setAgentHistories((prev) => ({
      ...prev,
      [activeAgent]: prev[activeAgent].map((session) =>
        session.id === sessionId ? { ...session, isFavorite: !session.isFavorite } : session
      )
    }));
    setOpenHistoryMenu(null);
  };

  const openHistorySession = (session: HistorySession) => {
    if (renamingHistory) return;

    const doneAt = session.updatedAt;
    const question = getHistorySessionQuestion(session);
    const conclusionMarkdown = buildConversationConclusionMarkdown(activeAgent, question);
    shouldFollowChatRef.current = true;
    hasUserInterruptedChatScrollRef.current = false;
    setIsChatAtBottom(true);
    setAnswerFeedback(null);
    setAnswerResolutionFeedback(null);
    setIsFeedbackDialogOpen(false);
    setSelectedFeedbackReasons([]);
    setFeedbackText("");
    if (activeUtilityPanel === "files") {
      setFilesPanelWidth((currentWidth) => Math.max(currentWidth, getFilesPanelDefaultWidth()));
    }
    setCurrentConversationFileNames([]);
    setActiveHistoryId(session.id);
    setIsNewChatActive(false);
    setConversationRuns([{
      id: `history-run-${session.id}`,
      question,
      createdAt: doneAt,
      completedAt: doneAt,
      conclusionMarkdown,
      conclusionVisibleLength: conclusionMarkdown.length,
      stage: "done",
      visibleSteps: buildThinkingChainSteps(activeAgent, question).length,
      responseStarted: true,
      isThinkingExpanded: false,
      isStopped: false,
      actionVariant: getStableActionVariant(session.id)
    }]);
  };

  const startHistoryRename = (session: HistorySession) => {
    shouldSkipHistoryRenameBlurRef.current = false;
    setOpenHistoryMenu(null);
    setRenamingHistory({
      sessionId: session.id,
      value: session.title
    });
  };

  const cancelHistoryRename = () => {
    shouldSkipHistoryRenameBlurRef.current = true;
    setRenamingHistory(null);
  };

  const confirmHistoryRename = (sessionId: string) => {
    const renameState = renamingHistory;
    if (!renameState || renameState.sessionId !== sessionId) return;

    shouldSkipHistoryRenameBlurRef.current = false;
    const nextName = buildSessionTitle(renameState.value);
    const currentTitle = activeAgentHistories.find((session) => session.id === sessionId)?.title;
    setRenamingHistory(null);

    if (!nextName || !currentTitle || nextName === currentTitle) return;

    setAgentHistories((prev) => ({
      ...prev,
      [activeAgent]: prev[activeAgent].map((session) =>
        session.id === sessionId
          ? {
              ...session,
              title: nextName,
              question: session.question ?? (activeHistoryId === sessionId ? activeRun?.question ?? session.title : session.title)
            }
          : session
      )
    }));
  };

  const deleteHistoryItem = (sessionId: string) => {
    if (renamingHistory?.sessionId === sessionId) {
      setRenamingHistory(null);
    }
    setAgentHistories((prev) => ({
      ...prev,
      [activeAgent]: prev[activeAgent].filter((session) => session.id !== sessionId)
    }));
    if (activeHistoryId === sessionId) {
      setActiveHistoryId(null);
      setIsNewChatActive(true);
    }
    setOpenHistoryMenu(null);
  };

  const renderHistoryMenu = (session: HistorySession, menuPosition?: Pick<HistoryMenuState, "left" | "top">) => {
    const isFavoriteGroup = session.isFavorite;
    const menu = (
      <div
        ref={historyMenuRef}
        className="history-item-menu"
        role="menu"
        style={menuPosition ? { left: `${menuPosition.left}px`, top: `${menuPosition.top}px` } : undefined}
      >
        <button
          type="button"
          className="history-item-menu-option"
          onClick={() => startHistoryRename(session)}
        >
          <span className="history-item-menu-icon" aria-hidden="true">
            <Icon name="bianji" />
          </span>
          <span>重命名</span>
        </button>
        <button
          type="button"
          className="history-item-menu-option"
          onClick={() => toggleFavoriteSession(session.id)}
        >
          <span className="history-item-menu-icon" aria-hidden="true">
            <Icon name={isFavoriteGroup ? "quxiaoshoucang" : "shoucang"} />
          </span>
          <span>{isFavoriteGroup ? "取消收藏" : "收藏"}</span>
        </button>
        <button
          type="button"
          className="history-item-menu-option danger"
          onClick={() => deleteHistoryItem(session.id)}
        >
          <span className="history-item-menu-icon" aria-hidden="true">
            <Icon name="shanchu" />
          </span>
          <span>删除</span>
        </button>
      </div>
    );

    return menuPosition ? createPortal(menu, document.body) : menu;
  };

  const showCollapsedTooltip = (label: string, rect: DOMRect) => {
    if (openCollapsedPopover) return;
    setCollapsedTooltip({
      label,
      left: rect.right + 10,
      top: rect.top + rect.height / 2
    });
  };

  const hideCollapsedTooltip = () => {
    setCollapsedTooltip((current) => (current ? null : current));
  };

  const toggleCollapsedPopover = (type: CollapsedPopoverType, event: ReactMouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setCollapsedTooltip(null);
    setOpenCollapsedPopover((current) =>
      current?.type === type
        ? null
        : {
            type,
            left: rect.right + 10,
            top: Math.max(16, rect.top - 4)
          }
    );
  };

  const toggleUtilityPanel = (panel: Exclude<UtilityPanel, null>) => {
    if (panel === "files" && activeUtilityPanel !== "files") {
      setFilesPanelWidth(getFilesPanelDefaultWidth());
    }
    setActiveUtilityPanel((current) => (current === panel ? null : panel));
    setOpenHistoryMenu(null);
    setRenamingHistory(null);
    setOpenCollapsedPopover(null);
    setCollapsedTooltip(null);
  };

  const scrollPromptTabs = () => {
    const track = tabsTrackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    const shouldRestart = maxScroll - track.scrollLeft < 8;
    track.scrollTo({
      left: shouldRestart ? 0 : Math.min(track.scrollLeft + 112, maxScroll),
      behavior: "smooth"
    });
  };

  const showUploadTooltip = (rect: DOMRect) => {
    setUploadTooltip({
      left: rect.left + rect.width / 2,
      top: rect.top - 4
    });
  };

  const hideUploadTooltip = () => {
    setUploadTooltip(null);
  };

  const startUploadProgress = (fileId: string, bytes: number) => {
    if (uploadProgressTimersRef.current[fileId]) {
      window.clearInterval(uploadProgressTimersRef.current[fileId]);
    }

    const startedAt = performance.now();
    const duration = getUploadSimulationDuration(bytes);

    uploadProgressTimersRef.current[fileId] = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const progress = Math.min(100, Math.round((elapsed / duration) * 100));

      setComposerFiles((current) =>
        current.map((item) =>
          item.id === fileId
            ? {
                ...item,
                uploadProgress: progress,
                isUploading: progress < 100
              }
            : item
        )
      );

      if (progress >= 100) {
        window.clearInterval(uploadProgressTimersRef.current[fileId]);
        delete uploadProgressTimersRef.current[fileId];
      }
    }, 80);
  };

  const addComposerFile = (file: Omit<ComposerFileAttachment, "id"> & { id?: string }) => {
    setComposerFiles((current) => {
      if (current.some((item) => item.name === file.name && item.source === file.source)) {
        return current;
      }

      return [
        ...current,
        {
          id: file.id ?? `${file.source}-${file.name}-${Date.now()}`,
          name: file.name,
          icon: file.icon,
          size: file.size,
          uploadProgress: file.uploadProgress,
          isUploading: file.isUploading,
          source: file.source
        }
      ];
    });
  };

  const removeComposerFile = (fileId: string) => {
    if (uploadProgressTimersRef.current[fileId]) {
      window.clearInterval(uploadProgressTimersRef.current[fileId]);
      delete uploadProgressTimersRef.current[fileId];
    }

    setComposerFiles((current) => current.filter((file) => file.id !== fileId));
  };

  const removeComposerReferenceByName = (fileName: string) => {
    setDraft((current) => removeComposerReferenceFromText(current, fileName).trimStart());
    setComposerFiles((current) => current.filter((file) => file.source !== "reference" || file.name !== fileName));
    setFileMentionRange(null);
    window.requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const addFilesToFilesPanel = (uploadedFiles: File[], options?: { markAsCurrentConversation?: boolean }) => {
    if (uploadedFiles.length === 0) return [];

    const existingNames = new Set(files.map((file) => file.name.toLowerCase()));
    const appended = uploadedFiles.map((file) => {
      const uniqueName = getUniqueFileName(file.name, existingNames);
      existingNames.add(uniqueName.toLowerCase());
      return {
        name: uniqueName,
        size: formatFileSize(file.size),
        icon: getFileCoverIcon(uniqueName)
      };
    });

    setFiles((current) => {
      return [...appended, ...current];
    });

    if (options?.markAsCurrentConversation) {
      setCurrentConversationFileNames((current) => Array.from(new Set([...current, ...appended.map((file) => file.name)])));
    }

    return appended;
  };

  const onUploadFiles = (event: ReactChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files ?? []);
    const existingUploadNames = new Set(uploadComposerFiles.map((file) => file.name));

    const appendedFiles = addFilesToFilesPanel(uploadedFiles, { markAsCurrentConversation: true });

    uploadedFiles.forEach((file, index) => {
      const appendedFile = appendedFiles[index];
      if (!appendedFile || existingUploadNames.has(appendedFile.name)) return;
      existingUploadNames.add(appendedFile.name);
      const id = `upload-${appendedFile.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

      addComposerFile({
        id,
        name: appendedFile.name,
        icon: getUploadFileIcon(appendedFile.name),
        size: appendedFile.size,
        uploadProgress: 0,
        isUploading: true,
        source: "upload"
      });
      startUploadProgress(id, file.size);
    });

    event.target.value = "";
    setUploadTooltip(null);
    window.requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const onUploadFilesToFilesPanel = (event: ReactChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files ?? []);
    if (uploadedFiles.length === 0) return;

    addFilesToFilesPanel(uploadedFiles, { markAsCurrentConversation: true });
    event.target.value = "";
    setIsFilesSearchActive(false);
    setFilesSearchQuery("");
  };

  const renderUploadTooltip = () => {
    if (!uploadTooltip) return null;

    return createPortal(
      <div className="upload-tooltip" style={{ left: `${uploadTooltip.left}px`, top: `${uploadTooltip.top}px` }}>
        上传文件
      </div>,
      document.body
    );
  };

  const renderSourceDrawer = () => {
    if (!isSourceDrawerOpen) return null;

    return (
      <div className="source-drawer-layer" role="presentation">
        <div className="source-drawer-mask" aria-hidden="true" />
        <aside className="source-drawer" role="dialog" aria-modal="true" aria-labelledby="source-drawer-title">
          <header className="source-drawer-header">
            <h3 id="source-drawer-title">信息来源</h3>
            <button
              type="button"
              className="source-drawer-close"
              aria-label="关闭"
              onClick={() => setIsSourceDrawerOpen(false)}
            >
              <i className="iconfont icon-guanbi" aria-hidden="true" />
            </button>
          </header>
          <div className="source-drawer-body">
            {INTERNAL_SOURCE_GROUPS.map((group) => (
              <section className="source-section source-section-internal" key={group.title}>
                <div className="source-section-title">
                  <span className="source-section-accent" aria-hidden="true" />
                  <span>{group.title}</span>
                </div>
                <div className="source-internal-list">
                  {group.items.map((item) => (
                    <div className="source-internal-item" key={item}>
                      <span className="source-check-icon" aria-hidden="true" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
            <section className="source-section source-section-external">
              <button
                type="button"
                className="source-section-title source-section-toggle"
                aria-expanded={isExternalSourcesExpanded}
                onClick={() => setIsExternalSourcesExpanded((isExpanded) => !isExpanded)}
              >
                <span className="source-section-accent" aria-hidden="true" />
                <span>外部来源</span>
                <span className="source-section-caret" aria-hidden="true">
                  <Icon name="jiantou_xiangxia" />
                </span>
              </button>
              {isExternalSourcesExpanded ? (
                <div className="source-external-list">
                  {EXTERNAL_SOURCES.map((source, index) => (
                    <article className="source-external-card" key={`${source.domain}-${index}`}>
                      <div className="source-external-meta">
                        <span className="source-index">{index + 1}</span>
                        <img className="source-favicon" src={source.icon} alt="" aria-hidden="true" />
                        <span className="source-domain">{source.domain}</span>
                      </div>
                      <h4>{source.title}</h4>
                      <p>{source.summary}</p>
                    </article>
                  ))}
                </div>
              ) : null}
            </section>
          </div>
        </aside>
      </div>
    );
  };

  const renderFeedbackDialog = () => {
    if (!isFeedbackDialogOpen) return null;

    return createPortal(
      <div className="feedback-dialog-backdrop" role="presentation">
        <form
          className="feedback-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-dialog-title"
          onSubmit={submitDislikeFeedback}
        >
          <div className="feedback-dialog-header">
            <h3 id="feedback-dialog-title">谢谢你的反馈，我们会继续优化进步</h3>
            <button type="button" className="feedback-dialog-close" aria-label="关闭" onClick={closeFeedbackDialog}>
              <i className="iconfont icon-guanbi" aria-hidden="true" />
            </button>
          </div>
          <div className="feedback-dialog-body">
            <div className="feedback-reason-grid">
              {DISLIKE_FEEDBACK_OPTIONS.map((reason) => (
                <label key={reason} className="feedback-reason-option">
                  <input
                    type="checkbox"
                    checked={selectedFeedbackReasons.includes(reason)}
                    onChange={() => toggleFeedbackReason(reason)}
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
            <textarea
              className="feedback-dialog-textarea"
              placeholder="其他我想吐槽的"
              value={feedbackText}
              onChange={(event) => setFeedbackText(event.target.value)}
            />
          </div>
          <div className="feedback-dialog-footer">
            <button type="button" className="feedback-dialog-button secondary" onClick={closeFeedbackDialog}>
              取消
            </button>
            <button type="submit" className="feedback-dialog-button primary" disabled={!canSubmitDislikeFeedback}>
              确定
            </button>
          </div>
        </form>
      </div>,
      document.body
    );
  };

  const renderGlobalToast = () => {
    if (!globalToast) return null;

    return createPortal(
      <div key={globalToast.id} className="global-toast" role="status" aria-live="polite">
        <span className="global-toast-icon" aria-hidden="true">
          <Icon name="toasttishi_chenggong_mian" />
        </span>
        <span className="global-toast-message">{globalToast.message}</span>
      </div>,
      document.body
    );
  };

  const renderResolutionPopconfirm = () => {
    if (isResolutionThanksVisible || !pendingResolutionFeedback || !resolutionPopconfirmPosition) return null;

    return createPortal(
      <form
        className={`chat-resolution-popconfirm is-${resolutionPopconfirmPosition.placement}`}
        aria-label="补充反馈"
        style={
          {
            left: `${resolutionPopconfirmPosition.left}px`,
            top: `${resolutionPopconfirmPosition.top}px`,
            "--chat-resolution-arrow-left": `${resolutionPopconfirmPosition.arrowLeft}px`
          } as CSSProperties
        }
        onSubmit={(event) => {
          event.preventDefault();
          confirmResolutionFeedback();
        }}
      >
        <div className="chat-resolution-popconfirm-arrow" aria-hidden="true" />
        <div className="chat-resolution-popconfirm-body">
          <div className="chat-resolution-reason-grid">
            {DISLIKE_FEEDBACK_OPTIONS.map((reason) => (
              <label key={reason} className="chat-resolution-reason-option">
                <input
                  type="checkbox"
                  checked={selectedResolutionReasons.includes(reason)}
                  onChange={() => toggleResolutionReason(reason)}
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>
          <textarea
            className="chat-resolution-popconfirm-textarea"
            placeholder="其他我想吐槽的"
            value={resolutionFeedbackText}
            onChange={(event) => setResolutionFeedbackText(event.target.value)}
          />
          <div className="chat-resolution-popconfirm-footer">
            <button type="button" className="chat-resolution-popconfirm-button secondary" onClick={closeResolutionPopconfirm}>
              取消
            </button>
            <button type="submit" className="chat-resolution-popconfirm-button primary">
              确定
            </button>
          </div>
        </div>
      </form>,
      document.body
    );
  };

  const quoteFileToComposer = (fileName: string) => {
    if (referenceComposerFiles.some((item) => item.name === fileName)) {
      window.requestAnimationFrame(() => textareaRef.current?.focus());
      return;
    }

    const referenceId = `reference-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    let nextCursor = 0;
    addComposerFile({
      id: referenceId,
      name: fileName,
      icon: getUploadFileIcon(fileName),
      source: "reference"
    });
    setDraft((current) => {
      const marker = `${COMPOSER_REFERENCE_START}${fileName}${COMPOSER_REFERENCE_END}`;
      const nextDraft = current ? `${current} ${marker}` : marker;
      nextCursor = nextDraft.length;
      return nextDraft;
    });
    setOpenFileMenu(null);
    setFileMentionRange(null);
    window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(nextCursor, nextCursor);
    });
  };

  const handleComposerChange = (event: ReactChangeEvent<HTMLTextAreaElement>) => {
    const nextDraft = event.target.value;
    const cursor = event.target.selectionStart ?? nextDraft.length;
    const mentionRange = getFileMentionRange(nextDraft, cursor) ?? getFileMentionRange(nextDraft, nextDraft.length);
    const nextReferenceNames = getComposerReferenceNames(nextDraft);

    setDraft(nextDraft);
    setComposerFiles((current) =>
      current.filter((file) => file.source !== "reference" || nextReferenceNames.has(file.name))
    );
    setFileMentionRange(mentionRange);
  };

  const insertComposerText = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextDraft = `${draft.slice(0, start)}${text}${draft.slice(end)}`;
    const nextCursor = start + text.length;

    setDraft(nextDraft);
    setFileMentionRange(getFileMentionRange(nextDraft, nextCursor));

    window.requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(nextCursor, nextCursor);
    });
  };

  const handleComposerBeforeInput = (event: ReactFormEvent<HTMLTextAreaElement>) => {
    const nativeEvent = event.nativeEvent as InputEvent;
    if (nativeEvent.inputType !== "insertText" || nativeEvent.data !== "@") return;

    event.preventDefault();
    insertComposerText("@");
  };

  const syncComposerMentionRange = (event: ReactKeyboardEvent<HTMLTextAreaElement> | ReactMouseEvent<HTMLTextAreaElement>) => {
    const textarea = event.currentTarget;
    setFileMentionRange(getFileMentionRange(textarea.value, textarea.selectionStart));
  };

  const handleComposerKeyUp = (event: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    const shouldSyncMentionRange = ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key);
    if (!shouldSyncMentionRange) return;

    syncComposerMentionRange(event);
  };

  const selectMentionFile = (fileName: string) => {
    if (!fileMentionRange) return;

    const referenceId = `reference-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    addComposerFile({
      id: referenceId,
      name: fileName,
      icon: getUploadFileIcon(fileName),
      source: "reference"
    });
    const marker = `${COMPOSER_REFERENCE_START}${fileName}${COMPOSER_REFERENCE_END}`;
    const nextCursor = fileMentionRange.start + marker.length;
    setDraft((current) => `${current.slice(0, fileMentionRange.start)}${marker}${current.slice(fileMentionRange.end)}`);
    setFileMentionRange(null);

    window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(nextCursor, nextCursor);
    });
  };

  const handleComposerKeyDown = (event: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    const nativeEvent = event.nativeEvent as KeyboardEvent;
    const isComposing = nativeEvent.isComposing || nativeEvent.keyCode === 229;

    if (event.key === "@") {
      event.preventDefault();
      insertComposerText("@");
      return;
    }

    if (event.key === "Backspace" || event.key === "Delete") {
      const mode = event.key === "Backspace" ? "backspace" : "delete";
      const cursor = event.currentTarget.selectionStart;
      const selectionEnd = event.currentTarget.selectionEnd;
      const targetReference = cursor === selectionEnd ? getComposerReferenceAtCursor(draft, cursor, mode) : null;

      if (targetReference) {
        event.preventDefault();
        setDraft((current) => `${current.slice(0, targetReference.start)}${current.slice(targetReference.end)}`);
        setComposerFiles((current) =>
          current.filter((file) => file.source !== "reference" || file.name !== targetReference.name)
        );
        setFileMentionRange(null);

        window.requestAnimationFrame(() => {
          textareaRef.current?.setSelectionRange(targetReference.start, targetReference.start);
        });
        return;
      }
    }

    if (!fileMentionRange && event.key === "Enter" && !event.shiftKey && !isComposing) {
      event.preventDefault();
      onSend();
      return;
    }

    if (!fileMentionRange) return;

    if (event.key === "Escape") {
      event.preventDefault();
      setFileMentionRange(null);
      return;
    }

    if (mentionFiles.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveFileMentionIndex((current) => (current + 1) % mentionFiles.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveFileMentionIndex((current) => (current - 1 + mentionFiles.length) % mentionFiles.length);
      return;
    }

    if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault();
      selectMentionFile(mentionFiles[activeFileMentionIndex]?.name ?? mentionFiles[0].name);
    }
  };

  const renderComposerFiles = () => {
    if (uploadComposerFiles.length === 0) return null;

    return (
      <div className="composer-file-tags" aria-label="已上传文件">
        {uploadComposerFiles.map((file) => (
          <span
            key={file.id}
            className={file.isUploading ? "composer-file-tag uploading" : "composer-file-tag"}
            style={{ "--upload-progress": `${file.uploadProgress ?? 100}%` } as CSSProperties}
          >
            <img className="composer-file-tag-icon" src={getUploadFileIcon(file.name)} alt="" />
            <span className="composer-file-tag-content">
              <span className="composer-file-tag-name">{file.name}</span>
              {file.size ? <span className="composer-file-tag-size">{file.size}</span> : null}
            </span>
            <button
              type="button"
              className="composer-file-tag-remove"
              aria-label={`移除${file.name}`}
              onClick={() => removeComposerFile(file.id)}
            >
              <i className="iconfont icon-guanbi" aria-hidden="true" />
            </button>
          </span>
        ))}
      </div>
    );
  };

  const renderComposerRichPreview = () => {
    if (referenceComposerFiles.length === 0) return null;

    const nodes: Array<
      { type: "text"; value: string } | { type: "reference"; name: string; start: number; end: number }
    > = [];
    let lastIndex = 0;

    draft.replace(COMPOSER_REFERENCE_PATTERN, (match, name: string, offset: number) => {
      if (offset > lastIndex) {
        nodes.push({ type: "text", value: draft.slice(lastIndex, offset) });
      }

      nodes.push({
        type: "reference",
        name,
        start: offset,
        end: offset + match.length
      });
      lastIndex = offset + match.length;
      return match;
    });

    if (lastIndex < draft.length) {
      nodes.push({ type: "text", value: draft.slice(lastIndex) });
    }

    return (
      <div className="composer-rich-preview" aria-hidden="true">
        {nodes.map((node, index) => {
          if (node.type === "text") {
            return node.value ? <span key={`text-${index}`}>{node.value}</span> : null;
          }

          const referenceFile = composerFiles.find((item) => item.source === "reference" && item.name === node.name);
          const fileName = referenceFile?.name ?? node.name;
          const removeReferenceFromComposer = () => {
            setDraft((current) => `${current.slice(0, node.start)}${current.slice(node.end)}`);
            setComposerFiles((current) => {
              const targetIndex = current.findIndex((file) => file.source === "reference" && file.name === node.name);
              if (targetIndex === -1) return current;
              return current.filter((_, idx) => idx !== targetIndex);
            });
            setFileMentionRange(null);
            window.requestAnimationFrame(() => {
              textareaRef.current?.focus();
              textareaRef.current?.setSelectionRange(node.start, node.start);
            });
          };

          return (
            <button
              key={`reference-${node.name}-${index}`}
              type="button"
              className="composer-reference-chip"
              aria-label={`移除引用文件 ${fileName}`}
              onMouseDown={(event) => event.preventDefault()}
              onKeyDown={(event) => {
                if (event.key !== "Delete" && event.key !== "Backspace") return;
                event.preventDefault();
                removeReferenceFromComposer();
              }}
              onClick={removeReferenceFromComposer}
            >
              <span className="composer-reference-chip-icon-wrap" aria-hidden="true">
                <img className="composer-reference-chip-icon" src={referenceFile?.icon ?? getUploadFileIcon(fileName)} alt="" />
                <i className="iconfont icon-guanbi composer-reference-chip-close-icon" />
              </span>
              <span className="composer-reference-chip-name">{fileName}</span>
            </button>
          );
        })}
      </div>
    );
  };

  const renderFileMentionPanel = () => {
    if (!fileMentionRange) return null;

    return (
      <div ref={fileMentionPanelRef} className="file-mention-panel" role="listbox" aria-label="引用个人文件">
        <div className="file-mention-list">
          <div className="file-mention-title">引用个人文件</div>
          {mentionFiles.length > 0 ? (
            mentionFiles.map((file, index) => (
              <button
                key={file.name}
                type="button"
                className={activeFileMentionIndex === index ? "file-mention-item active" : "file-mention-item"}
                role="option"
                aria-selected={activeFileMentionIndex === index}
                onMouseEnter={() => setActiveFileMentionIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectMentionFile(file.name)}
              >
                <img className="file-mention-icon" src={getUploadFileIcon(file.name)} alt="" />
                <span className="file-mention-name">{file.name}</span>
              </button>
            ))
          ) : (
            <div className="file-mention-empty">暂无匹配文件</div>
          )}
        </div>
        <div className="file-mention-footer" aria-hidden="true">
          <span className="file-mention-footer-item">
            <Icon name="daohang" />
            <span>导航</span>
          </span>
          <span className="file-mention-footer-item">
            <Icon name="xuanze" />
            <span>选择</span>
          </span>
          <span className="file-mention-footer-item">
            <Icon name="guanbi1" />
            <span>关闭</span>
          </span>
        </div>
      </div>
    );
  };

  const openRenamePopoverAt = (fileName: string, left: number, top: number) => {
    const { baseName } = splitFileNameExtension(fileName);
    const position = getRenamePopoverPosition(left, top);
    setOpenFileMenu(null);
    setOpenFileRenamePopover({
      fileName,
      value: baseName,
      left: position.left,
      top: position.top
    });
  };

  const openRenamePopover = (fileName: string) => {
    if (!openFileMenu) return;
    openRenamePopoverAt(fileName, openFileMenu.left, openFileMenu.top);
  };

  const deleteFile = (fileName: string) => {
    setFiles((current) => current.filter((file) => file.name !== fileName));
    setComposerFiles((current) => current.filter((file) => file.source !== "reference" || file.name !== fileName));
    setCurrentConversationFileNames((current) => current.filter((name) => name !== fileName));
    setDraft((current) => removeComposerReferenceFromText(current, fileName));
    setOpenFileMenu(null);
    setOpenFileRenamePopover(null);
    setInlineFileRename(null);
    setFileMarkdownByName((current) => {
      const next = { ...current };
      delete next[fileName];
      return next;
    });
    setEditingFileName((current) => (current === fileName ? null : current));
    setEditingFileDraft((current) => (editingFileName === fileName ? "" : current));
    if (activeFileDetailName === fileName) {
      setActiveFileDetailName(null);
    }
  };

  const getFileDetailText = (fileName: string) => fileMarkdownByName[fileName] ?? DEFAULT_FILE_MARKDOWN;

  const downloadFile = (fileName: string) => {
    const blob = new Blob([getFileDetailText(fileName)], { type: getFileMimeType(fileName) });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setOpenFileMenu(null);
  };

  const markFileEditing = (fileName: string) => {
    if (!isFileEditable(fileName)) return;

    setOpenFileMenu(null);
    setEditingFileName(fileName);
    setEditingFileDraft(getFileDetailText(fileName));
  };

  const applyFileRename = (previousName: string, value: string) => {
    const { baseName: previousBaseName, extension } = splitFileNameExtension(previousName);
    const nextBaseName = normalizeRenameBaseName(value, previousBaseName);
    const nextName = `${nextBaseName}${extension}`;

    setFiles((current) =>
      current.map((file) =>
        file.name === previousName
          ? {
              ...file,
              name: nextName,
              icon: getFileCoverIcon(nextName)
            }
          : file
      )
    );
    setComposerFiles((current) =>
      current.map((file) =>
        file.source === "reference" && file.name === previousName
          ? {
              ...file,
              name: nextName,
              icon: getUploadFileIcon(nextName)
            }
          : file
      )
    );
    setCurrentConversationFileNames((current) =>
      current.map((fileName) => (fileName === previousName ? nextName : fileName))
    );
    setDraft((current) =>
      current.replace(
        new RegExp(`${COMPOSER_REFERENCE_START}${escapeRegExp(previousName)}${COMPOSER_REFERENCE_END}`, "g"),
        `${COMPOSER_REFERENCE_START}${nextName}${COMPOSER_REFERENCE_END}`
      )
    );
    setFileMarkdownByName((current) => {
      const next = { ...current };
      next[nextName] = current[previousName] ?? DEFAULT_FILE_MARKDOWN;
      if (previousName !== nextName) {
        delete next[previousName];
      }
      return next;
    });
    setActiveFileDetailName((current) => (current === previousName ? nextName : current));
    setEditingFileName((current) => (current === previousName ? nextName : current));
    return nextName;
  };

  const confirmFileRename = (event: ReactFormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!openFileRenamePopover) return;

    applyFileRename(openFileRenamePopover.fileName, openFileRenamePopover.value);
    setOpenFileRenamePopover(null);
  };

  const startInlineFileRename = (fileName: string) => {
    const { baseName } = splitFileNameExtension(fileName);
    setOpenFileMenu(null);
    setOpenFileRenamePopover(null);
    setInlineFileRename({
      fileName,
      value: baseName,
      left: 0,
      top: 0
    });
  };

  const confirmInlineFileRename = (event: ReactFormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inlineFileRename) return;

    applyFileRename(inlineFileRename.fileName, inlineFileRename.value);
    setInlineFileRename(null);
  };

  const saveFileMarkdownEdit = () => {
    if (!editingFileName) return;

    setFileMarkdownByName((current) => ({
      ...current,
      [editingFileName]: editingFileDraft
    }));
    setEditingFileName(null);
  };

  const renderFileRenamePopover = () => {
    if (!openFileRenamePopover) return null;

    return createPortal(
      <form
        ref={fileRenamePopoverRef}
        className="file-rename-popover"
        style={{ left: `${openFileRenamePopover.left}px`, top: `${openFileRenamePopover.top}px` }}
        onSubmit={confirmFileRename}
      >
        <input
          ref={fileRenameInputRef}
          className="file-rename-input"
          value={openFileRenamePopover.value}
          onChange={(event) =>
            setOpenFileRenamePopover((current) =>
              current
                ? {
                    ...current,
                    value: event.target.value
                  }
                : current
            )
          }
        />
        <div className="file-rename-actions">
          <button type="button" className="file-rename-button secondary" onClick={() => setOpenFileRenamePopover(null)}>
            取消
          </button>
          <button type="submit" className="file-rename-button primary">
            确定
          </button>
        </div>
      </form>,
      document.body
    );
  };

  const renderFileMenu = () => {
    if (!openFileMenu) return null;

    return createPortal(
      <div
        ref={fileMenuRef}
        className="file-card-menu"
        role="menu"
        style={{ left: `${openFileMenu.left}px`, top: `${openFileMenu.top}px` }}
      >
        {isFileEditable(openFileMenu.fileName) ? (
          <button type="button" className="file-card-menu-option" role="menuitem" onClick={() => markFileEditing(openFileMenu.fileName)}>
            <span className="file-card-menu-icon" aria-hidden="true">
              <Icon name="bianji" />
            </span>
            <span>编辑</span>
          </button>
        ) : null}
        <button type="button" className="file-card-menu-option" role="menuitem" onClick={() => downloadFile(openFileMenu.fileName)}>
          <span className="file-card-menu-icon" aria-hidden="true">
            <Icon name="xiazai" />
          </span>
          <span>下载</span>
        </button>
        <button
          type="button"
          className="file-card-menu-option"
          role="menuitem"
          onClick={() => openRenamePopover(openFileMenu.fileName)}
        >
          <span className="file-card-menu-icon" aria-hidden="true">
            <Icon name="zhongmingming" />
          </span>
          <span>重命名</span>
        </button>
        <button type="button" className="file-card-menu-option danger" role="menuitem" onClick={() => deleteFile(openFileMenu.fileName)}>
          <span className="file-card-menu-icon" aria-hidden="true">
            <Icon name="shanchu" />
          </span>
          <span>删除</span>
        </button>
      </div>,
      document.body
    );
  };

  const startFilesPanelResize = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (isFilesPanelExpanded) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setFilesPanelWidth(getFilesPanelWidthFromClientX(event.clientX));
    setIsFilesPanelResizing(true);
  };

  const onFilesPanelResizerKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setFilesPanelWidth((current) => clamp(current + FILES_PANEL_RESIZE_STEP, getFilesPanelMinWidth(), getFilesPanelMaxWidth()));
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      setFilesPanelWidth((current) => clamp(current - FILES_PANEL_RESIZE_STEP, getFilesPanelMinWidth(), getFilesPanelMaxWidth()));
    }
  };

  const renderFilesPanelResizer = () => {
    if (activeUtilityPanel !== "files" || isFilesPanelExpanded) return null;

    return (
      <div
        className="files-panel-resizer"
        role="separator"
        aria-label="调整我的文件面板宽度"
        aria-orientation="vertical"
        aria-valuemin={getFilesPanelMinWidth()}
        aria-valuemax={getFilesPanelMaxWidth()}
        aria-valuenow={filesPanelWidth}
        tabIndex={0}
        onPointerDown={startFilesPanelResize}
        onKeyDown={onFilesPanelResizerKeyDown}
      />
    );
  };

  const renderFilesPanel = () => {
    if (activeUtilityPanel !== "files") return null;

    return (
      <aside className={isFilesPanelExpanded ? "files-panel expanded" : "files-panel"} aria-label="我的文件">
        <div className="files-panel-header">
          <div className="files-panel-title">
            <img className="files-panel-title-icon" src={myFilesColorIcon} alt="" />
            <h3>我的文件</h3>
          </div>
          <div className="files-panel-header-actions">
            <button
              type="button"
              className="icon-btn files-panel-action"
              aria-label={isFilesPanelExpanded ? "收起文件面板" : "展开文件面板"}
              data-tooltip={isFilesPanelExpanded ? "缩小" : "放大"}
              onClick={() => setIsFilesPanelExpanded((current) => !current)}
            >
              <Icon name={isFilesPanelExpanded ? "shouqi" : "zhankai"} />
            </button>
            <button
              type="button"
              className="icon-btn files-panel-action"
              aria-label="关闭文件面板"
              onClick={() => {
                setActiveFileDetailName(null);
                setEditingFileName(null);
                setEditingFileDraft("");
                setActiveUtilityPanel(null);
              }}
            >
              <i className="iconfont icon-guanbi" aria-hidden="true" />
            </button>
          </div>
        </div>
        {activeFileDetail ? (
          <>
            <div className="files-detail-toolbar">
              {(() => {
                const isEditingActive = editingFileName === activeFileDetail.name;
                const isActiveFileReferenced = referenceComposerFiles.some((file) => file.name === activeFileDetail.name);
                const canEditActiveFile = isFileEditable(activeFileDetail.name);

                return (
                  <>
              <button
                type="button"
                className="icon-btn files-detail-back"
                aria-label="返回文件列表"
                onClick={() => {
                  setActiveFileDetailName(null);
                  setInlineFileRename(null);
                  setEditingFileName(null);
                  setEditingFileDraft("");
                }}
              >
                <Icon name="jiantou_xiangzuo" />
              </button>
              <div className="files-detail-name-group">
                {inlineFileRename?.fileName === activeFileDetail.name ? (
                  <form className="files-detail-inline-rename" onSubmit={confirmInlineFileRename}>
                    <input
                      className="files-detail-inline-rename-input"
                      value={inlineFileRename.value}
                      autoFocus
                      onChange={(event) =>
                        setInlineFileRename((current) =>
                          current
                            ? {
                                ...current,
                                value: event.target.value
                              }
                            : current
                        )
                      }
                      onKeyDown={(event) => {
                        if (event.key !== "Escape") return;
                        event.preventDefault();
                        setInlineFileRename(null);
                      }}
                      onBlur={() => {
                        setInlineFileRename(null);
                      }}
                    />
                  </form>
                ) : (
                  <>
                    <span className="files-detail-name" title={activeFileDetailDisplayName}>
                      {activeFileDetailDisplayName}
                    </span>
                    {isEditingActive ? null : (
                      <button
                        type="button"
                        className="icon-btn files-detail-icon-action"
                        aria-label="重命名"
                        onClick={() => startInlineFileRename(activeFileDetail.name)}
                      >
                        <Icon name="zhongmingming" />
                      </button>
                    )}
                  </>
                )}
              </div>
              {isEditingActive ? (
                <div className="markdown-editor-actions">
                  <button
                    type="button"
                    className="markdown-editor-button"
                    onClick={() => {
                      setEditingFileName(null);
                      setEditingFileDraft("");
                    }}
                  >
                    取消
                  </button>
                  <button type="button" className="markdown-editor-button primary" onClick={saveFileMarkdownEdit}>
                    保存
                  </button>
                </div>
              ) : (
                <>
                  {canEditActiveFile ? (
                    <button
                      type="button"
                      className="icon-btn files-detail-icon-action"
                      aria-label="编辑"
                      onClick={() => {
                        markFileEditing(activeFileDetail.name);
                      }}
                    >
                      <Icon name="bianji" />
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="icon-btn files-detail-icon-action"
                    aria-label="删除"
                    onClick={() => deleteFile(activeFileDetail.name)}
                  >
                    <Icon name="shanchu" />
                  </button>
                  <button
                    type="button"
                    className="icon-btn files-detail-icon-action"
                    aria-label="下载"
                    onClick={() => downloadFile(activeFileDetail.name)}
                  >
                    <Icon name="xiazai" />
                  </button>
                  <button
                    type="button"
                    className={isActiveFileReferenced ? "files-detail-quote-button is-referenced" : "files-detail-quote-button"}
                    aria-label={isActiveFileReferenced ? "取消引用" : "引用到会话"}
                    aria-pressed={isActiveFileReferenced}
                    onClick={() => {
                      if (isActiveFileReferenced) {
                        removeComposerReferenceByName(activeFileDetail.name);
                        return;
                      }

                      quoteFileToComposer(activeFileDetail.name);
                    }}
                  >
                    <Icon name={isActiveFileReferenced ? "quxiaoyinyong" : "yinyongdaohuihua"} />
                    <span>{isActiveFileReferenced ? "取消引用" : "引用到会话"}</span>
                  </button>
                </>
              )}
                  </>
                );
              })()}
            </div>
            <div
              className={
                editingFileName === activeFileDetail.name
                  ? "files-detail-content markdown-editor-mode"
                  : "files-detail-content markdown-preview"
              }
            >
              {editingFileName === activeFileDetail.name ? (
                <textarea
                  className="markdown-editor-textarea"
                  value={editingFileDraft}
                  spellCheck={false}
                  aria-label={`${activeFileDetail.name} Markdown 内容`}
                  onChange={(event) => setEditingFileDraft(event.target.value)}
                />
              ) : (
                <div
                  className="markdown-preview-inner"
                  style={{
                    width: "900px",
                    maxWidth: "100%",
                    margin: "0 auto"
                  }}
                >
                  {renderMarkdown(activeFileMarkdown)}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="files-panel-toolbar">
              <div className="files-panel-segment" role="tablist" aria-label="文件范围">
                {[
                  { key: "all", label: "全部文件" },
                  { key: "current", label: "当前会话" }
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    role="tab"
                    aria-selected={filesPanelScope === item.key}
                    className={filesPanelScope === item.key ? "files-panel-segment-item active" : "files-panel-segment-item"}
                    onClick={() => setFilesPanelScope(item.key as FilesPanelScope)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <span className="files-panel-summary">{filesPanelSummary}</span>
              <div className="files-panel-toolbar-actions">
                {isFilesSearchActive ? (
                  <label ref={filesSearchRef} className="files-panel-search" aria-label="搜索文件">
                    <Icon name="sousuoneibu" />
                    <input
                      ref={filesSearchInputRef}
                      className="files-panel-search-input"
                      type="search"
                      value={filesSearchQuery}
                      placeholder="请输入"
                      onChange={(event) => setFilesSearchQuery(event.target.value)}
                      onBlur={() => {
                        setIsFilesSearchActive(false);
                        setFilesSearchQuery("");
                      }}
                      onKeyDown={(event) => {
                        if (event.key !== "Escape") return;
                        setIsFilesSearchActive(false);
                        setFilesSearchQuery("");
                      }}
                    />
                  </label>
                ) : (
                  <button
                    type="button"
                    className="icon-btn files-panel-action"
                    aria-label="搜索文件"
                    data-tooltip="搜索"
                    onClick={() => setIsFilesSearchActive(true)}
                  >
                    <Icon name="sousuoneibu" />
                  </button>
                )}
                <button
                  type="button"
                  className="icon-btn files-panel-action"
                  aria-label="上传文件"
                  data-tooltip="上传文件"
                  onClick={() => filesPanelFileInputRef.current?.click()}
                >
                  <Icon name="shangchuanwenjian" />
                </button>
                <input
                  ref={filesPanelFileInputRef}
                  hidden
                  type="file"
                  multiple
                  tabIndex={-1}
                  onChange={onUploadFilesToFilesPanel}
                />
              </div>
            </div>
            <div className="files-grid">
              {visibleFiles.map((file) => {
                const isFileReferenced = referenceComposerFiles.some((item) => item.name === file.name);
                const quoteActionLabel = isFileReferenced ? "取消引用" : "引用文件";

                return (
                  <div
                    key={file.name}
                    className={openFileMenu?.fileName === file.name ? "file-card menu-open" : "file-card"}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setActiveFileDetailName(file.name);
                      setEditingFileName(null);
                      setEditingFileDraft("");
                      setOpenFileMenu(null);
                      setIsFilesSearchActive(false);
                      setFilesSearchQuery("");
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter" && event.key !== " ") return;
                      event.preventDefault();
                      setActiveFileDetailName(file.name);
                      setEditingFileName(null);
                      setEditingFileDraft("");
                      setOpenFileMenu(null);
                      setIsFilesSearchActive(false);
                      setFilesSearchQuery("");
                    }}
                  >
                    <span className="file-card-preview">
                      <img src={file.icon} alt="" />
                    </span>
                    <span className="file-card-meta">
                      <span className="file-card-title-row">
                        <span className="file-card-name">{renderHighlightedFileName(file.name, filesSearchQuery)}</span>
                        <span className="file-card-actions" aria-label={`${file.name} 操作`}>
                          <button
                            type="button"
                            className="file-card-action"
                            aria-label={quoteActionLabel}
                            data-tooltip={quoteActionLabel}
                            onClick={(event) => {
                              event.stopPropagation();
                              if (isFileReferenced) {
                                removeComposerReferenceByName(file.name);
                                return;
                              }
                              quoteFileToComposer(file.name);
                            }}
                          >
                            <Icon name={isFileReferenced ? "quxiaoyinyong" : "yinyongdaohuihua"} />
                          </button>
                          <button
                            type="button"
                            className="file-card-action"
                            aria-label="更多"
                            aria-haspopup="menu"
                            aria-expanded={openFileMenu?.fileName === file.name}
                            onClick={(event) => {
                              event.stopPropagation();
                              const rect = event.currentTarget.getBoundingClientRect();
                              const position = getFileCardMenuPosition(rect);
                              setOpenFileMenu({
                                fileName: file.name,
                                left: position.left,
                                top: position.top
                              });
                            }}
                          >
                            <Icon name="gengduo" />
                          </button>
                        </span>
                      </span>
                      <span className="file-card-size">{file.size}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </aside>
    );
  };

  const renderCollapsedTooltip = () => {
    if (!collapsedTooltip) return null;

    return createPortal(
      <div
        className="collapsed-tooltip"
        style={{ left: `${collapsedTooltip.left}px`, top: `${collapsedTooltip.top}px` }}
      >
        {collapsedTooltip.label}
      </div>,
      document.body
    );
  };

  const renderCollapsedHistoryItems = (items: HistorySession[]) => {
    if (items.length === 0) {
      return <div className="collapsed-history-empty">暂无内容</div>;
    }

    return items.map((session) => (
      <button
        key={session.id}
        type="button"
        className={activeHistoryId === session.id ? "collapsed-history-item selected" : "collapsed-history-item"}
        onClick={() => {
          openHistorySession(session);
          setOpenCollapsedPopover(null);
          setCollapsedTooltip(null);
        }}
      >
        <span className="collapsed-history-item-label">{session.title}</span>
      </button>
    ));
  };

  const renderCollapsedHistorySection = (group: HistoryGroupKey, label: string, items: HistorySession[]) => {
    const isExpanded = expandedHistoryGroups[group];

    return (
      <section className="collapsed-history-group" key={group}>
        <button
          type="button"
          className={isExpanded ? "collapsed-history-toggle history-group-header expanded" : "collapsed-history-toggle history-group-header"}
          aria-expanded={isExpanded}
          onClick={() => toggleHistoryGroup(group)}
        >
          <span>{label}</span>
          <span className="history-group-icon" aria-hidden="true">
            <Icon name={isExpanded ? "jiantou_xiangxia" : "jiantou_xiangyou"} />
          </span>
        </button>
        <div
          className={
            isExpanded
              ? "history-collapse-shell collapsed-history-list-shell is-expanded"
              : "history-collapse-shell collapsed-history-list-shell is-collapsed"
          }
          aria-hidden={!isExpanded}
        >
          <div className="collapsed-history-list">{renderCollapsedHistoryItems(items)}</div>
        </div>
      </section>
    );
  };

  const renderCollapsedPopover = () => {
    if (!openCollapsedPopover) return null;

    const content =
      openCollapsedPopover.type === "agent" ? (
        <div className="collapsed-popover-stack">
          {SIDEBAR_AGENT_ITEMS.map((item, index) => {
            const selected = activeAgentIndex === index;
            return (
              <button
                key={item.name}
                type="button"
                className={[
                  "collapsed-popover-item",
                  selected ? "selected" : "",
                  item.disabled ? "disabled" : ""
                ]
                  .filter(Boolean)
                  .join(" ")}
                disabled={item.disabled}
                aria-disabled={item.disabled ? true : undefined}
                onClick={() => {
                  if (item.disabled) return;
                  setActiveAgentIndex(index);
                  setOpenCollapsedPopover(null);
                  setCollapsedTooltip(null);
                }}
              >
                <span className="collapsed-popover-avatar" aria-hidden="true">
                  <img src={item.icon} alt="" />
                </span>
                <span className="collapsed-popover-label">{item.name}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="collapsed-history-panel">
          {openCollapsedPopover.type === "favorites" ? (
            <section className="collapsed-history-group collapsed-history-group-static">
              <div className="collapsed-history-title">收藏</div>
              <div className="collapsed-history-list">{renderCollapsedHistoryItems(historyGroups.favorites)}</div>
            </section>
          ) : (
            <>
              {historyGroups.today.length > 0 ? (
                renderCollapsedHistorySection("today", "今天", historyGroups.today)
              ) : null}
              {historyGroups.yesterday.length > 0 ? (
                renderCollapsedHistorySection("yesterday", "昨天", historyGroups.yesterday)
              ) : null}
              {historyGroups.earlier.length > 0 ? (
                renderCollapsedHistorySection("earlier", "更早", historyGroups.earlier)
              ) : null}
              {historyGroups.today.length === 0 &&
              historyGroups.yesterday.length === 0 &&
              historyGroups.earlier.length === 0 ? (
                <div className="collapsed-history-empty">暂无历史会话</div>
              ) : null}
            </>
          )}
        </div>
      );

    return createPortal(
      <div
        ref={collapsedPopoverRef}
        className="collapsed-popover"
        style={{ left: `${openCollapsedPopover.left}px`, top: `${openCollapsedPopover.top}px` }}
      >
        {content}
      </div>,
      document.body
    );
  };

  const renderHistorySection = (group: HistoryGroupKey, label: string, items: HistorySession[]) => {
    if (items.length === 0) return null;

    const isExpanded = expandedHistoryGroups[group];

    return (
      <section className="side-group history-group" key={group}>
        <button
          type="button"
          className={isExpanded ? "history-group-header expanded" : "history-group-header"}
          aria-expanded={isExpanded}
          onClick={() => toggleHistoryGroup(group)}
        >
          <span>{label}</span>
          <span className="history-group-icon" aria-hidden="true">
            <Icon name={isExpanded ? "jiantou_xiangxia" : "jiantou_xiangyou"} />
          </span>
        </button>
        <div
          className={
            isExpanded
              ? "history-collapse-shell history-group-items-shell is-expanded"
              : "history-collapse-shell history-group-items-shell is-collapsed"
          }
          aria-hidden={!isExpanded}
        >
          <div className="history-group-items">
            {items.map((session) => (
              <div
                key={session.id}
                className={[
                  "history-item-row",
                  openHistoryMenu?.sessionId === session.id ? "menu-open" : "",
                  renamingHistory?.sessionId === session.id ? "is-renaming" : ""
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {renamingHistory?.sessionId === session.id ? (
                  <form
                    className="history-rename-form"
                    onSubmit={(event) => {
                      event.preventDefault();
                      confirmHistoryRename(session.id);
                    }}
                  >
                    <input
                      ref={historyRenameInputRef}
                      className="history-rename-input"
                      aria-label="重命名会话"
                      value={renamingHistory.value}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        setRenamingHistory((current) =>
                          current?.sessionId === session.id ? { ...current, value: nextValue } : current
                        );
                      }}
                      onBlur={() => {
                        if (shouldSkipHistoryRenameBlurRef.current) {
                          shouldSkipHistoryRenameBlurRef.current = false;
                          return;
                        }
                        confirmHistoryRename(session.id);
                      }}
                      onKeyDown={(event) => {
                        if (event.key !== "Escape") return;
                        event.preventDefault();
                        cancelHistoryRename();
                      }}
                    />
                  </form>
                ) : (
                  <>
                    <button
                      type="button"
                      className={activeHistoryId === session.id ? "history-item selected" : "history-item"}
                      onClick={() => {
                        openHistorySession(session);
                        setOpenHistoryMenu(null);
                      }}
                    >
                      <span className="history-item-label">{session.title}</span>
                    </button>
                    <button
                      type="button"
                      className="history-item-more"
                      aria-label="更多"
                      aria-haspopup="menu"
                      aria-expanded={openHistoryMenu?.sessionId === session.id}
                      onClick={(event) => {
                        event.stopPropagation();
                        const rect = event.currentTarget.getBoundingClientRect();
                        setOpenHistoryMenu((prev) =>
                          prev?.sessionId === session.id
                            ? null
                            : {
                                sessionId: session.id,
                                left: rect.left,
                                top: rect.bottom + 4
                              }
                        );
                      }}
                    >
                      <Icon name="gengduo" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const openMenuSession = openHistoryMenu
    ? activeAgentHistories.find((session) => session.id === openHistoryMenu.sessionId) ?? null
    : null;

  return (
    <div className={isSidebarCollapsed ? "app-shell is-collapsed" : "app-shell"}>
      <aside className={isSidebarCollapsed ? "sidebar collapsed" : "sidebar"}>
        <div className="sidebar-main">
          <div className="sidebar-header">
            <h1 className={isSidebarCollapsed ? "brand is-hidden" : "brand"}>Moss · 谋士</h1>
            <button
              type="button"
              className="icon-btn sidebar-toggle"
              aria-label={
                isAutoCollapsed
                  ? `页面宽度小于${SIDEBAR_AUTO_COLLAPSE_BREAKPOINT}px，侧边栏自动收起`
                  : isSidebarCollapsed
                    ? "展开侧边栏"
                    : "收起侧边栏"
              }
              onMouseEnter={(event) =>
                showCollapsedTooltip(
                  isSidebarCollapsed ? "展开侧边栏" : "收起侧边栏",
                  event.currentTarget.getBoundingClientRect()
                )
              }
              onMouseLeave={hideCollapsedTooltip}
              onFocus={(event) =>
                showCollapsedTooltip(
                  isSidebarCollapsed ? "展开侧边栏" : "收起侧边栏",
                  event.currentTarget.getBoundingClientRect()
                )
              }
              onBlur={hideCollapsedTooltip}
              onClick={() => {
                setCollapsedTooltip(null);
                if (isAutoCollapsed) return;
                setCollapsed((prev) => !prev);
              }}
            >
              <Icon name="cebianlan" />
            </button>
          </div>

          <div className="sidebar-body">
            <div
              className={
                isSidebarCollapsed
                  ? "sidebar-panel sidebar-panel-expanded is-hidden"
                  : "sidebar-panel sidebar-panel-expanded is-visible"
              }
              aria-hidden={isSidebarCollapsed}
            >
              <div className="sidebar-content">
                <section className="side-group">
                  <div className="side-label">我的 Agent</div>
                  {SIDEBAR_AGENT_ITEMS.map((item, index) => (
                    <button
                      key={item.name}
                      type="button"
                      className={[
                        "agent-item",
                        activeAgentIndex === index ? "selected" : "",
                        item.disabled ? "disabled" : ""
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      disabled={item.disabled}
                      aria-disabled={item.disabled ? true : undefined}
                      onClick={() => {
                        if (item.disabled) return;
                        setActiveAgentIndex(index);
                      }}
                    >
                      <span className="avatar">
                        <img src={item.icon} alt="" />
                      </span>
                      <span>{item.name}</span>
                    </button>
                  ))}
                </section>

                <div className="divider" />

                <button
                  type="button"
                  className={isNewChatActive ? "new-chat active" : "new-chat"}
                  onClick={activateNewChat}
                >
                  <Icon name="xinhuihua" /> 新会话
                </button>

                {historyGroups.favorites.length > 0
                  ? renderHistorySection("favorites", "收藏", historyGroups.favorites)
                  : null}
                {renderHistorySection("today", "今天", historyGroups.today)}
                {renderHistorySection("yesterday", "昨天", historyGroups.yesterday)}
                {renderHistorySection("earlier", "更早", historyGroups.earlier)}
              </div>
            </div>

            <div
              className={
                isSidebarCollapsed
                  ? "sidebar-panel sidebar-panel-collapsed is-visible"
                  : "sidebar-panel sidebar-panel-collapsed is-hidden"
              }
              aria-hidden={!isSidebarCollapsed}
            >
              <div className="collapsed-stream">
                <button
                  type="button"
                  className="icon-btn nav-icon current-agent-icon"
                  aria-label={activeAgent}
                  aria-haspopup="dialog"
                  aria-expanded={openCollapsedPopover?.type === "agent"}
                  onMouseEnter={(event) => showCollapsedTooltip(activeAgent, event.currentTarget.getBoundingClientRect())}
                  onMouseLeave={hideCollapsedTooltip}
                  onFocus={(event) => showCollapsedTooltip(activeAgent, event.currentTarget.getBoundingClientRect())}
                  onBlur={hideCollapsedTooltip}
                  onClick={(event) => toggleCollapsedPopover("agent", event)}
                >
                  <span className="tiny-avatar">
                    <img src={AGENT_ICON_MAP[activeAgent]} alt="" />
                  </span>
                </button>
                {collapsedNavItems.map(({ icon, label }) => (
                  <button
                    key={icon}
                    type="button"
                    className={[
                      "icon-btn",
                      "nav-icon",
                      icon === "xinhuihua" ? "brand-icon" : "",
                      icon !== "xinhuihua" ? "secondary-nav-icon" : "",
                      icon === "xinhuihua" && isNewChatActive ? "active" : "",
                      icon === "xinhuihua" && isNewChatActive ? "brand-active" : "",
                      icon === "shoucang" &&
                      (openCollapsedPopover?.type === "favorites" || isCollapsedFavoritesSelected)
                        ? "active"
                        : "",
                      icon === "lishihuihua" &&
                      (openCollapsedPopover?.type === "history" || isCollapsedHistorySelected)
                        ? "active"
                        : ""
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-label={label}
                    aria-haspopup={icon === "xinhuihua" ? undefined : "dialog"}
                    aria-expanded={
                      icon === "shoucang"
                        ? openCollapsedPopover?.type === "favorites"
                        : icon === "lishihuihua"
                          ? openCollapsedPopover?.type === "history"
                          : undefined
                    }
                    onMouseEnter={(event) =>
                      showCollapsedTooltip(label, event.currentTarget.getBoundingClientRect())
                    }
                    onMouseLeave={hideCollapsedTooltip}
                    onFocus={(event) =>
                      showCollapsedTooltip(label, event.currentTarget.getBoundingClientRect())
                    }
                    onBlur={hideCollapsedTooltip}
                    onClick={(event) => {
                      if (icon === "xinhuihua") {
                        activateNewChat();
                        setCollapsedTooltip(null);
                        return;
                      }

                      toggleCollapsedPopover(icon === "shoucang" ? "favorites" : "history", event);
                    }}
                  >
                    <Icon name={icon} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          <div
            className={
              isSidebarCollapsed
                ? "sidebar-footer-panel sidebar-footer-expanded is-hidden"
                : "sidebar-footer-panel sidebar-footer-expanded is-visible"
            }
            aria-hidden={isSidebarCollapsed}
          >
            <div className="sidebar-footer-expanded-inner">
              <div className="footer-links-row">
                <div className="footer-links">
                  <button
                    type="button"
                    className={activeUtilityPanel === "files" ? "footer-link active" : "footer-link"}
                    onClick={() => toggleUtilityPanel("files")}
                  >
                    <Icon name="wodewenjian" /> 我的文件
                  </button>
                  <button
                    type="button"
                    className={activeUtilityPanel === "automation" ? "footer-link active" : "footer-link"}
                    onClick={() => toggleUtilityPanel("automation")}
                  >
                    <Icon name="zidonghua" /> 自动化
                  </button>
                </div>
              </div>
              <div className="user-card-row">
                <button type="button" className="user-card" aria-label="admin_username111">
                  <img className="user-avatar-image" src={userAvatar} alt="" />
                  <span className="user-card-name">admin_username111</span>
                </button>
              </div>
            </div>
          </div>

          <div
            className={
              isSidebarCollapsed
                ? "sidebar-footer-panel sidebar-footer-collapsed is-visible"
                : "sidebar-footer-panel sidebar-footer-collapsed is-hidden"
            }
            aria-hidden={!isSidebarCollapsed}
          >
            <div className="sidebar-footer-collapsed-inner">
              <div className="sidebar-footer-collapsed-actions">
                <button
                  type="button"
                  className={
                    activeUtilityPanel === "files"
                      ? "icon-btn nav-icon secondary-nav-icon active"
                      : "icon-btn nav-icon secondary-nav-icon"
                  }
                  aria-label="我的文件"
                  onMouseEnter={(event) => showCollapsedTooltip("我的文件", event.currentTarget.getBoundingClientRect())}
                  onMouseLeave={hideCollapsedTooltip}
                  onFocus={(event) => showCollapsedTooltip("我的文件", event.currentTarget.getBoundingClientRect())}
                  onBlur={hideCollapsedTooltip}
                  onClick={() => toggleUtilityPanel("files")}
                >
                  <Icon name="wodewenjian" />
                </button>
                <button
                  type="button"
                  className={
                    activeUtilityPanel === "automation"
                      ? "icon-btn nav-icon secondary-nav-icon active"
                      : "icon-btn nav-icon secondary-nav-icon"
                  }
                  aria-label="自动化"
                  onMouseEnter={(event) => showCollapsedTooltip("自动化", event.currentTarget.getBoundingClientRect())}
                  onMouseLeave={hideCollapsedTooltip}
                  onFocus={(event) => showCollapsedTooltip("自动化", event.currentTarget.getBoundingClientRect())}
                  onBlur={hideCollapsedTooltip}
                  onClick={() => toggleUtilityPanel("automation")}
                >
                  <Icon name="zidonghua" />
                </button>
              </div>
              <div className="user-card-row user-card-row-collapsed">
                <button type="button" className="user-card user-card-collapsed" aria-label="admin_username111">
                  <img className="user-avatar-image" src={userAvatar} alt="" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
      {renderCollapsedTooltip()}
      {isSidebarCollapsed ? renderCollapsedPopover() : null}

      <main
        ref={mainRef}
        className={[
          "main",
          hasConversation ? "has-conversation-mode" : "",
          activeUtilityPanel ? "has-utility-panel" : "",
          activeUtilityPanel === "files" && isFilesPanelExpanded ? "has-files-panel-expanded" : "",
          isFilesPanelResizing ? "is-files-panel-resizing" : ""
        ]
          .filter(Boolean)
          .join(" ")}
        style={mainStyle}
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          updateSpotlightTarget(event.clientX - rect.left, event.clientY - rect.top, 1);
        }}
        onMouseLeave={() => {
          spotlightTargetRef.current.opacity = 0;
          startSpotlightAnimation();
        }}
      >
        <div
          key={activeAgent}
          className={hasConversation ? "main-content has-conversation" : "main-content"}
          style={conversationContentStyle}
        >
          {hasConversation ? (
            <>
              <header className="conversation-page-header">
                <h3>{buildConversationHeaderTitle(activeHistorySession?.title ?? activeRun?.question ?? "")}</h3>
                <button
                  type="button"
                  className={isCurrentSessionFavorite ? "chat-stage-header-action is-active" : "chat-stage-header-action"}
                  aria-label={isCurrentSessionFavorite ? "取消收藏" : "收藏"}
                  aria-pressed={isCurrentSessionFavorite}
                  data-tooltip={isCurrentSessionFavorite ? "取消收藏" : "收藏"}
                  onClick={() => {
                    if (!activeHistoryId) return;
                    toggleFavoriteSession(activeHistoryId);
                  }}
                >
                  <Icon name={isCurrentSessionFavorite ? "quxiaoshoucang" : "shoucang"} />
                </button>
              </header>
              <section className="chat-stage">
                <div
                  className={isChatAtBottom ? "chat-stage-body is-at-bottom" : "chat-stage-body"}
                  ref={chatStageBodyRef}
                  onScroll={handleChatStageScroll}
                  onWheel={markChatScrollInterrupted}
                  onTouchMove={markChatScrollInterrupted}
                  onPointerDown={(event) => {
                    if (event.currentTarget === event.target) markChatScrollInterrupted();
                  }}
                >
                  <div className="chat-stage-content">
                    {conversationRuns.map((run) => {
                      const isLatestRun = activeRun?.id === run.id;
                      const runIsAnswerComplete =
                        !run.isStopped &&
                        run.stage === "done" &&
                        run.conclusionVisibleLength >= run.conclusionMarkdown.length;
                      const runFollowUpQuestions = buildFollowUpQuestions(activeAgent, run.question);
                      const runThinkingSteps = buildThinkingChainSteps(activeAgent, run.question);

                      return (
                        <div key={run.id} className="chat-turn">
                          <div className="chat-question-row">
                            <span className="chat-time">刚刚</span>
                            <div className="chat-question-bubble">{run.question}</div>
                          </div>
                          {run.responseStarted ? (
                            <div className="chat-answer-row">
                              <div className="chat-answer-meta">
                                <span className="avatar">
                                  <Icon name="huizhi" />
                                </span>
                                <span>{activeAgent}</span>
                                <span className="chat-time">刚刚</span>
                              </div>
                              <div className="chat-thinking-card">
                                {run.stage === "done" ? (
                                  <div className="chat-thinking-summary-line">
                                    <button
                                      type="button"
                                      className={run.isThinkingExpanded ? "chat-thinking-toggle expanded" : "chat-thinking-toggle"}
                                      onClick={() =>
                                        setConversationRuns((currentRuns) =>
                                          currentRuns.map((item) =>
                                            item.id === run.id
                                              ? {
                                                  ...item,
                                                  isThinkingExpanded: !item.isThinkingExpanded
                                                }
                                              : item
                                          )
                                        )
                                      }
                                    >
                                      <span className="chat-thinking-status">
                                        {`全部工作已完成，耗时${formatRunElapsedSeconds(run)}s`}
                                      </span>
                                      <span className="chat-thinking-disclosure-icon" aria-hidden="true">
                                        <Icon name={run.isThinkingExpanded ? "jiantou_xiangxia" : "jiantou_xiangyou"} />
                                      </span>
                                    </button>
                                    <button
                                      type="button"
                                      className="chat-thinking-source-badge"
                                      onClick={() => {
                                        setIsExternalSourcesExpanded(true);
                                        setIsSourceDrawerOpen(true);
                                      }}
                                    >
                                      {`${Math.min(5, runThinkingSteps.length)} 信息来源`}
                                    </button>
                                  </div>
                                ) : (
                                  <div className="chat-thinking-status is-active">
                                    {run.stage === "thinking" ? "正在思考..." : "正在处理中..."}
                                  </div>
                                )}
                                {run.stage !== "thinking" ? (
                                  <div
                                    className={
                                      run.stage === "done" && !run.isThinkingExpanded
                                        ? "chat-thinking-flow-shell is-collapsed"
                                        : "chat-thinking-flow-shell is-expanded"
                                    }
                                    aria-hidden={run.stage === "done" && !run.isThinkingExpanded}
                                  >
                                    <div className="chat-thinking-flow">
                                      {runThinkingSteps.slice(0, run.visibleSteps).map((step, index, steps) => {
                                        const isLoading = run.stage !== "done" && index === steps.length - 1;
                                        return (
                                          <div key={step} className={isLoading ? "chat-thinking-step is-loading" : "chat-thinking-step"}>
                                            <span className="chat-thinking-icon" aria-hidden="true">
                                              {isLoading ? <LoadingSpinnerIcon /> : <Icon name={getThinkingStepIcon(step)} />}
                                            </span>
                                            <span>{step}</span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                              {run.stage === "done" ? (
                                <section
                                  className={
                                    !run.isStopped && run.conclusionVisibleLength < run.conclusionMarkdown.length
                                      ? "chat-conclusion is-streaming"
                                      : "chat-conclusion"
                                  }
                                >
                                  {renderMarkdown(run.conclusionMarkdown.slice(0, run.conclusionVisibleLength))}
                                </section>
                              ) : null}
                              {runIsAnswerComplete && isLatestRun ? (
                                <div className="chat-result-footer">
                                  <div className="chat-result-actions" aria-label="结果操作">
                                    <button
                                      type="button"
                                      className="chat-result-action"
                                      aria-label="复制"
                                      data-tooltip="复制"
                                      onClick={() => void copyActiveAnswer(run)}
                                    >
                                      <Icon name="fuzhi_e792" />
                                    </button>
                                    <button
                                      type="button"
                                      className="chat-result-action"
                                      aria-label="重新生成"
                                      data-tooltip="重新生成"
                                      onClick={() => regenerateActiveAnswer(run)}
                                    >
                                      <Icon name="shuaxin" />
                                    </button>
                                    {run.actionVariant === "resolution" ? (
                                      <div
                                        className={
                                          answerResolutionFeedback
                                            ? "chat-result-resolution has-selection"
                                            : "chat-result-resolution"
                                        }
                                        aria-label="回答解决情况"
                                      >
                                        {isResolutionThanksVisible ? (
                                          <span className="chat-result-resolution-thanks">谢谢你的反馈，我们会继续优化进步</span>
                                        ) : (
                                          <>
                                            <span className="chat-result-resolution-text">是否有解决你的问题？</span>
                                            <button
                                              type="button"
                                              className={
                                                answerResolutionFeedback === "resolved"
                                                  ? "chat-result-resolution-option is-active"
                                                  : "chat-result-resolution-option"
                                              }
                                              aria-pressed={answerResolutionFeedback === "resolved"}
                                              onClick={(event) => selectResolutionFeedback("resolved", event.currentTarget)}
                                            >
                                              <ResolutionIcon type="resolved" selected={answerResolutionFeedback === "resolved"} />
                                              <span>解决了</span>
                                            </button>
                                            <button
                                              type="button"
                                              className={
                                                answerResolutionFeedback === "partial"
                                                  ? "chat-result-resolution-option is-active"
                                                  : "chat-result-resolution-option"
                                              }
                                              aria-pressed={answerResolutionFeedback === "partial"}
                                              onClick={(event) => selectResolutionFeedback("partial", event.currentTarget)}
                                            >
                                              <ResolutionIcon type="partial" selected={answerResolutionFeedback === "partial"} />
                                              <span>部分解决</span>
                                            </button>
                                            <button
                                              type="button"
                                              className={
                                                answerResolutionFeedback === "unresolved"
                                                  ? "chat-result-resolution-option is-active"
                                                  : "chat-result-resolution-option"
                                              }
                                              aria-pressed={answerResolutionFeedback === "unresolved"}
                                              onClick={(event) => selectResolutionFeedback("unresolved", event.currentTarget)}
                                            >
                                              <ResolutionIcon type="unresolved" selected={answerResolutionFeedback === "unresolved"} />
                                              <span>未解决</span>
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    ) : (
                                      <>
                                        {!isFeedbackDialogOpen && answerFeedback !== "disliked" ? (
                                          <button
                                            type="button"
                                            className={
                                              answerFeedback === "liked"
                                                ? "chat-result-action is-feedback is-active"
                                                : "chat-result-action is-feedback"
                                            }
                                            aria-label={answerFeedback === "liked" ? "取消点赞" : "点赞"}
                                            aria-pressed={answerFeedback === "liked"}
                                            data-tooltip="点赞"
                                            onClick={toggleLikeFeedback}
                                          >
                                            <Icon name={answerFeedback === "liked" ? "dianzan_xuanzhong" : "dianzan"} />
                                          </button>
                                        ) : null}
                                        {!isFeedbackDialogOpen && answerFeedback !== "liked" ? (
                                          <button
                                            type="button"
                                            className={
                                              answerFeedback === "disliked"
                                                ? "chat-result-action is-feedback is-active"
                                                : "chat-result-action is-feedback"
                                            }
                                            aria-label={answerFeedback === "disliked" ? "取消点踩" : "点踩"}
                                            aria-pressed={answerFeedback === "disliked"}
                                            data-tooltip="点踩"
                                            onClick={toggleDislikeFeedback}
                                          >
                                            <Icon name={answerFeedback === "disliked" ? "diancai_xuanzhong" : "diancai"} />
                                          </button>
                                        ) : null}
                                      </>
                                    )}
                                  </div>
                                  <div className="chat-followups" aria-label="自动推荐问题">
                                    {runFollowUpQuestions.map((question) => (
                                      <button
                                        key={question}
                                        type="button"
                                        className="chat-followup-chip"
                                        onClick={() => fillFollowUpQuestion(question)}
                                      >
                                        <Icon name="tiaozhuan" />
                                        <span>{question}</span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
              {shouldShowScrollToBottom ? (
                <button
                  type="button"
                  className={
                    isGeneratingResponse
                      ? "chat-scroll-bottom-button is-outputting"
                      : "chat-scroll-bottom-button"
                  }
                  aria-label="滚动到底部"
                  onClick={scrollChatToBottom}
                >
                  <Icon name="jiantou_xiangxia" />
                </button>
              ) : null}
              {renderSourceDrawer()}
            </>
          ) : (
            <>
              <section className="hero">
                {activeAgent === "客户洞察" ? (
                  <h2>
                    <span>三分钟</span>看透目标客户，商机尽在掌握。
                  </h2>
                ) : activeAgent === "风险管理" ? (
                  <h2>
                    风险识别<span>早一步</span>，合作决策更稳妥
                  </h2>
                ) : activeAgent === "舆情监控" ? (
                  <h2>
                    舆情洞若观火，危机响应<span>快人一步</span>
                  </h2>
                ) : (
                  <h2>
                    您的专属<span>商业洞察员</span>，2分钟看透公司和市场趋势
                  </h2>
                )}
              </section>

              <section className="prompt-card">
                <div className="tabs" ref={tabsRef}>
                  <div className="tabs-track" ref={tabsTrackRef}>
                    {visibleTabs.map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        className={activeTab === tab.key ? "tab active" : "tab"}
                        onClick={() => setActiveTab(tab.key)}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  {showTabsMore ? (
                    <button type="button" className="tabs-more" aria-label="查看更多分类" onClick={scrollPromptTabs}>
                      <Icon name="jiantou_xiangyou" />
                    </button>
                  ) : null}
                </div>
                <div className="prompt-list">
                  {prompts.map((item, index) => (
                    <button
                      type="button"
                      key={item}
                      className={activePrompt === index ? "prompt-item active" : "prompt-item"}
                      onClick={() => {
                        setActivePrompt(index);
                        setDraft(item);
                        setFileMentionRange(null);
                        setComposerFiles([]);
                        window.requestAnimationFrame(() => textareaRef.current?.focus());
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}

          <section
            ref={composerRef}
            className={[
              "composer",
              draft.trim() || composerFiles.length > 0 ? "has-content" : "",
              referenceComposerFiles.length > 0 ? "has-references" : ""
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {renderFileMentionPanel()}
            <div className="composer-frame">
              {renderComposerFiles()}
              <div className="composer-input-layer">
                {renderComposerRichPreview()}
                <textarea
                  ref={textareaRef}
                  value={draft}
                  placeholder="描述需求，@引用文件"
                  spellCheck={false}
                  autoCorrect="off"
                  autoCapitalize="off"
                  onBeforeInput={handleComposerBeforeInput}
                  onChange={handleComposerChange}
                  onKeyDown={handleComposerKeyDown}
                  onKeyUp={handleComposerKeyUp}
                  onClick={syncComposerMentionRange}
                />
              </div>
              <div className="composer-actions">
                <input ref={fileInputRef} hidden type="file" multiple tabIndex={-1} onChange={onUploadFiles} />
                <button
                  ref={uploadButtonRef}
                  type="button"
                  className="icon-btn add"
                  aria-label="上传文件"
                  onMouseEnter={(event) => showUploadTooltip(event.currentTarget.getBoundingClientRect())}
                  onMouseLeave={hideUploadTooltip}
                  onFocus={(event) => showUploadTooltip(event.currentTarget.getBoundingClientRect())}
                  onBlur={hideUploadTooltip}
                  onClick={() => {
                    setUploadTooltip(null);
                    fileInputRef.current?.click();
                  }}
                >
                  <Icon name="tianjia" />
                </button>
                <button
                  type="button"
                  className={isGeneratingResponse ? "send-btn is-generating" : "send-btn"}
                  onClick={isGeneratingResponse ? stopGeneratingResponse : onSend}
                  disabled={
                    !isGeneratingResponse &&
                    !getComposerPlainText(draft, composerFiles).trim() &&
                    uploadComposerFiles.length === 0
                  }
                  aria-label={isGeneratingResponse ? "停止生成" : "发送"}
                >
                  <Icon name={isGeneratingResponse ? "tingzhi" : "fasong"} />
                </button>
              </div>
            </div>
          </section>
        </div>
        {renderFilesPanelResizer()}
        {renderFilesPanel()}
      </main>
      {openMenuSession && openHistoryMenu
        ? renderHistoryMenu(openMenuSession, {
            left: openHistoryMenu.left,
            top: openHistoryMenu.top
          })
        : null}
      {renderUploadTooltip()}
      {renderFileMenu()}
      {renderFileRenamePopover()}
      {renderFeedbackDialog()}
      {renderGlobalToast()}
      {renderResolutionPopconfirm()}
    </div>
  );
}

export default App;
