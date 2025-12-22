import { Outlet } from "react-router-dom";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";

const MainLayout = () => {
    return (
        <div className="font-sans">
            <Navbar />
            {/* pt-16 দেওয়া হয়েছে যাতে ফিক্সড নেভবারের নিচে কন্টেন্ট না যায় */}
            <div className="pt-16"> 
                <Outlet /> 
            </div>
            <Footer/>
        </div>
    );
};

export default MainLayout;