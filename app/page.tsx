"use client"

import { useState } from "react"

export default function Home() {
  const [msg, setMsg] = useState("")
  const [sum, setSum] = useState<number | null>(null);

  const fetchMessage = async () => {
    const res = await fetch("http://localhost:8000/hello");
    const data = await res.json();
    setMsg(data.message);
  };

  const calcAdd = async () => {
    const res = await fetch("http://localhost:8000/add?a=5&b=12");
    const data = await res.json();
    setSum(data.result);
  }

  return (
    <main className="flex flex-col items-center gap-6 p-10">
      <h1 className="text-3xl font-bold">
        Next.js + Tailwind + Python Full Stack Demo
      </h1>
      <button
        onClick={fetchMessage}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Retrive backend message
      </button>

      {msg && <p className="text-lg">Backend return: {msg}</p>}

      <button
        onClick={calcAdd}
        className="px-4 py-2 bg-green-500 text-white rounded-md"
      >
        Call backend add API (5 + 12)
      </button>

      {sum != null && <p className="text-lg">Calculation result: {sum}</p>}
    </main>
  )
}