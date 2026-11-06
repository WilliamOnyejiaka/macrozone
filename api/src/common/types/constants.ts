// --- Identity ---
export enum OrgType {
  CLIENT = "client",
}
export enum OrgRole {
  OWNER = "owner",
  MEMBER = "member",
  READ_ONLY = "read_only",
}
export const ORG_ROLE = OrgRole;

export enum DirectoryContactStatus {
  NEW = "new",
  CONTACTED = "contacted",
  QUALIFIED = "qualified",
  ARCHIVED = "archived",
}

export enum MembershipStatus {
  PENDING = "pending",
  ACTIVE = "active",
  REJECTED = "rejected",
  INVITED = "invited",
}
export const MEMBERSHIP_STATUS = MembershipStatus;

export enum InvitationStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
}
export const INVITATION_STATUS = InvitationStatus;

export enum InternalRole {
  OPS_ADMIN = "ops_admin",
  OPS_CHECKER = "ops_reviewer",
  FINANCE = "finance",
  SUPER_ADMIN = "super_admin",
}
export const INTERNAL_ROLE = InternalRole;

export enum UserRole {
  CLIENT = "client",
  PARTNER = "partner",
  ADMIN = "admin",
}

export const USER_TYPE = UserRole;

export enum SessionType {
  EXTERNAL = "external",
  INTERNAL = "internal",
}
export const SESSION_TYPE = SessionType;

// --- Vetting ---
export enum VettingStatus {
  QUEUED = "queued",
  IN_REVIEW = "in_review",
  APPROVED = "approved",
  REJECTED = "rejected",
}
export const VETTING_STATUS = VettingStatus;

// --- Partnership Lifecycle ---
export enum PartnershipState {
  BRIEF_OPEN = "brief_open",
  PROPOSED = "proposed",
  APPROVED = "approved",
  CONTRACTING = "contracting",
  LIVE = "live",
  ENDED = "ended",
  DISPUTED = "disputed",
}
export const PARTNERSHIP_STATE = PartnershipState;

// --- Commissions & Fraud Gate ---
export enum CommissionStatus {
  PROVISIONAL = "provisional",
  SCREENING = "screening",
  CONFIRMED = "confirmed",
  REJECTED = "rejected",
  POSTED = "posted",
}
export const COMMISSION_STATUS = CommissionStatus;

// --- Ledger ---
export enum LedgerAccountType {
  PARTNER_PAYABLE = "partner_payable",
  CLIENT_RECEIVABLE = "client_receivable",
  PLATFORM_REVENUE = "platform_revenue",
  SUSPENSE = "suspense",
}
export const LEDGER_ACCOUNT_TYPE = LedgerAccountType;

export enum PayoutStatus {
  DRAFT = "draft",
  PENDING_APPROVAL = "pending_approval",
  APPROVED = "approved",
  EXECUTED = "executed",
  FAILED = "failed",
}
export const PAYOUT_STATUS = PayoutStatus;

export enum PostingDirection {
  DEBIT = "debit",
  CREDIT = "credit",
}
export const POSTING_DIRECTION = PostingDirection;

// --- Onboarding ---
export enum OnboardingStatus {
  DRAFT = "draft",
  SUBMITTED = "submitted",
  UNDER_REVIEW = "under_review",
  ACTION_REQUIRED = "action_required",
  APPROVED = "approved",
  VERIFIED = "verified",
  SUSPENDED = "suspended",
  REJECTED = "rejected",
}
export const ONBOARDING_STATUS = OnboardingStatus;

// --- KYC ---
export enum KycStatus {
  NOT_STARTED = "not_started",
  PENDING = "pending",
  ACTION_REQUIRED = "action_required",
  FAILED = "failed",
  VERIFIED = "verified",
}
export const KYC_STATUS = KycStatus;

// --- Company Profile ---
export enum CompanyType {
  BROKER = "broker",
  PROP_FIRM = "prop_firm",
  OTHER = "other",
}
export const COMPANY_TYPE = CompanyType;

// --- Billing ---
export enum SubscriptionStatus {
  TRIALING = "trialing",
  ACTIVE = "active",
  PAST_DUE = "past_due",
  CANCELED = "canceled",
}
export const SUBSCRIPTION_STATUS = SubscriptionStatus;

// --- Tracking ---
export enum TrackingEventType {
  CLICK = "click",
  CONVERSION = "conversion",
}
export const TRACKING_EVENT_TYPE = TrackingEventType;

