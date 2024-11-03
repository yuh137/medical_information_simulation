import React, { createContext, useContext, useState } from 'react';
import { isTokenExpired } from '../utils/utils';

export enum UserType {
  Admin = 'Admin',
  Student = 'Student',
};

interface AuthContextType {
  isAuthenticated: boolean;
  type: UserType | null;
  username: string;
  initials: string;
  login: (token: string, initials: string, username: string, userType: UserType) => void;
  logout: () => void;
  changeUserType: (type: UserType | null) => void;
  changeUsername: (name: string) => void;
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
    const [username, setUsername] = useState<string>("");
    const [initials, setInitials] = useState<string>("");

    async function login(token: string, initials: string, username: string, userType: UserType) {setIsAuthenticated(true);
      setUserType(userType);
      setUsername(username);
      setInitials(initials);
      localStorage.setItem("token", token);
    }

    function logout() {
      setIsAuthenticated(false);
      setUserType(null);
      setUsername("");
      setInitials("");
      localStorage.removeItem("token");
    }

  function changeUserType(type: UserType | null) {
    setUserType(type);
  }

  function changeUsername(name: string) {
    setUsername(name);
  }

  async function checkSession(): Promise<boolean> {
    const tokenString = localStorage.getItem("token");

    // console.log("check session: ", tokenString);
    if (tokenString && tokenString !== "") {
      setIsAuthenticated(true);
      const token: AuthToken = JSON.parse(tokenString);
      // login(tokenString, token.initials, token.username, token.userType);

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
      <AuthContext.Provider value={{ isAuthenticated, initials, username, type: userType, login, logout, changeUsername, changeUserType, checkSession, checkUserType }}>
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
