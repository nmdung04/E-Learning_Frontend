const STORAGE_KEY = "reset-flow-session";

export type ResetFlowSession = {
  email?: string;
  resetToken?: string;
};

const isBrowser = () => typeof window !== "undefined";

export const readResetFlowSession = (): ResetFlowSession | null => {
  if (!isBrowser()) return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ResetFlowSession) : null;
  } catch (error) {
    console.error("Failed to read reset flow session", error);
    return null;
  }
};

export const writeResetFlowSession = (payload: ResetFlowSession) => {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error("Failed to write reset flow session", error);
  }
};

export const updateResetFlowSession = (payload: ResetFlowSession) => {
  const current = readResetFlowSession() ?? {};
  writeResetFlowSession({ ...current, ...payload });
};

export const clearResetFlowSession = () => {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear reset flow session", error);
  }
};
