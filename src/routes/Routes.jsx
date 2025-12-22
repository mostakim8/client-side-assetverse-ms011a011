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
import HrRoute from "../hooks/HrRoute"; 
import MyAssets from "../pages/MyAssets";
import EmployeeRoute from "../hooks/EmployeeRoute"; 
import MyTeam from "../pages/MyTeam";
import RequestAsset from "../pages/RequestAsset";
import EmployeeHome from "../pages/EmployeeHome";

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
      //employee protected routes 
{
  path: "employee-home",
  element: <EmployeeRoute><EmployeeHome /></EmployeeRoute>
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