import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import DashboardBot from "./pages/dashboardBot.tsx";
import { GlobalProvider } from "./context/session.tsx";
import { Toaster } from "sonner";
import Collection from "./pages/Collection.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/dashboard",
    element: <DashboardBot />,
  },
  {
    path: "/collection/:collectionId",
    element: <Collection />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalProvider>
      <Toaster richColors />
      <RouterProvider router={router} />
    </GlobalProvider>
  </React.StrictMode>
);
