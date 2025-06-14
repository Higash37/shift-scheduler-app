import { ShiftStatus } from "@/common/common-models/ModelIndex";

export const colors = {
  primary: "#1565C0", // ヘッダーと同じ青色に統一
  secondary: "#5856D6",
  background: "#F2F2F7",
  surface: "#FFFFFF",
  text: {
    primary: "#1C1C1E",
    secondary: "#8E8E93",
    white: "#FFFFFF",
    disabled: "#C7C7CC",
  },
  border: "#C7C7CC",
  error: "#FF3B30",
  success: "#34C759",
  warning: "#FF9500",
  selected: "#007AFF",
  shift: {
    available: "#34C759",
    unavailable: "#FF3B30",
    pending: "#FF9500",
    approved: "#007AFF",
    rejected: "#FF3B30",
  },
  // ShiftStatus型に準拠したステータスカラー
  status: {
    draft: "#B0BEC5",
    approved: "#1565C0", // 青色
    pending: "#FFC107",
    deleted: "#F44336",
    rejected: "#EF5350",
    deletion_requested: "#FF7043",
    completed: "#4CAF50", // 緑色
  } as Record<ShiftStatus, string> & { completed: string },
};
