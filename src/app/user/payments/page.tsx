"use client";
import { columns, Payment } from "./columns"
import { DataTable } from "./data-table"
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

type Payment = {
  id: string;
  amount: number;
  status: string;
  email: string;
  date: string;
};

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  // const res = await fetch("/api/payments", { cache: "no-store" });
  // if (!res.ok) throw new Error("Failed to fetch payments");
  // return res.json();
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
      date: "2024-01-01",
    },
    // ...
  ]
}

export default function PaymentsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<Payment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const date = new Date();

  useEffect(() => {
    getData()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (!user) return null;
  if (loading) return <div>Loading…</div>;

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
      <h1 className="text-2xl font-bold text-gray-900 w-full border-b border-gray-300 pb-2">Payments</h1>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}