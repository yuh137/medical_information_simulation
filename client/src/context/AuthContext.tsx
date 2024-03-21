import React, { createContext, useContext, useEffect, useState } from 'react'

export enum UserType {
  Admin = 'admin',
  Student = 'student',
};

interface AuthContextType {
  isAuthenticated: boolean;
  type: UserType | null;
  username: string;
  login: (token: string, username: string, userType: UserType) => void;
  logout: () => void;
  changeUserType: (type: UserType | null) => void;
  changeUsername: (name: string) => void;
  checkSession: () => boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = (props: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userType, setUserType] = useState<UserType | null>(null);
    const [username, setUsername] = useState<string>("");

    function login(token: string, username: string, userType: UserType) {
      setIsAuthenticated(true);
      setUserType(userType);
      setUsername(username);
      sessionStorage.setItem("token", token);
    }

    function logout() {
      setIsAuthenticated(false);
      setUserType(null);
      setUsername("");
      sessionStorage.removeItem("token");
    }

    function changeUserType(type: UserType | null) {
      setUserType(type);
    }

    function changeUsername(name: string) {
      setUsername(name);
    }

    // useEffect(() => {
    //   const tokenString = sessionStorage.getItem("token");
    //   if (tokenString && tokenString !== "") {
    //     setIsAuthenticated(true);
    //     const token = JSON.parse(tokenString);

    //     console.log(token);
    //   }
    // }, [isAuthenticated])

    function checkSession(): boolean {
      const tokenString = sessionStorage.getItem("token");
      if (tokenString && tokenString !== "") {
        // setIsAuthenticated(true);
        const token = JSON.parse(tokenString);
        login(tokenString, token.username, token.userType);

        // console.log(token);
        return true;
      }
      return false;
    }

    return (
      <AuthContext.Provider value={{ isAuthenticated, username, type: userType, login, logout, changeUsername, changeUserType, checkSession }}>
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

