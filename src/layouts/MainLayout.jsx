import { Outlet } from "react-router-dom";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";
import { ThemeProvider } from "../hooks/ThemeContext";

const MainLayout = () => {
    return (
        <ThemeProvider>
            {/* add text-slate-900 dark:text-slate-100 */}
            <div className="font-sans min-h-screen transition-colors duration-300 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                <Navbar />
                
                <main className="pt-16 min-h-[calc(100vh-80px)]"> 
                    <Outlet /> 
                </main>
                
                <Footer/>
            </div>
        </ThemeProvider>
    );
};

export default MainLayout;