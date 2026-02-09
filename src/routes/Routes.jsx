import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

// Shared Pages
import Home from "../shared/Home";
import Login from "../shared/Login";
import JoinEmployee from "../shared/JoinEmployee";
import JoinHR from "../shared/JoinHR";
import Profile from "../shared/Profile";
// HR Protected Routes
import HrRoute from "../hooks/HrRoute"; 
import HRHome from "../pages/hr/HRHome";
import AddAsset from "../pages/hr/AddAsset";
import AssetList from "../pages/hr/AssetList";
import AllRequests from "../pages/hr/AllRequests";
import MyEmployeeList from "../pages/hr/MyEmployeeList";
import AddEmployee from "../pages/hr/AddEmployee";
import UpgradePackage from "../pages/hr/UpgradePackage";

// employees Protected Routes
import EmployeeRoute from "../hooks/EmployeeRoute"; 
import EmployeeHome from "../pages/employee/EmployeeHome";
import MyAssets from "../pages/employee/MyAssets";
import MyTeam from "../pages/employee/MyTeam";
import RequestAsset from "../pages/employee/RequestAsset";
import JoinCompany from "../pages/employee/JoinCompany";



import Payment from "../pages/dashboard/payment/Payment";
import PaymentSuccess from "../pages/dashboard/payment/PaymentSuccess";

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

      // HR Protected Routes 
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
      { 
        path: "payment", 
        element: <HrRoute><Payment /></HrRoute> 
      },
      {
        path:"payment-success",
        element:<HrRoute><PaymentSuccess/></HrRoute>
      },
      //employee protected routes 
      {
       path: "employee-home",
       element: <EmployeeRoute><EmployeeHome /></EmployeeRoute>
      },

      {
        path: "join-company",
        element: <EmployeeRoute><JoinCompany /></EmployeeRoute>
      },
      {
        path: "my-assets",
        element: <EmployeeRoute><MyAssets /></EmployeeRoute>
      },
       {
        path: "my-team",
        element: <EmployeeRoute><MyTeam /></EmployeeRoute>
      },
      {
        path: "request-asset",
        element: <EmployeeRoute><RequestAsset /></EmployeeRoute>
      },
      {
        path: "profile",
        element: <Profile />
      }
    ],
  },
]);

export default router;