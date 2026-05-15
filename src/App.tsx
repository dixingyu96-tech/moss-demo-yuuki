import {
  ChangeEvent as ReactChangeEvent,
  CSSProperties,
  FormEvent as ReactFormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";
import { DEFAULT_FILE_MARKDOWN, INITIAL_FILE_MARKDOWN } from "./data/fileContents";
import fileMdIcon from "./assets/file-md.png";
import filePanelIcon from "./assets/file-md-title.png";
import filePdfIcon from "./assets/file-pdf.png";
import fileWordIcon from "./assets/file-word.png";
import userAvatar from "./assets/user-avatar.jpg";

type TabKey = "portrait" | "company" | "finance" | "news" | "people";

type PromptMap = Record<TabKey, string[]>;
type HistoryCategory = "today" | "yesterday" | "earlier";
type HistoryGroupKey = "favorites" | HistoryCategory;
type HistorySession = {
  id: string;
  title: string;
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
  ]
};

const AGENTS = ["客户洞察", "风险管理", "商机挖掘"] as const;
type AgentKey = (typeof AGENTS)[number];
type AgentHistoryMap = Record<AgentKey, HistorySession[]>;

const INITIAL_FILES: FileItem[] = [
  { name: "市场调研报告.doc", size: "10.3 KB", icon: fileWordIcon },
  { name: "市场调研报告.md", size: "10.3 KB", icon: fileMdIcon },
  { name: "市场调研报告.pdf", size: "10.3 KB", icon: filePdfIcon }
];

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const SIDEBAR_AUTO_COLLAPSE_BREAKPOINT = 1080;
const FILES_PANEL_DEFAULT_WIDTH = 396;
const FILES_PANEL_MIN_WIDTH = 320;
const FILES_PANEL_MAX_WIDTH = 640;
const FILES_PANEL_INSET = 8;
const FILES_PANEL_MIN_MAIN_WIDTH = 360;
const FILES_PANEL_RESIZE_STEP = 24;
const FILE_CARD_MENU_WIDTH = 112;

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
    createdAt: timestamp,
    updatedAt: timestamp,
    isFavorite
  };
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

