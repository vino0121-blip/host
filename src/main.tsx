import React from "react";
import { createRoot, type Root } from "react-dom/client";
import {
  AlertTriangle,
  Banknote,
  BarChart3,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
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
  Upload,
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
  date: string;
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

type CustomerProfile = {
  id: number;
  customer: string;
  hostId: number;
  birthday: string;
  favoriteDrink: string;
  visitNote: string;
  caution: string;
  lastContact: string;
};

type BottleKeep = {
  id: number;
  customer: string;
  hostId: number;
  bottleName: string;
  openedDate: string;
  expiresAt: string;
  memo: string;
};

type CustomerActionKind = "visit" | "dohan";
type CustomerActionStatus = "todo" | "done" | "missed";

type CustomerAction = {
  id: number;
  customer: string;
  hostId: number;
  date: string;
  time: string;
  kind: CustomerActionKind;
  targetAmount: number;
  status: CustomerActionStatus;
  memo: string;
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

type PayrollStatementRow = {
  host: Host;
  month: string;
  base: number;
  rate: number;
  salaryBase: number;
  adjustment: PayrollAdjustment;
  additionsTotal: number;
  payrollDeduction: number;
  manualDeductionsTotal: number;
  withholdingTax: number;
  deductionTotal: number;
  supplyTotal: number;
  supplyItems: PayrollItem[];
  deductionItems: PayrollItem[];
  uncollectedReceivable: number;
  payable: number;
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

type DeviceLogin = {
  id: string;
  storeId: string;
  userId: number;
  userName: string;
  role: Role;
  loginAt: string;
  expiresAt: number;
  userAgent: string;
  current: boolean;
};

type OperationLog = {
  id: number;
  date: string;
  time: string;
  actor: string;
  role: string;
  scope: "会計" | "経費" | "締め" | "来店予定" | "ボトル" | "給与";
  action: "登録" | "編集" | "削除" | "保存" | "移動";
  target: string;
  amount: number;
  detail: string;
};

type AppBackupPayload = {
  version: number;
  exportedAt: string;
  data: {
    hosts: Host[];
    users: AppUser[];
    receivables: Receivable[];
    receivablePayments: ReceivablePayment[];
    tableChecks: TableCheck[];
    customerProfiles: CustomerProfile[];
    bottles: BottleKeep[];
    customerActions: CustomerAction[];
    openTables: OpenTable[];
    expenses: Expense[];
    registerCloses: RegisterClose[];
    payrollAdjustments: Record<number, PayrollAdjustment>;
    operationLogs: OperationLog[];
    storeSettings: StoreSettings;
  };
};

type StoreSettings = {
  serviceRate: number;
  taxRate: number;
  openHour: number;
  closeHour: number;
  checkoutMainSubtotal: number;
  checkoutVipSubtotal: number;
  payrollRate: number;
  payrollBase: "subtotal" | "total";
  withholdingTaxRate: 0 | 10.21;
  receivablesEnabled: boolean;
  themeMode: "system" | "light" | "dark";
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
const deviceLogKey = "store-pilot-device-log";
const appDataStoragePrefix = "store-pilot-data-v1";
const appDataBackupVersion = 1;
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

const customerActionKindOptions: Array<{ label: string; value: CustomerActionKind }> = [
  { label: "来店", value: "visit" },
  { label: "同伴", value: "dohan" }
];

const customerActionKindLabel: Record<CustomerActionKind, string> = {
  visit: "来店",
  dohan: "同伴"
};

const customerActionStatusOptions: Array<{ label: string; value: CustomerActionStatus }> = [
  { label: "来店予定", value: "todo" },
  { label: "未対応", value: "missed" }
];

const customerActionStatusLabel: Record<CustomerActionStatus, string> = {
  todo: "来店予定",
  done: "処理済",
  missed: "未対応"
};

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
    date: "2026-06-29",
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
    date: "2026-06-29",
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
    date: "2026-06-29",
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

const initialCustomerProfiles: CustomerProfile[] = [
  {
    id: 1,
    customer: "A様",
    hostId: 1,
    birthday: "8/12",
    favoriteDrink: "鏡月",
    visitNote: "月末に来店多め。早い時間は短時間になりやすい。",
    caution: "同席者の前で売掛の話はしない",
    lastContact: "2026-06-30 LINE返信あり"
  },
  {
    id: 2,
    customer: "M様",
    hostId: 3,
    birthday: "11/03",
    favoriteDrink: "赤ワイン",
    visitNote: "VIP利用。イベント前に予算確認。",
    caution: "会計前に合計確認を必ず挟む",
    lastContact: "2026-06-29 次回来店相談"
  },
  {
    id: 3,
    customer: "R様",
    hostId: 2,
    birthday: "4/21",
    favoriteDrink: "焼酎",
    visitNote: "一人来店が多い。静かな席を希望。",
    caution: "電話連絡は夜のみ",
    lastContact: "2026-07-01 入金予定確認"
  }
];

const initialBottles: BottleKeep[] = [
  {
    id: 1,
    customer: "A様",
    hostId: 1,
    bottleName: "飾りボトル",
    openedDate: "2026-06-12",
    expiresAt: "2026-09-12",
    memo: "次回来店時に優先確認"
  },
  {
    id: 2,
    customer: "M様",
    hostId: 3,
    bottleName: "鏡月",
    openedDate: "2026-05-28",
    expiresAt: "2026-08-28",
    memo: "卓に出す用"
  },
  {
    id: 3,
    customer: "R様",
    hostId: 2,
    bottleName: "吉四六",
    openedDate: "2026-04-18",
    expiresAt: "2026-07-18",
    memo: "次回来店時に新規確認"
  }
];

const initialCustomerActions: CustomerAction[] = [
  {
    id: 1,
    customer: "A様",
    hostId: 1,
    date: "2026-07-02",
    time: "21:30",
    kind: "dohan",
    targetAmount: 300000,
    status: "todo",
    memo: "同伴後にVIP確認。飾りボトル確認"
  },
  {
    id: 2,
    customer: "M様",
    hostId: 3,
    date: "2026-07-02",
    time: "23:00",
    kind: "visit",
    targetAmount: 500000,
    status: "todo",
    memo: "イベント相談。会計前に予算確認"
  },
  {
    id: 3,
    customer: "R様",
    hostId: 2,
    date: "2026-07-03",
    time: "20:30",
    kind: "visit",
    targetAmount: 0,
    status: "todo",
    memo: "入金確認後に来店打診"
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
const htmlEscape = (value: string | number | undefined) =>
  String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
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

const downloadChecksCsv = (items: TableCheck[], hosts: Host[], receivablesEnabled: boolean, filename: string) => {
  const hostName = (hostId?: number) => hosts.find((host) => host.id === hostId)?.name ?? "未設定";
  const header = ["日付", "時間", "卓番", "客名", "担当", "人数", "小計", "税サ", "消費税", "値引", "合計", "現金", "カード", "売掛", "支払"];
  const rows = items.map((check) => [
    check.date,
    check.time,
    check.table,
    check.customerName,
    hostName(check.hostId),
    check.guests,
    check.subtotal,
    check.serviceRate,
    check.taxRate,
    check.discount,
    tableTotal(check),
    check.cashAmount,
    check.cardAmount,
    receivablesEnabled ? check.receivableAmount : 0,
    paymentLabelForDisplay(check, receivablesEnabled)
  ]);
  downloadCsv(header, rows, filename);
};

const downloadClosesCsv = (items: RegisterClose[], filename: string) => {
  const header = ["日付", "時間", "担当", "開始レジ金", "途中入金", "予想現金", "実残現金", "差額", "メモ"];
  const rows = items.map((item) => [
    item.date,
    item.time,
    item.closedBy,
    item.startCash,
    item.cashInjection,
    item.expectedCash,
    item.actualCash,
    item.difference,
    item.memo
  ]);
  downloadCsv(header, rows, filename);
};

const printDocument = (title: string, bodyHtml: string) => {
  const popup = window.open("", "_blank", "width=900,height=720");
  if (!popup) return false;
  popup.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><style>
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;margin:24px;color:#111827}
    h1{font-size:20px;margin:0 0 12px} h2{font-size:15px;margin:18px 0 8px}
    table{width:100%;border-collapse:collapse;margin-top:8px;font-size:12px}
    th,td{border:1px solid #d1d5db;padding:7px 8px;text-align:left}
    th{background:#f3f4f6} td.amount{text-align:right;font-variant-numeric:tabular-nums}
    .summary{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:12px 0}
    .box{border:1px solid #d1d5db;padding:10px}.box span{display:block;color:#6b7280;font-size:11px}.box b{font-size:16px}
    .statement-page{break-after:page;page-break-after:always}.statement-page:last-child{break-after:auto;page-break-after:auto}
    @media print{button{display:none} body{margin:12mm}}
  </style></head><body><button onclick="window.print()">PDF保存/印刷</button>${bodyHtml}</body></html>`);
  popup.document.close();
  popup.focus();
  return true;
};

const tableTotal = (check: TableCheck) => {
  const service = Math.round(check.subtotal * (check.serviceRate / 100));
  const tax = Math.round((check.subtotal + service) * (check.taxRate / 100));
  return Math.max(0, check.subtotal + service + tax - check.discount);
};

const payrollBaseAmount = (check: TableCheck, settings: StoreSettings) =>
  settings.payrollBase === "subtotal" ? check.subtotal : tableTotal(check);

const calculatePayrollStatementRow = ({
  host,
  month,
  settings,
  tableChecks,
  receivables,
  receivablesEnabled,
  payrollAdjustments,
  checkDateById
}: {
  host: Host;
  month: string;
  settings: StoreSettings;
  tableChecks: TableCheck[];
  receivables: Receivable[];
  receivablesEnabled: boolean;
  payrollAdjustments: Record<number, PayrollAdjustment>;
  checkDateById: Map<number, string>;
}): PayrollStatementRow => {
  const hostChecks = tableChecks.filter((check) => check.hostId === host.id && check.date.startsWith(month));
  const base = hostChecks.reduce((sum, check) => sum + payrollBaseAmount(check, settings), 0);
  const adjustment = payrollAdjustments[host.id] ?? blankPayrollAdjustment();
  const rate = adjustment.rate ?? settings.payrollRate;
  const salaryBase = Math.round(base * (rate / 100));
  const additionsTotal = adjustment.additions.reduce((sum, item) => sum + item.amount, 0);
  const manualDeductionsTotal = adjustment.deductions.reduce((sum, item) => sum + item.amount, 0);
  const payrollDeduction = receivablesEnabled ? receivables
    .filter((item) =>
      item.hostId === host.id &&
      item.collection === "payrollDeducted" &&
      receivableBusinessDate(item, checkDateById, month.slice(0, 4)).startsWith(month)
    )
    .reduce((sum, item) => sum + item.amount, 0) : 0;
  const uncollectedReceivable = receivablesEnabled ? receivables
    .filter((item) => item.hostId === host.id)
    .reduce((sum, item) => sum + item.amount, 0) : 0;
  const supplyTotal = salaryBase + additionsTotal;
  const withholdingTax = settings.withholdingTaxRate > 0 ? Math.round(supplyTotal * (settings.withholdingTaxRate / 100)) : 0;
  const deductionTotal = manualDeductionsTotal + payrollDeduction + withholdingTax;
  const supplyItems: PayrollItem[] = [
    { id: -1, label: `歩合支給 ${rate}%`, amount: salaryBase },
    ...adjustment.additions
  ];
  const deductionItems: PayrollItem[] = [
    ...adjustment.deductions,
    ...(payrollDeduction > 0 ? [{ id: -2, label: "給与控除売掛", amount: payrollDeduction }] : []),
    ...(withholdingTax > 0 ? [{ id: -3, label: "源泉所得税", amount: withholdingTax }] : [])
  ];

  return {
    host,
    month,
    base,
    rate,
    salaryBase,
    adjustment,
    additionsTotal,
    payrollDeduction,
    manualDeductionsTotal,
    withholdingTax,
    deductionTotal,
    supplyTotal,
    supplyItems,
    deductionItems,
    uncollectedReceivable,
    payable: supplyTotal - deductionTotal
  };
};

const payrollStatementHtml = (row: PayrollStatementRow, settings: StoreSettings) => {
  const supplyRows = row.supplyItems.map((item) => `<tr><td>${htmlEscape(item.label)}</td><td class="amount">${yenMoney(item.amount)}</td></tr>`).join("");
  const deductionRows = row.deductionItems.length > 0
    ? row.deductionItems.map((item) => `<tr><td>${htmlEscape(item.label)}</td><td class="amount">-${yenMoney(item.amount)}</td></tr>`).join("")
    : `<tr><td>控除なし</td><td class="amount">${yenMoney(0)}</td></tr>`;

  return `<section class="statement-page">
    <h1>${htmlEscape(row.month)} 給与明細</h1>
    <p>${htmlEscape(row.host.name)}</p>
    <div class="summary">
      <div class="box"><span>売上</span><b>${yenMoney(row.base)}</b></div>
      <div class="box"><span>支給合計</span><b>${yenMoney(row.supplyTotal)}</b></div>
      <div class="box"><span>支給額</span><b>${yenMoney(row.payable)}</b></div>
    </div>
    <h2>支給</h2><table><thead><tr><th>項目</th><th>金額</th></tr></thead><tbody>${supplyRows}</tbody></table>
    <h2>控除</h2><table><thead><tr><th>項目</th><th>金額</th></tr></thead><tbody>${deductionRows}</tbody></table>
    <h2>内訳</h2><table><tbody>
      <tr><th>計算元</th><td>${settings.payrollBase === "subtotal" ? "小計" : "総計"}</td></tr>
      <tr><th>歩合率</th><td>${row.rate}%</td></tr>
      <tr><th>給与控除売掛</th><td>-${yenMoney(row.payrollDeduction)}</td></tr>
      ${row.withholdingTax > 0 ? `<tr><th>源泉所得税</th><td>-${yenMoney(row.withholdingTax)}</td></tr>` : ""}
      <tr><th>控除合計</th><td>-${yenMoney(row.deductionTotal)}</td></tr>
    </tbody></table>
  </section>`;
};

const printPayrollStatement = (row: PayrollStatementRow, settings: StoreSettings) =>
  printDocument(`${row.month} ${row.host.name} 給与明細`, payrollStatementHtml(row, settings));

const printPayrollStatements = (rows: PayrollStatementRow[], month: string, settings: StoreSettings) =>
  printDocument(`${month} 給与明細`, rows.map((row) => payrollStatementHtml(row, settings)).join(""));

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
  checkoutMainSubtotal: 120000,
  checkoutVipSubtotal: 200000,
  payrollRate: 48,
  payrollBase: "total",
  withholdingTaxRate: 0,
  receivablesEnabled: true,
  themeMode: "system"
};

const formatDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const currentTime = (now = new Date()) => `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
const daysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();
const hourOptions = Array.from({ length: 24 }, (_, hour) => {
  const value = String(hour).padStart(2, "0");
  return { label: value, value };
});
const minuteOptions = Array.from({ length: 60 }, (_, minute) => {
  const value = String(minute).padStart(2, "0");
  return { label: value, value };
});
const normalizeActionTime = (time: string) => {
  const [hour = "00", minute = "00"] = time.split(":");
  const normalizedHour = String(Math.min(23, Math.max(0, Number(hour) || 0))).padStart(2, "0");
  const normalizedMinute = String(Math.min(59, Math.max(0, Number(minute) || 0))).padStart(2, "0");
  return `${normalizedHour}:${normalizedMinute}`;
};

const dateFromShortDue = (due: string, fallbackYear: string) => {
  const [month, day] = due.split("/");
  if (!month || !day) return "";
  return `${fallbackYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const receivableBusinessDate = (item: Receivable, checkDateById: Map<number, string>, fallbackYear: string) =>
  item.sourceCheckId ? checkDateById.get(item.sourceCheckId) ?? item.date : item.date || dateFromShortDue(item.due, fallbackYear);

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
  date: check.date,
  due: check.date.slice(5).replace("-", "/"),
  status: "soon",
  collection: "active",
  memo: `${check.table} 会計から自動反映`
});

const blankCheck = (hostId: number, settings: StoreSettings = defaultStoreSettings): TableCheck => {
  const baseCheck: TableCheck = {
    id: 0,
    table: "C-1",
    customerName: "名前未入力",
    hostId,
    guests: 2,
    subtotal: settings.checkoutMainSubtotal,
    serviceRate: settings.serviceRate,
    taxRate: settings.taxRate,
    discount: 0,
    payment: "カード",
    cashAmount: 0,
    cardAmount: 0,
    receivableAmount: 0,
    status: "paid",
    date: businessDateFor(settings),
    time: currentTime()
  };
  return { ...baseCheck, cardAmount: tableTotal(baseCheck) };
};

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
const readDeviceLog = () => {
  try {
    const raw = window.localStorage.getItem(deviceLogKey);
    if (!raw) return [] as DeviceLogin[];
    const items = JSON.parse(raw) as DeviceLogin[];
    return Array.isArray(items) ? items.filter((item) => item.expiresAt > Date.now()).slice(0, 50) : [];
  } catch {
    return [] as DeviceLogin[];
  }
};
const writeDeviceLog = (items: DeviceLogin[]) => {
  window.localStorage.setItem(deviceLogKey, JSON.stringify(items.slice(0, 50)));
};
const recordDeviceLogin = (storeId: string, user: AppUser) => {
  const expiresAt = Date.now() + deviceSessionMs;
  const currentSession = {
    id: `${storeId}-${user.id}-${Date.now()}`,
    storeId,
    userId: user.id,
    userName: user.name,
    role: user.role,
    loginAt: new Date().toISOString(),
    expiresAt,
    userAgent: navigator.userAgent,
    current: true
  } satisfies DeviceLogin;
  const existing = readDeviceLog().map((item) => ({ ...item, current: false }));
  writeDeviceLog([currentSession, ...existing]);
};
const clearDeviceLog = () => window.localStorage.removeItem(deviceLogKey);
const blankPayrollAdjustment = (): PayrollAdjustment => ({ additions: [], deductions: [] });
const appDataStorageKey = (name: string) => `${appDataStoragePrefix}:${name}`;

const safeReadStorage = <T,>(key: string, fallback: T, normalize?: (value: T) => T) => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    return normalize ? normalize(parsed) : parsed;
  } catch {
    return fallback;
  }
};

const usePersistentState = <T,>(key: string, initialValue: T, normalize?: (value: T) => T) => {
  const [value, setValue] = React.useState<T>(() => safeReadStorage(key, initialValue, normalize));

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can be unavailable in private mode; the app should still run.
    }
  }, [key, value]);

  return [value, setValue] as const;
};

const normalizeHosts = (items: Host[]) => (Array.isArray(items) && items.length > 0 ? items : initialHosts);
const normalizeUsers = (items: AppUser[]) => (Array.isArray(items) && items.length > 0 ? items : initialUsers);
const normalizeReceivables = (items: Receivable[]) =>
  Array.isArray(items)
    ? items.map((item) => ({
        ...item,
        date: item.date || (item.due.startsWith("7/") ? "2026-06-29" : dateFromShortDue(item.due, "2026")) || "2026-06-29",
        collection: item.collection ?? "active",
        memo: item.memo ?? ""
      }))
    : initialReceivables;
const normalizeExpenses = (items: Expense[]) =>
  Array.isArray(items)
    ? items.map((item) => ({
        ...item,
        taxRate: item.taxRate ?? 10,
        paymentMethod: item.paymentMethod ?? "現金",
        receiptStatus: item.receiptStatus ?? "手入力"
      }))
    : initialExpenses;
const normalizePayrollAdjustments = (items: Record<number, PayrollAdjustment>) =>
  Object.fromEntries(
    Object.entries(items ?? {}).map(([hostId, adjustment]) => [
      hostId,
      {
        ...adjustment,
        additions: Array.isArray(adjustment?.additions) ? adjustment.additions : [],
        deductions: Array.isArray(adjustment?.deductions) ? adjustment.deductions : []
      }
    ])
  );
const normalizeStoreSettings = (settings: StoreSettings) => ({
  ...defaultStoreSettings,
  ...(settings ?? {}),
  checkoutMainSubtotal: Math.max(0, Number(settings?.checkoutMainSubtotal ?? defaultStoreSettings.checkoutMainSubtotal) || 0),
  checkoutVipSubtotal: Math.max(0, Number(settings?.checkoutVipSubtotal ?? defaultStoreSettings.checkoutVipSubtotal) || 0),
  withholdingTaxRate: settings?.withholdingTaxRate === 10.21 ? 10.21 : 0,
  receivablesEnabled: settings?.receivablesEnabled ?? true,
  themeMode: settings?.themeMode === "dark" || settings?.themeMode === "light" ? settings.themeMode : "system"
});
const asArray = <T,>(value: unknown, fallback: T[]) => (Array.isArray(value) ? (value as T[]) : fallback);

function App() {
  const [currentUser, setCurrentUser] = React.useState<AppUser | null>(null);
  const [currentStoreId, setCurrentStoreId] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<Tab>("dashboard");
  const [hosts, setHosts] = usePersistentState<Host[]>(appDataStorageKey("hosts"), initialHosts, normalizeHosts);
  const [users, setUsers] = usePersistentState<AppUser[]>(appDataStorageKey("users"), initialUsers, normalizeUsers);
  const [receivables, setReceivables] = usePersistentState<Receivable[]>(
    appDataStorageKey("receivables"),
    initialReceivables,
    normalizeReceivables
  );
  const [receivablePayments, setReceivablePayments] = usePersistentState<ReceivablePayment[]>(
    appDataStorageKey("receivable-payments"),
    []
  );
  const [tableChecks, setTableChecks] = usePersistentState<TableCheck[]>(appDataStorageKey("table-checks"), initialTableChecks);
  const [customerProfiles, setCustomerProfiles] = usePersistentState<CustomerProfile[]>(
    appDataStorageKey("customer-profiles"),
    initialCustomerProfiles
  );
  const [bottles, setBottles] = usePersistentState<BottleKeep[]>(appDataStorageKey("bottles"), initialBottles);
  const [customerActions, setCustomerActions] = usePersistentState<CustomerAction[]>(
    appDataStorageKey("customer-actions"),
    initialCustomerActions
  );
  const [openTables, setOpenTables] = usePersistentState<OpenTable[]>(appDataStorageKey("open-tables"), initialOpenTables);
  const [expenses, setExpenses] = usePersistentState<Expense[]>(appDataStorageKey("expenses"), initialExpenses, normalizeExpenses);
  const [registerCloses, setRegisterCloses] = usePersistentState<RegisterClose[]>(appDataStorageKey("register-closes"), []);
  const [payrollAdjustments, setPayrollAdjustments] = usePersistentState<Record<number, PayrollAdjustment>>(
    appDataStorageKey("payroll-adjustments"),
    {},
    normalizePayrollAdjustments
  );
  const [operationLogs, setOperationLogs] = usePersistentState<OperationLog[]>(appDataStorageKey("operation-logs"), []);
  const [selectedHostId, setSelectedHostId] = React.useState(initialHosts[0].id);
  const [draftCheck, setDraftCheck] = React.useState<TableCheck>(blankCheck(initialHosts[0].id));
  const [editingCheckId, setEditingCheckId] = React.useState<number | null>(null);
  const [checkoutSourceOpenTableId, setCheckoutSourceOpenTableId] = React.useState<number | null>(null);
  const [checkoutEditorOpen, setCheckoutEditorOpen] = React.useState(false);
  const [expenseDraft, setExpenseDraft] = React.useState<Expense>(blankExpense(initialHosts[0].id));
  const [editingExpenseId, setEditingExpenseId] = React.useState<number | null>(null);
  const [notice, setNotice] = React.useState("準備完了");
  const [storeSettings, setStoreSettings] = usePersistentState<StoreSettings>(
    appDataStorageKey("settings"),
    defaultStoreSettings,
    normalizeStoreSettings
  );
  const [deviceLog, setDeviceLog] = React.useState<DeviceLogin[]>(() => readDeviceLog());
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
    document.documentElement.dataset.theme = storeSettings.themeMode;
  }, [storeSettings.themeMode]);

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
    recordDeviceLogin(store.id, user);
    setDeviceLog(readDeviceLog());
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

  const handleClearAllDeviceLog = () => {
    clearDeviceLog();
    clearSavedDevice();
    setDeviceLog([]);
    setNotice("保存端末情報を削除しました");
  };

  const handleForceLogoutUser = (user: AppUser) => {
    const nextLog = readDeviceLog().filter((device) => device.userId !== user.id);
    writeDeviceLog(nextLog);
    setDeviceLog(nextLog);
    if (currentUser?.id === user.id) {
      clearSavedDevice();
    }
    setNotice(`${user.name} の保存端末を解除しました`);
  };

  const createBackupPayload = (): AppBackupPayload => ({
    version: appDataBackupVersion,
    exportedAt: new Date().toISOString(),
    data: {
      hosts,
      users,
      receivables,
      receivablePayments,
      tableChecks,
      customerProfiles,
      bottles,
      customerActions,
      openTables,
      expenses,
      registerCloses,
      payrollAdjustments,
      operationLogs,
      storeSettings
    }
  });

  const exportBackup = () => {
    const payload = createBackupPayload();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `store-pilot-backup-${businessDateFor(storeSettings)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setNotice("業務データを出力しました");
  };

  const importBackup = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || "{}")) as Partial<AppBackupPayload>;
        const data = parsed.data;
        if (!data || typeof data !== "object") {
          setNotice("復元できるバックアップではありません");
          return;
        }
        setHosts(normalizeHosts(asArray<Host>(data.hosts, initialHosts)));
        setUsers(normalizeUsers(asArray<AppUser>(data.users, initialUsers)));
        setReceivables(normalizeReceivables(asArray<Receivable>(data.receivables, initialReceivables)));
        setReceivablePayments(asArray<ReceivablePayment>(data.receivablePayments, []));
        setTableChecks(asArray<TableCheck>(data.tableChecks, initialTableChecks));
        setCustomerProfiles(asArray<CustomerProfile>(data.customerProfiles, initialCustomerProfiles));
        setBottles(asArray<BottleKeep>(data.bottles, initialBottles));
        setCustomerActions(asArray<CustomerAction>(data.customerActions, initialCustomerActions));
        setOpenTables(asArray<OpenTable>(data.openTables, initialOpenTables));
        setExpenses(normalizeExpenses(asArray<Expense>(data.expenses, initialExpenses)));
        setRegisterCloses(asArray<RegisterClose>(data.registerCloses, []));
        setPayrollAdjustments(normalizePayrollAdjustments(data.payrollAdjustments ?? {}));
        setOperationLogs(asArray<OperationLog>(data.operationLogs, []));
        setStoreSettings(normalizeStoreSettings(data.storeSettings ?? defaultStoreSettings));
        setNotice("バックアップから復元しました");
      } catch {
        setNotice("バックアップの読み込みに失敗しました");
      }
    };
    reader.onerror = () => setNotice("バックアップの読み込みに失敗しました");
    reader.readAsText(file);
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
  const canManage = currentUser?.role === "admin";
  const canOperate = currentUser?.role === "admin" || currentUser?.role === "staff";
  const closedDateSet = React.useMemo(() => new Set(registerCloses.map((item) => item.date)), [registerCloses]);
  const isClosedDate = (date: string) => closedDateSet.has(date);
  const showLockedNotice = (date: string) => setNotice(`${date} は締め済みです。修正する場合は管理者確認が必要です。`);

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

  const addOpenTableFromAction = (action: CustomerAction) => {
    const nextTable: OpenTable = {
      id: Date.now(),
      table: "未定",
      guests: 2,
      hostId: action.hostId,
      customerName: action.customer || "名前未入力",
      currentAmount: 0,
      targetAmount: action.targetAmount || 100000,
      time: normalizeActionTime(action.time)
    };
    upsertCustomerProfile(nextTable.customerName, nextTable.hostId);
    setOpenTables((current) => [nextTable, ...current]);
    setCustomerActions((current) => current.filter((item) => item.id !== action.id));
    addOperationLog({
      scope: "来店予定",
      action: "移動",
      target: `${action.customer} / 未会計の卓`,
      amount: action.targetAmount,
      detail: `${hostName(action.hostId)} / ${action.date} ${action.time}`
    });
    setNotice(`${action.customer} を未会計の卓に追加`);
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
    const targetDate = editingCheckId === null ? businessDateFor(storeSettings) : draftCheck.date;
    if (isClosedDate(targetDate)) {
      showLockedNotice(targetDate);
      return;
    }
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
      date: targetDate,
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
    if (targetCheck && isClosedDate(targetCheck.date)) {
      showLockedNotice(targetCheck.date);
      return;
    }
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
    if (isClosedDate(mergedExpense.date)) {
      showLockedNotice(mergedExpense.date);
      return;
    }
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
    if (targetExpense && isClosedDate(targetExpense.date)) {
      showLockedNotice(targetExpense.date);
      return;
    }
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

  const updateCustomerProfile = (id: number, patch: Partial<CustomerProfile>) => {
    setCustomerProfiles((current) => current.map((profile) => (profile.id === id ? { ...profile, ...patch } : profile)));
  };

  const saveCustomerCaution = (customer: string, hostId: number, caution: string) => {
    const existingProfile = customerProfiles.find((profile) => profile.customer === customer && profile.hostId === hostId);
    if (existingProfile) {
      updateCustomerProfile(existingProfile.id, { caution });
      return;
    }
    setCustomerProfiles((current) => [
      {
        id: Date.now(),
        customer,
        hostId,
        birthday: "",
        favoriteDrink: "",
        visitNote: "",
        caution,
        lastContact: ""
      },
      ...current
    ]);
  };

  const upsertCustomerProfile = (customer: string, hostId: number) => {
    const existingProfile = customerProfiles.find((profile) => profile.customer === customer && profile.hostId === hostId);
    if (existingProfile) return existingProfile.id;
    const nextProfile: CustomerProfile = {
      id: Date.now(),
      customer,
      hostId,
      birthday: "",
      favoriteDrink: "",
      visitNote: "",
      caution: "",
      lastContact: currentBusinessDate
    };
    setCustomerProfiles((current) => [nextProfile, ...current]);
    return nextProfile.id;
  };

  const addBottle = () => {
    const hostId = selectedHostId;
    const customer = "新規顧客";
    upsertCustomerProfile(customer, hostId);
    const nextBottle: BottleKeep = {
      id: Date.now(),
      customer,
      hostId,
      bottleName: "鏡月",
      openedDate: currentBusinessDate,
      expiresAt: currentBusinessDate,
      memo: ""
    };
    setBottles((current) => [nextBottle, ...current]);
    addOperationLog({
      scope: "ボトル",
      action: "登録",
      target: `${nextBottle.customer} / ${nextBottle.bottleName}`,
      detail: hostName(nextBottle.hostId)
    });
  };

  const updateBottle = (id: number, patch: Partial<BottleKeep>) => {
    setBottles((current) =>
      current.map((bottle) => {
        if (bottle.id !== id) return bottle;
        return { ...bottle, ...patch };
      })
    );
  };

  const deleteBottle = (id: number) => {
    const targetBottle = bottles.find((bottle) => bottle.id === id);
    setBottles((current) => current.filter((bottle) => bottle.id !== id));
    if (targetBottle) {
      addOperationLog({
        scope: "ボトル",
        action: "削除",
        target: `${targetBottle.customer} / ${targetBottle.bottleName}`,
        detail: hostName(targetBottle.hostId)
      });
    }
  };

  const addCustomerAction = (patch: Partial<CustomerAction> = {}) => {
    const nextAction: CustomerAction = {
      id: Date.now(),
      customer: patch.customer || "新規顧客",
      hostId: patch.hostId ?? selectedHostId,
      date: patch.date || currentBusinessDate,
      time: patch.time || currentTime(),
      kind: patch.kind ?? "visit",
      targetAmount: patch.targetAmount ?? 0,
      status: patch.status ?? "todo",
      memo: patch.memo ?? ""
    };
    setCustomerActions((current) => [nextAction, ...current]);
    addOperationLog({
      scope: "来店予定",
      action: "登録",
      target: `${nextAction.customer} / ${customerActionKindLabel[nextAction.kind]}`,
      detail: `${hostName(nextAction.hostId)} / ${nextAction.date} ${nextAction.time}`
    });
  };

  const updateCustomerAction = (id: number, patch: Partial<CustomerAction>) => {
    setCustomerActions((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const deleteCustomerAction = (id: number) => {
    const targetAction = customerActions.find((item) => item.id === id);
    setCustomerActions((current) => current.filter((item) => item.id !== id));
    if (targetAction) {
      addOperationLog({
        scope: "来店予定",
        action: "削除",
        target: `${targetAction.customer} / ${customerActionKindLabel[targetAction.kind]}`,
        detail: `${hostName(targetAction.hostId)} / ${targetAction.date} ${targetAction.time}`
      });
    }
  };

  const saveRegisterClose = (actualCash: number, expectedCash: number, startCash: number, cashInjection: number, memo: string) => {
    if (!currentUser || !canOperate) return;
    if (isClosedDate(currentBusinessDate)) {
      setNotice(`${currentBusinessDate} はすでに締め済みです`);
      return;
    }
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
            customerActions={customerActions}
            currentBusinessDate={currentBusinessDate}
            onAddOpenTable={() => addOpenTable(selectedHost.id)}
            onUpdateOpenTable={updateOpenTable}
            onAddAction={(action) => addCustomerAction({ ...action, hostId: selectedHost.id, date: currentBusinessDate })}
            onMoveActionToOpenTable={addOpenTableFromAction}
            onDeleteAction={deleteCustomerAction}
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
          payrollAdjustments={payrollAdjustments}
          onChangePayrollAdjustments={setPayrollAdjustments}
          currentBusinessDate={currentBusinessDate}
        />
      )}

      {activeTab === "personal" && currentUser.role === "host" && (
        <PersonalView
          host={selectedHost}
          expenses={expenses}
          receivables={visibleReceivables}
          receivablesEnabled={receivablesEnabled}
          tableChecks={tableChecks}
          currentBusinessDate={currentBusinessDate}
          bottles={bottles}
        />
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
          currentBusinessDate={currentBusinessDate}
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
          isLocked={isClosedDate(currentBusinessDate)}
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
          payrollAdjustments={payrollAdjustments}
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
                payrollAdjustments={payrollAdjustments}
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
                receivables={visibleReceivables}
                receivablesEnabled={receivablesEnabled}
                payrollAdjustments={payrollAdjustments}
                tableChecks={tableChecks}
                currentBusinessDate={currentBusinessDate}
              />
            </CollapsiblePanel>
            <ManagementView
              currentUser={currentUser}
              settings={storeSettings}
              notice={notice}
              installHint={installHint}
              deviceLog={deviceLog}
              operationLogs={operationLogs}
              hosts={displayHosts}
              tableChecks={tableChecks}
              receivables={visibleReceivables}
              currentBusinessDate={currentBusinessDate}
              customerProfiles={customerProfiles}
              bottles={bottles}
              customerActions={customerActions}
              hostName={hostName}
              onSaveCustomerCaution={saveCustomerCaution}
              onAddBottle={addBottle}
              onUpdateBottle={updateBottle}
              onDeleteBottle={deleteBottle}
              onDeleteCustomerAction={deleteCustomerAction}
              onMoveCustomerActionToOpenTable={addOpenTableFromAction}
              onInstall={handleInstall}
              onLogout={handleLogout}
              onExportBackup={exportBackup}
              onImportBackup={importBackup}
              onUpdateSettings={setStoreSettings}
              onClearDevice={handleClearDevice}
              onClearAllDeviceLog={handleClearAllDeviceLog}
              users={users}
              canManage={canManage}
              onUpdateUser={updateUser}
              onAddUser={addEmployee}
              onForceLogoutUser={handleForceLogoutUser}
              onDeleteUser={(id) => setUsers((current) => current.filter((user) => user.id !== id))}
            />
          </section>
        ) : (
          <ManagementView
            currentUser={currentUser}
            settings={storeSettings}
            notice={notice}
            installHint={installHint}
            deviceLog={deviceLog}
            operationLogs={operationLogs}
            hosts={displayHosts}
            tableChecks={tableChecks}
            receivables={visibleReceivables}
            currentBusinessDate={currentBusinessDate}
            customerProfiles={customerProfiles}
            bottles={bottles}
            customerActions={customerActions}
            hostName={hostName}
            onSaveCustomerCaution={saveCustomerCaution}
            onAddBottle={addBottle}
            onUpdateBottle={updateBottle}
            onDeleteBottle={deleteBottle}
            onDeleteCustomerAction={deleteCustomerAction}
            onMoveCustomerActionToOpenTable={addOpenTableFromAction}
            onInstall={handleInstall}
            onLogout={handleLogout}
            onExportBackup={exportBackup}
            onImportBackup={importBackup}
            onUpdateSettings={setStoreSettings}
            onClearDevice={handleClearDevice}
            onClearAllDeviceLog={handleClearAllDeviceLog}
            users={users}
            canManage={canManage}
            onUpdateUser={updateUser}
            onAddUser={addEmployee}
            onForceLogoutUser={handleForceLogoutUser}
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
  tone,
  className = ""
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ size?: number }>;
  tone: "ink" | "green" | "orange" | "red";
  className?: string;
}) {
  const numericLength = value.replace(/[^\d-]/g, "").length;
  const valueSizeClass = numericLength >= 9 ? " metric-value-tight" : "";

  return (
    <article className={`metric tone-${tone}${valueSizeClass} ${className}`.trim()}>
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
  customerActions,
  currentBusinessDate,
  onAddOpenTable,
  onUpdateOpenTable,
  onAddAction,
  onMoveActionToOpenTable,
  onDeleteAction
}: {
  host: Host;
  todaySales: number;
  openTables: OpenTable[];
  customerActions: CustomerAction[];
  currentBusinessDate: string;
  onAddOpenTable: () => void;
  onUpdateOpenTable: (id: number, patch: Partial<OpenTable>) => void;
  onAddAction: (action: Partial<CustomerAction>) => void;
  onMoveActionToOpenTable: (action: CustomerAction) => void;
  onDeleteAction: (id: number) => void;
}) {
  const openTotal = openTables.reduce((sum, table) => sum + table.currentAmount, 0);
  const [selectedAction, setSelectedAction] = React.useState<CustomerAction | null>(null);
  const [showActionList, setShowActionList] = React.useState(false);
  const [actionDraftOpen, setActionDraftOpen] = React.useState(false);
  const [actionDraft, setActionDraft] = React.useState<CustomerAction>({
    id: 0,
    customer: "",
    hostId: host.id,
    date: currentBusinessDate,
    time: currentTime(),
    kind: "visit",
    targetAmount: 0,
    status: "todo",
    memo: ""
  });
  const todayActions = customerActions
    .filter((action) => action.hostId === host.id && action.date === currentBusinessDate && action.status !== "done")
    .sort((a, b) => a.time.localeCompare(b.time));
  const visibleActions = todayActions.slice(0, 3);
  const hiddenActionCount = Math.max(0, todayActions.length - visibleActions.length);
  const openActionDraft = () => {
    setActionDraft({
      id: 0,
      customer: "",
      hostId: host.id,
      date: currentBusinessDate,
      time: currentTime(),
      kind: "visit",
      targetAmount: 0,
      status: "todo",
      memo: ""
    });
    setActionDraftOpen(true);
  };

  return (
    <section className="home-stack">
      <article className="panel wide">
        <div className="panel-header">
          <div>
            <p className="eyebrow">日次</p>
          </div>
        </div>
        <div className="detail-metrics compact-metrics host-home-metrics">
          <Metric label="当日会計済" value={money(todaySales)} icon={ReceiptText} tone="green" />
          <Metric label="未会計合計" value={money(openTotal)} icon={ClipboardList} tone="orange" />
        </div>
      </article>

      <article className="panel wide">
        <div className="panel-header compact-header">
          <div className="host-home-title-line">
            <h3>来店予定</h3>
            <span className="status-pill status-ok">{todayActions.length}件</span>
          </div>
          <button className="icon-text-button ghost-button host-action-more-button" type="button" onClick={openActionDraft}>
            <Plus size={14} />
            追加
          </button>
        </div>
        <div className="host-action-list">
          {visibleActions.length === 0 ? (
            <div className="host-action-empty">来店予定なし</div>
          ) : (
            visibleActions.map((action) => (
              <button className="host-action-row selectable-row" type="button" key={action.id} onClick={() => setSelectedAction(action)}>
                <span>{action.time}</span>
                <small>{customerActionKindLabel[action.kind]}</small>
                <b>{action.customer}</b>
                <em>{action.targetAmount > 0 ? money(action.targetAmount) : "目標なし"}</em>
              </button>
            ))
          )}
          {hiddenActionCount > 0 && (
            <button className="host-action-more selectable-row" type="button" onClick={() => setShowActionList(true)}>
              残り{hiddenActionCount}件を表示
            </button>
          )}
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

      {selectedAction && (
        <CustomerActionDetailModal
          action={selectedAction}
          hostName={() => host.name}
          compactHostView
          onMoveToOpenTable={() => {
            onMoveActionToOpenTable(selectedAction);
            setSelectedAction(null);
          }}
          onDelete={() => {
            onDeleteAction(selectedAction.id);
            setSelectedAction(null);
          }}
          onClose={() => setSelectedAction(null)}
        />
      )}

      {showActionList && (
        <CustomerActionListModal
          actions={todayActions}
          onSelect={(action) => {
            setSelectedAction(action);
            setShowActionList(false);
          }}
          onClose={() => setShowActionList(false)}
        />
      )}

      {actionDraftOpen && (
        <CustomerActionDraftModal
          draft={actionDraft}
          onChange={setActionDraft}
          onSave={() => {
            onAddAction(actionDraft);
            setActionDraftOpen(false);
          }}
          onClose={() => setActionDraftOpen(false)}
        />
      )}
    </section>
  );
}

function CustomerActionDraftModal({
  draft,
  onChange,
  onSave,
  onClose
}: {
  draft: CustomerAction;
  onChange: (draft: CustomerAction) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="来店予定追加">
      <article className="panel checkout-modal action-detail-modal">
        <div className="panel-header">
          <div>
            <p className="eyebrow">来店予定</p>
            <h3>追加</h3>
          </div>
          <button className="icon-text-button ghost-button" type="button" onClick={onClose}>
            閉じる
          </button>
        </div>
        <div className="form-grid">
          <TextField label="客名" value={draft.customer} onChange={(customer) => onChange({ ...draft, customer })} />
          <TimeSelectField label="時間" value={draft.time} onChange={(time) => onChange({ ...draft, time })} />
          <SelectField
            label="種別"
            value={draft.kind}
            options={customerActionKindOptions}
            onChange={(kind) => onChange({ ...draft, kind: kind as CustomerActionKind })}
          />
          <NumberField label="目標" value={draft.targetAmount} min={0} step={1000} onChange={(targetAmount) => onChange({ ...draft, targetAmount })} />
          <TextField label="メモ" value={draft.memo} onChange={(memo) => onChange({ ...draft, memo })} />
        </div>
        <div className="modal-actions">
          <button className="install-button" type="button" onClick={onSave}>
            <Save size={16} />
            保存
          </button>
          <button className="icon-text-button ghost-button" type="button" onClick={onClose}>
            閉じる
          </button>
        </div>
      </article>
    </div>
  );
}

function CustomerActionListModal({
  actions,
  onSelect,
  onClose
}: {
  actions: CustomerAction[];
  onSelect: (action: CustomerAction) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = React.useState("");
  const normalizedSearch = search.trim().toLowerCase();
  const visibleActions = normalizedSearch
    ? actions.filter((action) => {
        const searchableText = `${action.time} ${action.customer} ${customerActionKindLabel[action.kind]} ${action.targetAmount} ${action.memo}`.toLowerCase();
        return searchableText.includes(normalizedSearch);
      })
    : actions;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="来店予定一覧">
      <article className="panel checkout-modal action-list-modal">
        <div className="panel-header">
          <div>
            <p className="eyebrow">来店予定</p>
            <h3>来店予定 {actions.length}件</h3>
          </div>
          <button className="icon-text-button ghost-button" type="button" onClick={onClose}>
            閉じる
          </button>
        </div>
        <label className="search-shell action-modal-search">
          <span>検索</span>
          <input
            type="search"
            value={search}
            placeholder="客名・時間・金額"
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <div className="host-action-modal-list">
          {visibleActions.length === 0 ? (
            <div className="plain-note">
              <CheckCircle2 size={18} />
              <div>
                <strong>該当なし</strong>
                <p>検索条件を変えると表示されます。</p>
              </div>
            </div>
          ) : (
            visibleActions.map((action) => (
              <button className="host-action-row selectable-row" type="button" key={action.id} onClick={() => onSelect(action)}>
                <span>{action.time}</span>
                <small>{customerActionKindLabel[action.kind]}</small>
                <b>{action.customer}</b>
                <em>{action.targetAmount > 0 ? money(action.targetAmount) : "目標なし"}</em>
              </button>
            ))
          )}
        </div>
      </article>
    </div>
  );
}

function CustomerActionDetailModal({
  action,
  hostName,
  compactHostView = false,
  onMoveToOpenTable,
  onDelete,
  onClose
}: {
  action: CustomerAction;
  hostName: (hostId?: number) => string;
  compactHostView?: boolean;
  onMoveToOpenTable?: () => void;
  onDelete?: () => void;
  onClose: () => void;
}) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="来店予定詳細">
      <article className="panel checkout-modal action-detail-modal">
        <div className="panel-header">
          <div>
            <p className="eyebrow">{customerActionKindLabel[action.kind]}</p>
            <h3>{action.customer}</h3>
          </div>
          <button className="icon-text-button ghost-button" type="button" onClick={onClose}>
            閉じる
          </button>
        </div>
        <div className="result-lines">
          {!compactHostView && <div><span>担当</span><b>{hostName(action.hostId)}</b></div>}
          <div><span>{compactHostView ? "時間" : "日時"}</span><b>{compactHostView ? action.time : `${action.date} ${action.time}`}</b></div>
          <div><span>目標</span><b>{action.targetAmount > 0 ? yenMoney(action.targetAmount) : "なし"}</b></div>
          <div><span>状態</span><b>{customerActionStatusLabel[action.status]}</b></div>
        </div>
        {action.memo && <p className="tax-note">{action.memo}</p>}
        <div className="modal-actions">
          {onMoveToOpenTable && (
            <button className="install-button" type="button" onClick={onMoveToOpenTable}>
              <Plus size={16} />
              未会計の卓に追加
            </button>
          )}
          {onDelete && (
            <button className="icon-text-button ghost-button danger-button" type="button" onClick={onDelete}>
              <Trash2 size={16} />
              削除
            </button>
          )}
          <button className="icon-text-button ghost-button" type="button" onClick={onClose}>
            閉じる
          </button>
        </div>
      </article>
    </div>
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
          ? (dateByCheckId.get(item.sourceCheckId) ?? item.date).slice(0, 7)
          : (item.date || dateFromShortDue(item.due, currentBusinessDate.slice(0, 4))).slice(0, 7)
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
    receivableBusinessDate(item, checkDateById, fallbackYear);
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
  const [rankingModal, setRankingModal] = React.useState<"sales" | "groups" | null>(null);
  const [copyNotice, setCopyNotice] = React.useState("");
  const monthChecks = tableChecks.filter((check) => check.date.startsWith(selectedMonth));
  const rankingRows = hosts.map((host) => {
    const hostChecks = monthChecks.filter((check) => check.hostId === host.id);
    const sales = hostChecks.reduce((sum, check) => sum + tableTotal(check), 0);
    const groups = hostChecks.length;
    return { host, sales, groups };
  });
  const salesRows = [...rankingRows].sort((a, b) => b.sales - a.sales || b.groups - a.groups || a.host.rank - b.host.rank);
  const groupRows = [...rankingRows].sort((a, b) => b.groups - a.groups || b.sales - a.sales || a.host.rank - b.host.rank);
  const modalRows = rankingModal === "groups" ? groupRows : salesRows;
  const rankingValue = (row: (typeof rankingRows)[number], mode: "sales" | "groups") =>
    mode === "sales" ? yenMoney(row.sales) : `${row.groups}組`;
  const copyTop10 = async (mode: "sales" | "groups") => {
    const rows = (mode === "sales" ? salesRows : groupRows).slice(0, 10);
    const text = rows.map((row, index) => `${index + 1}位 ${row.host.name} ${rankingValue(row, mode)}`).join("\n");
    await navigator.clipboard?.writeText(text);
    setCopyNotice("10位までコピーしました");
  };

  const renderRow = (row: (typeof rankingRows)[number], index: number, mode: "sales" | "groups") => (
    <button className="rank-row selectable-row" type="button" key={`${mode}-${row.host.id}`} onClick={() => setRankingModal(mode)}>
      <span>{index + 1}</span>
      <div>
        <strong>{row.host.name}</strong>
        <p>{yenMoney(row.sales)} / {row.groups}組 / 目標 {yenMoney(row.host.target)}</p>
      </div>
      <b>{mode === "sales" ? yenMoney(row.sales) : `${row.groups}組`}</b>
    </button>
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
            <h3>組数順位</h3>
          </div>
          <Users size={22} />
        </div>
        <div className="host-rank-list">
          {groupRows.map((row, index) => renderRow(row, index, "groups"))}
        </div>
      </article>

      {rankingModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="ランキング一覧">
          <article className="panel checkout-modal ranking-modal">
            <div className="panel-header">
              <div>
                <p className="eyebrow">{selectedMonth}</p>
                <h3>{rankingModal === "sales" ? "売上順位" : "組数順位"}</h3>
              </div>
              <button className="icon-text-button ghost-button" type="button" onClick={() => setRankingModal(null)}>
                閉じる
              </button>
            </div>
            <div className="button-row ranking-modal-actions">
              <button className="icon-text-button" type="button" onClick={() => copyTop10(rankingModal)}>
                <Download size={14} />
                10位までコピー
              </button>
              {copyNotice && <span className="status-pill status-ok">{copyNotice}</span>}
            </div>
            <div className="ranking-modal-list">
              <div className="ranking-modal-row ranking-modal-head">
                <span>順位</span>
                <span>名前</span>
                <span>金額</span>
              </div>
              {modalRows.map((row, index) => (
                <div className="ranking-modal-row" key={row.host.id}>
                  <span>{index + 1}</span>
                  <strong>{row.host.name}</strong>
                  <b>{rankingValue(row, rankingModal)}</b>
                </div>
              ))}
            </div>
          </article>
        </div>
      )}
    </section>
  );
}

function PayrollView({
  hosts,
  settings,
  tableChecks,
  receivables,
  receivablesEnabled,
  payrollAdjustments,
  onChangePayrollAdjustments,
  currentBusinessDate
}: {
  hosts: Host[];
  settings: StoreSettings;
  tableChecks: TableCheck[];
  receivables: Receivable[];
  receivablesEnabled: boolean;
  payrollAdjustments: Record<number, PayrollAdjustment>;
  onChangePayrollAdjustments: React.Dispatch<React.SetStateAction<Record<number, PayrollAdjustment>>>;
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
  const [editingHostId, setEditingHostId] = React.useState<number | null>(null);
  const checkDateById = React.useMemo(() => new Map(tableChecks.map((check) => [check.id, check.date])), [tableChecks]);
  const withholdingTaxRate = settings.withholdingTaxRate ?? 0;
  const withholdingEnabled = withholdingTaxRate > 0;
  const payrollRows = hosts.map((host) => calculatePayrollStatementRow({
    host,
    month: selectedMonth,
    settings,
    tableChecks,
    receivables,
    receivablesEnabled,
    payrollAdjustments,
    checkDateById
  }));
  const totals = payrollRows.reduce(
    (acc, row) => ({
      uncollectedReceivable: acc.uncollectedReceivable + row.uncollectedReceivable,
      payable: acc.payable + row.payable
    }),
    { uncollectedReceivable: 0, payable: 0 }
  );
  const editingRow = payrollRows.find((row) => row.host.id === editingHostId);
  const updatePayrollAdjustment = (hostId: number, patch: Partial<PayrollAdjustment>) => {
    onChangePayrollAdjustments((current) => {
      const base = current[hostId] ?? blankPayrollAdjustment();
      return { ...current, [hostId]: { ...base, ...patch } };
    });
  };
  const addPayrollItem = (hostId: number, type: "additions" | "deductions") => {
    const label = type === "additions" ? "支給項目" : "控除項目";
    onChangePayrollAdjustments((current) => {
      const base = current[hostId] ?? blankPayrollAdjustment();
      return { ...current, [hostId]: { ...base, [type]: [...base[type], { id: Date.now(), label, amount: 0 }] } };
    });
  };
  const updatePayrollItem = (hostId: number, type: "additions" | "deductions", itemId: number, patch: Partial<PayrollItem>) => {
    onChangePayrollAdjustments((current) => {
      const base = current[hostId] ?? blankPayrollAdjustment();
      return { ...current, [hostId]: { ...base, [type]: base[type].map((item) => (item.id === itemId ? { ...item, ...patch } : item)) } };
    });
  };
  const deletePayrollItem = (hostId: number, type: "additions" | "deductions", itemId: number) => {
    onChangePayrollAdjustments((current) => {
      const base = current[hostId] ?? blankPayrollAdjustment();
      return { ...current, [hostId]: { ...base, [type]: base[type].filter((item) => item.id !== itemId) } };
    });
  };
  const payrollItemSummary = (items: PayrollItem[]) =>
    items.length > 0 ? items.map((item) => `${item.label}:${item.amount}`).join(" / ") : "";
  const exportPayrollCsv = () => {
    const header = ["月", "ホスト", "売上", "歩合率", "歩合支給", "追加支給", "支給項目", "支給合計", "給与控除売掛", "手動控除", "控除項目", "源泉所得税", "控除合計", "支給額", "未回収売掛"];
    const rows = payrollRows.map((row) => [
      selectedMonth,
      row.host.name,
      row.base,
      `${row.rate}%`,
      row.salaryBase,
      row.additionsTotal,
      payrollItemSummary(row.supplyItems),
      row.supplyTotal,
      row.payrollDeduction,
      row.manualDeductionsTotal,
      payrollItemSummary(row.deductionItems),
      row.withholdingTax,
      row.deductionTotal,
      row.payable,
      row.uncollectedReceivable
    ]);
    downloadCsv(header, rows, `payroll-${selectedMonth}.csv`);
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
            <button className="icon-text-button ghost-button" type="button" onClick={exportPayrollCsv}>
              <Download size={14} />
              給与CSV
            </button>
            <button className="icon-text-button ghost-button" type="button" onClick={() => printPayrollStatements(payrollRows, selectedMonth, settings)}>
              <FileText size={14} />
              明細PDF一括
            </button>
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
            <div className="button-row full-button-row">
              <button className="install-button" type="button" onClick={() => printPayrollStatement(editingRow, settings)}>
                <FileText size={16} />
                明細PDF
              </button>
              <button className="icon-text-button ghost-button" type="button" onClick={() => setEditingHostId(null)}>
                閉じる
              </button>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}

function PersonalView({
  host,
  expenses,
  receivables,
  receivablesEnabled,
  tableChecks,
  currentBusinessDate,
  bottles
}: {
  host: Host;
  expenses: Expense[];
  receivables: Receivable[];
  receivablesEnabled: boolean;
  tableChecks: TableCheck[];
  currentBusinessDate: string;
  bottles: BottleKeep[];
}) {
  const monthOptions = React.useMemo(() => {
    const [baseYear, baseMonth] = currentBusinessDate.split("-").map(Number);
    const base = new Date(baseYear, (baseMonth || 1) - 1, 1);
    return Array.from({ length: 13 }, (_, index) => {
      const date = new Date(base);
      date.setMonth(base.getMonth() - index);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const label = `${date.getFullYear()}年${date.getMonth() + 1}月`;
      return { label, value, index };
    });
  }, [currentBusinessDate]);
  const [selectedMonth, setSelectedMonth] = React.useState(currentBusinessDate.slice(0, 7));
  React.useEffect(() => {
    setSelectedMonth(currentBusinessDate.slice(0, 7));
  }, [currentBusinessDate]);
  const [customerSearch, setCustomerSearch] = React.useState("");
  const [selectedCustomer, setSelectedCustomer] = React.useState<string | null>(null);
  const checkDateById = React.useMemo(() => new Map(tableChecks.map((check) => [check.id, check.date])), [tableChecks]);
  const hostChecks = tableChecks.filter((check) => check.hostId === host.id && check.date.startsWith(selectedMonth));
  const monthSales = hostChecks.reduce((sum, check) => sum + tableTotal(check), 0);
  const displayedExpenses = expenses
    .filter((expense) => expense.ownerType === "host" && expense.hostId === host.id && expense.date.startsWith(selectedMonth))
    .reduce((sum, expense) => sum + expense.amount, 0);
  const activeReceivable = receivablesEnabled ? receivables
    .filter((item) => item.hostId === host.id && item.collection !== "payrollDeducted")
    .reduce((sum, item) => sum + item.amount, 0) : 0;
  const payrollDeductedReceivable = receivablesEnabled ? receivables
    .filter((item) =>
      item.hostId === host.id &&
      item.collection === "payrollDeducted" &&
      receivableBusinessDate(item, checkDateById, selectedMonth.slice(0, 4)).startsWith(selectedMonth)
    )
    .reduce((sum, item) => sum + item.amount, 0) : 0;
  const payrollEstimate = Math.round(monthSales * 0.48 - payrollDeductedReceivable);
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
  const selectedCustomerBottles = selectedCustomer
    ? bottles.filter((bottle) => bottle.customer === selectedCustomer && bottle.hostId === host.id)
    : [];

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
          <Metric label="給与目安" value={money(Math.max(0, payrollEstimate))} icon={WalletCards} tone="green" />
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
                <strong>{item.customer}</strong>
                <span>{item.count}件</span>
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
          bottles={selectedCustomerBottles}
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
  profile,
  bottles = [],
  onClose
}: {
  title: string;
  checks: TableCheck[];
  total: number;
  hostName: (hostId?: number) => string;
  receivablesEnabled: boolean;
  profile?: CustomerProfile;
  bottles?: BottleKeep[];
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
        {((profile?.caution) || bottles.length > 0) && (
          <div className="customer-card-grid">
            {profile?.caution && (
              <section className="customer-card-box">
                <p className="eyebrow">注意</p>
                <div className="customer-card-lines">
                  <p>{profile.caution}</p>
                </div>
              </section>
            )}
            {bottles.length > 0 && (
              <section className="customer-card-box">
                <p className="eyebrow">ボトル</p>
                <div className="customer-bottle-mini-list">
                  {bottles.map((bottle) => (
                    <div className="customer-bottle-mini" key={bottle.id}>
                      <span>{bottle.bottleName}</span>
                      {bottle.memo && <small>{bottle.memo}</small>}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
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
            <button className="icon-text-button ghost-button" type="button" onClick={() => downloadChecksCsv(tableChecks, hosts, receivablesEnabled, `checks-${businessDate}.csv`)}>
              <Download size={14} />
              会計CSV
            </button>
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
  const applyCheckoutPattern = (subtotal: number) => {
    const nextBase = withAutoReceivable({ ...draftCheck, subtotal }, storeSettings);
    const nextTotal = tableTotal(nextBase);
    if (nextBase.payment === "現金") {
      onChangeDraft({ ...nextBase, cashAmount: nextTotal, cardAmount: 0, receivableAmount: 0 });
      return;
    }
    if (nextBase.payment === "カード") {
      onChangeDraft({ ...nextBase, cashAmount: 0, cardAmount: nextTotal, receivableAmount: 0 });
      return;
    }
    if (receivablesEnabled && nextBase.payment === "売掛") {
      onChangeDraft({ ...nextBase, cashAmount: 0, cardAmount: 0, receivableAmount: nextTotal });
      return;
    }
    onChangeDraft(nextBase);
  };
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

        <div className="checkout-pattern-row">
          <button className="icon-text-button ghost-button" type="button" onClick={() => applyCheckoutPattern(storeSettings.checkoutMainSubtotal)}>
            メイン {money(storeSettings.checkoutMainSubtotal)}
          </button>
          <button className="icon-text-button ghost-button" type="button" onClick={() => applyCheckoutPattern(storeSettings.checkoutVipSubtotal)}>
            VIP {money(storeSettings.checkoutVipSubtotal)}
          </button>
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
        <div className="open-table-title-line">
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
  onForceLogoutUser,
  onDeleteUser
}: {
  users: AppUser[];
  canManage: boolean;
  onUpdateUser: (id: number, patch: Partial<AppUser>) => void;
  onAddUser: () => void;
  onForceLogoutUser: (user: AppUser) => void;
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
        onForceLogoutUser={onForceLogoutUser}
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
  onForceLogoutUser,
  showEmbeddedActions = true,
  className = "",
  embedded = false
}: {
  users: AppUser[];
  canManage: boolean;
  onUpdateUser: (id: number, patch: Partial<AppUser>) => void;
  onAddUser: () => void;
  onDeleteUser: (id: number) => void;
  onForceLogoutUser?: (user: AppUser) => void;
  showEmbeddedActions?: boolean;
  className?: string;
  embedded?: boolean;
}) {
  const list = (
    <>
      {embedded && canManage && showEmbeddedActions && (
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
                <div className="employee-main-edit">
                  <TextField label="名前" value={user.name} onChange={(name) => onUpdateUser(user.id, { name })} />
                </div>
                <div className="employee-mini-controls">
                  <select value={user.role} aria-label="権限" onChange={(event) => onUpdateUser(user.id, { role: event.target.value as Role })}>
                    <option value="admin">店長</option>
                    <option value="staff">内勤</option>
                    <option value="host">ホスト</option>
                  </select>
                  <button className="icon-button employee-force-logout-button" type="button" aria-label={`${user.name}を強制ログアウト`} onClick={() => onForceLogoutUser?.(user)}>
                    <LogOut size={13} />
                  </button>
                  <button className="icon-button danger-button employee-delete-button" type="button" aria-label="従業員削除" onClick={() => onDeleteUser(user.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <strong>{user.name}</strong>
                </div>
                <span className="status-pill status-ok">{roleLabel[user.role]}</span>
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
                  <span className="receivable-due">{item.due}</span>
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
  isLocked,
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
  isLocked: boolean;
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
  const printClosingSheet = () => {
    const expenseRows = storeExpenses.length > 0
      ? storeExpenses.map((item) => `<tr><td>${htmlEscape(item.category)}</td><td>${htmlEscape(item.vendor || "支払先未入力")}</td><td>${htmlEscape(item.paymentMethod)}</td><td class="amount">${yenMoney(item.amount)}</td></tr>`).join("")
      : `<tr><td colspan="4">当日経費なし</td></tr>`;
    printDocument(
      `${businessDate} レジ締め`,
      `<h1>${businessDate} レジ締め</h1>
       <div class="summary">
        <div class="box"><span>総会計</span><b>${yenMoney(totalSales)}</b></div>
        <div class="box"><span>現金売上</span><b>${yenMoney(cashSales)}</b></div>
        <div class="box"><span>差額</span><b>${yenMoney(difference)}</b></div>
       </div>
       <table><tbody>
        <tr><th>開始レジ金</th><td class="amount">${yenMoney(startCash)}</td></tr>
        <tr><th>途中入金</th><td class="amount">${yenMoney(cashInjection)}</td></tr>
        <tr><th>カード売上</th><td class="amount">${yenMoney(cardSales)}</td></tr>
        <tr><th>売掛</th><td class="amount">${yenMoney(receivableSales)}</td></tr>
        <tr><th>現金経費</th><td class="amount">-${yenMoney(cashExpenses)}</td></tr>
        <tr><th>予想現金</th><td class="amount">${yenMoney(expectedCash)}</td></tr>
        <tr><th>実残現金</th><td class="amount">${yenMoney(actualCash)}</td></tr>
       </tbody></table>
       <h2>当日経費</h2><table><thead><tr><th>科目</th><th>支払先</th><th>支払</th><th>金額</th></tr></thead><tbody>${expenseRows}</tbody></table>`
    );
  };

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
          {isLocked ? <span className="status-pill status-ok">締め済み</span> : <CheckCircle2 size={22} />}
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
          disabled={isLocked}
        >
          <Save size={18} />
          {isLocked ? "締め済み" : "レジ締め保存"}
        </button>
      </article>

      <article className="panel wide">
        <div className="panel-header">
          <div>
            <p className="eyebrow">レジ締め</p>
            <h3>{businessDate}</h3>
          </div>
          <div className="panel-header-actions">
            <button className="icon-text-button ghost-button" type="button" onClick={() => downloadClosesCsv(closes, `register-closes.csv`)}>
              <Download size={14} />
              締めCSV
            </button>
            <button className="icon-text-button ghost-button" type="button" onClick={printClosingSheet}>
              <FileText size={14} />
              締めPDF
            </button>
            <span className={difference === 0 ? "status-pill status-ok" : "status-pill status-danger"}>差額 {money(difference)}</span>
          </div>
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
  title = "経費編集",
  onChangeDraft,
  onClose,
  onSave,
  onDelete
}: {
  draft: Expense;
  title?: string;
  onChangeDraft: (value: Expense) => void;
  onClose: () => void;
  onSave: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <article className="panel checkout-modal expense-edit-modal">
        <div className="panel-header">
          <div>
            <p className="eyebrow">経費</p>
            <h3>{title}</h3>
          </div>
          <button className="icon-text-button ghost-button" type="button" onClick={onClose}>
            閉じる
          </button>
        </div>
        <ExpenseFormFields draft={draft} onChangeDraft={onChangeDraft} />
        <div className="button-row expense-edit-actions">
          {onDelete ? (
            <button className="icon-text-button ghost-button danger-button" type="button" onClick={onDelete}>
              <Trash2 size={16} />
              削除
            </button>
          ) : (
            <button className="icon-text-button ghost-button" type="button" onClick={onClose}>
              閉じる
            </button>
          )}
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
        <DateSelectField label="日付" value={draft.date} onChange={(date) => onChangeDraft({ ...draft, date })} />
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
  actionIcon: ActionIcon = Download,
  headerControl,
  onAction,
  onEdit,
  onDelete,
  emptyTitle,
  emptyBody
}: {
  eyebrow?: string;
  title: string;
  expenses: Expense[];
  hostName: (hostId?: number) => string;
  canDelete: boolean;
  canEdit?: boolean;
  compactDetails?: boolean;
  iconSize?: number;
  actionLabel?: string;
  actionIcon?: React.ComponentType<{ size?: number }>;
  headerControl?: React.ReactNode;
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
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h3>{title}</h3>
        </div>
        <div className="panel-header-actions">
          {actionLabel && onAction && (
            <button className="icon-text-button ghost-button" type="button" onClick={onAction}>
              <ActionIcon size={14} />
              {actionLabel}
            </button>
          )}
          {headerControl}
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
  currentBusinessDate,
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
  currentBusinessDate: string;
  hostName: (hostId?: number) => string;
  onChangeDraft: (value: Expense) => void;
  onSave: () => void;
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
}) {
  const [createOpen, setCreateOpen] = React.useState(false);
  const visibleExpenses =
    currentUser.role === "host"
      ? expenses.filter((item) => item.ownerType === "host" && item.hostId === currentUser.hostId)
      : expenses.filter((item) => item.ownerType === "store");
  const monthOptions = React.useMemo(() => {
    const months = Array.from(new Set([
      currentBusinessDate.slice(0, 7),
      ...visibleExpenses.map((item) => item.date.slice(0, 7))
    ]));
    return months
      .filter(Boolean)
      .sort((a, b) => b.localeCompare(a))
      .map((value) => {
        const [year, month] = value.split("-");
        return { value, label: `${year}年${Number(month)}月` };
      });
  }, [currentBusinessDate, visibleExpenses]);
  const [selectedMonth, setSelectedMonth] = React.useState(currentBusinessDate.slice(0, 7));
  const monthExpenses = visibleExpenses.filter((item) => item.date.startsWith(selectedMonth));
  const total = monthExpenses.reduce((sum, item) => sum + item.amount, 0);
  const ownerType = currentUser.role === "host" ? "host" : "store";
  const openCreateExpense = () => {
    onChangeDraft({ ...blankExpense(currentUser.hostId ?? hosts[0]?.id ?? 0, ownerType), date: currentBusinessDate });
    setCreateOpen(true);
  };
  const closeCreateExpense = () => {
    onChangeDraft({ ...blankExpense(currentUser.hostId ?? hosts[0]?.id ?? 0, ownerType), date: currentBusinessDate });
    setCreateOpen(false);
  };
  const saveCreateExpense = () => {
    onSave();
    setCreateOpen(false);
  };

  return (
    <section className="summary-stack">
      <ExpenseListPanel
        title={`経費一覧 ${money(total)}`}
        expenses={monthExpenses}
        hostName={hostName}
        canEdit
        canDelete={false}
        actionLabel="登録"
        actionIcon={Plus}
        headerControl={
          <div className="expense-month-control">
            <SelectField label="年月" value={selectedMonth} options={monthOptions} onChange={setSelectedMonth} />
          </div>
        }
        onAction={openCreateExpense}
        onEdit={onEdit}
        onDelete={onDelete}
        emptyTitle="まだ経費がありません"
        emptyBody="経費を保存すると一覧に表示されます。"
      />

      {createOpen && (
        <ExpenseEditorModal
          title="経費登録"
          draft={draft}
          onChangeDraft={onChangeDraft}
          onClose={closeCreateExpense}
          onSave={saveCreateExpense}
        />
      )}
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
  payrollAdjustments,
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
  payrollAdjustments: Record<number, PayrollAdjustment>;
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
  const checkDateById = React.useMemo(() => new Map(tableChecks.map((check) => [check.id, check.date])), [tableChecks]);
  const payrollRows = Array.from({ length: 12 }, (_, index) => `${taxYear}-${String(index + 1).padStart(2, "0")}`)
    .map((month) => calculatePayrollStatementRow({
      host,
      month,
      settings,
      tableChecks,
      receivables,
      receivablesEnabled,
      payrollAdjustments,
      checkDateById
    }));
  const annualSales = annualHostChecks.reduce((sum, check) => sum + tableTotal(check), 0);
  const annualBaseExpenses = annualHostExpenses.reduce((sum, item) => sum + item.amount, 0);
  const businessIncome = payrollRows.reduce((sum, row) => sum + row.supplyTotal, 0);
  const totalIncome = Math.max(0, businessIncome - annualBaseExpenses);
  const deduction = basicDeduction(taxYear, totalIncome);
  const taxableIncome = Math.floor(Math.max(0, totalIncome - deduction) / 1000) * 1000;
  const baseIncomeTax = incomeTaxByProgressiveRate(taxableIncome);
  const withholdingTax = payrollRows.reduce((sum, row) => sum + row.withholdingTax, 0);
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
  receivables,
  receivablesEnabled,
  payrollAdjustments,
  tableChecks,
  currentBusinessDate
}: {
  currentUser: AppUser;
  settings: StoreSettings;
  hosts: Host[];
  selectedHostId: number;
  expenses: Expense[];
  receivables: Receivable[];
  receivablesEnabled: boolean;
  payrollAdjustments: Record<number, PayrollAdjustment>;
  tableChecks: TableCheck[];
  currentBusinessDate: string;
}) {
  const [payrollModalOpen, setPayrollModalOpen] = React.useState(false);
  const [selectedPayrollMonth, setSelectedPayrollMonth] = React.useState<{
    row: PayrollStatementRow;
    month: string;
    label: string;
    sales: number;
    base: number;
    payroll: number;
    withholdingTax: number;
    takeHome: number;
    supplyItems: PayrollItem[];
    deductionItems: PayrollItem[];
    supplyTotal: number;
    deductionTotal: number;
  } | null>(null);
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
  const checkDateById = React.useMemo(() => new Map(tableChecks.map((check) => [check.id, check.date])), [tableChecks]);
  const payrollMonths = Array.from({ length: 12 }, (_, index) => `${taxYear}-${String(index + 1).padStart(2, "0")}`);
  const monthlyPayrollRows = payrollMonths.map((month) => {
    const monthChecks = tableChecks.filter((check) => check.hostId === host.id && check.date.startsWith(month));
    const sales = monthChecks.reduce((sum, check) => sum + tableTotal(check), 0);
    const row = calculatePayrollStatementRow({
      host,
      month,
      settings,
      tableChecks,
      receivables,
      receivablesEnabled,
      payrollAdjustments,
      checkDateById
    });
    const [, monthNumber] = month.split("-");
    return {
      row,
      month,
      label: `${Number(monthNumber)}月`,
      sales,
      base: row.base,
      payroll: row.salaryBase,
      withholdingTax: row.withholdingTax,
      takeHome: row.payable,
      supplyItems: row.supplyItems,
      deductionItems: row.deductionItems,
      supplyTotal: row.supplyTotal,
      deductionTotal: row.deductionTotal
    };
  });
  const closePayrollModal = () => {
    setPayrollModalOpen(false);
    setSelectedPayrollMonth(null);
  };
  return (
    <>
      <article className="panel expense-category-panel tax-return-year-panel">
        <div className="summary-filter-row annual-year-row">
          <SelectField
            label="表示年"
            value={selectedYear}
            options={yearOptions}
            onChange={(value) => {
              setSelectedYear(value);
              setSelectedPayrollMonth(null);
            }}
          />
        </div>
      </article>

      <article className="panel expense-category-panel tax-return-payroll-panel">
        <div className="expense-category-list">
          <button className="expense-category-row" type="button" onClick={() => setPayrollModalOpen(true)}>
            <span>月別売上・手取り</span>
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
              <button className="icon-text-button ghost-button" type="button" onClick={closePayrollModal}>
                閉じる
              </button>
            </div>
            <div className="expense-modal-list">
              <div className="expense-modal-row payroll-month-row expense-modal-head">
                <span>月</span>
                <span>売上</span>
                <span>手取り</span>
              </div>
              {monthlyPayrollRows.map((row) => (
                <button className="expense-modal-row payroll-month-row selectable-modal-row" type="button" key={row.month} onClick={() => setSelectedPayrollMonth(row)}>
                  <strong>{row.label}</strong>
                  <b>{yenMoney(row.sales)}</b>
                  <b>{yenMoney(row.takeHome)}</b>
                </button>
              ))}
            </div>
          </article>
        </div>
      )}

      {selectedPayrollMonth && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="給与内訳">
          <article className="panel checkout-modal expense-detail-modal">
            <div className="panel-header">
              <div>
                <p className="eyebrow">{selectedYear}年</p>
                <h3>{selectedPayrollMonth.label} 内訳</h3>
              </div>
              <button className="icon-text-button ghost-button" type="button" onClick={() => setSelectedPayrollMonth(null)}>
                閉じる
              </button>
            </div>
            <div className="result-lines">
              <div><span>売上</span><b>{yenMoney(selectedPayrollMonth.sales)}</b></div>
              <div><span>計算元</span><b>{settings.payrollBase === "subtotal" ? "小計" : "総計"}</b></div>
              <div><span>支給合計</span><b>{yenMoney(selectedPayrollMonth.supplyTotal)}</b></div>
              <div><span>控除合計</span><b>-{yenMoney(selectedPayrollMonth.deductionTotal)}</b></div>
              <div><span>手取り</span><b>{yenMoney(selectedPayrollMonth.takeHome)}</b></div>
            </div>
            <div className="payroll-breakdown-grid">
              <section className="payroll-breakdown-box">
                <h4>支給項目</h4>
                <div className="expense-modal-list">
                  {selectedPayrollMonth.supplyItems.map((item) => (
                    <div className="expense-modal-row payroll-item-display-row" key={item.id}>
                      <span>{item.label}</span>
                      <b>{yenMoney(item.amount)}</b>
                    </div>
                  ))}
                </div>
              </section>
              <section className="payroll-breakdown-box">
                <h4>控除項目</h4>
                <div className="expense-modal-list">
                  {selectedPayrollMonth.deductionItems.length === 0 ? (
                    <p className="tax-note">控除なし</p>
                  ) : (
                    selectedPayrollMonth.deductionItems.map((item) => (
                      <div className="expense-modal-row payroll-item-display-row" key={item.id}>
                        <span>{item.label}</span>
                        <b>-{yenMoney(item.amount)}</b>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
            <div className="button-row full-button-row">
              <button className="install-button" type="button" onClick={() => printPayrollStatement(selectedPayrollMonth.row, settings)}>
                <FileText size={16} />
                明細PDF
              </button>
              <button className="icon-text-button ghost-button" type="button" onClick={() => setSelectedPayrollMonth(null)}>
                閉じる
              </button>
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
          ? (checkDateById.get(item.sourceCheckId) ?? item.date).slice(0, 4)
          : (item.date || dateFromShortDue(item.due, currentBusinessDate.slice(0, 4))).slice(0, 4)
      )
  ]))
    .filter(Boolean)
    .sort((a, b) => b.localeCompare(a))
    .map((value) => ({ value, label: `${value}年` }));
  const [selectedYear, setSelectedYear] = React.useState(currentBusinessDate.slice(0, 4));
  const yearChecks = tableChecks.filter((check) => check.date.startsWith(selectedYear));
  const yearExpenses = storeExpenses.filter((item) => item.date.startsWith(selectedYear));
  const receivableDate = (item: Receivable) =>
    receivableBusinessDate(item, checkDateById, selectedYear);
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

type ManagementSettingItem = {
  id: string;
  group: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number }>;
  content: React.ReactNode;
};

function ManagementSettingRow({
  item,
  onOpen
}: {
  item: ManagementSettingItem;
  onOpen: (id: string) => void;
}) {
  const Icon = item.icon;

  return (
    <button className="management-setting-row" type="button" onClick={() => onOpen(item.id)}>
      <span className="management-setting-icon">
        <Icon size={17} />
      </span>
      <span className="management-setting-copy">
        <span>{item.title}</span>
        <small>{item.description}</small>
      </span>
      <ChevronRight size={16} />
    </button>
  );
}

function ManagementView({
  currentUser,
  settings,
  notice,
  installHint,
  deviceLog,
  operationLogs,
  hosts,
  tableChecks,
  receivables,
  currentBusinessDate,
  customerProfiles,
  bottles,
  customerActions,
  hostName,
  onSaveCustomerCaution,
  onAddBottle,
  onUpdateBottle,
  onDeleteBottle,
  onDeleteCustomerAction,
  onMoveCustomerActionToOpenTable,
  onInstall,
  onLogout,
  onExportBackup,
  onImportBackup,
  onUpdateSettings,
  onClearDevice,
  onClearAllDeviceLog,
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
  deviceLog: DeviceLogin[];
  operationLogs: OperationLog[];
  hosts: Host[];
  tableChecks: TableCheck[];
  receivables: Receivable[];
  currentBusinessDate: string;
  customerProfiles: CustomerProfile[];
  bottles: BottleKeep[];
  customerActions: CustomerAction[];
  hostName: (hostId?: number) => string;
  onSaveCustomerCaution: (customer: string, hostId: number, caution: string) => void;
  onAddBottle: () => void;
  onUpdateBottle: (id: number, patch: Partial<BottleKeep>) => void;
  onDeleteBottle: (id: number) => void;
  onDeleteCustomerAction: (id: number) => void;
  onMoveCustomerActionToOpenTable: (action: CustomerAction) => void;
  onInstall: () => void;
  onLogout: () => void;
  onExportBackup: () => void;
  onImportBackup: (file: File) => void;
  onUpdateSettings: (settings: StoreSettings) => void;
  onClearDevice: () => void;
  onClearAllDeviceLog: () => void;
  users: AppUser[];
  canManage: boolean;
  onUpdateUser: (id: number, patch: Partial<AppUser>) => void;
  onAddUser: () => void;
  onDeleteUser: (id: number) => void;
}) {
  const canEditStoreSettings = currentUser.role === "admin" || currentUser.role === "staff";
  const backupInputId = `backup-file-${currentUser.id}`;
  const [activeSettingId, setActiveSettingId] = React.useState<string | null>(null);

  const employeeContent = (
    <EmployeePanel
      users={users}
      canManage={canManage}
      onUpdateUser={onUpdateUser}
      onAddUser={onAddUser}
      onDeleteUser={onDeleteUser}
      onForceLogoutUser={onForceLogoutUser}
      showEmbeddedActions={false}
      embedded
    />
  );
  const customerContent = (
    <CustomerManagementPanel
      hosts={hosts}
      tableChecks={tableChecks}
      receivables={receivables}
      currentBusinessDate={currentBusinessDate}
      customerProfiles={customerProfiles}
      bottles={bottles}
      hostName={hostName}
      receivablesEnabled={settings.receivablesEnabled}
    />
  );
  const bottleContent = (
    <BottleManagementPanel
      hosts={hosts}
      bottles={bottles}
      hostName={hostName}
      onAddBottle={onAddBottle}
      onUpdateBottle={onUpdateBottle}
      onDeleteBottle={onDeleteBottle}
    />
  );
  const actionContent = (
    <CustomerActionManagementPanel
      actions={customerActions}
      hostName={hostName}
      onDeleteAction={onDeleteCustomerAction}
      onMoveToOpenTable={onMoveCustomerActionToOpenTable}
    />
  );
  const hostMemoContent = currentUser.role === "host" && currentUser.hostId ? (
    <HostCustomerMemoPanel
      host={hosts.find((host) => host.id === currentUser.hostId) ?? hosts[0]}
      tableChecks={tableChecks}
      customerProfiles={customerProfiles}
      currentBusinessDate={currentBusinessDate}
      onSaveCaution={onSaveCustomerCaution}
    />
  ) : null;
  const storeSettingsContent = (
    <>
      <div className="form-grid">
        <NumberField label="税サ %" value={settings.serviceRate} min={0} max={50} step={1} onChange={(serviceRate) => onUpdateSettings({ ...settings, serviceRate })} />
        <NumberField label="消費税 %" value={settings.taxRate} min={0} max={20} step={1} onChange={(taxRate) => onUpdateSettings({ ...settings, taxRate })} />
        <NumberField label="営業開始" value={settings.openHour} min={0} max={23} step={1} onChange={(openHour) => onUpdateSettings({ ...settings, openHour })} />
        <NumberField label="営業終了" value={settings.closeHour} min={0} max={23} step={1} onChange={(closeHour) => onUpdateSettings({ ...settings, closeHour })} />
        <NumberField label="メイン小計" value={settings.checkoutMainSubtotal} min={0} step={1000} onChange={(checkoutMainSubtotal) => onUpdateSettings({ ...settings, checkoutMainSubtotal })} />
        <NumberField label="VIP小計" value={settings.checkoutVipSubtotal} min={0} step={1000} onChange={(checkoutVipSubtotal) => onUpdateSettings({ ...settings, checkoutVipSubtotal })} />
        <NumberField label="給与歩合 %" value={settings.payrollRate} min={0} max={100} step={1} onChange={(payrollRate) => onUpdateSettings({ ...settings, payrollRate })} />
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
        <SelectField
          label="表示"
          value={settings.themeMode}
          options={[
            { label: "システム", value: "system" },
            { label: "ライト", value: "light" },
            { label: "ダーク", value: "dark" }
          ]}
          onChange={(themeMode) => onUpdateSettings({ ...settings, themeMode: themeMode as StoreSettings["themeMode"] })}
        />
      </div>
      <div className="plain-note">
        <ReceiptText size={16} />
        <div>
          <strong>会計入力ではここを自動使用</strong>
          <p>営業時間をまたぐ営業日は、終了時刻前なら前日扱いで会計日付を付けます。</p>
        </div>
      </div>
    </>
  );
  const accountContent = (
    <>
        <div className="management-actions">
          <button className="install-button" type="button" onClick={onInstall}>
            <Download size={18} />
            {installHint}
          </button>
          {canEditStoreSettings && (
            <>
              <button className="icon-text-button ghost-button" type="button" onClick={onExportBackup}>
                <Download size={18} />
                業務データ出力
              </button>
              <label className="icon-text-button ghost-button backup-import-label" htmlFor={backupInputId}>
                <Upload size={18} />
                復元
              </label>
              <input
                className="visually-hidden-file"
                id={backupInputId}
                type="file"
                accept="application/json"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  if (file) onImportBackup(file);
                  event.currentTarget.value = "";
                }}
              />
            </>
          )}
          <button className="icon-text-button ghost-button" type="button" onClick={onClearDevice}>
            <Smartphone size={18} />
            端末情報削除
          </button>
          {canEditStoreSettings && (
            <button className="icon-text-button ghost-button" type="button" onClick={onClearAllDeviceLog}>
              <Trash2 size={18} />
              端末履歴削除
            </button>
          )}
          <button className="icon-text-button ghost-button" type="button" onClick={onLogout}>
            <LogOut size={18} />
            ログアウト
          </button>
        </div>
        {canEditStoreSettings && (
          <div className="device-session-list">
            {deviceLog.length === 0 ? (
              <p className="tax-note">保存中の端末履歴はありません。</p>
            ) : (
              deviceLog.map((device) => (
                <div className="device-session-row" key={device.id}>
                  <div>
                    <span>{device.userName}</span>
                    <small>{roleLabel[device.role]} / {new Date(device.loginAt).toLocaleString("ja-JP")}</small>
                  </div>
                  <span className={device.current ? "status-pill status-ok" : "status-pill status-warn"}>
                    {device.current ? "この端末" : "保存中"}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
        <div className="account-password-row">
          <TextField
            label="自分のパスワード"
            value={currentUser.password}
            onChange={(password) => onUpdateUser(currentUser.id, { password })}
          />
          <p className="tax-note">従業員一覧ではパスワードを編集せず、本人がここで変更します。</p>
        </div>
        <p className="tax-note">{notice}</p>
    </>
  );
  const settingsItems: ManagementSettingItem[] = [
    ...(canEditStoreSettings ? [
      { id: "employees", group: "店舗", title: "従業員", description: `${users.length}人 / 権限`, icon: Users, content: employeeContent },
      { id: "store", group: "店舗", title: "店舗設定", description: `税サ${settings.serviceRate}% / 消費税${settings.taxRate}%`, icon: Percent, content: storeSettingsContent },
      { id: "actions", group: "接客", title: "来店予定管理", description: `${customerActions.length}件`, icon: CheckCircle2, content: actionContent },
      { id: "customers", group: "接客", title: "顧客履歴", description: "最終来店・当月回数・注意", icon: UserRound, content: customerContent },
      { id: "bottles", group: "接客", title: "ボトル管理", description: `${bottles.length}件`, icon: ClipboardList, content: bottleContent }
    ] as ManagementSettingItem[] : []),
    ...(hostMemoContent ? [{ id: "host-caution", group: "顧客", title: "注意メモ", description: "担当顧客の注意事項", icon: UserRound, content: hostMemoContent }] as ManagementSettingItem[] : []),
    { id: "expense-guide", group: "経費", title: "勘定科目の目安", description: "申告・決算用の分類", icon: ReceiptText, content: <ExpenseAccountGuide /> },
    ...(canEditStoreSettings ? [{ id: "logs", group: "管理", title: "操作履歴", description: `${operationLogs.length}件`, icon: ShieldCheck, content: <OperationLogPanel logs={operationLogs} /> }] as ManagementSettingItem[] : []),
    { id: "account", group: "アカウント", title: "アカウント", description: `${roleLabel[currentUser.role]} / ${currentUser.name}`, icon: UserCog, content: accountContent }
  ];
  const activeSetting = settingsItems.find((item) => item.id === activeSettingId);
  const groupedSettings = Array.from(new Set(settingsItems.map((item) => item.group))).map((group) => ({
    group,
    items: settingsItems.filter((item) => item.group === group)
  }));

  return (
    <>
      <section className="management-settings-screen">
        <article className="panel management-profile-card">
          <span className="management-profile-icon">
            <UserCog size={22} />
          </span>
          <div>
            <p>{roleLabel[currentUser.role]}</p>
            <h3>{currentUser.name}</h3>
            <small>{canEditStoreSettings ? "店舗管理メニュー" : "個人設定"}</small>
          </div>
        </article>
        <div className="management-settings-groups">
          {groupedSettings.map((group) => (
            <div className="management-settings-group" key={group.group}>
              <p>{group.group}</p>
              <div className="management-settings-list">
                {group.items.map((item) => (
                  <ManagementSettingRow item={item} key={item.id} onOpen={setActiveSettingId} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      {activeSetting && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={activeSetting.title}>
          <article className="panel management-settings-modal">
            <div className="modal-title-row">
              <div>
                <p className="eyebrow">{activeSetting.group}</p>
                <h3>{activeSetting.title}</h3>
              </div>
              <div className="management-modal-actions">
                {activeSetting.id === "employees" && canManage && (
                  <button className="icon-text-button" type="button" onClick={onAddUser}>
                    <Plus size={16} />
                    追加
                  </button>
                )}
                <button className="icon-text-button ghost-button" type="button" onClick={() => setActiveSettingId(null)}>
                  閉じる
                </button>
              </div>
            </div>
            <div className="management-settings-modal-body">{activeSetting.content}</div>
          </article>
        </div>
      )}
    </>
  );
}

function CustomerManagementPanel({
  hosts,
  tableChecks,
  receivables,
  currentBusinessDate,
  customerProfiles,
  bottles,
  hostName,
  receivablesEnabled
}: {
  hosts: Host[];
  tableChecks: TableCheck[];
  receivables: Receivable[];
  currentBusinessDate: string;
  customerProfiles: CustomerProfile[];
  bottles: BottleKeep[];
  hostName: (hostId?: number) => string;
  receivablesEnabled: boolean;
}) {
  const [search, setSearch] = React.useState("");
  const [selectedKey, setSelectedKey] = React.useState<string | null>(null);
  const normalizedSearch = search.trim().toLowerCase();
  const hostIds = React.useMemo(() => new Set(hosts.map((host) => host.id)), [hosts]);
  const currentMonth = currentBusinessDate.slice(0, 7);
  const customers = React.useMemo(() => {
    const grouped = tableChecks.reduce<Record<string, {
      key: string;
      customer: string;
      hostId: number;
      count: number;
      total: number;
      monthCount: number;
      monthTotal: number;
      hasReceivable: boolean;
      lastVisit: string;
      lastVisitDate: string;
      checks: TableCheck[];
    }>>((acc, check) => {
      if (!hostIds.has(check.hostId)) return acc;
      const customer = check.customerName.trim() || "名前未設定";
      const key = `${check.hostId}:${customer}`;
      const visit = `${check.date} ${check.time}`;
      acc[key] = acc[key] ?? {
        key,
        customer,
        hostId: check.hostId,
        count: 0,
        total: 0,
        monthCount: 0,
        monthTotal: 0,
        hasReceivable: false,
        lastVisit: visit,
        lastVisitDate: check.date,
        checks: []
      };
      acc[key].count += 1;
      acc[key].total += tableTotal(check);
      if (check.date.startsWith(currentMonth)) {
        acc[key].monthCount += 1;
        acc[key].monthTotal += tableTotal(check);
      }
      acc[key].lastVisit = acc[key].lastVisit.localeCompare(visit) > 0 ? acc[key].lastVisit : visit;
      acc[key].lastVisitDate = acc[key].lastVisit.slice(0, 10);
      acc[key].checks.push(check);
      return acc;
    }, {});

    receivables.forEach((item) => {
      const host = hosts.find((hostItem) => hostItem.id === item.hostId);
      if (!host || item.collection !== "active" || item.amount <= 0) return;
      const key = `${item.hostId}:${item.customer}`;
      if (!grouped[key]) {
        grouped[key] = {
          key,
          customer: item.customer,
          hostId: item.hostId,
          count: 0,
          total: 0,
          monthCount: 0,
          monthTotal: 0,
          hasReceivable: true,
          lastVisit: item.date,
          lastVisitDate: item.date,
          checks: []
        };
      } else {
        grouped[key].hasReceivable = true;
      }
    });

    return Object.values(grouped)
      .map((item) => ({
        ...item,
        checks: item.checks.sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
      }))
      .sort((a, b) => b.lastVisit.localeCompare(a.lastVisit) || b.total - a.total);
  }, [currentMonth, hostIds, hosts, receivables, tableChecks]);
  const visibleCustomers = customers.filter((item) => {
    if (!normalizedSearch) return true;
    const receivableText = item.hasReceivable ? "売掛あり" : "売掛なし";
    const searchableText = `${item.customer} ${hostName(item.hostId)} ${item.monthTotal} ${item.lastVisitDate} ${receivableText}`.toLowerCase();
    return searchableText.includes(normalizedSearch);
  });
  const selectedCustomer = selectedKey ? customers.find((item) => item.key === selectedKey) : null;
  const selectedProfile = selectedCustomer
    ? customerProfiles.find((profile) => profile.customer === selectedCustomer.customer && profile.hostId === selectedCustomer.hostId)
    : undefined;
  const selectedBottles = selectedCustomer
    ? bottles.filter((bottle) => bottle.customer === selectedCustomer.customer && bottle.hostId === selectedCustomer.hostId)
    : [];

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
          <span>最終来店</span>
          <span>当月回数</span>
          <span>当月売上</span>
          <span>売掛</span>
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
              <span>{item.lastVisitDate || "-"}</span>
              <span>{item.monthCount}回</span>
              <b>{yenMoney(item.monthTotal)}</b>
              <span>{receivablesEnabled && item.hasReceivable ? "あり" : "なし"}</span>
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
          profile={selectedProfile}
          bottles={selectedBottles}
          onClose={() => setSelectedKey(null)}
        />
      )}
    </div>
  );
}

function HostCustomerMemoPanel({
  host,
  tableChecks,
  customerProfiles,
  currentBusinessDate,
  onSaveCaution
}: {
  host: Host;
  tableChecks: TableCheck[];
  customerProfiles: CustomerProfile[];
  currentBusinessDate: string;
  onSaveCaution: (customer: string, hostId: number, caution: string) => void;
}) {
  const [search, setSearch] = React.useState("");
  const currentMonth = currentBusinessDate.slice(0, 7);
  const normalizedSearch = search.trim().toLowerCase();
  const customers = React.useMemo(() => {
    const grouped = tableChecks
      .filter((check) => check.hostId === host.id)
      .reduce<Record<string, {
        customer: string;
        lastVisit: string;
        monthCount: number;
        monthTotal: number;
      }>>((acc, check) => {
        const customer = check.customerName.trim() || "名前未設定";
        const visit = `${check.date} ${check.time}`;
        acc[customer] = acc[customer] ?? { customer, lastVisit: visit, monthCount: 0, monthTotal: 0 };
        acc[customer].lastVisit = acc[customer].lastVisit.localeCompare(visit) > 0 ? acc[customer].lastVisit : visit;
        if (check.date.startsWith(currentMonth)) {
          acc[customer].monthCount += 1;
          acc[customer].monthTotal += tableTotal(check);
        }
        return acc;
      }, {});

    customerProfiles
      .filter((profile) => profile.hostId === host.id)
      .forEach((profile) => {
        grouped[profile.customer] = grouped[profile.customer] ?? {
          customer: profile.customer,
          lastVisit: "",
          monthCount: 0,
          monthTotal: 0
        };
      });

    return Object.values(grouped).sort((a, b) => b.lastVisit.localeCompare(a.lastVisit));
  }, [currentMonth, customerProfiles, host.id, tableChecks]);
  const visibleCustomers = customers.filter((item) => {
    if (!normalizedSearch) return true;
    const profile = customerProfiles.find((profileItem) => profileItem.customer === item.customer && profileItem.hostId === host.id);
    return `${item.customer} ${profile?.caution ?? ""} ${item.monthTotal}`.toLowerCase().includes(normalizedSearch);
  });

  return (
    <div className="host-customer-memo-panel">
      <div className="customer-management-toolbar">
        <label className="search-shell customer-management-search">
          <span>検索</span>
          <input
            type="search"
            value={search}
            placeholder="客名・注意"
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <span className="status-pill status-ok">{visibleCustomers.length}件</span>
      </div>
      <div className="host-customer-memo-list">
        {visibleCustomers.length === 0 ? (
          <div className="plain-note">
            <UserRound size={18} />
            <div>
              <strong>顧客なし</strong>
              <p>会計登録された顧客がここに表示されます。</p>
            </div>
          </div>
        ) : (
          visibleCustomers.map((item) => {
            const profile = customerProfiles.find((profileItem) => profileItem.customer === item.customer && profileItem.hostId === host.id);
            return (
              <div className="host-customer-memo-row" key={item.customer}>
                <div className="host-customer-memo-summary">
                  <span>{item.customer}</span>
                  <small>最終 {item.lastVisit.slice(0, 10) || "-"}</small>
                  <small>当月 {item.monthCount}回 / {money(item.monthTotal)}</small>
                </div>
                <TextField
                  label="注意"
                  value={profile?.caution ?? ""}
                  onChange={(caution) => onSaveCaution(item.customer, host.id, caution)}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function CustomerActionManagementPanel({
  actions,
  hostName,
  onDeleteAction,
  onMoveToOpenTable
}: {
  actions: CustomerAction[];
  hostName: (hostId?: number) => string;
  onDeleteAction: (id: number) => void;
  onMoveToOpenTable: (action: CustomerAction) => void;
}) {
  const [search, setSearch] = React.useState("");
  const normalizedSearch = search.trim().toLowerCase();
  const visibleActions = actions
    .filter((action) => {
      if (!normalizedSearch) return true;
      const searchableText = `${action.customer} ${hostName(action.hostId)} ${customerActionKindLabel[action.kind]} ${customerActionStatusLabel[action.status]} ${action.memo} ${action.date}`.toLowerCase();
      return searchableText.includes(normalizedSearch);
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  return (
    <div className="action-management">
      <div className="customer-management-toolbar">
        <label className="search-shell customer-management-search">
          <span>検索</span>
          <input
            type="search"
            value={search}
            placeholder="客名・担当・種別"
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <span className="status-pill status-ok">{visibleActions.length}件</span>
      </div>

      <div className="action-management-list">
        {visibleActions.length === 0 ? (
          <div className="plain-note">
            <CheckCircle2 size={18} />
            <div>
              <strong>来店予定なし</strong>
              <p>来店予定を追加するとここに表示されます。</p>
            </div>
          </div>
        ) : (
          visibleActions.map((action) => (
            <div className={`action-row action-readonly-row action-${action.status}`} key={action.id}>
              <span>{action.date}</span>
              <span>{action.time}</span>
              <b>{action.customer}</b>
              <span>{hostName(action.hostId)}</span>
              <span>{customerActionKindLabel[action.kind]}</span>
              <span>{action.targetAmount > 0 ? money(action.targetAmount) : "目標なし"}</span>
              <small>{action.memo || "-"}</small>
              <button className="icon-text-button ghost-button action-open-table-button" type="button" onClick={() => onMoveToOpenTable(action)}>
                <Plus size={14} />
                卓追加
              </button>
              <button className="icon-button danger-button" type="button" aria-label="来店予定削除" onClick={() => onDeleteAction(action.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function BottleManagementPanel({
  hosts,
  bottles,
  hostName,
  onAddBottle,
  onUpdateBottle,
  onDeleteBottle
}: {
  hosts: Host[];
  bottles: BottleKeep[];
  hostName: (hostId?: number) => string;
  onAddBottle: () => void;
  onUpdateBottle: (id: number, patch: Partial<BottleKeep>) => void;
  onDeleteBottle: (id: number) => void;
}) {
  const [search, setSearch] = React.useState("");
  const normalizedSearch = search.trim().toLowerCase();
  const visibleBottles = bottles
    .filter((bottle) => {
      if (!normalizedSearch) return true;
      const searchableText = `${bottle.customer} ${hostName(bottle.hostId)} ${bottle.bottleName} ${bottle.memo}`.toLowerCase();
      return searchableText.includes(normalizedSearch);
    })
    .sort((a, b) => a.customer.localeCompare(b.customer) || a.bottleName.localeCompare(b.bottleName));

  return (
    <div className="bottle-management">
      <div className="customer-management-toolbar">
        <label className="search-shell customer-management-search">
          <span>検索</span>
          <input
            type="search"
            value={search}
            placeholder="客名・担当・ボトル"
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <button className="icon-text-button" type="button" onClick={onAddBottle}>
          <Plus size={16} />
          追加
        </button>
      </div>

      <div className="bottle-management-list">
        {visibleBottles.length === 0 ? (
          <div className="plain-note">
            <ClipboardList size={18} />
            <div>
              <strong>ボトルなし</strong>
              <p>ボトルを追加するとここに表示されます。</p>
            </div>
          </div>
        ) : (
          visibleBottles.map((bottle) => (
            <div className="bottle-row" key={bottle.id}>
              <TextField label="客名" value={bottle.customer} onChange={(customer) => onUpdateBottle(bottle.id, { customer })} />
              <SelectField
                label="担当"
                value={String(bottle.hostId)}
                options={hosts.map((host) => ({ label: host.name, value: String(host.id) }))}
                onChange={(hostId) => onUpdateBottle(bottle.id, { hostId: Number(hostId) })}
              />
              <TextField label="ボトル" value={bottle.bottleName} onChange={(bottleName) => onUpdateBottle(bottle.id, { bottleName })} />
              <TextField label="開封" value={bottle.openedDate} onChange={(openedDate) => onUpdateBottle(bottle.id, { openedDate })} />
              <TextField label="期限" value={bottle.expiresAt} onChange={(expiresAt) => onUpdateBottle(bottle.id, { expiresAt })} />
              <TextField label="メモ" value={bottle.memo} onChange={(memo) => onUpdateBottle(bottle.id, { memo })} />
              <button className="icon-button danger-button" type="button" aria-label="ボトル削除" onClick={() => onDeleteBottle(bottle.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
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
            { label: "来店予定", value: "来店予定" },
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

function DateSelectField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [rawYear, rawMonth, rawDay] = value.split("-").map(Number);
  const year = rawYear || new Date().getFullYear();
  const month = Math.min(12, Math.max(1, rawMonth || 1));
  const day = Math.min(daysInMonth(year, month), Math.max(1, rawDay || 1));
  const yearOptions = Array.from({ length: 3 }, (_, index) => String(year - 1 + index));
  const monthOptions = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, "0"));
  const dayOptions = Array.from({ length: daysInMonth(year, month) }, (_, index) => String(index + 1).padStart(2, "0"));
  const updateDate = (nextYear: number, nextMonth: number, nextDay: number) => {
    const clampedDay = Math.min(daysInMonth(nextYear, nextMonth), Math.max(1, nextDay));
    onChange(`${nextYear}-${String(nextMonth).padStart(2, "0")}-${String(clampedDay).padStart(2, "0")}`);
  };

  return (
    <label className="number-field date-select-field">
      <span>{label}</span>
      <div className="date-select-controls">
        <select value={String(year)} onChange={(event) => updateDate(Number(event.target.value), month, day)}>
          {yearOptions.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
        <small>年</small>
        <select value={String(month).padStart(2, "0")} onChange={(event) => updateDate(year, Number(event.target.value), day)}>
          {monthOptions.map((option) => (
            <option value={option} key={option}>
              {Number(option)}
            </option>
          ))}
        </select>
        <small>月</small>
        <select value={String(day).padStart(2, "0")} onChange={(event) => updateDate(year, month, Number(event.target.value))}>
          {dayOptions.map((option) => (
            <option value={option} key={option}>
              {Number(option)}
            </option>
          ))}
        </select>
        <small>日</small>
      </div>
    </label>
  );
}

function TimeSelectField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const normalizedTime = normalizeActionTime(value);
  const [hour, minute] = normalizedTime.split(":");
  const updateTime = (nextHour: string, nextMinute: string) => onChange(`${nextHour}:${nextMinute}`);

  return (
    <label className="number-field time-select-field">
      <span>{label}</span>
      <div className="time-select-controls">
        <select value={hour} onChange={(event) => updateTime(event.target.value, minute)}>
          {hourOptions.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="time-separator">:</span>
        <select value={minute} onChange={(event) => updateTime(hour, event.target.value)}>
          {minuteOptions.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button className="icon-button ghost-button time-now-button" type="button" aria-label="現在時刻を入れる" onClick={() => onChange(currentTime())}>
          <Clock size={14} />
        </button>
      </div>
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
