import { StrictMode } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Upload from "./Upload";
import Dashboard from "./Dashboard";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Upload />,
  },
  {
    path: "/chat",
    element: <App />,
    // loader: chatLoader,
  },
  {
    path: "/dash",
    element: <Dashboard />,
  },
]);

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

ReactDOM.render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <RouterProvider router={router} />
    </ConvexProvider>
  </StrictMode>,
  document.getElementById("root")
);
