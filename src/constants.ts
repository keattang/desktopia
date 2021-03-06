export const PURCHASE_TYPES = {
  1: { id: 1, name: "One time payment" },
  2: { id: 2, name: "Recurring payment" },
};
export const PURCHASE_TERMS = {
  1: { id: 1, name: "Monthly" },
  2: { id: 2, name: "Yearly" },
};

export const OTHER_SOFTWARE_ID = "-1";

export const REGIONS = {
  "us-east-1": "US East (N. Virginia)",
  "ap-southeast-2": "Asia Pacific (Singapore)",
  "ap-southeast-1": "Asia Pacific (Sydney)",
  "eu-west-3": "Europe (Paris)",
};

export const SUPPORTED_REGIONS: Array<keyof typeof REGIONS> = [
  "us-east-1",
  // "ap-southeast-2",
  // "ap-southeast-1",
];

export const PRICING_API_REGION = "us-east-1";

export const SUPPORTED_OPERATING_SYSTEMS = ["Windows"];

export const TAG_PREFIX = "desktopia";
export const MANAGED_TAG_KEY = `${TAG_PREFIX}:managed`;

export const INSTANCE_STATES = {
  PENDING: "pending",
  RUNNING: "running",
  STOPPING: "stopping",
  STOPPED: "stopped",
  TERMINATED: "terminated",
};

export const TERMINATABLE_STATES = [
  INSTANCE_STATES.PENDING,
  INSTANCE_STATES.RUNNING,
  INSTANCE_STATES.STOPPING,
  INSTANCE_STATES.STOPPED,
];