function getFileIcon(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (extension === "pdf") return filePdfIcon;
  if (["css", "html", "js", "json", "jsx", "md", "ts", "tsx"].includes(extension ?? "")) return fileMdIcon;
  return fileWordIcon;
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

const INITIAL_AGENT_HISTORIES: AgentHistoryMap = {
  客户洞察: [
    createSession("insight-1", "帆软25年的销售额是多少", 0, 9, 12, true),
    createSession("insight-2", "公司同事的平均年齡大概在多大", 0, 11, 6, true),
    createSession("insight-3", "帆软的客户主要集中在哪些行业…", 0, 14, 18, true),
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
  商机挖掘: [
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
  const [collapsedTooltip, setCollapsedTooltip] = useState<CollapsedTooltipState>(null);
  const [openCollapsedPopover, setOpenCollapsedPopover] = useState<CollapsedPopoverState>(null);
  const [activeUtilityPanel, setActiveUtilityPanel] = useState<UtilityPanel>(null);
  const [isFilesPanelExpanded, setIsFilesPanelExpanded] = useState(false);
  const [filesPanelWidth, setFilesPanelWidth] = useState(FILES_PANEL_DEFAULT_WIDTH);
  const [isFilesPanelResizing, setIsFilesPanelResizing] = useState(false);
  const [isFilesSearchActive, setIsFilesSearchActive] = useState(false);
  const [filesSearchQuery, setFilesSearchQuery] = useState("");
  const [activeFileDetailName, setActiveFileDetailName] = useState<string | null>(null);
  const [inlineFileRename, setInlineFileRename] = useState<FileRenamePopoverState>(null);
  const [editingFileName, setEditingFileName] = useState<string | null>(null);
  const [editingFileDraft, setEditingFileDraft] = useState("");
  const [fileMentionRange, setFileMentionRange] = useState<FileMentionRange>(null);
  const [activeFileMentionIndex, setActiveFileMentionIndex] = useState(0);
  const [composerFiles, setComposerFiles] = useState<ComposerFileAttachment[]>([]);
  const [showTabsMore, setShowTabsMore] = useState(false);
  const [openUploadMenu, setOpenUploadMenu] = useState<FloatingPointState>(null);
  const [openFileMenu, setOpenFileMenu] = useState<FileMenuState>(null);
  const [openFileRenamePopover, setOpenFileRenamePopover] = useState<FileRenamePopoverState>(null);
  const [uploadTooltip, setUploadTooltip] = useState<FloatingPointState>(null);
  const mainRef = useRef<HTMLElement | null>(null);
  const spotlightFrameRef = useRef<number | null>(null);
  const spotlightCurrentRef = useRef({ x: 0, y: 0, opacity: 0 });
  const spotlightTargetRef = useRef({ x: 0, y: 0, opacity: 0 });
  const historyMenuRef = useRef<HTMLDivElement | null>(null);
  const uploadMenuRef = useRef<HTMLDivElement | null>(null);
  const fileMenuRef = useRef<HTMLDivElement | null>(null);
  const fileRenamePopoverRef = useRef<HTMLFormElement | null>(null);
  const fileRenameInputRef = useRef<HTMLInputElement | null>(null);
  const uploadButtonRef = useRef<HTMLButtonElement | null>(null);
  const uploadProgressTimersRef = useRef<Record<string, number>>({});
  const collapsedPopoverRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLElement | null>(null);
  const fileMentionPanelRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const filesPanelFileInputRef = useRef<HTMLInputElement | null>(null);
  const filesSearchRef = useRef<HTMLLabelElement | null>(null);
  const filesSearchInputRef = useRef<HTMLInputElement | null>(null);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const tabsTrackRef = useRef<HTMLDivElement | null>(null);

  const prompts = useMemo(() => PROMPTS[activeTab], [activeTab]);
  const activeAgent = AGENTS[activeAgentIndex];
  const activeAgentHistories = useMemo(() => agentHistories[activeAgent], [activeAgent, agentHistories]);
  const isSidebarCollapsed = collapsed || isAutoCollapsed;
  const visibleFiles = useMemo(() => {
    const query = filesSearchQuery.trim().toLowerCase();
    if (!query) return files;

    return files.filter((file) => file.name.toLowerCase().includes(query));
  }, [files, filesSearchQuery]);
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
  }, [activeUtilityPanel]);

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
    };
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (historyMenuRef.current?.contains(target)) return;
      if (uploadMenuRef.current?.contains(target)) return;
      if (fileMenuRef.current?.contains(target)) return;
      if (fileRenamePopoverRef.current?.contains(target)) return;
      if (uploadButtonRef.current?.contains(target)) return;
      if (collapsedPopoverRef.current?.contains(target)) return;

      setOpenHistoryMenu(null);
      setOpenUploadMenu(null);
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
    if (!openUploadMenu) return;

    const focusFrame = window.requestAnimationFrame(() => {
      uploadMenuRef.current?.querySelector<HTMLButtonElement>(".upload-menu-option")?.focus();
    });

    const closeUploadMenu = () => {
      setOpenUploadMenu(null);
      setUploadTooltip(null);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      closeUploadMenu();
    };

    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", closeUploadMenu);
    window.addEventListener("scroll", closeUploadMenu, true);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", closeUploadMenu);
      window.removeEventListener("scroll", closeUploadMenu, true);
    };
  }, [openUploadMenu]);

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
    }
  }, [activeAgentHistories, activeHistoryId]);

  useEffect(() => {
    setOpenHistoryMenu(null);
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
    setOpenHistoryMenu(null);
    setOpenCollapsedPopover(null);
  };

  const onSend = () => {
    const text = getComposerPlainText(draft, composerFiles).trim();
    if (!text && uploadComposerFiles.length === 0) return;
    setOpenHistoryMenu(null);
    const now = new Date().toISOString();
    const titleText = text || uploadComposerFiles.map((file) => file.name).join("、");

    if (isNewChatActive || !activeHistoryId) {
      const sessionId = `session-${Date.now()}`;
      const nextSession: HistorySession = {
        id: sessionId,
        title: buildSessionTitle(titleText),
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

    setDraft("");
    setFileMentionRange(null);
    setComposerFiles([]);
  };

  const getFilesPanelMaxWidth = () => {
    const mainLeft = mainRef.current?.getBoundingClientRect().left ?? 0;
    const availableWidth = window.innerWidth - mainLeft - FILES_PANEL_INSET * 2;
    return Math.max(FILES_PANEL_MIN_WIDTH, Math.min(FILES_PANEL_MAX_WIDTH, availableWidth - FILES_PANEL_MIN_MAIN_WIDTH));
  };

  const getFilesPanelWidthFromClientX = (clientX: number) => {
    const nextWidth = window.innerWidth - clientX - FILES_PANEL_INSET;
    return clamp(nextWidth, FILES_PANEL_MIN_WIDTH, getFilesPanelMaxWidth());
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

  const renameHistoryItem = (sessionId: string, currentTitle: string) => {
    const nextName = window.prompt("重命名", currentTitle)?.trim();
    if (!nextName || nextName === currentTitle) {
      setOpenHistoryMenu(null);
      return;
    }

    setAgentHistories((prev) => ({
      ...prev,
      [activeAgent]: prev[activeAgent].map((session) =>
        session.id === sessionId ? { ...session, title: nextName } : session
      )
    }));
    setOpenHistoryMenu(null);
  };

  const deleteHistoryItem = (sessionId: string) => {
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
          onClick={() => renameHistoryItem(session.id, session.title)}
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
    setActiveUtilityPanel((current) => (current === panel ? null : panel));
    setOpenHistoryMenu(null);
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
    if (openUploadMenu) return;
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
      if (file.source === "upload" && current.some((item) => item.name === file.name && item.source === file.source)) {
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

  const onUploadFiles = (event: ReactChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files ?? []);
    const existingUploadNames = new Set(uploadComposerFiles.map((file) => file.name));

    uploadedFiles.forEach((file) => {
      if (existingUploadNames.has(file.name)) return;
      existingUploadNames.add(file.name);
      const id = `upload-${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

      addComposerFile({
        id,
        name: file.name,
        icon: getFileIcon(file.name),
        size: formatFileSize(file.size),
        uploadProgress: 0,
        isUploading: true,
        source: "upload"
      });
      startUploadProgress(id, file.size);
    });

    event.target.value = "";
    setOpenUploadMenu(null);
    setUploadTooltip(null);
    window.requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const onUploadFilesToFilesPanel = (event: ReactChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files ?? []);
    if (uploadedFiles.length === 0) return;

    setFiles((current) => {
      const existingNames = new Set(current.map((file) => file.name.toLowerCase()));
      const appended = uploadedFiles.map((file) => {
        const uniqueName = getUniqueFileName(file.name, existingNames);
        existingNames.add(uniqueName.toLowerCase());
        return {
          name: uniqueName,
          size: formatFileSize(file.size),
          icon: getFileIcon(uniqueName)
        };
      });

      return [...appended, ...current];
    });

    event.target.value = "";
    setIsFilesSearchActive(false);
    setFilesSearchQuery("");
  };

  const openUploadMenuAtButton = (event: ReactMouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setUploadTooltip(null);
    setOpenUploadMenu({
      left: rect.left,
      top: rect.bottom + 4
    });
  };

  const renderUploadTooltip = () => {
    if (!uploadTooltip) return null;

    return createPortal(
      <div className="upload-tooltip" style={{ left: `${uploadTooltip.left}px`, top: `${uploadTooltip.top}px` }}>
        上传
      </div>,
      document.body
    );
  };

  const renderUploadMenu = () => {
    if (!openUploadMenu) return null;

    return createPortal(
      <div
        ref={uploadMenuRef}
        className="upload-menu"
        role="menu"
        style={{ left: `${openUploadMenu.left}px`, top: `${openUploadMenu.top}px` }}
      >
        <button
          type="button"
          className="upload-menu-option"
          role="menuitem"
          onClick={() => {
            fileInputRef.current?.click();
            setOpenUploadMenu(null);
          }}
        >
          <Icon name="shangchuanwenjian" />
          <span>上传文件</span>
        </button>
        <button
          type="button"
          className="upload-menu-option"
          role="menuitem"
          onClick={() => {
            setActiveUtilityPanel("files");
            setOpenUploadMenu(null);
          }}
        >
          <Icon name="xuanzewodewenjian" />
          <span>选择我的文件</span>
        </button>
      </div>,
      document.body
    );
  };

  const quoteFileToComposer = (fileName: string) => {
    const file = files.find((item) => item.name === fileName);
    const referenceId = `reference-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    let nextCursor = 0;
    addComposerFile({
      id: referenceId,
      name: fileName,
      icon: file?.icon ?? getFileIcon(fileName),
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

    setDraft(nextDraft);
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

    const file = files.find((item) => item.name === fileName);
    const referenceId = `reference-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    addComposerFile({
      id: referenceId,
      name: fileName,
      icon: file?.icon ?? getFileIcon(fileName),
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
            <img className="composer-file-tag-icon" src={getFileIcon(file.name)} alt="" />
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

          const fileName = composerFiles.find((item) => item.source === "reference" && item.name === node.name)?.name ?? node.name;
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
                <img className="composer-reference-chip-icon" src={getFileIcon(fileName)} alt="" />
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
                <img className="file-mention-icon" src={file.icon} alt="" />
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
    setDraft((current) =>
      current.replace(
        new RegExp(`${COMPOSER_REFERENCE_START}${fileName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}${COMPOSER_REFERENCE_END}`, "g"),
        ""
      )
    );
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
    const blob = new Blob([getFileDetailText(fileName)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    setOpenFileMenu(null);
  };

  const markFileEditing = (fileName: string) => {
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
              icon: getFileIcon(nextName)
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
              icon: getFileIcon(nextName)
            }
          : file
      )
    );
    setDraft((current) =>
      current.replace(
        new RegExp(`${COMPOSER_REFERENCE_START}${previousName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}${COMPOSER_REFERENCE_END}`, "g"),
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
        <button type="button" className="file-card-menu-option" role="menuitem" onClick={() => markFileEditing(openFileMenu.fileName)}>
          <span className="file-card-menu-icon" aria-hidden="true">
            <Icon name="bianji" />
          </span>
          <span>编辑</span>
        </button>
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
      setFilesPanelWidth((current) => clamp(current + FILES_PANEL_RESIZE_STEP, FILES_PANEL_MIN_WIDTH, getFilesPanelMaxWidth()));
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      setFilesPanelWidth((current) => clamp(current - FILES_PANEL_RESIZE_STEP, FILES_PANEL_MIN_WIDTH, getFilesPanelMaxWidth()));
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
        aria-valuemin={FILES_PANEL_MIN_WIDTH}
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
            <img className="files-panel-title-icon" src={filePanelIcon} alt="" />
            <h3>我的文件</h3>
          </div>
          <div className="files-panel-header-actions">
            <button
              type="button"
              className="icon-btn files-panel-action"
              aria-label={isFilesPanelExpanded ? "收起文件面板" : "展开文件面板"}
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
                    <button
                      type="button"
                      className="icon-btn files-detail-icon-action"
                      aria-label="重命名"
                      onClick={() => startInlineFileRename(activeFileDetail.name)}
                    >
                      <Icon name="zhongmingming" />
                    </button>
                  </>
                )}
              </div>
              <button
                type="button"
                className="icon-btn files-detail-icon-action"
                aria-label={editingFileName === activeFileDetail.name ? "退出编辑" : "编辑"}
                onClick={() => {
                  if (editingFileName === activeFileDetail.name) {
                    setEditingFileName(null);
                    setEditingFileDraft("");
                    return;
                  }

                  markFileEditing(activeFileDetail.name);
                }}
              >
                <Icon name="bianji" />
              </button>
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
                className="files-detail-quote-button"
                onClick={() => {
                  quoteFileToComposer(activeFileDetail.name);
                }}
              >
                <Icon name="yinyongdaohuihua" />
                <span>引用到会话</span>
              </button>
            </div>
            <div
              className={
                editingFileName === activeFileDetail.name
                  ? "files-detail-content markdown-editor-mode"
                  : "files-detail-content markdown-preview"
              }
            >
              {editingFileName === activeFileDetail.name ? (
                <>
                  <div className="markdown-editor-toolbar">
                    <span>Markdown 编辑模式</span>
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
                  </div>
                  <textarea
                    className="markdown-editor-textarea"
                    value={editingFileDraft}
                    spellCheck={false}
                    aria-label={`${activeFileDetail.name} Markdown 内容`}
                    onChange={(event) => setEditingFileDraft(event.target.value)}
                  />
                </>
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
              <span>文件总数：{visibleFiles.length}</span>
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
                    onClick={() => setIsFilesSearchActive(true)}
                  >
                    <Icon name="sousuoneibu" />
                  </button>
                )}
                <button
                  type="button"
                  className="icon-btn files-panel-action"
                  aria-label="上传文件"
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
              {visibleFiles.map((file) => (
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
                          aria-label="引用到会话"
                          onClick={(event) => {
                            event.stopPropagation();
                            quoteFileToComposer(file.name);
                          }}
                        >
                          <Icon name="yinyongdaohuihua" />
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
              ))}
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
          setActiveHistoryId(session.id);
          setIsNewChatActive(false);
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
        {isExpanded ? <div className="collapsed-history-list">{renderCollapsedHistoryItems(items)}</div> : null}
      </section>
    );
  };

  const renderCollapsedPopover = () => {
    if (!openCollapsedPopover) return null;

    const content =
      openCollapsedPopover.type === "agent" ? (
        <div className="collapsed-popover-stack">
          {AGENTS.map((item, index) => {
            const selected = activeAgentIndex === index;
            return (
              <button
                key={item}
                type="button"
                className={selected ? "collapsed-popover-item selected" : "collapsed-popover-item"}
                onClick={() => {
                  setActiveAgentIndex(index);
                  setOpenCollapsedPopover(null);
                  setCollapsedTooltip(null);
                }}
              >
                <span className="collapsed-popover-avatar" aria-hidden="true">
                  <Icon name="huizhi" />
                </span>
                <span className="collapsed-popover-label">{item}</span>
                {selected ? <span className="collapsed-popover-dot" aria-hidden="true" /> : null}
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
        {isExpanded ? (
          <div className="history-group-items">
            {items.map((session) => (
              <div
                key={session.id}
                className={
                  openHistoryMenu?.sessionId === session.id
                    ? "history-item-row menu-open"
                    : "history-item-row"
                }
              >
                <button
                  type="button"
                  className={activeHistoryId === session.id ? "history-item selected" : "history-item"}
                  onClick={() => {
                    setActiveHistoryId(session.id);
                    setIsNewChatActive(false);
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
              </div>
            ))}
          </div>
        ) : null}
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
              onClick={() => {
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
                  {AGENTS.map((item, index) => (
                    <button
                      key={item}
                      type="button"
                      className={`agent-item ${activeAgentIndex === index ? "selected" : ""}`}
                      onClick={() => setActiveAgentIndex(index)}
                    >
                      <span className="avatar">
                        <Icon name="huizhi" />
                      </span>
                      <span>{item}</span>
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
                    <Icon name="huizhi" />
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
      {isSidebarCollapsed ? renderCollapsedTooltip() : null}
      {isSidebarCollapsed ? renderCollapsedPopover() : null}

      <main
        ref={mainRef}
        className={[
          "main",
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
        <div key={activeAgent} className="main-content">
          <section className="hero">
            <h2>
              您的专属<span>商业洞察员</span>，2分钟看透公司和市场趋势
            </h2>
          </section>

          <section className="prompt-card">
            <div className="tabs" ref={tabsRef}>
              <div className="tabs-track" ref={tabsTrackRef}>
                {TABS.map((tab) => (
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
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

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
                  className={openUploadMenu ? "icon-btn add active" : "icon-btn add"}
                  aria-label="上传"
                  aria-haspopup="menu"
                  aria-expanded={Boolean(openUploadMenu)}
                  onMouseEnter={(event) => showUploadTooltip(event.currentTarget.getBoundingClientRect())}
                  onMouseLeave={hideUploadTooltip}
                  onFocus={(event) => showUploadTooltip(event.currentTarget.getBoundingClientRect())}
                  onBlur={hideUploadTooltip}
                  onClick={openUploadMenuAtButton}
                >
                  <Icon name="tianjia" />
                </button>
                <button
                  type="button"
                  className="send-btn"
                  onClick={onSend}
                  disabled={!getComposerPlainText(draft, composerFiles).trim() && uploadComposerFiles.length === 0}
                >
                  <Icon name="fasong" />
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
      {renderUploadMenu()}
      {renderFileMenu()}
      {renderFileRenamePopover()}
    </div>
  );
}

export default App;
