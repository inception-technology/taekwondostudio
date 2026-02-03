"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { fetchKpis } from "@/lib/api";

type Kpis = { title: string; value: number;}[];

export default function Indicators() {
  const [data, setData] = useState<Kpis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchKpis()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading KPIs…</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!data) return null;

  console.log("KPI Data:", data);

  return (
    <div className="flex flex-col w-full space-y-6 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 w-full text-center">Overview</h2>
        <div className="flex items-center space-x-4 w-full rounded-md p-5 justify-around">
            {data.map((d) => (
            <Card key={d.title} className="w-full max-w-md">
                <CardHeader>
                <CardTitle className="text-center font-bold">{d.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-6xl text-center font-bold">{d.value}</p>
                </CardContent>
            </Card>
            ))}
        </div>
    </div>
  );
}
