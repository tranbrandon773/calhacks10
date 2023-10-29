import { StrictMode } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Upload from "./Upload";
import Dashboard from "./Dashboard";
import Login from "./Login";
import { SessionProvider } from "./SessionProvider";
// import Sandbox from "./Sandbox";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/upload",
    element: <Upload />,
  },
  {
    path: "/chat",
    element: <App />,
  },
  {
    path: "/dash",
    element: <Dashboard />,
  },
  // {
  //   path: "/dev",
  //   element: <Sandbox />,
  // },  
]);

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

ReactDOM.render(
  <StrictMode>
    <SessionProvider>
    <ConvexProvider client={convex}>
      <RouterProvider router={router} />
    </ConvexProvider>
    </SessionProvider>
  </StrictMode>,
  document.getElementById("root")
);
