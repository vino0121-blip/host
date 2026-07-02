import React from "react";
import { createRoot, type Root } from "react-dom/client";
import {
  AlertTriangle,
  Banknote,
  BarChart3,
  Camera,
  CheckCircle2,
  ClipboardList,
  Coins,
  Download,
  Edit3,
  FileText,
  Home,
  LogOut,
  Percent,
  Plus,
  ReceiptText,
  Save,
  ShieldCheck,
  Smartphone,
  Trash2,
  Trophy,
  UserCog,
  UserRound,
  Users,
  WalletCards
} from "lucide-react";
import "./styles.css";

declare global {
  interface Window {
    __STORE_PILOT_ROOT__?: Root;
  }
}

type Role = "admin" | "staff" | "host";
type Tab = "dashboard" | "daily" | "summary" | "rankings" | "payroll" | "checkout" | "receivables" | "expenses" | "closing" | "personal" | "annual" | "admin";
type Payment = "現金" | "カード" | "売掛" | "振込" | "現金+カード" | "現金+売掛" | "カード+売掛" | "複合";
type ReceivableStatus = "danger" | "soon" | "ok";
type ReceivableCollection = "active" | "payrollDeducted";
type ExpensePayment = "現金" | "カード" | "後払い" | "振込";
type ExpenseTaxRate = 10 | 8 | 0;

type Host = {
  id: number;
  name: string;
  rank: number;
  sales: number;
  paid: number;
  receivable: number;
  expenses: number;
  taxReserve: number;
  target: number;
  lastEntry: string;
};

type AppUser = {
  id: number;
  name: string;
  loginId: string;
  password: string;
  role: Role;
  hostId?: number;
  active: boolean;
};

type StoreAccount = {
  id: string;
  name: string;
  password: string;
};

type Receivable = {
  id: number;
  sourceCheckId?: number;
  customer: string;
  hostId: number;
  amount: number;
  due: string;
  status: ReceivableStatus;
  collection: ReceivableCollection;
  memo: string;
};

type ReceivablePayment = {
  id: number;
  receivableId: number;
  hostId: number;
  amount: number;
  reportedBy: string;
  confirmedBy?: string;
  status: "reported" | "confirmed";
  time: string;
};

type TableCheck = {
  id: number;
  table: string;
  customerName: string;
  hostId: number;
  guests: number;
  subtotal: number;
  serviceRate: number;
  taxRate: number;
  discount: number;
  payment: Payment;
  cashAmount: number;
  cardAmount: number;
  receivableAmount: number;
  status: "paid" | "receivable";
  date: string;
  time: string;
};

type OpenTable = {
  id: number;
  table: string;
  guests: number;
  hostId: number;
  customerName: string;
  currentAmount: number;
  targetAmount: number;
  time: string;
};

type Expense = {
  id: number;
  ownerType: "store" | "host";
  hostId?: number;
  date: string;
  category: string;
  vendor: string;
  amount: number;
  taxRate: ExpenseTaxRate;
  paymentMethod: ExpensePayment;
  memo: string;
  receiptStatus: "手入力" | "レシート読取";
};

type RegisterClose = {
  id: number;
  date: string;
  startCash: number;
  cashInjection: number;
  expectedCash: number;
  actualCash: number;
  difference: number;
  closedBy: string;
  time: string;
  memo: string;
};

type OperationLog = {
  id: number;
  date: string;
  time: string;
  actor: string;
  role: string;
  scope: "会計" | "経費" | "締め";
  action: "登録" | "編集" | "削除" | "保存";
  target: string;
  amount: number;
  detail: string;
};

type StoreSettings = {
  serviceRate: number;
  taxRate: number;
  openHour: number;
  closeHour: number;
  payrollRate: number;
  payrollBase: "subtotal" | "total";
  withholdingTaxRate: 0 | 10.21;
  receivablesEnabled: boolean;
};

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const roleLabel: Record<Role, string> = {
  admin: "店長",
  staff: "内勤",
  host: "ホスト"
};

const storeAccounts: StoreAccount[] = [
  { id: "store-pilot", name: "Store Pilot 新宿店", password: "0000" }
];

const savedDeviceKey = "store-pilot-device-session";
const deviceSessionMs = 1000 * 60 * 60 * 24 * 30;

const categoryOptions = [
  "接待交際費",
  "旅費交通費",
  "消耗品費",
  "広告宣伝費",
  "通信費",
  "会議費",
  "雑費",
  "給与手当"
];

const expensePaymentOptions: ExpensePayment[] = ["現金", "カード", "後払い", "振込"];
const expenseTaxRateOptions: Array<{ label: string; value: string }> = [
  { label: "10%", value: "10" },
  { label: "軽減8%", value: "8" },
  { label: "対象外", value: "0" }
];
const expenseTaxRateLabel = (rate?: number) => (rate === 8 ? "8%" : rate === 0 ? "対象外" : "10%");

const hostExpenseAccountGuide = [
  {
    account: "接待交際費",
    examples: "お客様との食事、同伴・アフターの飲食、手土産、営業上必要な祝い花など",
    note: "誰と・何のために使ったかをメモ。私用の飲食は入れない"
  },
  {
    account: "旅費交通費",
    examples: "営業移動、出勤前後の仕事移動、タクシー、電車、駐車場、遠方イベント移動",
    note: "仕事と私用が混ざる移動は仕事分だけに分ける"
  },
  {
    account: "広告宣伝費",
    examples: "宣材写真、名刺、SNS広告、プロフィール掲載、イベント告知用の制作費",
    note: "自分の売上につながる宣伝費として残す"
  },
  {
    account: "通信費",
    examples: "仕事用スマホ、通話料、SNS連絡用の通信、予約管理アプリ、クラウド利用料",
    note: "私用スマホと兼用なら仕事で使う割合だけ"
  },
  {
    account: "消耗品費",
    examples: "名刺入れ、文具、撮影小物、ヘア用品、メイク用品、仕事用の小物",
    note: "長く使う高額品は一度確認。少額の仕事用品向け"
  },
  {
    account: "衣装・美容費",
    examples: "仕事専用のスーツ、靴、ヘアセット、美容院、メイク、撮影前の身だしなみ",
    note: "普段使いもするものは否認されやすいので仕事分だけ"
  },
  {
    account: "会議費",
    examples: "営業前の打ち合わせ、店との面談、軽い飲食を伴うミーティング",
    note: "接待ではなく打ち合わせ目的ならこっち"
  },
  {
    account: "支払手数料",
    examples: "振込手数料、決済手数料、送金手数料、予約サイトや外部サービス手数料",
    note: "売上回収や仕事用サービスにかかった手数料"
  },
  {
    account: "雑費",
    examples: "他の科目に入れにくい少額の仕事用支出",
    note: "多用しすぎると後で見にくいので、迷った時だけ"
  }
];

const initialHosts: Host[] = [
  {
    id: 1,
    name: "天城 レン",
    rank: 1,
    sales: 3840000,
    paid: 2880000,
    receivable: 510000,
    expenses: 142000,
    taxReserve: 331000,
    target: 4500000,
    lastEntry: "今日 03:12"
  },
  {
    id: 2,
    name: "黒崎 ミナト",
    rank: 2,
    sales: 2760000,
    paid: 2180000,
    receivable: 240000,
    expenses: 87000,
    taxReserve: 229000,
    target: 3200000,
    lastEntry: "昨日 23:45"
  },
  {
    id: 3,
    name: "一条 ユウ",
    rank: 3,
    sales: 1920000,
    paid: 1710000,
    receivable: 760000,
    expenses: 163000,
    taxReserve: 156000,
    target: 2500000,
    lastEntry: "今日 01:08"
  }
];

const initialUsers: AppUser[] = [
  { id: 1, name: "白石 店長", loginId: "manager", password: "1111", role: "admin", active: true },
  { id: 2, name: "経理 内勤", loginId: "staff", password: "2222", role: "staff", active: true },
  { id: 3, name: "天城 レン", loginId: "ren", password: "3333", role: "host", hostId: 1, active: true },
  { id: 4, name: "黒崎 ミナト", loginId: "minato", password: "4444", role: "host", hostId: 2, active: true }
];

const initialReceivables: Receivable[] = [
  {
    id: 1,
    customer: "A様",
    hostId: 3,
    amount: 430000,
    due: "6/30",
    status: "danger",
    collection: "active",
    memo: "分割相談中。店長確認"
  },
  {
    id: 2,
    customer: "M様",
    hostId: 1,
    amount: 280000,
    due: "7/02",
    status: "soon",
    collection: "payrollDeducted",
    memo: "LINE返信あり"
  },
  {
    id: 3,
    customer: "R様",
    hostId: 2,
    amount: 160000,
    due: "7/05",
    status: "ok",
    collection: "payrollDeducted",
    memo: "来店時に入金予定"
  }
];

const initialTableChecks: TableCheck[] = [
  {
    id: 1,
    table: "A-3",
    customerName: "A様",
    hostId: 1,
    guests: 2,
    subtotal: 186000,
    serviceRate: 20,
    taxRate: 10,
    discount: 0,
    payment: "カード",
    cashAmount: 0,
    cardAmount: 245520,
    receivableAmount: 0,
    status: "paid",
    date: "2026-06-29",
    time: "23:42"
  },
  {
    id: 2,
    table: "VIP-1",
    customerName: "M様",
    hostId: 3,
    guests: 3,
    subtotal: 420000,
    serviceRate: 20,
    taxRate: 10,
    discount: 30000,
    payment: "売掛",
    cashAmount: 0,
    cardAmount: 0,
    receivableAmount: 521400,
    status: "receivable",
    date: "2026-06-29",
    time: "00:18"
  },
  {
    id: 3,
    table: "B-2",
    customerName: "R様",
    hostId: 2,
    guests: 1,
    subtotal: 92000,
    serviceRate: 20,
    taxRate: 10,
    discount: 0,
    payment: "現金",
    cashAmount: 121440,
    cardAmount: 0,
    receivableAmount: 0,
    status: "paid",
    date: "2026-06-29",
    time: "01:05"
  }
];

const initialOpenTables: OpenTable[] = [
  {
    id: 1,
    table: "VIP-2",
    guests: 2,
    hostId: 1,
    customerName: "K様",
    currentAmount: 168000,
    targetAmount: 300000,
    time: "23:30"
  },
  {
    id: 2,
    table: "A-5",
    guests: 1,
    hostId: 2,
    customerName: "N様",
    currentAmount: 72000,
    targetAmount: 150000,
    time: "00:10"
  },
  {
    id: 3,
    table: "B-1",
    guests: 3,
    hostId: 3,
    customerName: "Y様",
    currentAmount: 0,
    targetAmount: 200000,
    time: "01:20"
  }
];

const initialExpenses: Expense[] = [
  {
    id: 1,
    ownerType: "store",
    date: "2026-06-28",
    category: "広告宣伝費",
    vendor: "SNS広告",
    amount: 88000,
    taxRate: 10,
    paymentMethod: "カード",
    memo: "求人広告",
    receiptStatus: "手入力"
  },
  {
    id: 2,
    ownerType: "host",
    hostId: 1,
    date: "2026-06-27",
    category: "接待交際費",
    vendor: "同伴飲食",
    amount: 18400,
    taxRate: 10,
    paymentMethod: "現金",
    memo: "領収書あり",
    receiptStatus: "レシート読取"
  },
  {
    id: 3,
    ownerType: "host",
    hostId: 2,
    date: "2026-06-26",
    category: "旅費交通費",
    vendor: "タクシー",
    amount: 6200,
    taxRate: 10,
    paymentMethod: "現金",
    memo: "営業後移動",
    receiptStatus: "手入力"
  }
];

const yenMoney = (value: number) =>
  new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0
  }).format(value);

const plainNumber = (value: number) => value.toLocaleString("ja-JP");
const parsePlainNumber = (value: string) => Number(value.replace(/[^\d.-]/g, "")) || 0;
const money = plainNumber;
const compactMoney = plainNumber;
const csvCell = (value: string | number | undefined) => `"${String(value ?? "").replace(/"/g, '""')}"`;
const maxTableAmount = 100000000;
const clampTableAmount = (value: number) => Math.min(maxTableAmount, Math.max(0, value));
const clampGuests = (value: number) => Math.min(99, Math.max(1, value || 1));

const downloadCsv = (header: Array<string | number>, rows: Array<Array<string | number | undefined>>, filename: string) => {
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};

const downloadExpensesCsv = (items: Expense[], filename: string) => {
  const header = ["日付", "勘定科目", "支払先", "金額", "消費税率", "支払", "メモ", "読取"];
  const rows = items.map((item) => [
    item.date,
    item.category,
    item.vendor,
    item.amount,
    expenseTaxRateLabel(item.taxRate),
    item.paymentMethod,
    item.memo,
    item.receiptStatus
  ]);
  downloadCsv(header, rows, filename);
};

const downloadExpenseCategoryCsv = (items: Expense[], filename: string) => {
  const header = ["勘定科目", "金額", "10%", "軽減8%", "対象外", "件数"];
  const rows = categoryOptions
    .map((category) => {
      const categoryItems = items.filter((item) => item.category === category);
      return [
        category,
        categoryItems.reduce((sum, item) => sum + item.amount, 0),
        categoryItems.filter((item) => item.taxRate === 10).reduce((sum, item) => sum + item.amount, 0),
        categoryItems.filter((item) => item.taxRate === 8).reduce((sum, item) => sum + item.amount, 0),
        categoryItems.filter((item) => item.taxRate === 0).reduce((sum, item) => sum + item.amount, 0),
        categoryItems.length
      ];
    })
    .filter((row) => Number(row[1]) > 0);
  downloadCsv(header, rows, filename);
};

const tableTotal = (check: TableCheck) => {
  const service = Math.round(check.subtotal * (check.serviceRate / 100));
  const tax = Math.round((check.subtotal + service) * (check.taxRate / 100));
  return Math.max(0, check.subtotal + service + tax - check.discount);
};

const incomeTaxRows = [
  { min: 1000, max: 1949000, rate: 0.05, deduction: 0 },
  { min: 1950000, max: 3299000, rate: 0.1, deduction: 97500 },
  { min: 3300000, max: 6949000, rate: 0.2, deduction: 427500 },
  { min: 6950000, max: 8999000, rate: 0.23, deduction: 636000 },
  { min: 9000000, max: 17999000, rate: 0.33, deduction: 1536000 },
  { min: 18000000, max: 39999000, rate: 0.4, deduction: 2796000 },
  { min: 40000000, max: Number.POSITIVE_INFINITY, rate: 0.45, deduction: 4796000 }
];

const basicDeduction = (taxYear: number, totalIncome: number) => {
  if (taxYear <= 2024) {
    if (totalIncome <= 24000000) return 480000;
    if (totalIncome <= 24500000) return 320000;
    if (totalIncome <= 25000000) return 160000;
    return 0;
  }

  if (taxYear === 2025) {
    if (totalIncome <= 1320000) return 950000;
    if (totalIncome <= 3360000) return 880000;
    if (totalIncome <= 4890000) return 680000;
    if (totalIncome <= 6550000) return 630000;
    if (totalIncome <= 23500000) return 580000;
    if (totalIncome <= 24000000) return 480000;
    if (totalIncome <= 24500000) return 320000;
    if (totalIncome <= 25000000) return 160000;
    return 0;
  }

  if (totalIncome <= 1320000) return 950000;
  if (totalIncome <= 23500000) return 580000;
  if (totalIncome <= 24000000) return 480000;
  if (totalIncome <= 24500000) return 320000;
  if (totalIncome <= 25000000) return 160000;
  return 0;
};

const incomeTaxByProgressiveRate = (taxableIncome: number) => {
  const roundedTaxableIncome = Math.floor(Math.max(0, taxableIncome) / 1000) * 1000;
  const row = incomeTaxRows.find((item) => roundedTaxableIncome >= item.min && roundedTaxableIncome <= item.max);
  return row ? Math.round(roundedTaxableIncome * row.rate - row.deduction) : 0;
};

const paymentLabel = (check: TableCheck): Payment => {
  const parts = [
    check.cashAmount > 0 ? "現金" : "",
    check.cardAmount > 0 ? "カード" : "",
    check.receivableAmount > 0 ? "売掛" : ""
  ].filter(Boolean);

  if (parts.length === 0) return check.payment;
  if (parts.length === 1) return parts[0] as Payment;
  if (parts.length === 2) return parts.join("+") as Payment;
  return "複合";
};

const hasReceivablePayment = (check: TableCheck) => check.receivableAmount > 0 || paymentLabel(check).includes("売掛");

const isReceivablesEnabled = (settings: StoreSettings) => settings.receivablesEnabled !== false;

const nonReceivablePayment = (check: TableCheck): Payment =>
  check.cashAmount > 0 && check.cardAmount > 0 ? "現金+カード" : check.cashAmount > 0 ? "現金" : check.cardAmount > 0 ? "カード" : "カード";

const paymentLabelForDisplay = (check: TableCheck, receivablesEnabled: boolean) =>
  receivablesEnabled ? paymentLabel(check) : paymentLabel({ ...check, payment: nonReceivablePayment(check), receivableAmount: 0 });

const paymentOptionsFor = (receivablesEnabled: boolean): Payment[] =>
  receivablesEnabled
    ? ["現金", "カード", "売掛", "現金+カード", "現金+売掛", "カード+売掛", "複合", "振込"]
    : ["現金", "カード", "現金+カード", "複合", "振込"];

const paymentFilterOptionsFor = (receivablesEnabled: boolean) => [
  { label: "すべて", value: "all" },
  { label: "現金", value: "現金" },
  { label: "カード", value: "カード" },
  ...(receivablesEnabled ? [{ label: "売掛", value: "売掛" }] : []),
  { label: "複合", value: "複合" }
];

const withAutoReceivable = (check: TableCheck, settings: StoreSettings) => {
  const pricedCheck = { ...check, serviceRate: settings.serviceRate, taxRate: settings.taxRate };
  const total = tableTotal(pricedCheck);
  if (!isReceivablesEnabled(settings)) {
    return {
      ...pricedCheck,
      payment: nonReceivablePayment(pricedCheck),
      receivableAmount: 0
    };
  }
  return {
    ...pricedCheck,
    receivableAmount: Math.max(0, total - pricedCheck.cashAmount - pricedCheck.cardAmount)
  };
};

const defaultStoreSettings: StoreSettings = {
  serviceRate: 20,
  taxRate: 10,
  openHour: 20,
  closeHour: 5,
  payrollRate: 48,
  payrollBase: "total",
  withholdingTaxRate: 0,
  receivablesEnabled: true
};

const formatDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const currentTime = (now = new Date()) => `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

const dateFromShortDue = (due: string, fallbackYear: string) => {
  const [month, day] = due.split("/");
  if (!month || !day) return "";
  return `${fallbackYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const businessDateFor = (settings: StoreSettings, now = new Date()) => {
  const businessDate = new Date(now);
  if (settings.closeHour <= settings.openHour && now.getHours() < settings.closeHour) {
    businessDate.setDate(businessDate.getDate() - 1);
  }
  return formatDate(businessDate);
};

const receivableFromCheck = (check: TableCheck): Receivable => ({
  id: Date.now() + check.id,
  sourceCheckId: check.id,
  customer: check.customerName,
  hostId: check.hostId,
  amount: check.receivableAmount,
  due: check.date.slice(5).replace("-", "/"),
  status: "soon",
  collection: "active",
  memo: `${check.table} 会計から自動反映`
});

const blankCheck = (hostId: number, settings: StoreSettings = defaultStoreSettings): TableCheck => ({
  id: 0,
  table: "C-1",
  customerName: "名前未入力",
  hostId,
  guests: 2,
  subtotal: 120000,
  serviceRate: settings.serviceRate,
  taxRate: settings.taxRate,
  discount: 0,
  payment: "カード",
  cashAmount: 0,
  cardAmount: 158400,
  receivableAmount: 0,
  status: "paid",
  date: businessDateFor(settings),
  time: currentTime()
});

const blankExpense = (hostId: number, ownerType: Expense["ownerType"] = "store"): Expense => ({
  id: 0,
  ownerType,
  hostId: ownerType === "host" ? hostId : undefined,
  date: "2026-06-29",
  category: "接待交際費",
  vendor: "",
  amount: 0,
  taxRate: 10,
  paymentMethod: "現金",
  memo: "",
  receiptStatus: "手入力"
});

const readSavedDevice = () => {
  try {
    const raw = window.localStorage.getItem(savedDeviceKey);
    if (!raw) return null;
    const saved = JSON.parse(raw) as { storeId?: string; userId?: number; expiresAt?: number };
    if (!saved.storeId || !saved.userId || !saved.expiresAt || saved.expiresAt < Date.now()) {
      window.localStorage.removeItem(savedDeviceKey);
      return null;
    }
    return saved;
  } catch {
    window.localStorage.removeItem(savedDeviceKey);
    return null;
  }
};

const saveDevice = (storeId: string, userId: number) => {
  window.localStorage.setItem(savedDeviceKey, JSON.stringify({ storeId, userId, expiresAt: Date.now() + deviceSessionMs }));
};

const clearSavedDevice = () => window.localStorage.removeItem(savedDeviceKey);

function App() {
  const [currentUser, setCurrentUser] = React.useState<AppUser | null>(null);
  const [currentStoreId, setCurrentStoreId] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<Tab>("dashboard");
  const [hosts, setHosts] = React.useState<Host[]>(initialHosts);
  const [users, setUsers] = React.useState<AppUser[]>(initialUsers);
  const [receivables, setReceivables] = React.useState<Receivable[]>(initialReceivables);
  const [receivablePayments, setReceivablePayments] = React.useState<ReceivablePayment[]>([]);
  const [tableChecks, setTableChecks] = React.useState<TableCheck[]>(initialTableChecks);
  const [openTables, setOpenTables] = React.useState<OpenTable[]>(initialOpenTables);
  const [expenses, setExpenses] = React.useState<Expense[]>(initialExpenses);
  const [registerCloses, setRegisterCloses] = React.useState<RegisterClose[]>([]);
  const [operationLogs, setOperationLogs] = React.useState<OperationLog[]>([]);
  const [selectedHostId, setSelectedHostId] = React.useState(initialHosts[0].id);
  const [draftCheck, setDraftCheck] = React.useState<TableCheck>(blankCheck(initialHosts[0].id));
  const [editingCheckId, setEditingCheckId] = React.useState<number | null>(null);
  const [checkoutSourceOpenTableId, setCheckoutSourceOpenTableId] = React.useState<number | null>(null);
  const [checkoutEditorOpen, setCheckoutEditorOpen] = React.useState(false);
  const [expenseDraft, setExpenseDraft] = React.useState<Expense>(blankExpense(initialHosts[0].id));
  const [editingExpenseId, setEditingExpenseId] = React.useState<number | null>(null);
  const [notice, setNotice] = React.useState("準備完了");
  const [storeSettings, setStoreSettings] = React.useState<StoreSettings>(defaultStoreSettings);
  const [installPrompt, setInstallPrompt] = React.useState<InstallPromptEvent | null>(null);
  const [installHint, setInstallHint] = React.useState("ホーム追加");

  React.useEffect(() => {
    if ("serviceWorker" in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }

    if ("serviceWorker" in navigator && import.meta.env.DEV) {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => registrations.forEach((registration) => registration.unregister()))
        .catch(() => undefined);
    }

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
      setInstallHint("ホーム追加");
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  React.useEffect(() => {
    if (currentUser) return;
    const saved = readSavedDevice();
    if (!saved) return;
    const store = storeAccounts.find((item) => item.id === saved.storeId);
    const user = users.find((item) => item.id === saved.userId && item.active);
    if (!store || !user) {
      clearSavedDevice();
      return;
    }
    setCurrentStoreId(store.id);
    setCurrentUser(user);
  }, [currentUser, users]);

  React.useEffect(() => {
    if (!currentUser) return;
    if (currentUser.role === "host" && currentUser.hostId) {
      setSelectedHostId(currentUser.hostId);
      setActiveTab("dashboard");
      setExpenseDraft((current) => ({ ...current, ownerType: "host", hostId: currentUser.hostId }));
    } else {
      setActiveTab("dashboard");
      setExpenseDraft((current) => ({ ...current, ownerType: "store", hostId: undefined }));
    }
  }, [currentUser]);

  React.useEffect(() => {
    if (!isReceivablesEnabled(storeSettings)) return;
    setReceivables((current) => {
      const sourceIds = new Set(current.map((item) => item.sourceCheckId).filter((id): id is number => typeof id === "number"));
      const missingReceivables = tableChecks
        .filter((check) => check.receivableAmount > 0 && !sourceIds.has(check.id))
        .map((check) => receivableFromCheck(check));
      return missingReceivables.length > 0 ? [...missingReceivables, ...current] : current;
    });
  }, [storeSettings, tableChecks]);

  React.useEffect(() => {
    if (!isReceivablesEnabled(storeSettings) && activeTab === "receivables") {
      setActiveTab("dashboard");
    }
  }, [activeTab, storeSettings]);

  const visibleTabs = React.useMemo(() => {
    if (!currentUser) return [];
    const receivablesEnabled = isReceivablesEnabled(storeSettings);
    if (currentUser.role === "admin") {
      const tabs = [
        ["dashboard", "HOME", Home],
        ["checkout", "会計", ReceiptText],
        ["receivables", "売掛", ClipboardList],
        ["closing", "締め", Banknote],
        ["rankings", "ランキング", Trophy],
        ["summary", "集計", BarChart3],
        ["payroll", "給与", WalletCards],
        ["admin", "管理", UserCog]
      ] as Array<[Tab, string, React.ComponentType<{ size?: number }>]>;
      return receivablesEnabled ? tabs : tabs.filter(([id]) => id !== "receivables");
    }
    if (currentUser.role === "staff") {
      const tabs = [
        ["dashboard", "HOME", Home],
        ["checkout", "会計", ReceiptText],
        ["receivables", "売掛", ClipboardList],
        ["closing", "締め", Banknote],
        ["rankings", "ランキング", Trophy],
        ["summary", "集計", BarChart3],
        ["payroll", "給与", WalletCards],
        ["admin", "管理", UserCog]
      ] as Array<[Tab, string, React.ComponentType<{ size?: number }>]>;
      return receivablesEnabled ? tabs : tabs.filter(([id]) => id !== "receivables");
    }
    const tabs = [
      ["dashboard", "HOME", Home],
      ["daily", "日次", ReceiptText],
      ["receivables", "売掛", ClipboardList],
      ["personal", "月次", BarChart3],
      ["expenses", "経費", FileText],
      ["admin", "管理", UserCog]
    ] as Array<[Tab, string, React.ComponentType<{ size?: number }>]>;
    return receivablesEnabled ? tabs : tabs.filter(([id]) => id !== "receivables");
  }, [currentUser, storeSettings]);

  const handleInstall = async () => {
    if (!installPrompt) {
      setInstallHint("共有から追加");
      return;
    }

    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  const handleLogin = (user: AppUser, store: StoreAccount) => {
    setCurrentStoreId(store.id);
    setCurrentUser(user);
    saveDevice(store.id, user.id);
  };

  const handleLogout = () => {
    clearSavedDevice();
    setCurrentStoreId(null);
    setCurrentUser(null);
  };

  const handleClearDevice = () => {
    clearSavedDevice();
    setNotice("この端末のログイン保存を削除しました");
  };

  const displayHosts = React.useMemo(() => {
    const hostRows = hosts.map((host) => {
      const hostUser = users.find((user) => user.role === "host" && user.hostId === host.id);
      return hostUser ? { ...host, name: hostUser.name } : host;
    });
    const hostIds = new Set(hostRows.map((host) => host.id));
    const employeeHostRows = users
      .filter((user) => user.active && user.role === "host" && (!user.hostId || !hostIds.has(user.hostId)))
      .map((user, index) => ({
        id: user.hostId ?? -user.id,
        name: user.name,
        rank: hostRows.length + index + 1,
        sales: 0,
        paid: 0,
        receivable: 0,
        expenses: 0,
        taxReserve: 0,
        target: 1000000,
        lastEntry: "未入力"
      }));
    return [...hostRows, ...employeeHostRows];
  }, [hosts, users]);

  const updateUser = (id: number, patch: Partial<AppUser>) => {
    const source = users.find((user) => user.id === id);
    if (!source) return;
    const nextRole = patch.role ?? source.role;
    const shouldCreateHost = nextRole === "host" && !source.hostId;
    const createdHostId = shouldCreateHost ? Date.now() : undefined;
    const nextPatch = shouldCreateHost ? { ...patch, hostId: createdHostId } : patch;
    setUsers((current) => current.map((user) => (user.id === id ? { ...user, ...nextPatch } : user)));
    if (currentUser?.id === id) {
      setCurrentUser((current) => (current ? { ...current, ...nextPatch } : current));
    }
    if (createdHostId) {
      setHosts((current) => [
        ...current,
        {
          id: createdHostId,
          name: patch.name ?? source.name,
          rank: current.length + 1,
          sales: 0,
          paid: 0,
          receivable: 0,
          expenses: 0,
          taxReserve: 0,
          target: 1000000,
          lastEntry: "未入力"
        }
      ]);
    }
  };

  const addEmployee = () => {
    const id = Date.now();
    setUsers((current) => [
      ...current,
      {
        id,
        name: "新人 従業員",
        loginId: `user${current.length + 1}`,
        password: "0000",
        role: "staff",
        active: true
      }
    ]);
  };

  const hostName = (hostId?: number) => displayHosts.find((host) => host.id === hostId)?.name ?? "未設定";
  const storeSales = displayHosts.reduce((sum, host) => sum + host.sales, 0);
  const storePaid = displayHosts.reduce((sum, host) => sum + host.paid, 0);
  const receivablesEnabled = isReceivablesEnabled(storeSettings);
  const visibleReceivables = receivablesEnabled ? receivables : [];
  const storeReceivable = visibleReceivables
    .filter((item) => item.collection !== "payrollDeducted")
    .reduce((sum, item) => sum + item.amount, 0);
  const storePayrollDeductedReceivable = visibleReceivables
    .filter((item) => item.collection === "payrollDeducted")
    .reduce((sum, item) => sum + item.amount, 0);
  const storeExpenses = expenses.filter((item) => item.ownerType === "store").reduce((sum, item) => sum + item.amount, 0);
  const selectedHost = displayHosts.find((host) => host.id === selectedHostId) ?? displayHosts[0];
  const currentBusinessDate = businessDateFor(storeSettings);
  const currentBusinessChecks = tableChecks.filter((check) => check.date === currentBusinessDate);
  const currentHostBusinessChecks = currentBusinessChecks.filter((check) => check.hostId === selectedHost.id);
  const todayCheckoutTotal = currentBusinessChecks.reduce((sum, check) => sum + tableTotal(check), 0);
  const hostTodaySales = currentHostBusinessChecks.reduce((sum, check) => sum + tableTotal(check), 0);
  const hostMonthExpenses =
    selectedHost.expenses +
    expenses
      .filter((expense) => expense.ownerType === "host" && expense.hostId === selectedHost.id)
      .reduce((sum, expense) => sum + expense.amount, 0);
  const canManage = currentUser?.role === "admin";
  const canOperate = currentUser?.role === "admin" || currentUser?.role === "staff";

  const addOperationLog = (entry: Omit<OperationLog, "id" | "date" | "time" | "actor" | "role">) => {
    if (!currentUser) return;
    setOperationLogs((current) => [
      {
        id: Date.now() + Math.floor(Math.random() * 1000),
        date: currentBusinessDate,
        time: currentTime(),
        actor: currentUser.name,
        role: roleLabel[currentUser.role],
        ...entry
      },
      ...current
    ].slice(0, 300));
  };

  const addOpenTable = (hostId = selectedHost.id) => {
    setOpenTables((current) => [
      {
        id: Date.now(),
        table: "新規",
        guests: 2,
        hostId,
        customerName: "名前未入力",
        currentAmount: 0,
        targetAmount: 100000,
        time: currentTime()
      },
      ...current
    ]);
  };

  const updateOpenTable = (id: number, patch: Partial<OpenTable>) => {
    setOpenTables((current) => current.map((table) => (table.id === id ? { ...table, ...patch } : table)));
  };

  const startCheckoutFromOpenTable = (table: OpenTable) => {
    const nextDraft = {
      ...blankCheck(table.hostId, storeSettings),
      table: table.table,
      customerName: table.customerName,
      hostId: table.hostId,
      guests: table.guests,
      subtotal: table.currentAmount,
      payment: "カード" as Payment,
      cashAmount: 0,
      cardAmount: 0,
      receivableAmount: 0
    };
    setDraftCheck(withAutoReceivable(nextDraft, storeSettings));
    setEditingCheckId(null);
    setCheckoutSourceOpenTableId(table.id);
    setCheckoutEditorOpen(true);
  };

  const openCheckEdit = (check: TableCheck) => {
    setDraftCheck(check);
    setEditingCheckId(check.id);
    setCheckoutSourceOpenTableId(null);
    setCheckoutEditorOpen(true);
  };

  const openExpenseEdit = (expense: Expense) => {
    setExpenseDraft(expense);
    setEditingExpenseId(expense.id);
  };

  const closeExpenseEdit = () => {
    const ownerType = currentUser?.role === "host" ? "host" : "store";
    setEditingExpenseId(null);
    setExpenseDraft(blankExpense(currentUser?.hostId ?? selectedHostId, ownerType));
  };

  const saveCheck = () => {
    const previousCheck = editingCheckId !== null ? tableChecks.find((check) => check.id === editingCheckId) : undefined;
    const normalizedDraft = withAutoReceivable(draftCheck, storeSettings);
    const checkTotal = tableTotal(normalizedDraft);
    if (normalizedDraft.cashAmount + normalizedDraft.cardAmount > checkTotal) {
      setNotice("現金＋カードが合計を超えています。差額がマイナスの会計は保存できません。");
      return;
    }
    const normalizedReceivable = normalizedDraft.receivableAmount;
    const nextCheck = {
      ...normalizedDraft,
      id: editingCheckId ?? Date.now(),
      serviceRate: storeSettings.serviceRate,
      taxRate: storeSettings.taxRate,
      payment: paymentLabel(normalizedDraft),
      status: normalizedReceivable > 0 ? "receivable" : "paid",
      date: editingCheckId === null ? businessDateFor(storeSettings) : draftCheck.date,
      time: editingCheckId === null ? normalizedDraft.time : draftCheck.time
    } satisfies TableCheck;

    setTableChecks((current) =>
      editingCheckId === null ? [nextCheck, ...current] : current.map((check) => (check.id === editingCheckId ? nextCheck : check))
    );
    addOperationLog({
      scope: "会計",
      action: editingCheckId === null ? "登録" : "編集",
      target: `${nextCheck.table} / ${nextCheck.customerName}`,
      amount: tableTotal(nextCheck),
      detail:
        editingCheckId === null
          ? `${hostName(nextCheck.hostId)} / ${paymentLabelForDisplay(nextCheck, receivablesEnabled)}`
          : `${hostName(nextCheck.hostId)} / ${money(previousCheck ? tableTotal(previousCheck) : 0)} -> ${money(tableTotal(nextCheck))}`
    });
    if (checkoutSourceOpenTableId !== null) {
      setOpenTables((current) => current.filter((table) => table.id !== checkoutSourceOpenTableId));
    }
    if (receivablesEnabled) {
      setReceivables((current) => {
        const withoutCurrentCheck = current.filter((item) => item.sourceCheckId !== nextCheck.id);
        if (nextCheck.receivableAmount <= 0) return withoutCurrentCheck;
        return [receivableFromCheck(nextCheck), ...withoutCurrentCheck];
      });
    }
    setDraftCheck(blankCheck(selectedHostId, storeSettings));
    setEditingCheckId(null);
    setCheckoutSourceOpenTableId(null);
    setCheckoutEditorOpen(false);
  };

  const deleteCheck = (id: number) => {
    const targetCheck = tableChecks.find((check) => check.id === id);
    setTableChecks((current) => current.filter((check) => check.id !== id));
    setReceivables((current) => current.filter((item) => item.sourceCheckId !== id));
    if (targetCheck) {
      addOperationLog({
        scope: "会計",
        action: "削除",
        target: `${targetCheck.table} / ${targetCheck.customerName}`,
        amount: tableTotal(targetCheck),
        detail: `${hostName(targetCheck.hostId)} / ${paymentLabelForDisplay(targetCheck, receivablesEnabled)}`
      });
    }
    if (editingCheckId === id) {
      setDraftCheck(blankCheck(selectedHostId, storeSettings));
      setEditingCheckId(null);
      setCheckoutSourceOpenTableId(null);
      setCheckoutEditorOpen(false);
    }
  };

  const saveExpense = (overrides: Partial<Expense> = {}) => {
    const previousExpense = editingExpenseId !== null ? expenses.find((item) => item.id === editingExpenseId) : undefined;
    const isHostExpense = currentUser?.role === "host";
    const ownerType = overrides.ownerType ?? (isHostExpense ? "host" : "store");
    const hostId = ownerType === "host" ? overrides.hostId ?? currentUser?.hostId ?? selectedHostId : undefined;
    const mergedExpense = { ...expenseDraft, ...overrides };
    const normalizedTaxRate = [0, 8, 10].includes(Number(mergedExpense.taxRate)) ? Number(mergedExpense.taxRate) as ExpenseTaxRate : 10;
    const nextExpense = {
      ...mergedExpense,
      id: editingExpenseId ?? Date.now(),
      ownerType,
      hostId,
      amount: Math.max(0, mergedExpense.amount),
      taxRate: normalizedTaxRate
    } satisfies Expense;
    setExpenses((current) =>
      editingExpenseId === null
        ? [nextExpense, ...current]
        : current.map((item) => (item.id === editingExpenseId ? nextExpense : item))
    );
    addOperationLog({
      scope: "経費",
      action: editingExpenseId === null ? "登録" : "編集",
      target: `${nextExpense.category} / ${nextExpense.vendor || "支払先未入力"}`,
      amount: nextExpense.amount,
      detail:
        editingExpenseId === null
          ? `${nextExpense.ownerType === "store" ? "店舗" : hostName(nextExpense.hostId)} / ${nextExpense.paymentMethod}`
          : `${nextExpense.ownerType === "store" ? "店舗" : hostName(nextExpense.hostId)} / ${money(previousExpense?.amount ?? 0)} -> ${money(nextExpense.amount)}`
    });
    setEditingExpenseId(null);
    setExpenseDraft(blankExpense(hostId ?? selectedHostId, ownerType));
  };

  const deleteExpense = (id: number) => {
    const targetExpense = expenses.find((item) => item.id === id);
    setExpenses((current) => current.filter((item) => item.id !== id));
    if (targetExpense) {
      addOperationLog({
        scope: "経費",
        action: "削除",
        target: `${targetExpense.category} / ${targetExpense.vendor || "支払先未入力"}`,
        amount: targetExpense.amount,
        detail: `${targetExpense.ownerType === "store" ? "店舗" : hostName(targetExpense.hostId)} / ${targetExpense.paymentMethod}`
      });
    }
    if (editingExpenseId === id) {
      setEditingExpenseId(null);
      setExpenseDraft(blankExpense(selectedHostId));
    }
  };

  const saveRegisterClose = (actualCash: number, expectedCash: number, startCash: number, cashInjection: number, memo: string) => {
    if (!currentUser || !canOperate) return;
    const difference = actualCash - expectedCash;
    setRegisterCloses((current) => [
      {
        id: Date.now(),
        date: currentBusinessDate,
        startCash,
        cashInjection,
        expectedCash,
        actualCash,
        difference,
        closedBy: currentUser.name,
        time: currentTime(),
        memo
      },
      ...current
    ]);
    addOperationLog({
      scope: "締め",
      action: "保存",
      target: currentBusinessDate,
      amount: actualCash,
      detail: `予想 ${money(expectedCash)} / 差額 ${money(difference)}`
    });
    setNotice(`レジ締め保存: ${currentBusinessDate} 差額 ${money(difference)}`);
  };

  const applyReceivablePayment = (target: Receivable, amount: number) => {
    setReceivables((current) =>
      current
        .map((item) =>
          item.id === target.id
            ? {
                ...item,
                amount: Math.max(0, item.amount - amount),
                status: item.amount - amount <= 0 ? "ok" : item.status
              }
            : item
        )
        .filter((item) => item.amount > 0)
    );
    setHosts((current) =>
      current.map((host) =>
        host.id === target.hostId ? { ...host, receivable: Math.max(0, host.receivable - amount) } : host
      )
    );

    if (target.sourceCheckId) {
      setTableChecks((current) =>
        current.map((check) => {
          if (check.id !== target.sourceCheckId) return check;
          const receivableAmount = Math.max(0, check.receivableAmount - amount);
          const nextCheck = { ...check, receivableAmount };
          return {
            ...nextCheck,
            status: receivableAmount > 0 ? "receivable" : "paid",
            payment:
              receivableAmount > 0 || nextCheck.cashAmount > 0 || nextCheck.cardAmount > 0
                ? paymentLabel(nextCheck)
                : "現金"
          };
        })
      );
    }
  };

  const reportReceivablePayment = (item: Receivable, amount: number) => {
    if (!currentUser || currentUser.role !== "host") return;
    const reportedAmount = Math.min(item.amount, Math.max(0, Math.round(amount)));
    if (reportedAmount <= 0) return;
    const autoConfirmed = item.collection === "payrollDeducted";

    setReceivablePayments((current) => [
      {
        id: Date.now(),
        receivableId: item.id,
        hostId: item.hostId,
        amount: reportedAmount,
        reportedBy: currentUser.name,
        confirmedBy: autoConfirmed ? "給与控除" : undefined,
        status: autoConfirmed ? "confirmed" : "reported",
        time: new Intl.DateTimeFormat("ja-JP", { hour: "2-digit", minute: "2-digit" }).format(new Date())
      },
      ...current
    ]);
    if (autoConfirmed) {
      applyReceivablePayment(item, reportedAmount);
    }
    setNotice(`${hostName(item.hostId)} / ${item.customer} / ${autoConfirmed ? "給与控除報告" : "入金報告"} ${money(reportedAmount)}`);
  };

  const updateReceivableMemo = (item: Receivable, memo: string) => {
    if (!currentUser || currentUser.role !== "host" || item.hostId !== currentUser.hostId) return;
    setReceivables((current) => current.map((receivable) => (receivable.id === item.id ? { ...receivable, memo } : receivable)));
  };

  const updateReceivableCollection = (item: Receivable, collection: ReceivableCollection) => {
    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "staff")) return;
    setReceivables((current) =>
      current.map((receivable) => (receivable.id === item.id ? { ...receivable, collection } : receivable))
    );
  };

  const confirmReceivablePayment = (payment: ReceivablePayment) => {
    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "staff") || payment.status !== "reported") return;
    const target = receivables.find((item) => item.id === payment.receivableId);
    if (!target) return;

    const confirmedAmount = Math.min(target.amount, payment.amount);
    if (confirmedAmount <= 0) return;

    setReceivablePayments((current) =>
      current.map((item) =>
        item.id === payment.id
          ? { ...item, amount: confirmedAmount, status: "confirmed", confirmedBy: currentUser.name }
          : item
      )
    );
    applyReceivablePayment(target, confirmedAmount);
    setNotice(`${hostName(payment.hostId)} / 受取確認 ${money(confirmedAmount)}`);
  };

  const currentStore = storeAccounts.find((store) => store.id === currentStoreId) ?? storeAccounts[0];

  if (!currentUser) {
    return <LoginScreen stores={storeAccounts} users={users} onLogin={handleLogin} />;
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Host Store PWA</p>
          <h1>Store Pilot</h1>
          <p className="top-store-name">{currentStore.name}</p>
        </div>
        <span className="status-pill status-ok">
          {roleLabel[currentUser.role]} / {currentUser.name}
        </span>
      </header>

      <nav className="tabs" aria-label="主要メニュー">
        {visibleTabs.map(([id, label, Icon]) => (
          <button className={activeTab === id ? "tab is-active" : "tab"} key={id} type="button" onClick={() => setActiveTab(id)}>
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      {activeTab === "dashboard" && (
        currentUser.role === "host" ? (
          <HostHome
            host={selectedHost}
            todaySales={hostTodaySales}
            openTables={openTables.filter((table) => table.hostId === selectedHost.id)}
            onAddOpenTable={() => addOpenTable(selectedHost.id)}
            onUpdateOpenTable={updateOpenTable}
          />
        ) : (
          <StoreHome
            openTables={openTables}
            hosts={displayHosts}
            hostName={hostName}
            onRegisterOpenTable={startCheckoutFromOpenTable}
            onAddOpenTable={() => addOpenTable(selectedHostId)}
            onUpdateOpenTable={updateOpenTable}
            onDeleteOpenTable={(id) => setOpenTables((current) => current.filter((table) => table.id !== id))}
          />
        )
      )}

      {activeTab === "summary" && currentUser.role !== "host" && (
        <SummaryView
          storeSales={storeSales}
          todayCheckoutTotal={todayCheckoutTotal}
          storePaid={storePaid}
          storeReceivable={storeReceivable}
          storePayrollDeductedReceivable={storePayrollDeductedReceivable}
          storeExpenses={storeExpenses}
          expenses={expenses}
          hosts={displayHosts}
          receivables={visibleReceivables}
          receivablesEnabled={receivablesEnabled}
          tableChecks={tableChecks}
          currentBusinessDate={currentBusinessDate}
          hostName={hostName}
        />
      )}

      {activeTab === "rankings" && canOperate && (
        <RankingsView
          hosts={displayHosts}
          tableChecks={tableChecks}
          currentBusinessDate={currentBusinessDate}
        />
      )}

      {activeTab === "payroll" && canOperate && (
        <PayrollView
          hosts={displayHosts}
          settings={storeSettings}
          tableChecks={tableChecks}
          receivables={visibleReceivables}
          receivablesEnabled={receivablesEnabled}
          currentBusinessDate={currentBusinessDate}
        />
      )}

      {activeTab === "personal" && currentUser.role === "host" && (
        <PersonalView host={selectedHost} monthExpenses={hostMonthExpenses} receivables={visibleReceivables} receivablesEnabled={receivablesEnabled} tableChecks={tableChecks} />
      )}

      {activeTab === "daily" && currentUser.role === "host" && (
        <HostDailyView
          host={selectedHost}
          currentBusinessDate={currentBusinessDate}
          tableChecks={tableChecks}
          receivablesEnabled={receivablesEnabled}
        />
      )}

      {activeTab === "checkout" && canOperate && (
        <CheckoutView
          hosts={displayHosts}
          storeSettings={storeSettings}
          businessDate={currentBusinessDate}
          draftCheck={draftCheck}
          tableChecks={currentBusinessChecks}
          editingCheckId={editingCheckId}
          editorOpen={checkoutEditorOpen}
          hostName={hostName}
          receivablesEnabled={receivablesEnabled}
          onChangeDraft={(value) => setDraftCheck(withAutoReceivable(value, storeSettings))}
          onOpenNew={() => {
            const nextDraft = blankCheck(selectedHostId, storeSettings);
            setDraftCheck(nextDraft);
            setEditingCheckId(null);
            setCheckoutSourceOpenTableId(null);
            setCheckoutEditorOpen(true);
          }}
          onCloseEditor={() => {
            setDraftCheck(blankCheck(selectedHostId, storeSettings));
            setEditingCheckId(null);
            setCheckoutSourceOpenTableId(null);
            setCheckoutEditorOpen(false);
          }}
          onSave={saveCheck}
          onEdit={openCheckEdit}
          onDelete={deleteCheck}
          onCancelEdit={() => {
            setDraftCheck(blankCheck(selectedHostId, storeSettings));
            setEditingCheckId(null);
            setCheckoutSourceOpenTableId(null);
            setCheckoutEditorOpen(false);
          }}
        />
      )}

      {checkoutEditorOpen && canOperate && (
        <CheckoutEditorModal
          hosts={displayHosts}
          storeSettings={storeSettings}
          draftCheck={draftCheck}
          tableChecks={currentBusinessChecks}
          editingCheckId={editingCheckId}
          receivablesEnabled={receivablesEnabled}
          onChangeDraft={(value) => setDraftCheck(withAutoReceivable(value, storeSettings))}
          onClose={() => {
            setDraftCheck(blankCheck(selectedHostId, storeSettings));
            setEditingCheckId(null);
            setCheckoutSourceOpenTableId(null);
            setCheckoutEditorOpen(false);
          }}
          onSave={saveCheck}
        />
      )}

      {editingExpenseId !== null && (
        <ExpenseEditorModal
          draft={expenseDraft}
          onChangeDraft={setExpenseDraft}
          onClose={closeExpenseEdit}
          onSave={saveExpense}
          onDelete={() => deleteExpense(editingExpenseId)}
        />
      )}

      {activeTab === "receivables" && receivablesEnabled && (
        <ReceivablesView
          currentUser={currentUser}
          receivables={visibleReceivables}
          payments={receivablePayments}
          hostName={hostName}
          onUpdateMemo={updateReceivableMemo}
          onUpdateCollection={updateReceivableCollection}
          onReportPayment={reportReceivablePayment}
          onConfirmPayment={confirmReceivablePayment}
        />
      )}

      {activeTab === "expenses" && currentUser.role === "host" && (
        <ExpensesView
          currentUser={currentUser}
          hosts={displayHosts}
          expenses={expenses}
          draft={expenseDraft}
          hostName={hostName}
          onChangeDraft={setExpenseDraft}
          onSave={saveExpense}
          onEdit={openExpenseEdit}
          onDelete={deleteExpense}
        />
      )}

      {activeTab === "closing" && canOperate && (
        <ClosingView
          businessDate={currentBusinessDate}
          tableChecks={currentBusinessChecks}
          receivablesEnabled={receivablesEnabled}
          expenses={expenses}
          draft={expenseDraft}
          closes={registerCloses}
          onChangeDraft={setExpenseDraft}
          onSaveExpense={() => saveExpense({ date: currentBusinessDate, ownerType: "store", hostId: undefined })}
          onEditExpense={openExpenseEdit}
          onDeleteExpense={deleteExpense}
          onSave={saveRegisterClose}
        />
      )}

      {activeTab === "annual" && (
        <AnnualView
          currentUser={currentUser}
          settings={storeSettings}
          hosts={displayHosts}
          selectedHostId={selectedHostId}
          expenses={expenses}
          receivables={visibleReceivables}
          receivablesEnabled={receivablesEnabled}
          tableChecks={tableChecks}
          currentBusinessDate={currentBusinessDate}
          onSelectHost={setSelectedHostId}
        />
      )}

      {activeTab === "admin" && (
        currentUser.role === "host" ? (
          <section className="host-management-stack">
            <CollapsiblePanel eyebrow="個人" title="年間集計" icon={FileText} className="host-tax-panel">
              <AnnualView
                currentUser={currentUser}
                settings={storeSettings}
                hosts={displayHosts}
                selectedHostId={selectedHostId}
                expenses={expenses}
                receivables={visibleReceivables}
                receivablesEnabled={receivablesEnabled}
                tableChecks={tableChecks}
                currentBusinessDate={currentBusinessDate}
                onSelectHost={setSelectedHostId}
              />
            </CollapsiblePanel>
            <CollapsiblePanel eyebrow="申告" title="確定申告用" icon={ReceiptText} className="host-tax-panel">
              <TaxReturnExpenseView
                currentUser={currentUser}
                settings={storeSettings}
                hosts={displayHosts}
                selectedHostId={selectedHostId}
                expenses={expenses}
                tableChecks={tableChecks}
                currentBusinessDate={currentBusinessDate}
              />
            </CollapsiblePanel>
            <ManagementView
              currentUser={currentUser}
              settings={storeSettings}
              notice={notice}
              installHint={installHint}
              operationLogs={operationLogs}
              hosts={displayHosts}
              tableChecks={tableChecks}
              hostName={hostName}
              onInstall={handleInstall}
              onLogout={handleLogout}
              onUpdateSettings={setStoreSettings}
              onClearDevice={handleClearDevice}
              users={users}
              canManage={canManage}
              onUpdateUser={updateUser}
              onAddUser={addEmployee}
              onDeleteUser={(id) => setUsers((current) => current.filter((user) => user.id !== id))}
            />
          </section>
        ) : (
          <ManagementView
            currentUser={currentUser}
            settings={storeSettings}
            notice={notice}
            installHint={installHint}
            operationLogs={operationLogs}
            hosts={displayHosts}
            tableChecks={tableChecks}
            hostName={hostName}
            onInstall={handleInstall}
            onLogout={handleLogout}
            onUpdateSettings={setStoreSettings}
            onClearDevice={handleClearDevice}
            users={users}
            canManage={canManage}
            onUpdateUser={updateUser}
            onAddUser={addEmployee}
            onDeleteUser={(id) => setUsers((current) => current.filter((user) => user.id !== id))}
          />
        )
      )}
    </main>
  );
}

function LoginScreen({
  stores,
  users,
  onLogin
}: {
  stores: StoreAccount[];
  users: AppUser[];
  onLogin: (user: AppUser, store: StoreAccount) => void;
}) {
  const [selectedStoreId, setSelectedStoreId] = React.useState(stores[0]?.id ?? "");
  const [storePassword, setStorePassword] = React.useState("");
  const [storeUnlocked, setStoreUnlocked] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const selectedStore = stores.find((store) => store.id === selectedStoreId) ?? stores[0];
  const activeUsers = users.filter((user) => user.active);
  const selectedUser = activeUsers.find((user) => String(user.id) === selectedUserId);

  const unlockStore = () => {
    if (!selectedStore || storePassword !== selectedStore.password) {
      setError("店舗パスワードが違います");
      return;
    }
    setStoreUnlocked(true);
    setError("");
  };

  const loginUser = () => {
    if (!selectedStore || !selectedUser || userPassword !== selectedUser.password) {
      setError("個人パスワードが違います");
      return;
    }
    onLogin(selectedUser, selectedStore);
  };

  return (
    <main className="login-shell">
      <section className="login-panel">
        <p className="eyebrow">Store Pilot</p>
        <h1>{storeUnlocked ? "名前選択" : "店舗選択"}</h1>
        <p className="login-copy">{storeUnlocked ? "従業員名を選んで個人パスワードを入力します。" : "店舗を選んで店舗パスワードを入力します。"}</p>

        {!storeUnlocked ? (
          <div className="login-form">
            <SelectField
              label="店舗"
              value={selectedStoreId}
              options={stores.map((store) => ({ label: store.name, value: store.id }))}
              onChange={(storeId) => {
                setSelectedStoreId(storeId);
                setStorePassword("");
                setError("");
              }}
            />
            <label className="number-field">
              <span>店舗パスワード</span>
              <input type="password" value={storePassword} onChange={(event) => setStorePassword(event.target.value)} />
            </label>
            <button className="install-button full-button" type="button" onClick={unlockStore}>
              次へ
            </button>
          </div>
        ) : (
          <div className="login-form">
            <SelectField
              label="名前"
              value={selectedUserId}
              options={[{ label: "選択してください", value: "" }, ...activeUsers.map((user) => ({ label: `${user.name} / ${roleLabel[user.role]}`, value: String(user.id) }))]}
              onChange={(userId) => {
                setSelectedUserId(userId);
                setUserPassword("");
                setError("");
              }}
            />
            <label className="number-field">
              <span>個人パスワード</span>
              <input type="password" value={userPassword} onChange={(event) => setUserPassword(event.target.value)} />
            </label>
            <div className="button-row login-actions">
              <button className="icon-text-button ghost-button" type="button" onClick={() => setStoreUnlocked(false)}>
                戻る
              </button>
              <button className="install-button" type="button" onClick={loginUser}>
                ログイン
              </button>
            </div>
          </div>
        )}
        {error && <p className="login-error">{error}</p>}
      </section>
    </main>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
  tone
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ size?: number }>;
  tone: "ink" | "green" | "orange" | "red";
}) {
  return (
    <article className={`metric tone-${tone}`}>
      <div className="metric-icon">
        <Icon size={20} />
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

function StoreHome({
  openTables,
  hosts,
  hostName,
  onRegisterOpenTable,
  onAddOpenTable,
  onUpdateOpenTable,
  onDeleteOpenTable
}: {
  openTables: OpenTable[];
  hosts: Host[];
  hostName: (hostId?: number) => string;
  onRegisterOpenTable: (table: OpenTable) => void;
  onAddOpenTable: () => void;
  onUpdateOpenTable: (id: number, patch: Partial<OpenTable>) => void;
  onDeleteOpenTable: (id: number) => void;
}) {
  return (
    <section className="home-stack">
      <article className="panel wide">
        <OpenTablesPanel
          title="当日の未会計"
          openTables={openTables}
          hosts={hosts}
          hostName={hostName}
          canEditAmount
          canChangeHost
          canDelete
          onAdd={onAddOpenTable}
          onUpdate={onUpdateOpenTable}
          onDelete={onDeleteOpenTable}
          onRegister={onRegisterOpenTable}
        />
      </article>

    </section>
  );
}

function HostHome({
  host,
  todaySales,
  openTables,
  onAddOpenTable,
  onUpdateOpenTable
}: {
  host: Host;
  todaySales: number;
  openTables: OpenTable[];
  onAddOpenTable: () => void;
  onUpdateOpenTable: (id: number, patch: Partial<OpenTable>) => void;
}) {
  const openTotal = openTables.reduce((sum, table) => sum + table.currentAmount, 0);

  return (
    <section className="home-stack">
      <article className="panel wide">
        <div className="panel-header">
          <div>
            <p className="eyebrow">日次</p>
            <h3>{host.name}</h3>
          </div>
        </div>
        <div className="detail-metrics compact-metrics">
          <Metric label="当日売上" value={money(todaySales)} icon={ReceiptText} tone="green" />
          <Metric label="未会計現状" value={money(openTotal)} icon={ClipboardList} tone="orange" />
        </div>
      </article>

      <article className="panel wide">
        <OpenTablesPanel
          title="未会計の卓"
          openTables={openTables}
          hosts={[host]}
          hostName={() => host.name}
          canEditAmount={false}
          canChangeHost={false}
          canDelete={false}
          showTotalPill={false}
          showTimeWithCustomer
          onAdd={onAddOpenTable}
          onUpdate={onUpdateOpenTable}
        />
      </article>
    </section>
  );
}

function HostDailyView({
  host,
  currentBusinessDate,
  tableChecks,
  receivablesEnabled
}: {
  host: Host;
  currentBusinessDate: string;
  tableChecks: TableCheck[];
  receivablesEnabled: boolean;
}) {
  const dateOptions = React.useMemo(() => {
    const dates = Array.from(new Set([
      currentBusinessDate,
      ...tableChecks.filter((check) => check.hostId === host.id).map((check) => check.date)
    ]));
    return dates
      .filter(Boolean)
      .sort((a, b) => b.localeCompare(a))
      .map((value) => ({ value, label: value }));
  }, [currentBusinessDate, host.id, tableChecks]);
  const [selectedDate, setSelectedDate] = React.useState(currentBusinessDate);
  React.useEffect(() => {
    setSelectedDate(currentBusinessDate);
  }, [currentBusinessDate]);
  const selectedChecks = tableChecks.filter((check) => check.hostId === host.id && check.date === selectedDate);
  const dailySales = selectedChecks.reduce((sum, check) => sum + tableTotal(check), 0);
  const cashTotal = selectedChecks.reduce((sum, check) => sum + check.cashAmount, 0);
  const cardTotal = selectedChecks.reduce((sum, check) => sum + check.cardAmount, 0);
  const receivableTotal = receivablesEnabled ? selectedChecks.reduce((sum, check) => sum + check.receivableAmount, 0) : 0;
  const dateLabel = selectedDate === currentBusinessDate ? "当日" : "売上";

  return (
    <section className="home-stack">
      <article className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">日次</p>
            <h3>{host.name}</h3>
          </div>
          <div className="month-select-wrap host-daily-date">
            <SelectField
              label="表示日"
              value={selectedDate}
              options={dateOptions}
              onChange={setSelectedDate}
            />
          </div>
          <div className="daily-total-pills">
            <span className="status-pill status-ok">{dateLabel} {money(dailySales)}</span>
            <span className="status-pill status-ok">現金 {money(cashTotal)}</span>
            <span className="status-pill status-warn">カード {money(cardTotal)}</span>
            {receivablesEnabled && <span className="status-pill status-danger">売掛 {money(receivableTotal)}</span>}
          </div>
        </div>
        <div className="table-check-list compact-check-list">
          {selectedChecks.length === 0 ? (
            <div className="plain-note">
              <ReceiptText size={20} />
              <div>
                <strong>この日の会計はまだありません</strong>
                <p>管理者・内勤が会計を登録するとここに反映されます。</p>
              </div>
            </div>
          ) : (
            selectedChecks.map((check) => {
              const showReceivable = receivablesEnabled && hasReceivablePayment(check);

              return (
                <div className="table-check-row compact-check-row host-daily-row" key={check.id}>
                  <div className="check-line-main">
                    <strong>{check.table}</strong>
                    <span>{check.guests}名</span>
                    <span>{check.customerName}</span>
                    {showReceivable && <small className="status-pill pay-pill status-danger">{paymentLabelForDisplay(check, receivablesEnabled)}</small>}
                  </div>
                  <b className="check-amount">{money(tableTotal(check))}</b>
                </div>
              );
            })
          )}
        </div>
      </article>

    </section>
  );
}

function SummaryView({
  storeSales,
  todayCheckoutTotal,
  storePaid,
  storeReceivable,
  storePayrollDeductedReceivable,
  storeExpenses,
  expenses,
  hosts,
  receivables,
  receivablesEnabled,
  tableChecks,
  currentBusinessDate,
  hostName
}: {
  storeSales: number;
  todayCheckoutTotal: number;
  storePaid: number;
  storeReceivable: number;
  storePayrollDeductedReceivable: number;
  storeExpenses: number;
  expenses: Expense[];
  hosts: Host[];
  receivables: Receivable[];
  receivablesEnabled: boolean;
  tableChecks: TableCheck[];
  currentBusinessDate: string;
  hostName: (hostId?: number) => string;
}) {
  const monthOptions = React.useMemo(() => {
    const dateByCheckId = new Map(tableChecks.map((check) => [check.id, check.date]));
    const months = Array.from(new Set([
      currentBusinessDate.slice(0, 7),
      ...tableChecks.map((check) => check.date.slice(0, 7)),
      ...expenses.filter((expense) => expense.ownerType === "store").map((expense) => expense.date.slice(0, 7)),
      ...receivables.map((item) =>
        item.sourceCheckId
          ? dateByCheckId.get(item.sourceCheckId)?.slice(0, 7) ?? ""
          : dateFromShortDue(item.due, currentBusinessDate.slice(0, 4)).slice(0, 7)
      )
    ]));
    return months
      .filter(Boolean)
      .sort((a, b) => b.localeCompare(a))
      .map((value) => {
        const [year, month] = value.split("-");
        return { value, label: `${year}年${Number(month)}月` };
      });
  }, [currentBusinessDate, expenses, receivables, tableChecks]);
  const [selectedMonth, setSelectedMonth] = React.useState(currentBusinessDate.slice(0, 7));
  const monthChecks = tableChecks.filter((check) => check.date.startsWith(selectedMonth));
  const checkDateById = new Map(tableChecks.map((check) => [check.id, check.date]));
  const receivableDate = (item: Receivable, fallbackYear: string) =>
    item.sourceCheckId ? checkDateById.get(item.sourceCheckId) ?? "" : dateFromShortDue(item.due, fallbackYear);
  const monthSales = monthChecks.reduce((sum, check) => sum + tableTotal(check), 0);
  const monthPaid = monthChecks.reduce((sum, check) => sum + check.cashAmount + check.cardAmount, 0);
  const monthOpenReceivables = receivables.filter((item) => receivableDate(item, selectedMonth.slice(0, 4)).startsWith(selectedMonth));
  const monthUncollectedReceivable = monthOpenReceivables.reduce((sum, item) => sum + item.amount, 0);
  const monthStoreExpenses = expenses.filter((expense) => expense.ownerType === "store" && expense.date.startsWith(selectedMonth));
  const monthStoreExpenseTotal = monthStoreExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const [selectedDayDate, setSelectedDayDate] = React.useState<string | null>(null);
  const [daySearchQuery, setDaySearchQuery] = React.useState("");
  const monthReceivableDates = monthOpenReceivables.map((item) => receivableDate(item, selectedMonth.slice(0, 4))).filter(Boolean);
  const dailyRows = Array.from(new Set([...monthChecks.map((check) => check.date), ...monthStoreExpenses.map((expense) => expense.date), ...monthReceivableDates]))
    .sort((a, b) => b.localeCompare(a))
    .map((date) => {
      const checks = monthChecks.filter((check) => check.date === date);
      const dayExpenses = monthStoreExpenses.filter((expense) => expense.date === date);
      const dayOpenReceivables = monthOpenReceivables.filter((item) => receivableDate(item, selectedMonth.slice(0, 4)) === date);
      return {
        date,
        sales: checks.reduce((sum, check) => sum + tableTotal(check), 0),
        paid: checks.reduce((sum, check) => sum + check.cashAmount + check.cardAmount, 0),
        receivable: dayOpenReceivables.reduce((sum, item) => sum + item.amount, 0),
        expenses: dayExpenses.reduce((sum, expense) => sum + expense.amount, 0)
      };
    });
  const timeOrder = (time: string) => {
    const [hourText, minuteText] = time.split(":");
    const hour = Number(hourText) || 0;
    const minute = Number(minuteText) || 0;
    return (hour < 12 ? hour + 24 : hour) * 60 + minute;
  };
  const selectedDayChecks = selectedDayDate
    ? tableChecks
        .filter((check) => check.date === selectedDayDate)
        .sort((a, b) => timeOrder(a.time) - timeOrder(b.time) || a.id - b.id)
    : [];
  const normalizedDaySearch = daySearchQuery.trim().toLowerCase();
  const filteredDayChecks = normalizedDaySearch
    ? selectedDayChecks.filter((check) => {
        const searchableText = `${check.time} ${check.table} ${check.customerName} ${hostName(check.hostId)} ${paymentLabelForDisplay(check, receivablesEnabled)} ${tableTotal(check)}`.toLowerCase();
        return searchableText.includes(normalizedDaySearch);
      })
    : selectedDayChecks;

  return (
    <section className="period-summary-layout">
      <div className="summary-stack monthly-summary-stack">
        <article className="panel summary-panel">
          <div className="panel-header">
            <div>
              <h3>月次 / 日次</h3>
            </div>
            <div className="summary-filter-row">
              <SelectField
                label="表示月"
                value={selectedMonth}
                options={monthOptions}
                onChange={setSelectedMonth}
              />
            </div>
          </div>
          <div className="quick-numbers summary-metrics" aria-label="店舗集計">
            <Metric label="月間総売上" value={yenMoney(monthSales)} icon={BarChart3} tone="ink" />
            <Metric label="月間入金済" value={yenMoney(monthPaid)} icon={CheckCircle2} tone="green" />
            {receivablesEnabled && <Metric label="未回収売掛" value={yenMoney(monthUncollectedReceivable)} icon={AlertTriangle} tone="orange" />}
            <Metric label="月間店舗経費" value={yenMoney(monthStoreExpenseTotal)} icon={ReceiptText} tone="red" />
          </div>

          <div className="panel-header compact-header">
            <div>
              <p className="eyebrow">日別</p>
              <h3>{receivablesEnabled ? "売上・入金・未回収・経費" : "売上・入金・経費"}</h3>
            </div>
          </div>
          <div className="daily-summary-list">
            <div className={receivablesEnabled ? "daily-summary-row daily-summary-head" : "daily-summary-row daily-summary-head no-receivable"}>
              <span>日付</span>
              <span>売上</span>
              <span>入金</span>
              {receivablesEnabled && <span>未回収</span>}
              <span>経費</span>
            </div>
            {dailyRows.length === 0 ? (
              <div className="plain-note">
                <ReceiptText size={20} />
                <div>
                  <strong>この月のデータはまだありません</strong>
                  <p>会計か店舗経費を登録すると日別に表示されます。</p>
                </div>
              </div>
            ) : (
              dailyRows.map((row) => (
                <button className={receivablesEnabled ? "daily-summary-row selectable-row" : "daily-summary-row selectable-row no-receivable"} type="button" key={row.date} onClick={() => {
                  setSelectedDayDate(row.date);
                  setDaySearchQuery("");
                }}>
                  <strong>{row.date}</strong>
                  <b>{yenMoney(row.sales)}</b>
                  <b>{yenMoney(row.paid)}</b>
                  {receivablesEnabled && <b>{yenMoney(row.receivable)}</b>}
                  <b>{yenMoney(row.expenses)}</b>
                </button>
              ))
            )}
          </div>
        </article>

        <ExpenseCategorySummary
          eyebrow="経費"
          title="勘定科目別"
          expenses={monthStoreExpenses}
        />
      </div>

      <StoreAnnualView expenses={expenses} receivables={receivables} receivablesEnabled={receivablesEnabled} tableChecks={tableChecks} currentBusinessDate={currentBusinessDate} />

      {selectedDayDate && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="当日会計一覧">
          <article className="panel checkout-modal day-check-modal">
            <div className="panel-header">
              <div>
                <p className="eyebrow">当日会計</p>
                <h3>{selectedDayDate}</h3>
              </div>
              <button className="icon-text-button ghost-button" type="button" onClick={() => setSelectedDayDate(null)}>
                閉じる
              </button>
            </div>
            <div className="receivable-search-row">
              <label className="search-shell receivable-search">
                <span>検索</span>
                <input
                  type="search"
                  value={daySearchQuery}
                  placeholder="卓番・客名・ホスト名"
                  onChange={(event) => setDaySearchQuery(event.target.value)}
                />
              </label>
              <span className="status-pill status-ok">{filteredDayChecks.length}件</span>
            </div>
            <div className="day-check-list">
              <div className="day-check-row day-check-head">
                <span>入店時間</span>
                <span>卓番</span>
                <span>名前</span>
                <span>担当</span>
                <span>支払</span>
                <span>合計</span>
              </div>
              {filteredDayChecks.length === 0 ? (
                <div className="plain-note">
                  <ReceiptText size={20} />
                  <div>
                    <strong>会計がありません</strong>
                    <p>検索条件を変えるか、別の日付を選択してください。</p>
                  </div>
                </div>
              ) : (
                filteredDayChecks.map((check) => (
                  <div className="day-check-row" key={check.id}>
                    <strong>{check.time}</strong>
                    <span>{check.table}</span>
                    <span>{check.customerName}</span>
                    <span>{hostName(check.hostId)}</span>
                    <span>{paymentLabelForDisplay(check, receivablesEnabled)}</span>
                    <b>{yenMoney(tableTotal(check))}</b>
                  </div>
                ))
              )}
            </div>
          </article>
        </div>
      )}
    </section>
  );
}

function RankingsView({
  hosts,
  tableChecks,
  currentBusinessDate
}: {
  hosts: Host[];
  tableChecks: TableCheck[];
  currentBusinessDate: string;
}) {
  const monthOptions = React.useMemo(() => {
    const months = Array.from(new Set([currentBusinessDate.slice(0, 7), ...tableChecks.map((check) => check.date.slice(0, 7))]));
    return months
      .filter(Boolean)
      .sort((a, b) => b.localeCompare(a))
      .map((value) => {
        const [year, month] = value.split("-");
        return { value, label: `${year}年${Number(month)}月` };
      });
  }, [currentBusinessDate, tableChecks]);
  const [selectedMonth, setSelectedMonth] = React.useState(currentBusinessDate.slice(0, 7));
  const monthChecks = tableChecks.filter((check) => check.date.startsWith(selectedMonth));
  const rankingRows = hosts.map((host) => {
    const hostChecks = monthChecks.filter((check) => check.hostId === host.id);
    const sales = hostChecks.reduce((sum, check) => sum + tableTotal(check), 0);
    const groups = hostChecks.length;
    return { host, sales, groups };
  });
  const salesRows = [...rankingRows].sort((a, b) => b.sales - a.sales || b.groups - a.groups || a.host.rank - b.host.rank);
  const groupRows = [...rankingRows].sort((a, b) => b.groups - a.groups || b.sales - a.sales || a.host.rank - b.host.rank);

  const renderRow = (row: (typeof rankingRows)[number], index: number, mode: "sales" | "groups") => (
    <div className="rank-row" key={`${mode}-${row.host.id}`}>
      <span>{index + 1}</span>
      <div>
        <strong>{row.host.name}</strong>
        <p>{yenMoney(row.sales)} / {row.groups}組 / 目標 {yenMoney(row.host.target)}</p>
      </div>
      <b>{mode === "sales" ? yenMoney(row.sales) : `${row.groups}組`}</b>
    </div>
  );

  return (
    <section className="content-grid ranking-grid">
      <div className="ranking-toolbar">
        <div className="month-select-wrap">
          <SelectField
            label="表示月"
            value={selectedMonth}
            options={monthOptions}
            onChange={setSelectedMonth}
          />
        </div>
      </div>

      <article className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">左</p>
            <h3>売上順位</h3>
          </div>
          <Trophy size={22} />
        </div>
        <div className="host-rank-list">
          {salesRows.map((row, index) => renderRow(row, index, "sales"))}
        </div>
      </article>

      <article className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">右</p>
            <h3>組数順位</h3>
          </div>
          <Users size={22} />
        </div>
        <div className="host-rank-list">
          {groupRows.map((row, index) => renderRow(row, index, "groups"))}
        </div>
      </article>
    </section>
  );
}

function PayrollView({
  hosts,
  settings,
  tableChecks,
  receivables,
  receivablesEnabled,
  currentBusinessDate
}: {
  hosts: Host[];
  settings: StoreSettings;
  tableChecks: TableCheck[];
  receivables: Receivable[];
  receivablesEnabled: boolean;
  currentBusinessDate: string;
}) {
  type PayrollItem = {
    id: number;
    label: string;
    amount: number;
  };
  type PayrollAdjustment = {
    rate?: number;
    additions: PayrollItem[];
    deductions: PayrollItem[];
  };
  const blankPayrollAdjustment = (): PayrollAdjustment => ({ additions: [], deductions: [] });
  const monthOptions = React.useMemo(() => {
    const months = Array.from(new Set([currentBusinessDate.slice(0, 7), ...tableChecks.map((check) => check.date.slice(0, 7))]));
    return months
      .filter(Boolean)
      .sort((a, b) => b.localeCompare(a))
      .map((value) => {
        const [year, month] = value.split("-");
        return { value, label: `${year}年${Number(month)}月` };
      });
  }, [currentBusinessDate, tableChecks]);
  const [selectedMonth, setSelectedMonth] = React.useState(currentBusinessDate.slice(0, 7));
  const [editingHostId, setEditingHostId] = React.useState<number | null>(null);
  const [payrollAdjustments, setPayrollAdjustments] = React.useState<Record<number, PayrollAdjustment>>({});
  const monthChecks = tableChecks.filter((check) => check.date.startsWith(selectedMonth));
  const baseAmount = (check: TableCheck) => (settings.payrollBase === "subtotal" ? check.subtotal : tableTotal(check));
  const withholdingTaxRate = settings.withholdingTaxRate ?? 0;
  const withholdingEnabled = withholdingTaxRate > 0;
  const payrollRows = hosts.map((host) => {
    const hostChecks = monthChecks.filter((check) => check.hostId === host.id);
    const base = hostChecks.reduce((sum, check) => sum + baseAmount(check), 0);
    const adjustment = payrollAdjustments[host.id] ?? blankPayrollAdjustment();
    const rate = adjustment.rate ?? settings.payrollRate;
    const salaryBase = Math.round(base * (rate / 100));
    const additionsTotal = adjustment.additions.reduce((sum, item) => sum + item.amount, 0);
    const manualDeductionsTotal = adjustment.deductions.reduce((sum, item) => sum + item.amount, 0);
    const payrollDeduction = receivablesEnabled ? receivables
      .filter((item) => item.hostId === host.id && item.collection === "payrollDeducted")
      .reduce((sum, item) => sum + item.amount, 0) : 0;
    const uncollectedReceivable = receivablesEnabled ? receivables
      .filter((item) => item.hostId === host.id)
      .reduce((sum, item) => sum + item.amount, 0) : 0;
    const supplyTotal = salaryBase + additionsTotal;
    const withholdingTax = withholdingEnabled ? Math.round(supplyTotal * (withholdingTaxRate / 100)) : 0;
    const deductionTotal = manualDeductionsTotal + payrollDeduction + withholdingTax;
    const payable = supplyTotal - deductionTotal;
    return { host, base, rate, salaryBase, adjustment, additionsTotal, payrollDeduction, manualDeductionsTotal, withholdingTax, deductionTotal, supplyTotal, uncollectedReceivable, payable };
  });
  const totals = payrollRows.reduce(
    (acc, row) => ({
      uncollectedReceivable: acc.uncollectedReceivable + row.uncollectedReceivable,
      payable: acc.payable + row.payable
    }),
    { uncollectedReceivable: 0, payable: 0 }
  );
  const editingRow = payrollRows.find((row) => row.host.id === editingHostId);
  const updatePayrollAdjustment = (hostId: number, patch: Partial<PayrollAdjustment>) => {
    setPayrollAdjustments((current) => {
      const base = current[hostId] ?? blankPayrollAdjustment();
      return { ...current, [hostId]: { ...base, ...patch } };
    });
  };
  const addPayrollItem = (hostId: number, type: "additions" | "deductions") => {
    const label = type === "additions" ? "支給項目" : "控除項目";
    setPayrollAdjustments((current) => {
      const base = current[hostId] ?? blankPayrollAdjustment();
      return { ...current, [hostId]: { ...base, [type]: [...base[type], { id: Date.now(), label, amount: 0 }] } };
    });
  };
  const updatePayrollItem = (hostId: number, type: "additions" | "deductions", itemId: number, patch: Partial<PayrollItem>) => {
    setPayrollAdjustments((current) => {
      const base = current[hostId] ?? blankPayrollAdjustment();
      return { ...current, [hostId]: { ...base, [type]: base[type].map((item) => (item.id === itemId ? { ...item, ...patch } : item)) } };
    });
  };
  const deletePayrollItem = (hostId: number, type: "additions" | "deductions", itemId: number) => {
    setPayrollAdjustments((current) => {
      const base = current[hostId] ?? blankPayrollAdjustment();
      return { ...current, [hostId]: { ...base, [type]: base[type].filter((item) => item.id !== itemId) } };
    });
  };

  return (
    <section className="summary-stack">
      <article className="panel payroll-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">給与計算</p>
            <h3>月次給与</h3>
          </div>
          <div className="summary-filter-row">
            <SelectField
              label="表示月"
              value={selectedMonth}
              options={monthOptions}
              onChange={setSelectedMonth}
            />
          </div>
        </div>
        <div className="quick-numbers summary-metrics">
          <Metric label="支給額合計" value={yenMoney(totals.payable)} icon={Coins} tone="green" />
          {receivablesEnabled && <Metric label="未回収売掛合計" value={yenMoney(totals.uncollectedReceivable)} icon={AlertTriangle} tone="red" />}
        </div>

        <div className="payroll-list">
          <div className={`payroll-row payroll-head${withholdingEnabled ? " with-withholding" : ""}${receivablesEnabled ? "" : " no-receivable"}`}>
            <span>ホスト</span>
            <span>売上</span>
            <span>歩合</span>
            {receivablesEnabled && <span>売掛</span>}
            {withholdingEnabled && <span>源泉</span>}
            <span>控除</span>
            <span>支給額</span>
          </div>
          {payrollRows.map((row) => (
            <button
              className={`payroll-row payroll-action-row${withholdingEnabled ? " with-withholding" : ""}${receivablesEnabled ? "" : " no-receivable"}`}
              type="button"
              key={row.host.id}
              onClick={() => setEditingHostId(row.host.id)}
            >
              <span className="payroll-name-button">{row.host.name}</span>
              <b>{yenMoney(row.base)}</b>
              <b>{row.rate}%</b>
              {receivablesEnabled && <b>{yenMoney(row.uncollectedReceivable)}</b>}
              {withholdingEnabled && <b>{yenMoney(row.withholdingTax)}</b>}
              <b>{yenMoney(row.deductionTotal)}</b>
              <b>{yenMoney(row.payable)}</b>
            </button>
          ))}
        </div>
      </article>

      {editingRow && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="給与計算編集">
          <article className="panel checkout-modal">
            <div className="panel-header">
              <div>
                <p className="eyebrow">給与計算</p>
                <h3>{editingRow.host.name}</h3>
              </div>
              <span className="status-pill status-ok">支給 {yenMoney(editingRow.payable)}</span>
            </div>
            <div className="form-grid">
              <NumberField
                label="個別歩合 %"
                value={editingRow.rate}
                min={0}
                max={100}
                step={1}
                onChange={(rate) => updatePayrollAdjustment(editingRow.host.id, { rate })}
              />
            </div>
            <div className="payroll-edit-section">
              <div className="panel-header compact-header">
                <div>
                  <p className="eyebrow">支給</p>
                  <h3>支給項目</h3>
                </div>
                <button className="icon-text-button" type="button" onClick={() => addPayrollItem(editingRow.host.id, "additions")}>
                  <Plus size={16} />
                  追加
                </button>
              </div>
              <div className="payroll-item-list">
                {editingRow.adjustment.additions.length === 0 ? (
                  <p className="tax-note">追加支給なし</p>
                ) : (
                  editingRow.adjustment.additions.map((item) => (
                    <div className="payroll-item-row" key={item.id}>
                      <input
                        className="payroll-item-input"
                        type="text"
                        value={item.label}
                        aria-label="支給項目"
                        onChange={(event) => updatePayrollItem(editingRow.host.id, "additions", item.id, { label: event.target.value })}
                      />
                      <input
                        className="payroll-item-input amount"
                        type="text"
                        inputMode="numeric"
                        value={plainNumber(item.amount)}
                        aria-label="支給金額"
                        onChange={(event) => updatePayrollItem(editingRow.host.id, "additions", item.id, { amount: Math.max(0, parsePlainNumber(event.target.value)) })}
                      />
                      <button className="icon-button danger-button" type="button" aria-label="支給項目削除" onClick={() => deletePayrollItem(editingRow.host.id, "additions", item.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="payroll-edit-section">
              <div className="panel-header compact-header">
                <div>
                  <p className="eyebrow">控除</p>
                  <h3>控除項目</h3>
                </div>
                <button className="icon-text-button" type="button" onClick={() => addPayrollItem(editingRow.host.id, "deductions")}>
                  <Plus size={16} />
                  追加
                </button>
              </div>
              <div className="payroll-item-list">
                {editingRow.adjustment.deductions.length === 0 ? (
                  <p className="tax-note">追加控除なし</p>
                ) : (
                  editingRow.adjustment.deductions.map((item) => (
                    <div className="payroll-item-row" key={item.id}>
                      <input
                        className="payroll-item-input"
                        type="text"
                        value={item.label}
                        aria-label="控除項目"
                        onChange={(event) => updatePayrollItem(editingRow.host.id, "deductions", item.id, { label: event.target.value })}
                      />
                      <input
                        className="payroll-item-input amount"
                        type="text"
                        inputMode="numeric"
                        value={plainNumber(item.amount)}
                        aria-label="控除金額"
                        onChange={(event) => updatePayrollItem(editingRow.host.id, "deductions", item.id, { amount: Math.max(0, parsePlainNumber(event.target.value)) })}
                      />
                      <button className="icon-button danger-button" type="button" aria-label="控除項目削除" onClick={() => deletePayrollItem(editingRow.host.id, "deductions", item.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="result-lines">
              <div><span>給与対象</span><b>{settings.payrollBase === "subtotal" ? "小計" : "総計"}</b></div>
              <div><span>売上</span><b>{yenMoney(editingRow.base)}</b></div>
              <div><span>歩合</span><b>{editingRow.rate}%</b></div>
              {receivablesEnabled && <div><span>売掛</span><b>{yenMoney(editingRow.uncollectedReceivable)}</b></div>}
              <div><span>支給合計</span><b>{yenMoney(editingRow.supplyTotal)}</b></div>
              {withholdingEnabled && <div><span>源泉所得税</span><b>-{yenMoney(editingRow.withholdingTax)}</b></div>}
              <div><span>控除合計</span><b>-{yenMoney(editingRow.deductionTotal)}</b></div>
              <div><span>支給額</span><b>{yenMoney(editingRow.payable)}</b></div>
            </div>
            <button className="install-button full-button" type="button" onClick={() => setEditingHostId(null)}>
              閉じる
            </button>
          </article>
        </div>
      )}
    </section>
  );
}

function PersonalView({
  host,
  monthExpenses,
  receivables,
  receivablesEnabled,
  tableChecks
}: {
  host: Host;
  monthExpenses: number;
  receivables: Receivable[];
  receivablesEnabled: boolean;
  tableChecks: TableCheck[];
}) {
  const monthOptions = React.useMemo(() => {
    const base = new Date(2026, 5, 1);
    return Array.from({ length: 13 }, (_, index) => {
      const date = new Date(base);
      date.setMonth(base.getMonth() - index);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const label = `${date.getFullYear()}年${date.getMonth() + 1}月`;
      return { label, value, index };
    });
  }, []);
  const [selectedMonth, setSelectedMonth] = React.useState(monthOptions[0].value);
  const [customerSearch, setCustomerSearch] = React.useState("");
  const [selectedCustomer, setSelectedCustomer] = React.useState<string | null>(null);
  const selectedIndex = monthOptions.find((month) => month.value === selectedMonth)?.index ?? 0;
  const hostChecks = tableChecks.filter((check) => check.hostId === host.id && check.date.startsWith(selectedMonth));
  const currentMonthSales = hostChecks.reduce((sum, check) => sum + tableTotal(check), 0);
  const monthSales = selectedIndex === 0 ? currentMonthSales : Math.max(0, Math.round(host.sales * (1 - selectedIndex * 0.035)));
  const displayedExpenses = Math.max(0, Math.round(monthExpenses * (1 - selectedIndex * 0.025)));
  const activeReceivable = receivablesEnabled ? receivables
    .filter((item) => item.hostId === host.id && item.collection !== "payrollDeducted")
    .reduce((sum, item) => sum + item.amount, 0) : 0;
  const payrollDeductedReceivable = receivablesEnabled ? receivables
    .filter((item) => item.hostId === host.id && item.collection === "payrollDeducted")
    .reduce((sum, item) => sum + item.amount, 0) : 0;
  const takeHome = Math.round(monthSales * 0.48 - displayedExpenses - host.taxReserve - payrollDeductedReceivable);
  const targetRate = host.target > 0 ? Math.round((monthSales / host.target) * 100) : 0;
  const normalizedCustomerSearch = customerSearch.trim().toLowerCase();
  const customerSales = Object.values(
    hostChecks.reduce<Record<string, { customer: string; total: number; count: number }>>((acc, check) => {
      const key = check.customerName || "名前未設定";
      acc[key] = acc[key] ?? { customer: key, total: 0, count: 0 };
      acc[key].total += tableTotal(check);
      acc[key].count += 1;
      return acc;
    }, {})
  )
    .filter((item) => (normalizedCustomerSearch ? item.customer.toLowerCase().includes(normalizedCustomerSearch) : true))
    .sort((a, b) => b.total - a.total);
  const selectedCustomerChecks = selectedCustomer
    ? hostChecks.filter((check) => check.customerName === selectedCustomer).sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
    : [];
  const selectedCustomerTotal = selectedCustomerChecks.reduce((sum, check) => sum + tableTotal(check), 0);

  return (
    <section className="content-grid">
      <article className="panel wide">
        <div className="panel-header">
          <div>
            <h3>{host.name}</h3>
          </div>
          <div className="month-select-wrap">
            <SelectField
              label="表示月"
              value={selectedMonth}
              options={monthOptions.map((month) => ({ label: month.label, value: month.value }))}
              onChange={setSelectedMonth}
            />
          </div>
          <span className="status-pill status-ok">目標 {targetRate}%</span>
        </div>
        <div className="detail-metrics">
          <Metric label="月間売上" value={money(monthSales)} icon={BarChart3} tone="ink" />
          <Metric label="月間経費" value={money(displayedExpenses)} icon={ReceiptText} tone="orange" />
          <Metric label="手取り目安" value={money(Math.max(0, takeHome))} icon={WalletCards} tone="green" />
          {receivablesEnabled && <Metric label="通常売掛" value={money(activeReceivable)} icon={AlertTriangle} tone="orange" />}
          {receivablesEnabled && <Metric label="給与控除売掛" value={money(payrollDeductedReceivable)} icon={WalletCards} tone="red" />}
        </div>
        <ProgressRow label="月間目標" value={monthSales} total={host.target || 1} color="green" />
      </article>

      <article className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">顧客別</p>
            <h3>月間利用額</h3>
          </div>
          <span className="status-pill status-ok">{customerSales.length}件</span>
        </div>
        <div className="receivable-search-row">
          <label className="search-shell receivable-search">
            <span>検索</span>
            <input
              type="search"
              value={customerSearch}
              placeholder="客名"
              onChange={(event) => setCustomerSearch(event.target.value)}
            />
          </label>
        </div>
        <div className="customer-sales-list">
          {customerSales.length === 0 ? (
            <p className="tax-note">該当なし</p>
          ) : (
            customerSales.map((item) => (
              <button className="customer-sales-row selectable-row" type="button" key={item.customer} onClick={() => setSelectedCustomer(item.customer)}>
                <div>
                  <strong>{item.customer}</strong>
                  <p>{item.count}件</p>
                </div>
                <b>{money(item.total)}</b>
              </button>
            ))
          )}
        </div>
      </article>

      {selectedCustomer && (
        <CustomerDetailModal
          title={selectedCustomer}
          checks={selectedCustomerChecks}
          total={selectedCustomerTotal}
          hostName={() => host.name}
          receivablesEnabled={receivablesEnabled}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </section>
  );
}

function CustomerDetailModal({
  title,
  checks,
  total,
  hostName,
  receivablesEnabled,
  onClose
}: {
  title: string;
  checks: TableCheck[];
  total: number;
  hostName: (hostId?: number) => string;
  receivablesEnabled: boolean;
  onClose: () => void;
}) {
  const average = checks.length > 0 ? Math.round(total / checks.length) : 0;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="顧客履歴">
      <article className="panel checkout-modal customer-detail-modal">
        <div className="panel-header">
          <div>
            <p className="eyebrow">顧客履歴</p>
            <h3>{title}</h3>
          </div>
          <button className="icon-text-button ghost-button" type="button" onClick={onClose}>
            閉じる
          </button>
        </div>
        <div className="quick-numbers summary-metrics">
          <Metric label="利用合計" value={yenMoney(total)} icon={BarChart3} tone="ink" />
          <Metric label="来店回数" value={`${checks.length}件`} icon={ReceiptText} tone="green" />
          <Metric label="平均単価" value={yenMoney(average)} icon={Coins} tone="orange" />
        </div>
        <div className="customer-history-list">
          <div className="customer-history-row customer-history-head">
            <span>日付</span>
            <span>卓</span>
            <span>担当</span>
            <span>支払</span>
            <span>金額</span>
          </div>
          {checks.length === 0 ? (
            <div className="plain-note">
              <ReceiptText size={20} />
              <div>
                <strong>履歴なし</strong>
                <p>会計が登録されるとここに表示されます。</p>
              </div>
            </div>
          ) : (
            checks.map((check) => (
              <div className="customer-history-row" key={check.id}>
                <span>{check.date} {check.time}</span>
                <span>{check.table}</span>
                <span>{hostName(check.hostId)}</span>
                <span>{paymentLabelForDisplay(check, receivablesEnabled)}</span>
                <b>{yenMoney(tableTotal(check))}</b>
              </div>
            ))
          )}
        </div>
      </article>
    </div>
  );
}

function CheckoutView({
  hosts,
  storeSettings,
  businessDate,
  draftCheck,
  tableChecks,
  editingCheckId,
  editorOpen,
  hostName,
  receivablesEnabled,
  onChangeDraft,
  onOpenNew,
  onCloseEditor,
  onSave,
  onEdit,
  onDelete,
  onCancelEdit,
}: {
  hosts: Host[];
  storeSettings: StoreSettings;
  businessDate: string;
  draftCheck: TableCheck;
  tableChecks: TableCheck[];
  editingCheckId: number | null;
  editorOpen: boolean;
  hostName: (hostId?: number) => string;
  receivablesEnabled: boolean;
  onChangeDraft: (value: TableCheck) => void;
  onOpenNew: () => void;
  onCloseEditor: () => void;
  onSave: () => void;
  onEdit: (check: TableCheck) => void;
  onDelete: (id: number) => void;
  onCancelEdit: () => void;
}) {
  const [checkSearch, setCheckSearch] = React.useState("");
  const [paymentFilter, setPaymentFilter] = React.useState("all");
  const calculatedDraft = { ...draftCheck, serviceRate: storeSettings.serviceRate, taxRate: storeSettings.taxRate };
  const service = Math.round(calculatedDraft.subtotal * (storeSettings.serviceRate / 100));
  const tax = Math.round((calculatedDraft.subtotal + service) * (storeSettings.taxRate / 100));
  const total = tableTotal(calculatedDraft);
  const taxTotal = service + tax;
  const todayTotal = tableChecks.reduce((sum, check) => sum + tableTotal(check), 0);
  const paidTotal = draftCheck.cashAmount + draftCheck.cardAmount + (receivablesEnabled ? draftCheck.receivableAmount : 0);
  const balance = total - paidTotal;
  const isOverpaid = balance < 0;
  const receivableTotal = receivablesEnabled ? tableChecks.reduce(
    (sum, check) => sum + (check.receivableAmount > 0 ? check.receivableAmount : check.payment === "売掛" ? tableTotal(check) : 0),
    0
  ) : 0;
  const filteredChecks = tableChecks.filter((check) => {
    const searchText = `${check.table} ${check.customerName} ${hostName(check.hostId)}`.toLowerCase();
    const matchesSearch = searchText.includes(checkSearch.trim().toLowerCase());
    const label = paymentLabelForDisplay(check, receivablesEnabled);
    const matchesPayment =
      paymentFilter === "all" ||
      (paymentFilter === "売掛" ? receivablesEnabled && hasReceivablePayment(check) : paymentFilter === "複合" ? label.includes("+") || label === "複合" : label.includes(paymentFilter));
    return matchesSearch && matchesPayment;
  });
  const applyPaymentPreset = (payment: Payment) => {
    if (payment === "現金") {
      onChangeDraft({ ...draftCheck, payment, cashAmount: total, cardAmount: 0, receivableAmount: 0 });
      return;
    }
    if (payment === "カード") {
      onChangeDraft({ ...draftCheck, payment, cashAmount: 0, cardAmount: total, receivableAmount: 0 });
      return;
    }
    if (receivablesEnabled && payment === "売掛") {
      onChangeDraft({ ...draftCheck, payment, cashAmount: 0, cardAmount: 0, receivableAmount: total });
      return;
    }
    onChangeDraft({ ...draftCheck, payment });
  };

  return (
    <section className="checkout-stack">
      <article className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">本日の会計一覧</p>
            <h3>卓別会計</h3>
          </div>
          <div className="button-row">
            <span className="status-pill status-warn">営業日 {businessDate}</span>
            <span className="status-pill status-ok">本日 {money(todayTotal)}</span>
            <button className="icon-text-button" type="button" onClick={onOpenNew}>
              <Plus size={16} />
              新規会計
            </button>
          </div>
        </div>

        <div className="checkout-filter-row">
          <label className="search-shell checkout-search">
            <span>検索</span>
            <input
              type="search"
              value={checkSearch}
              placeholder="卓番・名前・担当"
              onChange={(event) => setCheckSearch(event.target.value)}
            />
          </label>
          <SelectField
            label="支払い"
            value={paymentFilter}
            options={paymentFilterOptionsFor(receivablesEnabled)}
            onChange={setPaymentFilter}
          />
        </div>

        <div className="table-check-list compact-check-list">
          {filteredChecks.map((check) => {
            const showReceivable = receivablesEnabled && hasReceivablePayment(check);

            return (
              <div className="table-check-row with-actions compact-check-row" key={check.id}>
                <div className="check-line-main">
                  <strong>{check.table}</strong>
                  <span>{check.guests}名</span>
                  <span>{check.customerName}</span>
                  {showReceivable && <small className="status-pill pay-pill status-danger">{paymentLabelForDisplay(check, receivablesEnabled)}</small>}
                  <small>{check.date}</small>
                  <small>{hostName(check.hostId)}</small>
                </div>
                <b className="check-amount">{money(tableTotal(check))}</b>
                <div className="row-actions">
                  <button className="icon-button" type="button" aria-label="会計編集" onClick={() => onEdit(check)}>
                    <Edit3 size={16} />
                  </button>
                  <button className="icon-button danger-button" type="button" aria-label="会計削除" onClick={() => onDelete(check.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </article>

      {false && editorOpen && (
      <article className="panel checkout-editor-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">卓ごとの会計</p>
            <h3>{editingCheckId === null ? "会計入力" : "会計編集"}</h3>
          </div>
          {receivablesEnabled && <span className="status-pill status-warn">売掛 {money(receivableTotal)}</span>}
        </div>

        <div className="form-grid checkout-form">
          <TextField label="卓番" value={draftCheck.table} onChange={(table) => onChangeDraft({ ...draftCheck, table })} />
          <NumberField label="人数" value={draftCheck.guests} min={1} step={1} onChange={(guests) => onChangeDraft({ ...draftCheck, guests })} />
          <TextField label="名前" value={draftCheck.customerName} onChange={(customerName) => onChangeDraft({ ...draftCheck, customerName })} />
          <SelectField
            label="担当"
            value={String(draftCheck.hostId)}
            options={hosts.map((host) => ({ label: host.name, value: String(host.id) }))}
            onChange={(hostId) => onChangeDraft({ ...draftCheck, hostId: Number(hostId) })}
          />
          <SelectField
            label="支払い"
            value={draftCheck.payment}
            options={paymentOptionsFor(receivablesEnabled).map((item) => ({ label: item, value: item }))}
            onChange={(payment) => applyPaymentPreset(payment as Payment)}
          />
          <NumberField label="小計" value={draftCheck.subtotal} min={0} step={1000} onChange={(subtotal) => onChangeDraft({ ...draftCheck, subtotal })} />
          <div className="tax-inline">
            <span>tax</span>
            <b>{money(taxTotal)}</b>
          </div>
          <NumberField label="値引き" value={draftCheck.discount} min={0} step={1} onChange={(discount) => onChangeDraft({ ...draftCheck, discount })} />
        </div>

        <div className="form-grid checkout-form payment-split">
          <NumberField label="現金" value={draftCheck.cashAmount} min={0} step={1000} onChange={(cashAmount) => onChangeDraft({ ...draftCheck, cashAmount })} />
          <NumberField label="カード" value={draftCheck.cardAmount} min={0} step={1000} onChange={(cardAmount) => onChangeDraft({ ...draftCheck, cardAmount })} />
          {receivablesEnabled && <NumberField label="売掛" value={draftCheck.receivableAmount} min={0} step={1000} onChange={(receivableAmount) => onChangeDraft({ ...draftCheck, receivableAmount })} />}
          <div className={isOverpaid ? "payment-balance is-over" : balance === 0 ? "payment-balance is-even" : "payment-balance"}>
            <span>差額</span>
            <b>{money(balance)}</b>
          </div>
        </div>

        <div className="checkout-total">
          <div>
            <span>合計</span>
            <strong>{money(total)}</strong>
          </div>
          <div className="button-row">
            <button className="icon-text-button ghost-button" type="button" onClick={editingCheckId !== null ? onCancelEdit : onCloseEditor}>
              閉じる
            </button>
            <button className="install-button" type="button" onClick={onSave} disabled={isOverpaid}>
              <Save size={18} />
              {editingCheckId === null ? "会計を登録" : "編集を保存"}
            </button>
          </div>
        </div>

        <div className="result-lines">
          <div><span>小計</span><b>{money(draftCheck.subtotal)}</b></div>
          <div><span>税サ {storeSettings.serviceRate}%</span><b>{money(service)}</b></div>
          <div><span>消費税 {storeSettings.taxRate}%</span><b>{money(tax)}</b></div>
          <div><span>値引き</span><b>-{money(draftCheck.discount)}</b></div>
        </div>
      </article>
      )}
    </section>
  );
}

function CheckoutEditorModal({
  hosts,
  storeSettings,
  draftCheck,
  tableChecks,
  editingCheckId,
  receivablesEnabled,
  onChangeDraft,
  onClose,
  onSave
}: {
  hosts: Host[];
  storeSettings: StoreSettings;
  draftCheck: TableCheck;
  tableChecks: TableCheck[];
  editingCheckId: number | null;
  receivablesEnabled: boolean;
  onChangeDraft: (value: TableCheck) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const calculatedDraft = withAutoReceivable(draftCheck, storeSettings);
  const service = Math.round(calculatedDraft.subtotal * (storeSettings.serviceRate / 100));
  const tax = Math.round((calculatedDraft.subtotal + service) * (storeSettings.taxRate / 100));
  const total = tableTotal(calculatedDraft);
  const taxTotal = service + tax;
  const paidTotal = calculatedDraft.cashAmount + calculatedDraft.cardAmount + (receivablesEnabled ? calculatedDraft.receivableAmount : 0);
  const balance = total - paidTotal;
  const isOverpaid = balance < 0;
  const receivableTotal = receivablesEnabled ? tableChecks.reduce(
    (sum, check) => sum + (check.receivableAmount > 0 ? check.receivableAmount : check.payment === "売掛" ? tableTotal(check) : 0),
    0
  ) : 0;
  const updateDraft = (patch: Partial<TableCheck>) => onChangeDraft({ ...draftCheck, ...patch });
  const applyPaymentPreset = (payment: Payment) => {
    if (payment === "現金") {
      onChangeDraft({ ...draftCheck, payment, cashAmount: total, cardAmount: 0, receivableAmount: 0 });
      return;
    }
    if (payment === "カード") {
      onChangeDraft({ ...draftCheck, payment, cashAmount: 0, cardAmount: total, receivableAmount: 0 });
      return;
    }
    if (receivablesEnabled && payment === "売掛") {
      onChangeDraft({ ...draftCheck, payment, cashAmount: 0, cardAmount: 0, receivableAmount: total });
      return;
    }
    onChangeDraft({ ...draftCheck, payment });
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="会計編集">
      <article className="panel checkout-editor-panel checkout-modal">
        <div className="panel-header">
          <div>
            <p className="eyebrow">卓ごとの会計</p>
            <h3>{editingCheckId === null ? "会計入力" : "会計編集"}</h3>
          </div>
          {receivablesEnabled && <span className="status-pill status-warn">売掛 {money(receivableTotal)}</span>}
        </div>

        <div className="form-grid checkout-form">
          <TextField label="卓番" value={draftCheck.table} onChange={(table) => updateDraft({ table })} />
          <NumberField label="人数" value={draftCheck.guests} min={1} step={1} onChange={(guests) => updateDraft({ guests })} />
          <TextField label="名前" value={draftCheck.customerName} onChange={(customerName) => updateDraft({ customerName })} />
          <SelectField
            label="担当"
            value={String(draftCheck.hostId)}
            options={hosts.map((host) => ({ label: host.name, value: String(host.id) }))}
            onChange={(hostId) => updateDraft({ hostId: Number(hostId) })}
          />
          <SelectField
            label="支払い"
            value={paymentLabelForDisplay(calculatedDraft, receivablesEnabled)}
            options={paymentOptionsFor(receivablesEnabled).map((item) => ({ label: item, value: item }))}
            onChange={(payment) => applyPaymentPreset(payment as Payment)}
          />
          <NumberField label="小計" value={draftCheck.subtotal} min={0} step={1000} onChange={(subtotal) => updateDraft({ subtotal })} />
          <div className="tax-inline">
            <span>tax</span>
            <b>{money(taxTotal)}</b>
          </div>
          <NumberField label="値引き" value={draftCheck.discount} min={0} step={1} onChange={(discount) => updateDraft({ discount })} />
        </div>

        <div className="form-grid checkout-form payment-split">
          <NumberField label="現金" value={draftCheck.cashAmount} min={0} step={1000} onChange={(cashAmount) => updateDraft({ cashAmount })} />
          <NumberField label="カード" value={draftCheck.cardAmount} min={0} step={1000} onChange={(cardAmount) => updateDraft({ cardAmount })} />
          {receivablesEnabled && <div className="auto-receivable-box">
            <span>売掛</span>
            <b>{money(calculatedDraft.receivableAmount)}</b>
          </div>}
          <div className={isOverpaid ? "payment-balance is-over" : balance === 0 ? "payment-balance is-even" : "payment-balance"}>
            <span>差額</span>
            <b>{money(balance)}</b>
          </div>
        </div>

        <div className="checkout-total">
          <div>
            <span>合計</span>
            <strong>{money(total)}</strong>
          </div>
          <div className="button-row">
            <button className="icon-text-button ghost-button" type="button" onClick={onClose}>
              閉じる
            </button>
            <button className="install-button" type="button" onClick={onSave} disabled={isOverpaid}>
              <Save size={18} />
              {editingCheckId === null ? "会計を登録" : "編集を保存"}
            </button>
          </div>
        </div>

        <div className="result-lines">
          <div><span>小計</span><b>{money(draftCheck.subtotal)}</b></div>
          <div><span>税サ {storeSettings.serviceRate}%</span><b>{money(service)}</b></div>
          <div><span>消費税 {storeSettings.taxRate}%</span><b>{money(tax)}</b></div>
          <div><span>値引き</span><b>-{money(draftCheck.discount)}</b></div>
        </div>
      </article>
    </div>
  );
}

function OpenTablesPanel({
  title,
  openTables,
  hosts,
  hostName,
  canEditAmount,
  canChangeHost,
  canDelete,
  showTotalPill = true,
  showTimeWithCustomer = false,
  onAdd,
  onUpdate,
  onDelete,
  onRegister
}: {
  title: string;
  openTables: OpenTable[];
  hosts: Host[];
  hostName: (hostId?: number) => string;
  canEditAmount: boolean;
  canChangeHost: boolean;
  canDelete: boolean;
  showTotalPill?: boolean;
  showTimeWithCustomer?: boolean;
  onAdd: () => void;
  onUpdate: (id: number, patch: Partial<OpenTable>) => void;
  onDelete?: (id: number) => void;
  onRegister?: (table: OpenTable) => void;
}) {
  const totalCurrent = openTables.reduce((sum, table) => sum + table.currentAmount, 0);

  return (
    <>
      <div className="panel-header compact-header">
        <div>
          <p className="eyebrow">営業中</p>
          <h3>{title}</h3>
        </div>
        <div className="button-row">
          {showTotalPill && <span className="status-pill status-warn">現状 {money(totalCurrent)}</span>}
          <button className="icon-text-button" type="button" onClick={onAdd}>
            <Plus size={18} />
            追加
          </button>
        </div>
      </div>

      <div className="open-table-list">
        {openTables.map((table) => {
          const progress = table.targetAmount > 0 ? Math.min(100, Math.round((table.currentAmount / table.targetAmount) * 100)) : 0;
          const progressBackground = `linear-gradient(90deg, rgba(249, 115, 22, 0.22) 0 ${progress}%, #ffffff ${progress}% 100%)`;
          const hasProgressActions = !showTimeWithCustomer || Boolean(onRegister) || (canDelete && Boolean(onDelete));

          return (
            <div className={canChangeHost || hosts.length > 1 ? "open-table-row has-host-field" : "open-table-row no-host-field"} key={table.id}>
              <div className="open-table-fields">
                <label className="open-inline-field table-code-field">
                  <span>卓番</span>
                  <input type="text" value={table.table} onChange={(event) => onUpdate(table.id, { table: event.target.value })} />
                </label>
                <label className="open-inline-field guests-field">
                  <span>人数</span>
                  <input type="number" value={table.guests} min={1} max={99} step={1} onChange={(event) => onUpdate(table.id, { guests: clampGuests(Number(event.target.value)) })} />
                </label>
                <label className="open-inline-field customer-field">
                  <span>名前</span>
                  {showTimeWithCustomer ? (
                    <div className="open-name-with-time">
                      <input type="text" value={table.customerName} maxLength={6} onChange={(event) => onUpdate(table.id, { customerName: event.target.value })} />
                      <small className="inline-table-time">{table.time}</small>
                    </div>
                  ) : (
                    <input type="text" value={table.customerName} maxLength={6} onChange={(event) => onUpdate(table.id, { customerName: event.target.value })} />
                  )}
                </label>
                {(canChangeHost || hosts.length > 1) && (
                  <label className="open-inline-field host-field">
                    <span>担当</span>
                    {canChangeHost ? (
                      <select value={String(table.hostId)} onChange={(event) => onUpdate(table.id, { hostId: Number(event.target.value) })}>
                        {hosts.map((host) => (
                          <option value={host.id} key={host.id}>
                            {host.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input type="text" value={hostName(table.hostId)} readOnly />
                    )}
                  </label>
                )}
                <label className="open-inline-field amount-field">
                  <span>現状</span>
                  {canEditAmount ? (
                    <input
                      type="text"
                      inputMode="numeric"
                      value={plainNumber(table.currentAmount)}
                      style={{ background: progressBackground }}
                      onChange={(event) => onUpdate(table.id, { currentAmount: clampTableAmount(parsePlainNumber(event.target.value)) })}
                    />
                  ) : (
                    <input type="text" value={plainNumber(table.currentAmount)} style={{ background: progressBackground }} readOnly />
                  )}
                </label>
                <label className="open-inline-field amount-field">
                  <span>目標</span>
                  <input type="text" inputMode="numeric" value={plainNumber(table.targetAmount)} onChange={(event) => onUpdate(table.id, { targetAmount: clampTableAmount(parsePlainNumber(event.target.value)) })} />
                </label>
              </div>

              {hasProgressActions && (
                <div className="open-table-progress">
                  {!showTimeWithCustomer && <span className="status-pill status-ok">{table.time}</span>}
                  {onRegister && (
                    <button className="icon-text-button" type="button" onClick={() => onRegister(table)}>
                      <ReceiptText size={16} />
                      会計登録
                    </button>
                  )}
                  {canDelete && onDelete && (
                    <button className="icon-button danger-button" type="button" aria-label="未会計卓削除" onClick={() => onDelete(table.id)}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function HostsView({
  hosts,
  receivables,
  selectedHost,
  canManage,
  onSelectHost,
  onUpdateHost,
  onAddHost,
  onDeleteHost
}: {
  hosts: Host[];
  receivables: Receivable[];
  selectedHost: Host;
  canManage: boolean;
  onSelectHost: (id: number) => void;
  onUpdateHost: (id: number, patch: Partial<Host>) => void;
  onAddHost: () => void;
  onDeleteHost: (id: number) => void;
}) {
  const selectedReceivables = receivables.filter((item) => item.hostId === selectedHost.id);
  const activeReceivable = selectedReceivables
    .filter((item) => item.collection !== "payrollDeducted")
    .reduce((sum, item) => sum + item.amount, 0);
  const payrollDeductedReceivable = selectedReceivables
    .filter((item) => item.collection === "payrollDeducted")
    .reduce((sum, item) => sum + item.amount, 0);
  const takeHome = Math.round(selectedHost.sales * 0.48 - selectedHost.expenses - selectedHost.taxReserve - payrollDeductedReceivable);

  return (
    <section className="split-layout">
      <article className="panel host-list-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">ホスト一覧</p>
            <h3>追加・編集・削除</h3>
          </div>
          {canManage && (
            <button className="icon-text-button" type="button" onClick={onAddHost}>
              <Plus size={18} />
              追加
            </button>
          )}
        </div>
        <div className="host-buttons">
          {hosts.map((host) => (
            <button className={selectedHost.id === host.id ? "host-button is-selected" : "host-button"} key={host.id} type="button" onClick={() => onSelectHost(host.id)}>
              <span>#{host.rank}</span>
              <strong>{host.name}</strong>
              <small>{compactMoney(host.sales)}</small>
            </button>
          ))}
        </div>
      </article>

      <article className="panel host-detail-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">個人ページ</p>
            <h3>{selectedHost.name}</h3>
          </div>
          <span className="status-pill status-ok">最終入力 {selectedHost.lastEntry}</span>
        </div>

        {canManage && (
          <div className="form-grid edit-block">
            <TextField label="名前" value={selectedHost.name} onChange={(name) => onUpdateHost(selectedHost.id, { name })} />
            <NumberField label="目標" value={selectedHost.target} min={0} step={10000} onChange={(target) => onUpdateHost(selectedHost.id, { target })} />
          </div>
        )}

        <div className="detail-metrics">
          <Metric label="売上" value={money(selectedHost.sales)} icon={Coins} tone="ink" />
          <Metric label="手取り予測" value={money(Math.max(0, takeHome))} icon={WalletCards} tone="green" />
          <Metric label="通常売掛" value={money(activeReceivable)} icon={AlertTriangle} tone="orange" />
          <Metric label="給与控除売掛" value={money(payrollDeductedReceivable)} icon={WalletCards} tone="red" />
          <Metric label="経費" value={money(selectedHost.expenses)} icon={ReceiptText} tone="red" />
        </div>
        <ProgressRow label="目標達成" value={selectedHost.sales} total={selectedHost.target || 1} color="green" />
        {canManage && (
          <button className="icon-text-button danger-solid" type="button" onClick={() => onDeleteHost(selectedHost.id)}>
            <Trash2 size={18} />
            このホストを削除
          </button>
        )}
      </article>
    </section>
  );
}

function EmployeesView({
  users,
  canManage,
  onUpdateUser,
  onAddUser,
  onDeleteUser
}: {
  users: AppUser[];
  canManage: boolean;
  onUpdateUser: (id: number, patch: Partial<AppUser>) => void;
  onAddUser: () => void;
  onDeleteUser: (id: number) => void;
}) {
  return (
    <section className="content-grid employee-grid">
      <EmployeePanel
        users={users}
        canManage={canManage}
        onUpdateUser={onUpdateUser}
        onAddUser={onAddUser}
        onDeleteUser={onDeleteUser}
        className="wide"
      />
    </section>
  );
}

function EmployeePanel({
  users,
  canManage,
  onUpdateUser,
  onAddUser,
  onDeleteUser,
  className = "",
  embedded = false
}: {
  users: AppUser[];
  canManage: boolean;
  onUpdateUser: (id: number, patch: Partial<AppUser>) => void;
  onAddUser: () => void;
  onDeleteUser: (id: number) => void;
  className?: string;
  embedded?: boolean;
}) {
  const list = (
    <>
      {embedded && canManage && (
        <div className="employee-panel-actions">
          <button className="icon-text-button" type="button" onClick={onAddUser}>
            <Plus size={18} />
            追加
          </button>
        </div>
      )}
      <div className="employee-list">
        {users.map((user) => (
          <div className="employee-row" key={user.id}>
            {canManage ? (
              <>
                <TextField label="名前" value={user.name} onChange={(name) => onUpdateUser(user.id, { name })} />
                <TextField label="ID" value={user.loginId} onChange={(loginId) => onUpdateUser(user.id, { loginId })} />
                <SelectField
                  label="権限"
                  value={user.role}
                  options={[
                    { label: "店長", value: "admin" },
                    { label: "内勤", value: "staff" },
                    { label: "ホスト", value: "host" }
                  ]}
                  onChange={(role) => onUpdateUser(user.id, { role: role as Role })}
                />
                <TextField label="パスワード" value={user.password} onChange={(password) => onUpdateUser(user.id, { password })} />
                <button className={user.active ? "icon-text-button" : "icon-text-button ghost-button"} type="button" onClick={() => onUpdateUser(user.id, { active: !user.active })}>
                  {user.active ? "有効" : "停止中"}
                </button>
                <button className="icon-button danger-button" type="button" aria-label="従業員削除" onClick={() => onDeleteUser(user.id)}>
                  <Trash2 size={16} />
                </button>
              </>
            ) : (
              <>
                <div>
                  <strong>{user.name}</strong>
                  <p>ID: {user.loginId}</p>
                </div>
                <span className="status-pill status-ok">{roleLabel[user.role]}</span>
                <span className={user.active ? "status-pill status-ok" : "status-pill status-danger"}>{user.active ? "有効" : "停止中"}</span>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );

  if (embedded) {
    return <div className={`employee-panel employee-panel-content ${className}`.trim()}>{list}</div>;
  }

  return (
    <article className={`panel employee-panel ${className}`.trim()}>
      <div className="panel-header">
        <div>
          <p className="eyebrow">従業員</p>
          <h3>ログイン・権限管理</h3>
        </div>
        {canManage && (
          <button className="icon-text-button" type="button" onClick={onAddUser}>
            <Plus size={18} />
            追加
          </button>
        )}
      </div>
      {list}
    </article>
  );
}

function ReceivablesView({
  currentUser,
  receivables,
  payments,
  hostName,
  onUpdateMemo,
  onUpdateCollection,
  onReportPayment,
  onConfirmPayment
}: {
  currentUser: AppUser;
  receivables: Receivable[];
  payments: ReceivablePayment[];
  hostName: (hostId?: number) => string;
  onUpdateMemo: (item: Receivable, memo: string) => void;
  onUpdateCollection: (item: Receivable, collection: ReceivableCollection) => void;
  onReportPayment: (item: Receivable, amount: number) => void;
  onConfirmPayment: (payment: ReceivablePayment) => void;
}) {
  const visibleReceivables = currentUser.role === "host" ? receivables.filter((item) => item.hostId === currentUser.hostId) : receivables;
  const visiblePayments = currentUser.role === "host" ? payments.filter((item) => item.hostId === currentUser.hostId) : payments;
  const [searchQuery, setSearchQuery] = React.useState("");
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredReceivables = normalizedSearch
    ? visibleReceivables.filter((item) => {
        const searchableText = `${item.customer} ${hostName(item.hostId)} ${item.amount} ${money(item.amount)}`.toLowerCase();
        return searchableText.includes(normalizedSearch);
      })
    : visibleReceivables;
  const activeTotal = filteredReceivables
    .filter((item) => item.collection !== "payrollDeducted")
    .reduce((sum, item) => sum + item.amount, 0);
  const payrollDeductedTotal = filteredReceivables
    .filter((item) => item.collection === "payrollDeducted")
    .reduce((sum, item) => sum + item.amount, 0);
  const [paymentDrafts, setPaymentDrafts] = React.useState<Record<number, string>>({});

  const paymentRows = (receivableId: number) => visiblePayments.filter((payment) => payment.receivableId === receivableId);

  return (
    <section className="content-grid receivables-grid">
      <article className="panel wide">
        <div className="panel-header receivable-header">
          <div className="receivable-title-block">
            <p className="eyebrow">売掛管理</p>
            <div className="receivable-title-line">
              {currentUser.role !== "host" && <h3>通常売掛</h3>}
              <div className="receivable-total-pills">
                <span className="status-pill status-warn">通常 {money(activeTotal)}</span>
                <span className="status-pill status-danger">給与控除済 {money(payrollDeductedTotal)}</span>
              </div>
            </div>
          </div>
          <div className="receivable-search-row">
            <label className="search-shell receivable-search">
              <span>検索</span>
              <input
                type="search"
                value={searchQuery}
                placeholder={currentUser.role === "host" ? "客名・金額" : "客名・ホスト名・金額"}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </label>
            <span className="status-pill status-ok">{filteredReceivables.length}件</span>
          </div>
        </div>
        <div className="receivable-table">
          {filteredReceivables.map((item) => {
            const rows = paymentRows(item.id);
            const reportedTotal = rows
              .filter((payment) => payment.status === "reported")
              .reduce((sum, payment) => sum + payment.amount, 0);
            const remainingReportable = Math.max(0, item.amount - reportedTotal);
            const draftValue = paymentDrafts[item.id] ?? plainNumber(remainingReportable);
            const isPayrollDeducted = item.collection === "payrollDeducted";

            return (
              <div className="receivable-row with-actions" key={item.id}>
                <div className="receivable-main-line">
                  <span>{hostName(item.hostId)}</span>
                  <small>→</small>
                  <strong>{item.customer}</strong>
                  <span className={`status-pill status-${item.status}`}>{item.due}</span>
                  {currentUser.role === "host" ? (
                    <span className={item.collection === "payrollDeducted" ? "status-pill status-danger" : "status-pill status-warn"}>
                      {item.collection === "payrollDeducted" ? "給与控除済" : "通常"}
                    </span>
                  ) : (
                    <select
                      className={item.collection === "payrollDeducted" ? "receivable-kind-select is-payroll" : "receivable-kind-select"}
                      value={item.collection}
                      onChange={(event) => onUpdateCollection(item, event.target.value as ReceivableCollection)}
                    >
                      <option value="active">通常</option>
                      <option value="payrollDeducted">給与控除済</option>
                    </select>
                  )}
                </div>
                <div className="receivable-money-line">
                  <b>{money(item.amount)}</b>
                  {currentUser.role === "host" ? (
                    <label className="receivable-memo-field">
                      <span>備考</span>
                      <input type="text" value={item.memo} onChange={(event) => onUpdateMemo(item, event.target.value)} />
                    </label>
                  ) : (
                    <p className="receivable-memo-text">{item.memo}</p>
                  )}
                </div>
                {currentUser.role === "host" && (
                  <div className="receivable-payment-box">
                    <label className="open-inline-field amount-field">
                      <span>{isPayrollDeducted ? "報告" : "入金"}</span>
                      <input
                        inputMode="numeric"
                        type="text"
                        value={draftValue}
                        onChange={(event) =>
                          setPaymentDrafts((current) => ({ ...current, [item.id]: plainNumber(parsePlainNumber(event.target.value)) }))
                        }
                      />
                    </label>
                    <p>{isPayrollDeducted ? "給与から引かれている分を報告すると残高から減算。" : "入金した金額を報告。店側の受取確認後に売掛から減算。"}</p>
                    <button
                      className="icon-text-button"
                      type="button"
                      disabled={remainingReportable <= 0}
                      onClick={() => {
                        const reportedAmount = Math.min(remainingReportable, parsePlainNumber(draftValue));
                        onReportPayment(item, reportedAmount);
                        setPaymentDrafts((current) => ({
                          ...current,
                          [item.id]: plainNumber(Math.max(0, remainingReportable - reportedAmount))
                        }));
                      }}
                    >
                      <CheckCircle2 size={16} />
                      {isPayrollDeducted ? "報告" : "入金報告"}
                    </button>
                  </div>
                )}

                {rows.map((payment) => (
                  <div className="receivable-payment-box" key={payment.id}>
                    <span className={payment.status === "confirmed" ? "status-pill status-ok" : "status-pill status-warn"}>
                      {payment.confirmedBy === "給与控除" ? "報告済" : payment.status === "confirmed" ? "確認済" : "報告待ち"} {money(payment.amount)}
                    </span>
                    <p>
                      {payment.reportedBy} / {payment.time}
                      {payment.confirmedBy ? ` / 確認 ${payment.confirmedBy}` : ""}
                    </p>
                    {currentUser.role !== "host" && payment.status === "reported" ? (
                      <button className="icon-text-button" type="button" onClick={() => onConfirmPayment(payment)}>
                        <ShieldCheck size={16} />
                        受取確認
                      </button>
                    ) : (
                      <span className="status-pill status-ok">二重チェック</span>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </article>

    </section>
  );
}

function ClosingView({
  businessDate,
  tableChecks,
  receivablesEnabled,
  expenses,
  draft,
  closes,
  onChangeDraft,
  onSaveExpense,
  onEditExpense,
  onDeleteExpense,
  onSave
}: {
  businessDate: string;
  tableChecks: TableCheck[];
  receivablesEnabled: boolean;
  expenses: Expense[];
  draft: Expense;
  closes: RegisterClose[];
  onChangeDraft: (value: Expense) => void;
  onSaveExpense: () => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: number) => void;
  onSave: (actualCash: number, expectedCash: number, startCash: number, cashInjection: number, memo: string) => void;
}) {
  const storeExpenses = expenses.filter((item) => item.ownerType === "store" && item.date === businessDate);
  const cashSales = tableChecks.reduce((sum, check) => sum + check.cashAmount, 0);
  const cardSales = tableChecks.reduce((sum, check) => sum + check.cardAmount, 0);
  const receivableSales = receivablesEnabled ? tableChecks.reduce((sum, check) => sum + check.receivableAmount, 0) : 0;
  const totalSales = tableChecks.reduce((sum, check) => sum + tableTotal(check), 0);
  const cashExpenses = storeExpenses
    .filter((item) => item.paymentMethod === "現金")
    .reduce((sum, item) => sum + item.amount, 0);
  const previousClose = closes
    .filter((item) => item.date < businessDate)
    .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))[0];
  const carriedCash = previousClose?.actualCash ?? 0;
  const [startCash, setStartCash] = React.useState(carriedCash);
  const [cashInjection, setCashInjection] = React.useState(0);
  const expectedCash = startCash + cashInjection + cashSales - cashExpenses;
  const [actualCash, setActualCash] = React.useState(expectedCash);
  const [memo, setMemo] = React.useState("");
  const [closeSearchDate, setCloseSearchDate] = React.useState(businessDate);
  const difference = actualCash - expectedCash;
  const searchedCloses = closes.filter((item) => item.date === closeSearchDate);
  const storeExpenseTotal = storeExpenses.reduce((sum, item) => sum + item.amount, 0);

  React.useEffect(() => {
    setStartCash(carriedCash);
    setCashInjection(0);
    setActualCash(expectedCash);
  }, [businessDate, carriedCash]);

  React.useEffect(() => {
    setActualCash(expectedCash);
  }, [expectedCash]);

  React.useEffect(() => {
    setCloseSearchDate(businessDate);
  }, [businessDate]);

  return (
    <section className="content-grid closing-grid">
      <article className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">締め入力</p>
            <h3>実残チェック</h3>
          </div>
          <CheckCircle2 size={22} />
        </div>
        <div className="form-grid">
          <NumberField label="スタートレジ金" value={startCash} min={0} step={1000} onChange={setStartCash} />
          <NumberField label="途中入金" value={cashInjection} min={0} step={1000} onChange={setCashInjection} />
          <NumberField label="実残現金" value={actualCash} min={0} step={1000} onChange={setActualCash} />
          <TextField label="メモ" value={memo} onChange={setMemo} />
        </div>
        <div className="result-lines closing-lines">
          <div><span>前日引継</span><b>{money(startCash)}</b></div>
          <div><span>途中入金</span><b>{money(cashInjection)}</b></div>
          <div><span>現金売上</span><b>{money(cashSales)}</b></div>
          <div><span>現金経費</span><b>-{money(cashExpenses)}</b></div>
          <div><span>予想現金</span><b>{money(expectedCash)}</b></div>
          <div><span>差額</span><b>{money(difference)}</b></div>
        </div>
        <button
          className="install-button full-button"
          type="button"
          onClick={() => {
            onSave(actualCash, expectedCash, startCash, cashInjection, memo);
            setMemo("");
          }}
        >
          <Save size={18} />
          レジ締め保存
        </button>
      </article>

      <article className="panel wide">
        <div className="panel-header">
          <div>
            <p className="eyebrow">レジ締め</p>
            <h3>{businessDate}</h3>
          </div>
          <span className={difference === 0 ? "status-pill status-ok" : "status-pill status-danger"}>差額 {money(difference)}</span>
        </div>
        <div className="quick-numbers summary-metrics">
          <Metric label="総会計" value={yenMoney(totalSales)} icon={ReceiptText} tone="ink" />
          <Metric label="現金売上" value={yenMoney(cashSales)} icon={Banknote} tone="green" />
          <Metric label="カード売上" value={yenMoney(cardSales)} icon={WalletCards} tone="green" />
          {receivablesEnabled && <Metric label="売掛" value={yenMoney(receivableSales)} icon={AlertTriangle} tone="orange" />}
          <Metric label="現金経費" value={yenMoney(cashExpenses)} icon={FileText} tone="red" />
          <Metric label="スタートレジ金" value={yenMoney(startCash)} icon={Coins} tone="ink" />
          <Metric label="途中入金" value={yenMoney(cashInjection)} icon={Banknote} tone="green" />
          <Metric label="レジ予想現金" value={yenMoney(expectedCash)} icon={Coins} tone="ink" />
        </div>
        <div className="closing-history-inline">
          <div className="panel-header compact-header">
            <div>
              <p className="eyebrow">締め履歴</p>
              <h3>{searchedCloses.length}件</h3>
            </div>
            <label className="number-field closing-date-field">
              <span>検索日</span>
              <input type="date" value={closeSearchDate} onChange={(event) => setCloseSearchDate(event.target.value)} />
            </label>
          </div>
          <div className="expense-list">
            {searchedCloses.length === 0 ? (
              <div className="plain-note">
                <CheckCircle2 size={20} />
                <div>
                  <strong>締め履歴なし</strong>
                  <p>検索日のレジ締めはまだありません。</p>
                </div>
              </div>
            ) : (
              searchedCloses.map((item) => (
                <div className="expense-row closing-history-row" key={item.id}>
                  <div>
                    <strong>{item.date} {item.time} / {item.closedBy}</strong>
                    <p>{item.memo || "メモなし"}</p>
                  </div>
                  <b>{money(item.actualCash)}</b>
                  <span className="status-pill status-ok">開始 {money(item.startCash)}</span>
                  <span className="status-pill status-warn">入金 {money(item.cashInjection)}</span>
                  <span className={item.difference === 0 ? "status-pill status-ok" : "status-pill status-danger"}>
                    差額 {money(item.difference)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </article>

      <ExpenseEditor
        title="店舗経費"
        subtitle="経費入力"
        draft={{ ...draft, date: businessDate, ownerType: "store", hostId: undefined }}
        fixedDate={businessDate}
        onChangeDraft={(value) => onChangeDraft({ ...value, date: businessDate, ownerType: "store", hostId: undefined })}
        onSave={onSaveExpense}
      />

      <ExpenseListPanel
        eyebrow="当日経費"
        title={money(storeExpenseTotal)}
        expenses={storeExpenses}
        hostName={() => "店舗"}
        compactDetails
        canEdit
        canDelete={false}
        onEdit={onEditExpense}
        onDelete={onDeleteExpense}
        emptyTitle="当日の経費はまだありません"
        emptyBody="締め前に入力するとここに表示されます。"
      />
    </section>
  );
}

function ExpenseEditor({
  title,
  subtitle,
  draft,
  fixedDate,
  onChangeDraft,
  onReceipt,
  onSave
}: {
  title: string;
  subtitle: string;
  draft: Expense;
  fixedDate?: string;
  onChangeDraft: (value: Expense) => void;
  onReceipt?: () => void;
  onSave: () => void;
}) {
  return (
    <article className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">{subtitle}</p>
          <h3>{title}</h3>
        </div>
        {onReceipt && (
          <button className="icon-text-button" type="button" onClick={onReceipt}>
            <Camera size={18} />
            レシート撮影
          </button>
        )}
      </div>
      <ExpenseFormFields draft={draft} fixedDate={fixedDate} onChangeDraft={onChangeDraft} />
      <button className="install-button full-button" type="button" onClick={onSave}>
        <Save size={18} />
        経費を保存
      </button>
    </article>
  );
}

function ExpenseEditorModal({
  draft,
  onChangeDraft,
  onClose,
  onSave,
  onDelete
}: {
  draft: Expense;
  onChangeDraft: (value: Expense) => void;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="経費編集">
      <article className="panel checkout-modal expense-edit-modal">
        <div className="panel-header">
          <div>
            <p className="eyebrow">経費</p>
            <h3>経費編集</h3>
          </div>
          <button className="icon-text-button ghost-button" type="button" onClick={onClose}>
            閉じる
          </button>
        </div>
        <ExpenseFormFields draft={draft} onChangeDraft={onChangeDraft} />
        <div className="button-row expense-edit-actions">
          <button className="icon-text-button ghost-button danger-button" type="button" onClick={onDelete}>
            <Trash2 size={16} />
            削除
          </button>
          <button className="install-button" type="button" onClick={onSave}>
            <Save size={18} />
            保存
          </button>
        </div>
      </article>
    </div>
  );
}

function ExpenseFormFields({
  draft,
  fixedDate,
  onChangeDraft
}: {
  draft: Expense;
  fixedDate?: string;
  onChangeDraft: (value: Expense) => void;
}) {
  return (
    <div className="form-grid">
      {!fixedDate && (
        <TextField label="日付" value={draft.date} onChange={(date) => onChangeDraft({ ...draft, date })} />
      )}
      <SelectField
        label="勘定科目"
        value={draft.category}
        options={categoryOptions.map((category) => ({ label: category, value: category }))}
        onChange={(category) => onChangeDraft({ ...draft, category })}
      />
      <TextField label="支払先" value={draft.vendor} onChange={(vendor) => onChangeDraft({ ...draft, vendor })} />
      <NumberField label="金額" value={draft.amount} min={0} step={100} onChange={(amount) => onChangeDraft({ ...draft, amount })} />
      <SelectField
        label="消費税"
        value={String(draft.taxRate ?? 10)}
        options={expenseTaxRateOptions}
        onChange={(taxRate) => onChangeDraft({ ...draft, taxRate: Number(taxRate) as ExpenseTaxRate })}
      />
      <SelectField
        label="支払"
        value={draft.paymentMethod}
        options={expensePaymentOptions.map((paymentMethod) => ({ label: paymentMethod, value: paymentMethod }))}
        onChange={(paymentMethod) => onChangeDraft({ ...draft, paymentMethod: paymentMethod as ExpensePayment })}
      />
      <TextField label="メモ" value={draft.memo} onChange={(memo) => onChangeDraft({ ...draft, memo })} />
    </div>
  );
}

function ExpenseListPanel({
  eyebrow,
  title,
  expenses,
  hostName,
  canDelete,
  canEdit = false,
  compactDetails = false,
  iconSize = 16,
  actionLabel,
  onAction,
  onEdit,
  onDelete,
  emptyTitle,
  emptyBody
}: {
  eyebrow: string;
  title: string;
  expenses: Expense[];
  hostName: (hostId?: number) => string;
  canDelete: boolean;
  canEdit?: boolean;
  compactDetails?: boolean;
  iconSize?: number;
  actionLabel?: string;
  onAction?: () => void;
  onEdit?: (expense: Expense) => void;
  onDelete: (id: number) => void;
  emptyTitle: string;
  emptyBody: string;
}) {
  return (
    <article className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h3>{title}</h3>
        </div>
        <div className="panel-header-actions">
          {actionLabel && onAction && (
            <button className="icon-text-button ghost-button" type="button" onClick={onAction}>
              <Download size={14} />
              {actionLabel}
            </button>
          )}
          <FileText size={iconSize} />
        </div>
      </div>
      <div className="expense-list">
        {expenses.length === 0 ? (
          <div className="plain-note">
            <ReceiptText size={20} />
            <div>
              <strong>{emptyTitle}</strong>
              <p>{emptyBody}</p>
            </div>
          </div>
        ) : (
          expenses.map((item) => (
            <div className="expense-row" key={item.id}>
              <div className="expense-main-cell">
                <strong>{item.category}</strong>
                <p>
                  {compactDetails
                    ? `${item.vendor || "支払先未入力"} / ${item.paymentMethod}${item.memo ? ` / ${item.memo}` : ""}`
                    : `${item.date} / ${item.ownerType === "store" ? "店舗" : hostName(item.hostId)} / ${item.vendor || "支払先未入力"} / ${item.paymentMethod}`}
                </p>
              </div>
              <div className="expense-amount-cell">
                <b>{money(item.amount)}</b>
                <span>{expenseTaxRateLabel(item.taxRate)} / {item.receiptStatus}</span>
              </div>
              {canEdit && onEdit && (
                <button className="icon-button" type="button" aria-label="経費編集" onClick={() => onEdit(item)}>
                  <Edit3 size={16} />
                </button>
              )}
              {canDelete && (
                <button className="icon-button danger-button" type="button" aria-label="経費削除" onClick={() => onDelete(item.id)}>
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </article>
  );
}

function ExpenseCategorySummary({
  eyebrow,
  title,
  expenses,
  actionLabel,
  onAction,
  listActionLabel,
  onListAction,
  filterMode = "none"
}: {
  eyebrow: string;
  title: string;
  expenses: Expense[];
  actionLabel?: string;
  onAction?: () => void;
  listActionLabel?: string;
  onListAction?: () => void;
  filterMode?: "none" | "annual";
}) {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [taxModalOpen, setTaxModalOpen] = React.useState(false);
  const [monthFilter, setMonthFilter] = React.useState("all");
  const [vendorFilter, setVendorFilter] = React.useState("");
  const [minAmountFilter, setMinAmountFilter] = React.useState("");
  const [maxAmountFilter, setMaxAmountFilter] = React.useState("");
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  const categoryTotals = categoryOptions
    .map((category) => ({
      category,
      total: expenses.filter((item) => item.category === category).reduce((sum, item) => sum + item.amount, 0)
    }))
    .filter((item) => item.total > 0);
  const selectedCategoryExpenses = selectedCategory
    ? expenses.filter((item) => item.category === selectedCategory).sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
    : [];
  const monthOptions = Array.from(new Set(selectedCategoryExpenses.map((item) => item.date.slice(0, 7))))
    .sort((a, b) => b.localeCompare(a))
    .map((value) => {
      const [, month] = value.split("-");
      return { value, label: `${Number(month)}月` };
    });
  const minAmount = minAmountFilter.trim() ? parsePlainNumber(minAmountFilter) : null;
  const maxAmount = maxAmountFilter.trim() ? parsePlainNumber(maxAmountFilter) : null;
  const normalizedVendorFilter = vendorFilter.trim().toLowerCase();
  const visibleExpenses = selectedCategoryExpenses.filter((item) => {
    if (filterMode === "annual" && monthFilter !== "all" && !item.date.startsWith(monthFilter)) return false;
    if (filterMode === "annual" && normalizedVendorFilter && !item.vendor.toLowerCase().includes(normalizedVendorFilter)) return false;
    if (filterMode === "annual" && minAmount !== null && item.amount < minAmount) return false;
    if (filterMode === "annual" && maxAmount !== null && item.amount > maxAmount) return false;
    return true;
  });
  const openCategory = (category: string) => {
    setSelectedCategory(category);
    setMonthFilter("all");
    setVendorFilter("");
    setMinAmountFilter("");
    setMaxAmountFilter("");
  };
  const taxRateTotals = [
    { label: "10%", taxRate: 10 },
    { label: "軽減8%", taxRate: 8 },
    { label: "対象外", taxRate: 0 }
  ].map((row) => {
    const taxItems = expenses.filter((item) => item.taxRate === row.taxRate);
    return {
      ...row,
      total: taxItems.reduce((sum, item) => sum + item.amount, 0),
      count: taxItems.length
    };
  });

  return (
    <>
      <article className="panel expense-category-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h3>{title}</h3>
          </div>
          <div className="panel-header-actions">
            {actionLabel && onAction && (
              <button className="icon-text-button ghost-button" type="button" onClick={onAction}>
                <Download size={14} />
                {actionLabel}
              </button>
            )}
            {listActionLabel && onListAction && (
              <button className="icon-text-button ghost-button" type="button" onClick={onListAction}>
                <Download size={14} />
                {listActionLabel}
              </button>
            )}
            <strong className="panel-total">{yenMoney(total)}</strong>
          </div>
        </div>
        <div className="expense-category-list">
          {categoryTotals.length === 0 ? (
            <div className="plain-note compact-note">
              <ReceiptText size={18} />
              <div>
                <strong>経費なし</strong>
                <p>締めタブで経費を入れるとここに集計されます。</p>
              </div>
            </div>
          ) : (
            categoryTotals.map((item) => (
              <button className="expense-category-row" type="button" key={item.category} onClick={() => openCategory(item.category)}>
                <span>{item.category}</span>
                <b>{yenMoney(item.total)}</b>
              </button>
            ))
          )}
          {expenses.length > 0 && (
            <button className="expense-category-row expense-tax-row" type="button" onClick={() => setTaxModalOpen(true)}>
              <span>消費税別合計</span>
              <b>{yenMoney(total)}</b>
            </button>
          )}
        </div>
      </article>

      {taxModalOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="消費税別合計">
          <article className="panel checkout-modal expense-tax-modal">
            <div className="panel-header">
              <div>
                <p className="eyebrow">経費</p>
                <h3>消費税別合計</h3>
              </div>
              <button className="icon-text-button ghost-button" type="button" onClick={() => setTaxModalOpen(false)}>
                閉じる
              </button>
            </div>
            <div className="expense-category-list">
              {taxRateTotals.map((item) => (
                <div className="expense-category-row" key={item.taxRate}>
                  <span>{item.label} / {item.count}件</span>
                  <b>{yenMoney(item.total)}</b>
                </div>
              ))}
            </div>
          </article>
        </div>
      )}

      {selectedCategory && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="経費一覧">
          <article className="panel checkout-modal expense-detail-modal">
            <div className="panel-header">
              <div>
                <p className="eyebrow">経費一覧</p>
                <h3>{selectedCategory}</h3>
              </div>
              <button className="icon-text-button ghost-button" type="button" onClick={() => setSelectedCategory(null)}>
                閉じる
              </button>
            </div>
            {filterMode === "annual" && (
              <div className="expense-modal-filters">
                <SelectField
                  label="月"
                  value={monthFilter}
                  options={[{ label: "全月", value: "all" }, ...monthOptions]}
                  onChange={setMonthFilter}
                />
                <TextField label="支払先" value={vendorFilter} onChange={setVendorFilter} />
                <label className="number-field">
                  <span>金額下限</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={minAmountFilter}
                    onChange={(event) => setMinAmountFilter(event.target.value)}
                  />
                </label>
                <label className="number-field">
                  <span>金額上限</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={maxAmountFilter}
                    onChange={(event) => setMaxAmountFilter(event.target.value)}
                  />
                </label>
              </div>
            )}
            <div className="expense-modal-list">
              <div className="expense-modal-row expense-modal-head">
                <span>日付</span>
                <span>支払先</span>
                <span>支払</span>
                <span>金額</span>
              </div>
              {visibleExpenses.length === 0 ? (
                <div className="plain-note compact-note">
                  <ReceiptText size={18} />
                  <div>
                    <strong>該当なし</strong>
                    <p>条件を変えて確認してください。</p>
                  </div>
                </div>
              ) : (
                visibleExpenses.map((item) => (
                  <div className="expense-modal-row" key={item.id}>
                    <strong>{item.date}</strong>
                    <span>{item.vendor || "支払先未入力"}</span>
                    <span>{item.paymentMethod}</span>
                    <div className="expense-amount-cell">
                      <b>{yenMoney(item.amount)}</b>
                      <span>{expenseTaxRateLabel(item.taxRate)} / {item.receiptStatus}</span>
                    </div>
                    {item.memo && <p>{item.memo}</p>}
                  </div>
                ))
              )}
            </div>
          </article>
        </div>
      )}
    </>
  );
}

function ExpensesView({
  currentUser,
  hosts,
  expenses,
  draft,
  hostName,
  onChangeDraft,
  onSave,
  onEdit,
  onDelete
}: {
  currentUser: AppUser;
  hosts: Host[];
  expenses: Expense[];
  draft: Expense;
  hostName: (hostId?: number) => string;
  onChangeDraft: (value: Expense) => void;
  onSave: () => void;
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
}) {
  const visibleExpenses =
    currentUser.role === "host"
      ? expenses.filter((item) => item.ownerType === "host" && item.hostId === currentUser.hostId)
      : expenses.filter((item) => item.ownerType === "store");
  const total = visibleExpenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <section className="split-layout">
      <ExpenseEditor
        title={currentUser.role === "host" ? "自分の経費" : "店舗経費"}
        subtitle="経費入力"
        draft={draft}
        onChangeDraft={onChangeDraft}
        onSave={onSave}
      />

      <ExpenseListPanel
        eyebrow="申告・決算用"
        title={`経費一覧 ${money(total)}`}
        expenses={visibleExpenses}
        hostName={hostName}
        canEdit
        canDelete={false}
        onEdit={onEdit}
        onDelete={onDelete}
        emptyTitle="まだ経費がありません"
        emptyBody="経費を保存すると一覧に表示されます。"
      />
    </section>
  );
}

function AnnualView({
  currentUser,
  settings,
  hosts,
  selectedHostId,
  expenses,
  receivables,
  receivablesEnabled,
  tableChecks,
  currentBusinessDate,
  onSelectHost
}: {
  currentUser: AppUser;
  settings: StoreSettings;
  hosts: Host[];
  selectedHostId: number;
  expenses: Expense[];
  receivables: Receivable[];
  receivablesEnabled: boolean;
  tableChecks: TableCheck[];
  currentBusinessDate: string;
  onSelectHost: (id: number) => void;
}) {
  const [selectedYear, setSelectedYear] = React.useState(currentBusinessDate.slice(0, 4));

  if (currentUser.role !== "host") {
    return <StoreAnnualView expenses={expenses} receivables={receivables} receivablesEnabled={receivablesEnabled} tableChecks={tableChecks} currentBusinessDate={currentBusinessDate} />;
  }

  const hostId = currentUser.role === "host" ? currentUser.hostId ?? selectedHostId : selectedHostId;
  const host = hosts.find((item) => item.id === hostId) ?? hosts[0];
  const yearOptions = Array.from(new Set([
    currentBusinessDate.slice(0, 4),
    ...tableChecks.filter((check) => check.hostId === host.id).map((check) => check.date.slice(0, 4)),
    ...expenses.filter((item) => item.ownerType === "host" && item.hostId === host.id).map((item) => item.date.slice(0, 4))
  ]))
    .filter(Boolean)
    .sort((a, b) => b.localeCompare(a))
    .map((value) => ({ value, label: `${value}年` }));
  const taxYear = Number(selectedYear);
  const annualHostExpenses = expenses.filter((item) => item.ownerType === "host" && item.hostId === host.id && item.date.startsWith(selectedYear));
  const annualHostChecks = tableChecks.filter((check) => check.hostId === host.id && check.date.startsWith(selectedYear));
  const payrollBaseAmount = (check: TableCheck) => (settings.payrollBase === "subtotal" ? check.subtotal : tableTotal(check));
  const annualSales = annualHostChecks.reduce((sum, check) => sum + tableTotal(check), 0);
  const annualBaseExpenses = annualHostExpenses.reduce((sum, item) => sum + item.amount, 0);
  const businessIncome = Math.round(annualHostChecks.reduce((sum, check) => sum + payrollBaseAmount(check), 0) * (settings.payrollRate / 100));
  const totalIncome = Math.max(0, businessIncome - annualBaseExpenses);
  const deduction = basicDeduction(taxYear, totalIncome);
  const taxableIncome = Math.floor(Math.max(0, totalIncome - deduction) / 1000) * 1000;
  const baseIncomeTax = incomeTaxByProgressiveRate(taxableIncome);
  const withholdingTax = settings.withholdingTaxRate > 0 ? Math.round(businessIncome * (settings.withholdingTaxRate / 100)) : 0;
  const incomeTax = baseIncomeTax - withholdingTax;
  const residentTax = Math.round(taxableIncome * 0.1);

  return (
    <section className="content-grid">
      <article className="panel wide">
        <div className="summary-filter-row annual-year-row">
          <SelectField label="表示年" value={selectedYear} options={yearOptions} onChange={setSelectedYear} />
        </div>
        <div className="detail-metrics">
          <Metric label="年間総売上" value={money(annualSales)} icon={BarChart3} tone="ink" />
          <Metric label="事業収入（給与）" value={money(businessIncome)} icon={WalletCards} tone="green" />
          <Metric label="年間経費" value={money(annualBaseExpenses)} icon={ReceiptText} tone="orange" />
          <Metric label="所得税目安" value={money(incomeTax)} icon={Percent} tone="red" />
          {settings.withholdingTaxRate > 0 && <Metric label="源泉所得税" value={money(withholdingTax)} icon={Coins} tone="red" />}
        </div>
        <p className="tax-note">税金は概算です。実運用では青色申告、控除、社保、源泉、税理士設定を追加します。</p>
      </article>

      <div className="plain-note compact-note">
        <Percent size={18} />
        <div>
          <strong>住民税目安 {money(residentTax)}</strong>
          <p>税金は概算です。実際の申告では控除や社会保険を反映します。</p>
        </div>
      </div>
    </section>
  );
}

function TaxReturnExpenseView({
  currentUser,
  settings,
  hosts,
  selectedHostId,
  expenses,
  tableChecks,
  currentBusinessDate
}: {
  currentUser: AppUser;
  settings: StoreSettings;
  hosts: Host[];
  selectedHostId: number;
  expenses: Expense[];
  tableChecks: TableCheck[];
  currentBusinessDate: string;
}) {
  const [payrollModalOpen, setPayrollModalOpen] = React.useState(false);
  const hostId = currentUser.role === "host" ? currentUser.hostId ?? selectedHostId : selectedHostId;
  const host = hosts.find((item) => item.id === hostId) ?? hosts[0];
  const yearOptions = Array.from(new Set([
    currentBusinessDate.slice(0, 4),
    ...tableChecks.filter((check) => check.hostId === host.id).map((check) => check.date.slice(0, 4)),
    ...expenses.filter((item) => item.ownerType === "host" && item.hostId === host.id).map((item) => item.date.slice(0, 4))
  ]))
    .filter(Boolean)
    .sort((a, b) => b.localeCompare(a))
    .map((value) => ({ value, label: `${value}年` }));
  const [selectedYear, setSelectedYear] = React.useState(currentBusinessDate.slice(0, 4));
  const taxYear = Number(selectedYear);
  const annualHostExpenses = expenses.filter((item) => item.ownerType === "host" && item.hostId === host.id && item.date.startsWith(selectedYear));
  const baseAmount = (check: TableCheck) => (settings.payrollBase === "subtotal" ? check.subtotal : tableTotal(check));
  const payrollMonths = Array.from({ length: 12 }, (_, index) => `${taxYear}-${String(index + 1).padStart(2, "0")}`);
  const monthlyPayrollRows = payrollMonths.map((month) => {
    const monthChecks = tableChecks.filter((check) => check.hostId === host.id && check.date.startsWith(month));
    const base = monthChecks.reduce((sum, check) => sum + baseAmount(check), 0);
    const payroll = Math.round(base * (settings.payrollRate / 100));
    const [, monthNumber] = month.split("-");
    return {
      month,
      label: `${Number(monthNumber)}月`,
      base,
      payroll
    };
  });
  return (
    <>
      <article className="panel expense-category-panel tax-return-year-panel">
        <div className="summary-filter-row annual-year-row">
          <SelectField label="表示年" value={selectedYear} options={yearOptions} onChange={setSelectedYear} />
        </div>
      </article>

      <article className="panel expense-category-panel tax-return-payroll-panel">
        <div className="expense-category-list">
          <button className="expense-category-row" type="button" onClick={() => setPayrollModalOpen(true)}>
            <span>給与月次</span>
            <b>表示</b>
          </button>
        </div>
      </article>

      <ExpenseCategorySummary
        eyebrow="確定申告用"
        title="経費集計"
        expenses={annualHostExpenses}
        actionLabel="科目CSV"
        onAction={() => downloadExpenseCategoryCsv(annualHostExpenses, `host-expense-categories-${host.id}-${taxYear}.csv`)}
        listActionLabel="一覧CSV"
        onListAction={() => downloadExpensesCsv(annualHostExpenses, `host-expenses-${host.id}-${taxYear}.csv`)}
        filterMode="annual"
      />

      {payrollModalOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="給与月次">
          <article className="panel checkout-modal expense-detail-modal">
            <div className="panel-header">
              <div>
                <p className="eyebrow">確定申告用</p>
                <h3>給与月次</h3>
              </div>
              <button className="icon-text-button ghost-button" type="button" onClick={() => setPayrollModalOpen(false)}>
                閉じる
              </button>
            </div>
            <div className="expense-modal-list">
              <div className="expense-modal-row payroll-month-row expense-modal-head">
                <span>月</span>
                <span>給与対象</span>
                <span>給与</span>
              </div>
              {monthlyPayrollRows.map((row) => (
                <div className="expense-modal-row payroll-month-row" key={row.month}>
                  <strong>{row.label}</strong>
                  <b>{yenMoney(row.base)}</b>
                  <b>{yenMoney(row.payroll)}</b>
                </div>
              ))}
            </div>
          </article>
        </div>
      )}
    </>
  );
}

function StoreAnnualView({
  expenses,
  receivables,
  receivablesEnabled,
  tableChecks,
  currentBusinessDate
}: {
  expenses: Expense[];
  receivables: Receivable[];
  receivablesEnabled: boolean;
  tableChecks: TableCheck[];
  currentBusinessDate: string;
}) {
  const storeExpenses = expenses
    .filter((item) => item.ownerType === "store")
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
  const checkDateById = new Map(tableChecks.map((check) => [check.id, check.date]));
  const yearOptions = Array.from(new Set([
    currentBusinessDate.slice(0, 4),
    ...tableChecks.map((check) => check.date.slice(0, 4)),
    ...storeExpenses.map((item) => item.date.slice(0, 4)),
    ...receivables.map((item) =>
      item.sourceCheckId
        ? checkDateById.get(item.sourceCheckId)?.slice(0, 4) ?? ""
        : dateFromShortDue(item.due, currentBusinessDate.slice(0, 4)).slice(0, 4)
    )
  ]))
    .filter(Boolean)
    .sort((a, b) => b.localeCompare(a))
    .map((value) => ({ value, label: `${value}年` }));
  const [selectedYear, setSelectedYear] = React.useState(currentBusinessDate.slice(0, 4));
  const yearChecks = tableChecks.filter((check) => check.date.startsWith(selectedYear));
  const yearExpenses = storeExpenses.filter((item) => item.date.startsWith(selectedYear));
  const receivableDate = (item: Receivable) =>
    item.sourceCheckId ? checkDateById.get(item.sourceCheckId) ?? "" : dateFromShortDue(item.due, selectedYear);
  const yearOpenReceivables = receivables.filter((item) => receivableDate(item).startsWith(selectedYear));
  const yearSales = yearChecks.reduce((sum, check) => sum + tableTotal(check), 0);
  const yearPaid = yearChecks.reduce((sum, check) => sum + check.cashAmount + check.cardAmount, 0);
  const yearUncollectedReceivable = yearOpenReceivables.reduce((sum, item) => sum + item.amount, 0);
  const yearTotal = yearExpenses.reduce((sum, item) => sum + item.amount, 0);
  const monthlyRows = Array.from({ length: 12 }, (_, index) => `${selectedYear}-${String(index + 1).padStart(2, "0")}`).map((month) => {
    const checks = yearChecks.filter((check) => check.date.startsWith(month));
    const monthItems = yearExpenses.filter((item) => item.date.startsWith(month));
    const monthReceivables = yearOpenReceivables.filter((item) => receivableDate(item).startsWith(month));
    const [, monthNumber] = month.split("-");
    return {
      month,
      label: `${Number(monthNumber)}月`,
      sales: checks.reduce((sum, check) => sum + tableTotal(check), 0),
      paid: checks.reduce((sum, check) => sum + check.cashAmount + check.cardAmount, 0),
      receivable: monthReceivables.reduce((sum, item) => sum + item.amount, 0),
      expenses: monthItems.reduce((sum, item) => sum + item.amount, 0)
    };
  });

  return (
    <section className="summary-stack">
      <article className="panel summary-panel">
        <div className="panel-header">
          <div>
            <h3>年間</h3>
          </div>
          <div className="summary-filter-row">
            <SelectField
              label="表示年"
              value={selectedYear}
              options={yearOptions}
              onChange={setSelectedYear}
            />
          </div>
        </div>
        <div className="quick-numbers summary-metrics">
          <Metric label="年間総売上" value={yenMoney(yearSales)} icon={BarChart3} tone="ink" />
          <Metric label="年間入金済" value={yenMoney(yearPaid)} icon={CheckCircle2} tone="green" />
          {receivablesEnabled && <Metric label="未回収売掛" value={yenMoney(yearUncollectedReceivable)} icon={AlertTriangle} tone="orange" />}
          <Metric label="年間店舗経費" value={yenMoney(yearTotal)} icon={ReceiptText} tone="red" />
        </div>

        <div className="panel-header compact-header">
          <div>
            <p className="eyebrow">月別</p>
            <h3>{receivablesEnabled ? "売上・入金・未回収・経費" : "売上・入金・経費"}</h3>
          </div>
        </div>
        <div className="daily-summary-list">
          <div className={receivablesEnabled ? "daily-summary-row daily-summary-head" : "daily-summary-row daily-summary-head no-receivable"}>
            <span>月</span>
            <span>売上</span>
            <span>入金</span>
            {receivablesEnabled && <span>未回収</span>}
            <span>経費</span>
          </div>
          {monthlyRows.map((row) => (
            <div className={receivablesEnabled ? "daily-summary-row" : "daily-summary-row no-receivable"} key={row.month}>
              <strong>{row.label}</strong>
              <b>{yenMoney(row.sales)}</b>
              <b>{yenMoney(row.paid)}</b>
              {receivablesEnabled && <b>{yenMoney(row.receivable)}</b>}
              <b>{yenMoney(row.expenses)}</b>
            </div>
          ))}
        </div>
      </article>

      <ExpenseCategorySummary
        eyebrow="確定申告用"
        title="経費集計"
        expenses={yearExpenses}
        actionLabel="科目CSV"
        onAction={() => downloadExpenseCategoryCsv(yearExpenses, `store-expense-categories-${selectedYear}.csv`)}
        listActionLabel="一覧CSV"
        onListAction={() => downloadExpensesCsv(yearExpenses, `store-expenses-${selectedYear}.csv`)}
        filterMode="annual"
      />
    </section>
  );
}

function CollapsiblePanel({
  eyebrow,
  title,
  icon: Icon,
  className = "",
  children
}: {
  eyebrow: string;
  title: string;
  icon: React.ComponentType<{ size?: number }>;
  className?: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <article className={`panel collapsible-panel ${className}`.trim()}>
      <button className="collapsible-header" type="button" aria-expanded={isOpen} onClick={() => setIsOpen((current) => !current)}>
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h3>{title}</h3>
        </div>
        <span className="collapsible-header-actions">
          <Icon size={18} />
          <span className="collapsible-state">{isOpen ? "閉じる" : "開く"}</span>
        </span>
      </button>
      {isOpen && <div className="collapsible-body">{children}</div>}
    </article>
  );
}

function ManagementView({
  currentUser,
  settings,
  notice,
  installHint,
  operationLogs,
  hosts,
  tableChecks,
  hostName,
  onInstall,
  onLogout,
  onUpdateSettings,
  onClearDevice,
  users,
  canManage,
  onUpdateUser,
  onAddUser,
  onDeleteUser
}: {
  currentUser: AppUser;
  settings: StoreSettings;
  notice: string;
  installHint: string;
  operationLogs: OperationLog[];
  hosts: Host[];
  tableChecks: TableCheck[];
  hostName: (hostId?: number) => string;
  onInstall: () => void;
  onLogout: () => void;
  onUpdateSettings: (settings: StoreSettings) => void;
  onClearDevice: () => void;
  users: AppUser[];
  canManage: boolean;
  onUpdateUser: (id: number, patch: Partial<AppUser>) => void;
  onAddUser: () => void;
  onDeleteUser: (id: number) => void;
}) {
  const canEditStoreSettings = currentUser.role === "admin" || currentUser.role === "staff";

  return (
    <section className="content-grid management-grid">
      {canEditStoreSettings && (
        <>
        <CollapsiblePanel eyebrow="管理" title="従業員" icon={Users} className="management-employees-panel">
          <EmployeePanel
            users={users}
            canManage={canManage}
            onUpdateUser={onUpdateUser}
            onAddUser={onAddUser}
            onDeleteUser={onDeleteUser}
            embedded
          />
        </CollapsiblePanel>
        <CollapsiblePanel eyebrow="顧客" title="顧客履歴" icon={UserRound} className="management-customer-panel">
          <CustomerManagementPanel
            hosts={hosts}
            tableChecks={tableChecks}
            hostName={hostName}
            receivablesEnabled={settings.receivablesEnabled}
          />
        </CollapsiblePanel>
        </>
      )}

      {canEditStoreSettings && (
        <CollapsiblePanel eyebrow="店舗設定" title="税・サ設定" icon={Percent} className="management-store-panel">
          <div className="form-grid">
            <NumberField
              label="税サ %"
              value={settings.serviceRate}
              min={0}
              max={50}
              step={1}
              onChange={(serviceRate) => onUpdateSettings({ ...settings, serviceRate })}
            />
            <NumberField
              label="消費税 %"
              value={settings.taxRate}
              min={0}
              max={20}
              step={1}
              onChange={(taxRate) => onUpdateSettings({ ...settings, taxRate })}
            />
            <NumberField
              label="営業開始"
              value={settings.openHour}
              min={0}
              max={23}
              step={1}
              onChange={(openHour) => onUpdateSettings({ ...settings, openHour })}
            />
            <NumberField
              label="営業終了"
              value={settings.closeHour}
              min={0}
              max={23}
              step={1}
              onChange={(closeHour) => onUpdateSettings({ ...settings, closeHour })}
            />
            <NumberField
              label="給与歩合 %"
              value={settings.payrollRate}
              min={0}
              max={100}
              step={1}
              onChange={(payrollRate) => onUpdateSettings({ ...settings, payrollRate })}
            />
            <SelectField
              label="給与対象"
              value={settings.payrollBase}
              options={[
                { label: "小計", value: "subtotal" },
                { label: "総計", value: "total" }
              ]}
              onChange={(payrollBase) => onUpdateSettings({ ...settings, payrollBase: payrollBase as StoreSettings["payrollBase"] })}
            />
            <SelectField
              label="源泉所得税"
              value={String(settings.withholdingTaxRate ?? 0)}
              options={[
                { label: "0", value: "0" },
                { label: "10.21%", value: "10.21" }
              ]}
              onChange={(withholdingTaxRate) => onUpdateSettings({ ...settings, withholdingTaxRate: Number(withholdingTaxRate) as StoreSettings["withholdingTaxRate"] })}
            />
            <SelectField
              label="売掛"
              value={settings.receivablesEnabled ? "on" : "off"}
              options={[
                { label: "ON", value: "on" },
                { label: "OFF", value: "off" }
              ]}
              onChange={(value) => onUpdateSettings({ ...settings, receivablesEnabled: value === "on" })}
            />
          </div>
          <div className="plain-note">
            <ReceiptText size={16} />
            <div>
              <strong>会計入力ではここを自動使用</strong>
              <p>営業時間をまたぐ営業日は、終了時刻前なら前日扱いで会計日付を付けます。</p>
            </div>
          </div>
        </CollapsiblePanel>
      )}

      {canEditStoreSettings && settings.receivablesEnabled && (
        <CollapsiblePanel eyebrow="売掛" title="確認ルール" icon={ClipboardList} className="management-rules-panel">
          <div className="rule-list">
            <p><b>赤</b> 期限切れ・本日中に店長確認</p>
            <p><b>黄</b> 3日以内・担当から連絡</p>
            <p><b>緑</b> 入金予定あり・メモ更新</p>
          </div>
        </CollapsiblePanel>
      )}

      <CollapsiblePanel eyebrow="経費" title="勘定科目の目安" icon={ReceiptText} className="management-expense-guide-panel">
        <ExpenseAccountGuide />
      </CollapsiblePanel>

      {canEditStoreSettings && (
        <CollapsiblePanel eyebrow="監査" title="操作履歴" icon={ShieldCheck} className="management-log-panel">
          <OperationLogPanel logs={operationLogs} />
        </CollapsiblePanel>
      )}

      <CollapsiblePanel eyebrow="アカウント" title={`${roleLabel[currentUser.role]} / ${currentUser.name}`} icon={UserCog} className="management-account-panel">
        <div className="management-actions">
          <button className="install-button" type="button" onClick={onInstall}>
            <Download size={18} />
            {installHint}
          </button>
          <button className="icon-text-button ghost-button" type="button" onClick={onClearDevice}>
            <Smartphone size={18} />
            端末情報削除
          </button>
          <button className="icon-text-button ghost-button" type="button" onClick={onLogout}>
            <LogOut size={18} />
            ログアウト
          </button>
        </div>
        <p className="tax-note">{notice}</p>
      </CollapsiblePanel>

    </section>
  );
}

function CustomerManagementPanel({
  hosts,
  tableChecks,
  hostName,
  receivablesEnabled
}: {
  hosts: Host[];
  tableChecks: TableCheck[];
  hostName: (hostId?: number) => string;
  receivablesEnabled: boolean;
}) {
  const [search, setSearch] = React.useState("");
  const [selectedKey, setSelectedKey] = React.useState<string | null>(null);
  const normalizedSearch = search.trim().toLowerCase();
  const hostIds = React.useMemo(() => new Set(hosts.map((host) => host.id)), [hosts]);
  const customers = React.useMemo(() => {
    const grouped = tableChecks.reduce<Record<string, {
      key: string;
      customer: string;
      hostId: number;
      count: number;
      total: number;
      lastVisit: string;
      checks: TableCheck[];
    }>>((acc, check) => {
      if (!hostIds.has(check.hostId)) return acc;
      const customer = check.customerName.trim() || "名前未設定";
      const key = `${check.hostId}:${customer}`;
      const visit = `${check.date} ${check.time}`;
      acc[key] = acc[key] ?? { key, customer, hostId: check.hostId, count: 0, total: 0, lastVisit: visit, checks: [] };
      acc[key].count += 1;
      acc[key].total += tableTotal(check);
      acc[key].lastVisit = acc[key].lastVisit.localeCompare(visit) > 0 ? acc[key].lastVisit : visit;
      acc[key].checks.push(check);
      return acc;
    }, {});

    return Object.values(grouped)
      .map((item) => ({
        ...item,
        checks: item.checks.sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
      }))
      .sort((a, b) => b.lastVisit.localeCompare(a.lastVisit) || b.total - a.total);
  }, [hostIds, tableChecks]);
  const visibleCustomers = customers.filter((item) => {
    if (!normalizedSearch) return true;
    const searchableText = `${item.customer} ${hostName(item.hostId)} ${item.total} ${item.lastVisit}`.toLowerCase();
    return searchableText.includes(normalizedSearch);
  });
  const selectedCustomer = selectedKey ? customers.find((item) => item.key === selectedKey) : null;

  return (
    <div className="customer-management">
      <div className="customer-management-toolbar">
        <label className="search-shell customer-management-search">
          <span>検索</span>
          <input
            type="search"
            value={search}
            placeholder="客名・担当・金額"
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <span className="status-pill status-ok">{visibleCustomers.length}件</span>
      </div>

      <div className="customer-management-list">
        <div className="customer-management-row customer-management-head">
          <span>客名</span>
          <span>担当</span>
          <span>回数</span>
          <span>合計</span>
          <span>最終来店</span>
        </div>
        {visibleCustomers.length === 0 ? (
          <div className="plain-note">
            <UserRound size={18} />
            <div>
              <strong>顧客履歴なし</strong>
              <p>会計登録された顧客がここに表示されます。</p>
            </div>
          </div>
        ) : (
          visibleCustomers.map((item) => (
            <button className="customer-management-row selectable-row" type="button" key={item.key} onClick={() => setSelectedKey(item.key)}>
              <span>{item.customer}</span>
              <span>{hostName(item.hostId)}</span>
              <span>{item.count}件</span>
              <b>{yenMoney(item.total)}</b>
              <span>{item.lastVisit}</span>
            </button>
          ))
        )}
      </div>

      {selectedCustomer && (
        <CustomerDetailModal
          title={`${selectedCustomer.customer} / ${hostName(selectedCustomer.hostId)}`}
          checks={selectedCustomer.checks}
          total={selectedCustomer.total}
          hostName={hostName}
          receivablesEnabled={receivablesEnabled}
          onClose={() => setSelectedKey(null)}
        />
      )}
    </div>
  );
}

function ExpenseAccountGuide() {
  return (
    <div className="expense-guide">
      <p className="expense-guide-note">
        仕事の売上を作るために直接使ったものを入れる目安。私用と混ざるものは仕事分だけに分けて、相手・目的・内容をメモしておく。
      </p>
      <div className="expense-guide-list">
        {hostExpenseAccountGuide.map((item) => (
          <div className="expense-guide-row" key={item.account}>
            <span>{item.account}</span>
            <p>{item.examples}</p>
            <small>{item.note}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

function OperationLogPanel({ logs }: { logs: OperationLog[] }) {
  const [scopeFilter, setScopeFilter] = React.useState("all");
  const visibleLogs = logs
    .filter((log) => scopeFilter === "all" || log.scope === scopeFilter)
    .slice(0, 80);

  return (
    <div className="operation-log-panel">
      <div className="operation-log-toolbar">
        <SelectField
          label="種別"
          value={scopeFilter}
          options={[
            { label: "すべて", value: "all" },
            { label: "会計", value: "会計" },
            { label: "経費", value: "経費" },
            { label: "締め", value: "締め" }
          ]}
          onChange={setScopeFilter}
        />
        <span className="status-pill status-ok">{visibleLogs.length}件</span>
      </div>

      <div className="operation-log-list">
        <div className="operation-log-row operation-log-head">
          <span>日時</span>
          <span>担当</span>
          <span>種別</span>
          <span>内容</span>
          <span>金額</span>
          <span>詳細</span>
        </div>
        {visibleLogs.length === 0 ? (
          <div className="plain-note">
            <ShieldCheck size={20} />
            <div>
              <strong>操作履歴はまだありません</strong>
              <p>会計・経費・締めを登録、編集、削除するとここに残ります。</p>
            </div>
          </div>
        ) : (
          visibleLogs.map((log) => (
            <div className="operation-log-row" key={log.id}>
              <span>{log.date} {log.time}</span>
              <span>{log.actor}<small>{log.role}</small></span>
              <span>{log.scope}<small>{log.action}</small></span>
              <strong>{log.target}</strong>
              <b>{yenMoney(log.amount)}</b>
              <span>{log.detail}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  total,
  color,
  formatValue = money
}: {
  label: string;
  value: number;
  total: number;
  color: "green" | "orange";
  formatValue?: (value: number) => string;
}) {
  const percentage = Math.min(100, Math.round((value / total) * 100));
  return (
    <div className="progress-row">
      <div className="progress-label">
        <span>{label}</span>
        <strong>{formatValue(value)}</strong>
      </div>
      <div className="progress-track" aria-label={`${label} ${percentage}%`}>
        <div className={`progress-fill fill-${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function Task({
  icon: Icon,
  title,
  detail,
  tone
}: {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  detail: string;
  tone: "danger" | "warning" | "normal";
}) {
  return (
    <div className={`task task-${tone}`}>
      <Icon size={20} />
      <div>
        <strong>{title}</strong>
        <p>{detail}</p>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  step,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max?: number;
  step: number;
  onChange: (value: number) => void;
}) {
  const parsedValue = (input: string) => {
    const rawValue = parsePlainNumber(input);
    const minValue = typeof min === "number" ? min : rawValue;
    const maxValue = typeof max === "number" ? max : Number.POSITIVE_INFINITY;
    return Math.min(maxValue, Math.max(minValue, rawValue));
  };

  return (
    <label className="number-field">
      <span>{label}</span>
      <input
        type="text"
        inputMode="numeric"
        value={plainNumber(value)}
        data-min={min}
        data-max={max}
        data-step={step}
        onChange={(event) => onChange(parsedValue(event.target.value))}
      />
    </label>
  );
}

function TextField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="number-field">
      <span>{label}</span>
      <input type="text" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="number-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

const rootElement = document.getElementById("root")!;
const root = window.__STORE_PILOT_ROOT__ ?? createRoot(rootElement);
window.__STORE_PILOT_ROOT__ = root;

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
