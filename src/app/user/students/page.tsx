"use client";
import { useAuth } from "@/contexts/AuthContext";
const Students = () => {
  const { user } = useAuth();
  const date = new Date();
  return (
    <div className="flex flex-col w-full">
      <div className="w-full flex mt-4 mb-8">
        <div className="mb-4 text-lg">Hello 
          {user && (
          <strong> {user.username.charAt(0).toUpperCase() + user.username.slice(1)}</strong>
          )} 👋  
          <span> - {date.toLocaleDateString("en", { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' })}</span>
        </div>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 w-full border-b border-gray-300 pb-2">Students</h1>

    </div>
  )
}

export default Students