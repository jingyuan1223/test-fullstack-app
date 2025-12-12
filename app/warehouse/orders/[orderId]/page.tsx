"use client"

import {useState, useEffect} from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function WarehouseOrderPage({ params }: { params: { orderId: string }}) {
    const { orderId } = params
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [checking, setChecking] = useState(false)

    useEffect(() => {
        async function fetchOrder(){
            setLoading(true)
            try{
                const res = await fetch("http://localhost:8000/api/orders/${orderId}")
                if(!res.ok) throw new Error("Order doesn't exist!")
                const data = await res.json()
                setOrder(data)
            } catch (err: any) {
                setError(err.message)
            }
            setLoading(false)
        }
        fetchOrder()
    }, [orderId])

    async function handleConfirm() {
        setChecking(true);
        await fetch("http://localhost:8000/api/orders/${orderId}/allocate", {
            method: "Post",
        })
        alert("Stock Locked")
        setChecking(false)
    }
    if (loading) return <div className="p-6">Loading...</div>
    if (error) return <div className="p-6 text-red-500">{error}</div>
    if (!order) return null

    return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">仓库订单检查</h1>

      <Card>
        <CardHeader>
          <CardTitle>订单 #{orderId}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {order.items.map((item: any) => (
            <div key={item.sku} className="border p-3 rounded-lg bg-gray-50">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">{item.sku}</div>
                  <div className="text-sm text-gray-600">{item.name}</div>
                </div>

                <div className="text-right">
                  <div>数量：{item.qty}</div>

                  {/* 库存展示 */}
                  <div className="flex items-center gap-2 text-sm">
                    <span>库存：{item.inventory}</span>
                    {item.inventory >= item.qty ? (
                      <Badge className="bg-green-500">充足</Badge>
                    ) : (
                      <Badge className="bg-red-500">不足</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Separator />

          <Button
            className="w-full"
            disabled={checking}
            onClick={handleConfirm}
          >
            {checking ? "处理中..." : "确认配货（锁定库存）"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )

}