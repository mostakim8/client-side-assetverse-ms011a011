import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import JoinEmployee from "../pages/JoinEmployee";
import JoinHR from "../pages/JoinHR";
import Login from "../pages/Login";

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
    ],
  },
]);

export default router;