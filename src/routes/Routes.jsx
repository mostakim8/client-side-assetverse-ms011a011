import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import JoinEmployee from "../pages/JoinEmployee";
import JoinHR from "../pages/JoinHR";
import Login from "../pages/Login";
import AddAsset from "../pages/AddAsset";
import AssetList from "../pages/AssetList";
import AllRequests from "../pages/AllRequests";

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
      {
    path: "add-asset",
    element: <AddAsset />
},
{
                path: "asset-list", 
                element: <AssetList />,
            },
            {
                path: "all-requests",  
                element: <AllRequests />,
            },
    ],
  },
]);

export default router;