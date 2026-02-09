import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // before theme is set, check localStorage for saved theme preference
    const [isDark, setIsDark] = useState(
        localStorage.getItem("theme") === "dark"
    );

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            // for DaisyUI 
            root.setAttribute("data-theme", "dark"); 
            // for Tailwind CSS
            root.classList.add("dark");              
            localStorage.setItem("theme", "dark");
        } else {
            root.setAttribute("data-theme", "light");
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};