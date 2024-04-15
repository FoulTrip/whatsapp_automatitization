import React from "react";
import ReactDOM from "react-dom/client";
import App from "./routes/App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import ErrorPage from "./error-page.tsx";
import DashboardBot from "./components/dashboardBot.tsx";
import { GlobalProvider } from "./context/session.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardBot />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalProvider>
      <RouterProvider router={router} />
    </GlobalProvider>
  </React.StrictMode>
);
