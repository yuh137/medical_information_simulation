import React, { createContext, useContext, useState } from 'react';
import { isTokenExpired } from '../utils/utils';

export enum UserType {
  Admin = 'Admin',
  Student = 'Student',
};

interface AuthContextType {
  isAuthenticated: boolean;
  type: UserType | null;
  userId: string;
  login: (token: string, userId: string, userType: UserType) => void;
  logout: () => void;
  checkSession: () => Promise<boolean>;
  checkUserType: () => UserType | null;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export interface AuthToken {
  jwtToken: string;
  userID: string;
  roles: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = (props: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userType, setUserType] = useState<UserType | null>(null);
    const [userId, setUserId] = useState<string>("");

    async function login(token: string, userId: string, userType: UserType) {
      setIsAuthenticated(true);
      setUserType(userType);
      setUserId(userId);
      localStorage.setItem("token", token);
    }

    function logout() {
      setIsAuthenticated(false);
      setUserType(null);
      setUserId("");
      localStorage.removeItem("token");
    }

    async function checkSession(): Promise<boolean> {
      const tokenString = localStorage.getItem("token");

      // console.log("check session: ", tokenString);
      if (tokenString && tokenString !== "") {
        setIsAuthenticated(true);
        const token: AuthToken = JSON.parse(tokenString);

        const jwt = token.jwtToken;
        if (isTokenExpired(jwt)) {
          return false;
        }
        return true;
      }
      return false;
    };

    function checkUserType(): UserType | null {
      if (!checkSession()) return null;

      const tokenString = localStorage.getItem("token");
      if (tokenString) {
        // const token: { username: string, userType: UserType } = JSON.parse(tokenString);
        // return token.userType;
        const authToken: AuthToken | null = JSON.parse(tokenString);
        if (authToken) {
          return authToken.roles.includes(UserType.Admin) ? UserType.Admin : UserType.Student;
        }
      }
      return null;
    }

    return (
      <AuthContext.Provider value={{ isAuthenticated, userId, type: userType, login, logout, checkSession, checkUserType }}>
        {props.children}
      </AuthContext.Provider>
    )
  }

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
