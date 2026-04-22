export type CarBadgeMode = "none" | "custom" | "recommended" | "no_deposit";

export type CarDisplayConfig = {
  badgeMode: CarBadgeMode;
  badgeText: string;
  promoText: string;
  showOnWebsite: boolean;
  showOnHomepage: boolean;
};

export type MonthlyPlanConfig = {
  km: string;
  price: number;
  recommended?: boolean;
  promoText?: string;
};

const DEFAULT_DISPLAY_CONFIG: CarDisplayConfig = {
  badgeMode: "none",
  badgeText: "",
  promoText: "",
  showOnWebsite: true,
  showOnHomepage: true,
};

function safeText(value: unknown) {
  return String(value ?? "").trim();
}

function safeBoolean(value: unknown, fallback: boolean) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }

  return fallback;
}

export function parseCarDisplayConfig(raw: unknown): CarDisplayConfig {
  const text = safeText(raw);

  if (!text) {
    return { ...DEFAULT_DISPLAY_CONFIG };
  }

  if (!text.startsWith("{")) {
    return {
      ...DEFAULT_DISPLAY_CONFIG,
      badgeMode: "custom",
      badgeText: text,
    };
  }

  try {
    const parsed = JSON.parse(text) as Partial<CarDisplayConfig>;
    const badgeMode = ["none", "custom", "recommended", "no_deposit"].includes(
      String(parsed.badgeMode || "")
    )
      ? (parsed.badgeMode as CarBadgeMode)
      : DEFAULT_DISPLAY_CONFIG.badgeMode;

    return {
      badgeMode,
      badgeText: safeText(parsed.badgeText),
      promoText: safeText(parsed.promoText),
      showOnWebsite: safeBoolean(
        parsed.showOnWebsite,
        DEFAULT_DISPLAY_CONFIG.showOnWebsite
      ),
      showOnHomepage: safeBoolean(
        parsed.showOnHomepage,
        DEFAULT_DISPLAY_CONFIG.showOnHomepage
      ),
    };
  } catch {
    return {
      ...DEFAULT_DISPLAY_CONFIG,
      badgeMode: "custom",
      badgeText: text,
    };
  }
}

export function serializeCarDisplayConfig(config: Partial<CarDisplayConfig>) {
  const normalized: CarDisplayConfig = {
    badgeMode:
      config.badgeMode && ["none", "custom", "recommended", "no_deposit"].includes(config.badgeMode)
        ? config.badgeMode
        : DEFAULT_DISPLAY_CONFIG.badgeMode,
    badgeText: safeText(config.badgeText),
    promoText: safeText(config.promoText),
    showOnWebsite: safeBoolean(
      config.showOnWebsite,
      DEFAULT_DISPLAY_CONFIG.showOnWebsite
    ),
    showOnHomepage: safeBoolean(
      config.showOnHomepage,
      DEFAULT_DISPLAY_CONFIG.showOnHomepage
    ),
  };

  if (
    normalized.badgeMode === "none" &&
    !normalized.badgeText &&
    !normalized.promoText &&
    normalized.showOnWebsite &&
    normalized.showOnHomepage
  ) {
    return "";
  }

  if (
    normalized.badgeMode === "custom" &&
    normalized.badgeText &&
    !normalized.promoText &&
    normalized.showOnWebsite &&
    normalized.showOnHomepage
  ) {
    return normalized.badgeText;
  }

  return JSON.stringify(normalized);
}

export function getCarBadgeLabel(
  config: CarDisplayConfig,
  options?: { allowNoDeposit?: boolean }
) {
  if (config.badgeMode === "custom") {
    return config.badgeText || "";
  }

  if (config.badgeMode === "recommended") {
    return config.badgeText || "Recommended";
  }

  if (config.badgeMode === "no_deposit" && options?.allowNoDeposit) {
    return config.badgeText || "No Deposit";
  }

  return "";
}

export function normalizeMonthlyPlans(value: unknown): MonthlyPlanConfig[] {
  const parsedValue =
    typeof value === "string"
      ? (() => {
          try {
            return JSON.parse(value);
          } catch {
            return [];
          }
        })()
      : value;

  if (!Array.isArray(parsedValue)) return [];

  return parsedValue
    .map<MonthlyPlanConfig | null>((plan) => {
      if (!plan || typeof plan !== "object") return null;

      const km = safeText((plan as { km?: unknown }).km);
      const price = Number((plan as { price?: unknown }).price ?? 0);

      if (!km) return null;

      return {
        km,
        price: Number.isFinite(price) ? price : 0,
        recommended: safeBoolean(
          (plan as { recommended?: unknown }).recommended,
          false
        ),
        promoText: safeText((plan as { promoText?: unknown }).promoText),
      };
    })
    .filter((plan): plan is MonthlyPlanConfig => plan !== null);
}

export function getRecommendedMonthlyPlan(plans: MonthlyPlanConfig[]) {
  return plans.find((plan) => plan.recommended) || plans[0] || null;
}