// --- Partnership Models & Metrics ---
export enum PartnershipModel {
  CPA = "cpa",
  REVENUE_SHARE = "revenue_share",
  HYBRID = "hybrid",
  FIXED_FEE = "fixed_fee",
  CUSTOM = "custom",
}
export const PARTNERSHIP_MODEL = PartnershipModel;

export enum PerformanceMetricType {
  LEADS = "leads",
  SIGNUPS = "signups",
  DEPOSITS = "deposits",
  SALES = "sales",
  REVENUE = "revenue",
  CONVERSION_RATE = "conversion_rate",
  TRADING_VOLUME = "trading_volume",
  OTHER = "other",
}
export const PERFORMANCE_METRIC_TYPE = PerformanceMetricType;

// --- Evidence & Document Types ---
export enum EvidenceStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}
export const EVIDENCE_STATUS = EvidenceStatus;

export enum DocumentOwnerType {
  PERFORMANCE_METRIC = "performance_metric",
  KYC = "kyc",
  ONBOARDING = "onboarding",
}
export const DOCUMENT_OWNER_TYPE = DocumentOwnerType;

export enum HttpStatus {
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,
  PROCESSING = 102,
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NON_AUTHORITATIVE_INFORMATION = 203,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,
  MULTI_STATUS = 207,
  ALREADY_REPORTED = 208,
  IM_USED = 226,
  MULTIPLE_CHOICES = 300,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  USE_PROXY = 305,
  TEMPORARY_REDIRECT = 307,
  PERMANENT_REDIRECT = 308,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  PAYLOAD_TOO_LARGE = 413,
  URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  RANGE_NOT_SATISFIABLE = 416,
  EXPECTATION_FAILED = 417,
  IM_A_TEAPOT = 418,
  MISDIRECTED_REQUEST = 421,
  UNPROCESSABLE_ENTITY = 422,
  LOCKED = 423,
  FAILED_DEPENDENCY = 424,
  TOO_EARLY = 425,
  UPGRADE_REQUIRED = 426,
  PRECONDITION_REQUIRED = 428,
  TOO_MANY_REQUESTS = 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE = 431,
  UNAVAILABLE_FOR_LEGAL_REASONS = 451,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
  VARIANT_ALSO_NEGOTIATES = 506,
  INSUFFICIENT_STORAGE = 507,
  LOOP_DETECTED = 508,
  NOT_EXTENDED = 510,
  NETWORK_AUTHENTICATION_REQUIRED = 511,
}

export const HttpStatusMessage: Record<HttpStatus, string> = {
  100: "Continue",
  101: "Switching Protocols",
  102: "Processing",
  200: "OK",
  201: "Created",
  202: "Accepted",
  203: "Non-Authoritative Information",
  204: "No Content",
  205: "Reset Content",
  206: "Partial Content",
  207: "Multi-Status",
  208: "Already Reported",
  226: "IM Used",
  300: "Multiple Choices",
  301: "Moved Permanently",
  302: "Found",
  303: "See Other",
  304: "Not Modified",
  305: "Use Proxy",
  307: "Temporary Redirect",
  308: "Permanent Redirect",
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  412: "Precondition Failed",
  413: "Payload Too Large",
  414: "URI Too Long",
  415: "Unsupported Media Type",
  416: "Range Not Satisfiable",
  417: "Expectation Failed",
  418: "I'm a teapot",
  421: "Misdirected Request",
  422: "Unprocessable Entity",
  423: "Locked",
  424: "Failed Dependency",
  425: "Too Early",
  426: "Upgrade Required",
  428: "Precondition Required",
  429: "Too Many Requests",
  431: "Request Header Fields Too Large",
  451: "Unavailable For Legal Reasons",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported",
  506: "Variant Also Negotiates",
  507: "Insufficient Storage",
  508: "Loop Detected",
  510: "Not Extended",
  511: "Network Authentication Required",
};

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  SUPER_ADMIN = "SUPER_ADMIN",
}
export enum TokenType {
  ACCESS = "ACCESS",
  REFRESH = "REFRESH",
}

export enum ResourceType {
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "video",
  RAW = "raw",
  PDF = "raw",
  AUTO = "auto",
}

export enum CdnFolders {
  USER_PICTURES = "macrozone-cdn/profile-pictures/users"
}

export enum UploadType {
  STANDARD = "standard",
  MEDIA = "media",
  MATERIAL = "material",
}

export enum AuthProvider {
  LOCAL = "local",
  GOOGLE = "google",
}

export enum OTPChannel {
  SMS = "sms",
  EMAIL = "email",
}

export enum OTPPurpose {
  SIGN_UP = "signup",
  PASSWORD_RESET = "password_reset",
  CHANGE_EMAIL = "change_email",
}