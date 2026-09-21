export const CREATE_FLOW_STORAGE_KEY = "flowintoone:create-flow";

export type WebsitePurpose = "shop" | "events" | "portfolio" | "services" | "personal";
export type WebsiteDesignModel = "editorial" | "minimal";
export type CreateFlowStep = "purpose" | "details" | "design" | "review";

export type WebsiteDetails = {
  name: string;
  tagline: string;
  description: string;
  materials: string;
  creativeProcess: string;
  categoryId: string;
  city: string;
  country: string;
  websiteUrl: string;
  instagramUrl: string;
  etsyUrl: string;
  contactEmail: string;
  slug: string;
};

export type CreateFlowState = {
  purpose: WebsitePurpose | null;
  details: WebsiteDetails;
  designModel: WebsiteDesignModel;
  step: CreateFlowStep;
};

export const emptyWebsiteDetails: WebsiteDetails = {
  name: "",
  tagline: "",
  description: "",
  materials: "",
  creativeProcess: "",
  categoryId: "",
  city: "",
  country: "",
  websiteUrl: "",
  instagramUrl: "",
  etsyUrl: "",
  contactEmail: "",
  slug: "",
};

export const initialCreateFlowState: CreateFlowState = {
  purpose: null,
  details: emptyWebsiteDetails,
  designModel: "editorial",
  step: "purpose",
};

const purposes: WebsitePurpose[] = ["shop", "events", "portfolio", "services", "personal"];
const models: WebsiteDesignModel[] = ["editorial", "minimal"];
const steps: CreateFlowStep[] = ["purpose", "details", "design", "review"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

export function readCreateFlowState(): CreateFlowState {
  try {
    const stored = window.sessionStorage.getItem(CREATE_FLOW_STORAGE_KEY);
    if (!stored) return initialCreateFlowState;
    const parsed: unknown = JSON.parse(stored);
    if (!isRecord(parsed)) return initialCreateFlowState;

    const rawDetails = isRecord(parsed.details) ? parsed.details : {};
    const purpose = purposes.includes(parsed.purpose as WebsitePurpose)
      ? (parsed.purpose as WebsitePurpose)
      : null;
    const designModel = models.includes(parsed.designModel as WebsiteDesignModel)
      ? (parsed.designModel as WebsiteDesignModel)
      : "editorial";
    const step = steps.includes(parsed.step as CreateFlowStep)
      ? (parsed.step as CreateFlowStep)
      : purpose
        ? "details"
        : "purpose";

    return {
      purpose,
      designModel,
      step,
      details: Object.fromEntries(
        Object.keys(emptyWebsiteDetails).map((key) => [key, text(rawDetails[key])]),
      ) as WebsiteDetails,
    };
  } catch {
    return initialCreateFlowState;
  }
}

export function writeCreateFlowState(patch: Partial<CreateFlowState>) {
  try {
    const current = readCreateFlowState();
    window.sessionStorage.setItem(
      CREATE_FLOW_STORAGE_KEY,
      JSON.stringify({
        ...current,
        ...patch,
        details: { ...current.details, ...patch.details },
      }),
    );
    return true;
  } catch {
    return false;
  }
}

export function clearCreateFlowState() {
  try {
    window.sessionStorage.removeItem(CREATE_FLOW_STORAGE_KEY);
  } catch {
    // Storage is optional; the server-side record is the source of truth.
  }
}
