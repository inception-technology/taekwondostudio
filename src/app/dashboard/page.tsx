"use client";

import { RequireAuth } from "@/components/shared/RequireAuth";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <RequireAuth>
      <h1>Dashboard</h1>

      {user && (
        <p>
          Welcome <strong>{user.username}</strong> 👋
        </p>
      )}
    </RequireAuth>
  );
};

export default Dashboard;
