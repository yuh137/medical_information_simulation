import React, { createContext, useState, useContext } from 'react'

export interface Theme {
    primaryColor: string;
    secondaryColor: string;
    thirdColor?: string;
    fourthColor?: string;
    primaryBorderColor?: string;
    primaryHoverColor?: string;
    primaryHoverBorderColor?: string;
}

interface ThemeContextType {
    theme: Theme;
}

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const mainTheme: Theme = {
    primaryColor: '#3a6cc6',
    secondaryColor: "#dae3f3",  
    primaryBorderColor: '#47669C',
    primaryHoverColor: '#8faadc',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = (props: ThemeProviderProps) => {
  const [theme, setTheme] = useState(mainTheme);

  return (
    <ThemeContext.Provider value={{ theme }}>
        {props.children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
}

// export default ThemeContext