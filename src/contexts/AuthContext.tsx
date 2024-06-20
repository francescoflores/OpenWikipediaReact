import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
} from "react";
import axios from "axios";
import { IUser } from "../interfaces/IUser";
import { useNavigate, useLocation } from "react-router-dom";

const { VITE_BACKEND_URL } = import.meta.env;

const api = axios.create({
  baseURL: `${VITE_BACKEND_URL}`,
});

interface IAuthContext {
  loading: boolean;
  user: IUser | null;
  setAsLogged: (user: IUser) => void;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
}

type AuthAction =
  | { type: "SET_AS_LOGGED"; payload: IUser }
  | { type: "LOGOUT" };

const AuthContext = createContext<IAuthContext | null>(null);

const authReducer = (state: IAuthContext, action: AuthAction): IAuthContext => {
  switch (action.type) {
    case "SET_AS_LOGGED":
      const { token } = action.payload;
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return { ...state, user: action.payload, loading: false };

    case "LOGOUT":
      delete api.defaults.headers.common["Authorization"];
      return { ...state, user: null, loading: false };

    default:
      return state;
  }
};

const initialState: IAuthContext = {
  loading: true,
  user: null,
  setAsLogged: () => {},
  logout: () => {},
  login: async () => {},
  signup: async () => {},
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, dispatch] = useReducer(authReducer, initialState);

  const setAsLogged = (user: IUser) => {
    dispatch({ type: "SET_AS_LOGGED", payload: user });
  };

  const logout = () => {
    localStorage.removeItem("ACCESS_TOKEN");
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/api/auth/signin", { email, password });
      const user = response.data;
      localStorage.setItem("ACCESS_TOKEN", user.token);
      setAsLogged(user);
      navigate("/");
    } catch (error) {
      console.error("Failed to login", error);
    }
  };

  const signup = async (email: string, username: string, password: string) => {
    try {
      await api.post("/api/auth/signup", {
        email,
        username,
        password,
      });
      navigate("/");
    } catch (error) {
      console.error("Failed to signup", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      api
        .get<IUser>("/api/user")
        .then((response) => {
          setAsLogged(response.data);
        })
        .catch((error) => {
          console.error("Failed to fetch user data", error);
          logout();
        });
    } else if (location.pathname !== "/register") {
      dispatch({ type: "LOGOUT" });
      navigate("/login");
    } else {
      dispatch({ type: "LOGOUT" });
    }
  }, [location.pathname]);

  return (
    <AuthContext.Provider
      value={{ ...state, setAsLogged, logout, login, signup }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth, api };
