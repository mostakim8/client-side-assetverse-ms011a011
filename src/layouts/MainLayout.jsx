import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <div>
            {/* এখানে আপনি চাইলে আপনার Navbar যোগ করতে পারেন */}
            <Outlet /> {/* এই অংশের ভেতরেই আপনার Home বা JoinHR পেজগুলো দেখাবে */}
            {/* এখানে Footer যোগ করতে পারেন */}
        </div>
    );
};

export default MainLayout;