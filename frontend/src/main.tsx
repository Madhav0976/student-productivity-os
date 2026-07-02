import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import { Suspense, lazy } from "react";
const Analytics = lazy(() => import("./pages/Analytics"));
const Coding = lazy(() => import("./pages/Coding"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Goals = lazy(() => import("./pages/Goals"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Notes = lazy(() => import("./pages/Notes"));
const Placement = lazy(() => import("./pages/Placement"));
const Profile = lazy(() => import("./pages/Profile"));
const Register = lazy(() => import("./pages/Register"));
const Study = lazy(() => import("./pages/Study"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Inbox = lazy(() => import("./pages/Inbox"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Archive = lazy(() => import("./pages/Archive"));
const Settings = lazy(() => import("./pages/Settings"));
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#F7F9FC] dark:bg-[#0F172A]"><div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-800 border-t-blue-600 rounded-full animate-spin"></div></div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/study" element={<Study />} />
              <Route path="/placements" element={<Placement />} />
              <Route path="/coding" element={<Coding />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>
);
