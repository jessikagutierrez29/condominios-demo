import api from "../service/api";
import { clearAuth, getToken, isAuthenticated, setToken, setUser } from "./authStorage";

const MOCK_USER = {
  id: 1,
  name: "Administrador",
  role: "admin",
  email: "admin@condominio.demo",
};

export async function login({ username, password, useMock = true }) {
  if (useMock) {
    if (username === "admin" && password === "1234") {
      setToken("mock-demo-token");
      setUser(MOCK_USER);
      return { token: "mock-demo-token", user: MOCK_USER };
    }
    throw new Error("Credenciales inválidas");
  }

  const response = await api.post("/login", {
    username,
    password,
  });

  const token = response?.data?.token;
  const user = response?.data?.user;
  if (token) setToken(token);
  if (user) setUser(user);
  return { token, user };
}

export async function fetchProfile() {
  if (!getToken()) return null;
  const response = await api.get("/me");
  const user = response?.data?.user || response?.data;
  if (user) setUser(user);
  return user;
}

export function logout() {
  clearAuth();
}

export { isAuthenticated };
