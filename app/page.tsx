"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Download, Copy } from "lucide-react";
import { motion } from "framer-motion";

export default function App() {
  const [form, setForm] = useState({
    product_name: "",
    category: "",
    selling_points: "",
    style: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fillDemo = () => {
    setForm({
      product_name: "智能电饭煲",
      category: "厨房电器",
      selling_points: "省电,大容量,一键操作",
      style: "极简风",
    });
  };

  const runWorkflow = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/runWorkflow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: form,
          response_mode: "blocking",
          user: "demo",
        }),
      });

      const text = await res.text();
      console.log("真实返回👇", text);

      const data = JSON.parse(text);

      const outputs = data?.data?.outputs || {};

      setResult({
        title: outputs.title || "暂无标题",
        selling_points: outputs.selling_points
          ? outputs.selling_points.split(",")
          : [],
        image: outputs.result || "",
      });
    } catch (err) {
      console.error(err);
      setError("生成失败");
    }

    setLoading(false);
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadImage = () => {
    if (!result?.image) return;
    window.open(result.image, "_blank");
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] p-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto"
      >
        {/* 左侧 */}
        <Card className="rounded-lg shadow-md">
          <CardContent className="p-8 space-y-5">
            <h1 className="text-2xl font-semibold">AI电商上新助手</h1>

            <Input
              name="product_name"
              placeholder="商品名称"
              value={form.product_name}
              onChange={handleChange}
            />
            <Input
              name="category"
              placeholder="商品品类"
              value={form.category}
              onChange={handleChange}
            />
            <Input
              name="selling_points"
              placeholder="核心卖点（逗号分隔）"
              value={form.selling_points}
              onChange={handleChange}
            />
            <Input
              name="style"
              placeholder="风格（极简 / 高端 / 小红书）"
              value={form.style}
              onChange={handleChange}
            />

            {/* 按钮铺满 */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                onClick={runWorkflow}
                disabled={loading}
                className="w-full h-11 bg-[#1A1A1A] text-white hover:bg-[#333]"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "生成"
                )}
              </Button>

              <Button
                variant="outline"
                onClick={fillDemo}
                className="w-full h-11"
              >
                示例
              </Button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </CardContent>
        </Card>

        {/* 右侧 */}
        <Card className="rounded-lg shadow-md">
          <CardContent className="p-8 space-y-6">
            <h2 className="text-2xl font-semibold">生成结果</h2>

            {loading && (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-40 bg-gray-200 rounded"></div>
              </div>
            )}

            {result && (
              <>
                {/* 标题 */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-medium">标题</h3>
                    <Copy
                      size={16}
                      className="cursor-pointer hover:text-blue-500"
                      onClick={() => copyText(result.title)}
                    />
                  </div>
                  <p className="text-lg">{result.title}</p>
                </div>

                {/* 卖点 */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-medium">卖点</h3>
                    <Copy
                      size={16}
                      className="cursor-pointer hover:text-blue-500"
                      onClick={() =>
                        copyText(result.selling_points.join("\n"))
                      }
                    />
                  </div>
                  <ul className="space-y-1">
                    {result.selling_points.map((item: string, i: number) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>

                {/* 图片 */}
                {result.image && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <img
                      src={result.image}
                      className="rounded-lg shadow-sm"
                    />

                    <Button
                      onClick={downloadImage}
                      className="w-full mt-3 h-11 bg-[#3B82F6] text-white hover:opacity-90"
                    >
                      <Download size={16} className="mr-2" />
                      下载图片
                    </Button>
                  </motion.div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}