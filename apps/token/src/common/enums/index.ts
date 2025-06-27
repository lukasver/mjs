export enum InvestmentType {
	DEBT = "DEBT",
	EQUITY = "EQUITY",
	LOAN = "CONVERTIBLE_LOAN",
	FUND = "FUND",
}

export enum ProjectListingType {
	REAL_ESTATE = "Real Estate",
	// CORPORATE = "CORPORATE",
	PRIVATE_EQUITY = "Private Companies", // @maxi will refactor later when we integrate INFRASTRUCTURE
	INFRASTRUCTURE = "INFRASTRUCTURE",
	OTHER_REAL_ASSETS = "OTHER_REAL_ASSETS",
	// PRIVATE_EQUITY = "Private Equity",
}
export enum ProjectStatus {
	OPEN = "Open",
	CLOSED = "Closed",
	LISTED = "Listed",
	DRAFT = "Draft",
	PENDING = "Pending",
	DUPLICATED = "Duplicated",
	DE_LIST = "DeList",
	REJECTED = "Rejected",
	TERMINATED = "Terminated",
	APPROVED = "Approved",
	WITHDRAW = "Withdraw",
}

export enum ProjectListingMarketType {
	PRIMARY = "PRIMARY",
	SECONDARY = "SECONDARY",
}

export enum TransactionStatus {
	PENDING_FOR_TWO_CONFIRMATIONS = "PENDING_FOR_TWO_CONFIRMATIONS",
	PENDING_FOR_ONE_CONFIRMATION = "PENDING_FOR_ONE_CONFIRMATION",
	CONFIRMED = "CONFIRMED",
	CANCELED = "CANCELED",
	REJECTED = "REJECTED",
}

export enum TransactionType {
	SUBSCRIPTION = "SUBSCRIPTION",
	SECONDARY = "SECONDARY",
}

export enum NotificationType {
	ORDER_TAKEN = "ORDER_TAKEN",
	PRIVATE_DEAL = "PRIVATE_DEAL",
	SUBSCRIPTION = "SUBSCRIPTION",
	ORDER_CONFIRM_BY_COUNTER_PARTY = "ORDER_CONFIRM_BY_COUNTER_PARTY",
	TRANSFER_PROJECT = "TRANSFER_PROJECT",
	PROJECT_STATUS_CHANGED = "PROJECT_STATUS_CHANGED",
}

export enum UserType {
	WEALTH_MANAGER = "WEALTH_MANAGER",
	DISTRIBUTOR = "DISTRIBUTOR",
}

export enum UserRoles {
	ROLE_WEALTH_MANAGER = "ROLE_WEALTH_MANAGER",
	ROLE_DISTRIBUTOR = "ROLE_DISTRIBUTOR",
	ROLE_SUPER_ADMIN = "ROLE_SUPER_ADMIN",
}

export enum UserStatus {
	APPROVED = "Approved",
	REJECTED = "Rejected",
	PENDING = "Pending",
	UNDER_REGISTRATION = "Under Registration",
}

export enum AuthStatus {
	LOADING = "loading",
	AUTHENTICATED = "authenticated",
	UNAUTHENTICATED = "unauthenticated",
}

export enum RegistrationSteps {
	NEW_ACCOUNT = "REGISTRATION_NEW_ACCOUNT",
	PERSONAL_DETAIL = "REGISTRATION_PERSONAL_DETAIL",
	DOCUMENT_DETAIL = "REGISTRATION_DOCUMENT_DETAIL",
	COMPLETED = "REGISTRATION_COMPLETED",
}

// get enum key from enum value

export enum Locales {
	EN = "en",
	FR = "fr",
	ES = "es",
}

export type enumList =
	| ProjectStatus
	| UserRoles
	| UserStatus
	| UserType
	| NotificationType
	| TransactionStatus
	| ProjectListingType
	| ProjectStatus
	| InvestmentType;

export enum LogSeverity {
	DEFAULT = "DEFAULT",
	DEBUG = "DEBUG",
	INFO = "INFO",
	NOTICE = "NOTICE",
	WARNING = "WARNING",
	ERROR = "ERROR",
	CRITICAL = "CRITICAL",
	ALERT = "ALERT",
	EMERGENCY = "EMERGENCY",
}

export enum CHIP_KEY {
	status = "status",
}

export enum DATE_KEYS {
	saleClosingDate = "saleClosingDate",
	saleStartingDate = "saleStartingDate",
	createdAt = "createdAt",
	updatedAt = "updatedAt",
	saleStartDate = "saleStartDate",
}

export enum FLOAT_NUM_KEYS {
	tokenPricePerUnit = "tokenPricePerUnit",
}

export enum INT_NUM_KEYS {
	availableTokenQuantity = "availableTokenQuantity",
	initialTokenQuantity = "initialTokenQuantity",
	maximumTokenBuyPerUser = "maximumTokenBuyPerUser",
	minimumTokenBuyPerUser = "minimumTokenBuyPerUser",
}

export enum SignStatus {
	WAITING_FOR_MY_SIGNATURE = "WAITING_FOR_MY_SIGNATURE",
	WAITING_FOR_OTHERS = "WAITING_FOR_OTHERS",
	COMPLETED = "COMPLETED",
	AGREEMENT_NOT_SIGNABLE = "AGREEMENT_NOT_SIGNABLE",
	INVALID_AGREEMENT_ID = "INVALID_AGREEMENT_ID",
	SIGNED = "SIGNED",
	OUT_FOR_SIGNATURE = "OUT_FOR_SIGNATURE",
}

export enum TransactionModalTypes {
	Loading = "loading",
	ManualTransfer = "manualTransfer",
	PendingTx = "pendingTransaction",
	WalletLogin = "walletLogin",
	ConfirmPayment = "confirmPayment",
	CryptoWarning = "cryptowarning",
	Contract = "contract",
	PendingContract = "pendingContract",
}

export enum INPUTS_TYPES {
	Checkbox = "checkbox",
	Currency = "currency",
	PeriodicityTime = "periodicityTime",
	Select = "select",
	Text = "text",
	Date = "date",
	Phone = "phone",
	Number = "number",
	Country = "country",
	File = "file",
	Email = "email",
	Dual = "dual",
	TextArea = "textarea",
	Multiselect = "multiselect",
}
