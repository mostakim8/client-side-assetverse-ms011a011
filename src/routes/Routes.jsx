import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import JoinEmployee from "../pages/JoinEmployee";
import JoinHR from "../pages/JoinHR";
import Login from "../pages/Login";
import AddAsset from "../pages/AddAsset";
import AssetList from "../pages/AssetList";
import AllRequests from "../pages/AllRequests";
import MyEmployeeList from "../pages/MyEmployeeList";
import AddEmployee from "../pages/AddEmployee";
import UpgradePackage from "../pages/UpgradePackage";
import Profile from "../pages/Profile";
import HRHome from "../pages/HRHome";
import HrRoute from "../hooks/HrRoute"; // HrRoute ইম্পোর্ট করুন

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "join-employee",
        element: <JoinEmployee />,
      },
      {
        path: "join-hr",
        element: <JoinHR />,
      },
      {
        path: "login",
        element: <Login />,
      },

      // HR Protected Routes (সবগুলো HrRoute দিয়ে র‍্যাপ করা হয়েছে)
      {
        path: "hr-home",
        element: <HrRoute><HRHome /></HrRoute>
      },
      {
        path: "add-asset",
        element: <HrRoute><AddAsset /></HrRoute>
      },
      {
        path: "asset-list",
        element: <HrRoute><AssetList /></HrRoute>
      },
      {
        path: "all-requests",
        element: <HrRoute><AllRequests /></HrRoute>
      },
      {
        path: "my-employee-list",
        element: <HrRoute><MyEmployeeList /></HrRoute>
      },
      {
        path: "add-employee",
        element: <HrRoute><AddEmployee /></HrRoute>
      },
      {
        path: "upgrade-package",
        element: <HrRoute><UpgradePackage /></HrRoute>
      },
      
      // প্রোফাইল সবার জন্য হতে পারে, তবে চাইলে এটিকেও প্রোটেক্টেড রাখতে পারেন
      {
        path: "profile",
        element: <Profile />
      }
    ],
  },
]);

export default router;