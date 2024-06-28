import React, { createContext, useContext, useEffect, useState } from 'react'

export enum UserType {
  Admin = 'admin',
  Student = 'student',
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
  checkSession: () => boolean;
  checkUserType: () => UserType | null;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = (props: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userType, setUserType] = useState<UserType | null>(null);
    const [username, setUsername] = useState<string>("");
    const [initials, setInitials] = useState<string>("");

    function login(token: string, initials: string, username: string, userType: UserType) {
      setIsAuthenticated(true);
      setUserType(userType);
      setUsername(username);
      setInitials(initials);
      sessionStorage.setItem("token", token);
    }

    function logout() {
      setIsAuthenticated(false);
      setUserType(null);
      setUsername("");
      setInitials("");
      sessionStorage.removeItem("token");
    }

    function changeUserType(type: UserType | null) {
      setUserType(type);
    }

    function changeUsername(name: string) {
      setUsername(name);
    }

    function checkSession(): boolean {
      const tokenString = sessionStorage.getItem("token");
      if (tokenString && tokenString !== "") {
        // setIsAuthenticated(true);
        const token = JSON.parse(tokenString);
        login(tokenString, token.initials, token.username, token.userType);

        // console.log(token);
        return true;
      }
      return false;
    };

    function checkUserType(): UserType | null {
      if (!checkSession()) return null;

      const tokenString = sessionStorage.getItem("token");
      if (tokenString) {
        const token: { username: string, userType: UserType } = JSON.parse(tokenString);
        return token.userType;
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
      throw new Error("useAuth must be used within a AuthProvider");
    }

    return context;
  }

