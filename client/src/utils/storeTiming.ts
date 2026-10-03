import { StoreSettings } from "../types";

export interface StoreTimingStatus {
  isOpen: boolean;
  reason: string;
  openingTimeFormatted: string;
  closingTimeFormatted: string;
  notice: string;
}

export function formatTime12h(time24: string): string {
  if (!time24) return "";
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr, 10);
  if (isNaN(h)) return time24;
  const m = mStr || "00";
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

export function getStoreOpenStatus(settings?: StoreSettings | null): StoreTimingStatus {
  const openingTime = settings?.openingTime || "09:00";
  const closingTime = settings?.closingTime || "22:00";
  const openingTimeFormatted = formatTime12h(openingTime);
  const closingTimeFormatted = formatTime12h(closingTime);
  const defaultClosedNotice = `Store is currently closed for delivery & orders. Operating hours: ${openingTimeFormatted} - ${closingTimeFormatted}`;
  const notice = settings?.storeClosedNotice || defaultClosedNotice;

  if (!settings) {
    return {
      isOpen: true,
      reason: "Open",
      openingTimeFormatted,
      closingTimeFormatted,
      notice
    };
  }

  // Manual Override (Force Open or Force Closed)
  if (settings.isStoreOpenManualOverride === false) {
    return {
      isOpen: false,
      reason: "Store closed by bakery management.",
      openingTimeFormatted,
      closingTimeFormatted,
      notice: settings.storeClosedNotice || "Store is currently closed for delivery & orders by management."
    };
  }

  if (settings.isStoreOpenManualOverride === true) {
    return {
      isOpen: true,
      reason: "Force Opened by Admin",
      openingTimeFormatted,
      closingTimeFormatted,
      notice
    };
  }

  // Time-based operating window check
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [openH, openM] = openingTime.split(":").map((n) => parseInt(n, 10) || 0);
  const [closeH, closeM] = closingTime.split(":").map((n) => parseInt(n, 10) || 0);

  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;

  return {
    isOpen,
    reason: isOpen ? "Store is Open" : `Store opens at ${openingTimeFormatted}`,
    openingTimeFormatted,
    closingTimeFormatted,
    notice: isOpen ? "" : (settings.storeClosedNotice || `Store is currently closed for delivery. We open at ${openingTimeFormatted}.`)
  };
}
