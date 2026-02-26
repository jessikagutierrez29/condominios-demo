const TOKEN_KEY = "sigc_auth_token";
const USER_KEY = "sigc_auth_user";

function getStorage() {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getToken() {
  const storage = getStorage();
  return storage ? storage.getItem(TOKEN_KEY) : null;
}

export function setToken(token) {
  const storage = getStorage();
  if (!storage) return;
  if (token) storage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(TOKEN_KEY);
}

export function getUser() {
  const storage = getStorage();
  if (!storage) return null;
  const raw = storage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setUser(user) {
  const storage = getStorage();
  if (!storage) return;
  if (!user) {
    storage.removeItem(USER_KEY);
    return;
  }
  storage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  clearToken();
  setUser(null);
}

export function isAuthenticated() {
  return Boolean(getToken());
}
