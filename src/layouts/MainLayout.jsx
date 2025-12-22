import { Outlet } from "react-router-dom";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";

const MainLayout = () => {
    return (
        <div className="font-sans">
            <Navbar />
            
            <div className="pt-16"> 
                <Outlet /> 
            </div>
            <Footer/>
        </div>
    );
};

export default MainLayout;