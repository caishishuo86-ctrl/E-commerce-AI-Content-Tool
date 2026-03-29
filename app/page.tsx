"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Download, Copy } from "lucide-react";

export default function App() {
  const [form, setForm] = useState({
    product_name: "",
    category: "",
    selling_points: "",
    style: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fillDemo = () => {
    setForm({
      product_name: "智能电饭煲",
      category: "厨房电器",
      selling_points: "省电,大容量,一键操作",
      style: "简约风",
    });
  };

  const runWorkflow = async () => {
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch("https://api.dify.ai/v1/workflows/run", {
        method: "POST",
        headers: {
          Authorization: "Bearer app-RlJJVyGQLN7plp0el7VJKZ50",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: form,
          response_mode: "blocking",
          user: "demo",
        }),
      });

      const data = await res.json();

      if (!data?.data?.outputs) {
        throw new Error("返回数据异常");
      }

      setResult(data.data.outputs);
    } catch (err) {
      setError("生成失败，请检查接口或参数");
      console.error(err);
    }

    setLoading(false);
  };

  const downloadImage = async () => {
    const url = result?.images?.[0]?.url;
    if (!url) return;
    const blob = await fetch(url).then((r) => r.blob());
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "product-image.png";
    link.click();
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-6 grid grid-cols-2 gap-6">
      {/* 左侧输入 */}
      <Card className="p-4">
        <CardContent className="space-y-3">
          <h2 className="text-xl font-bold">AI电商上新助手</h2>

          <Input name="product_name" placeholder="商品名称" value={form.product_name} onChange={handleChange} />
          <Input name="category" placeholder="商品品类" value={form.category} onChange={handleChange} />
          <Input name="selling_points" placeholder="核心卖点" value={form.selling_points} onChange={handleChange} />
          <Input name="style" placeholder="文案风格" value={form.style} onChange={handleChange} />

          <div className="flex gap-2">
            <Button onClick={runWorkflow} disabled={loading} className="w-full">
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} /> 生成中...
                </span>
              ) : (
                "一键生成"
              )}
            </Button>

            <Button variant="outline" onClick={fillDemo}>示例</Button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
      </Card>

      {/* 右侧结果 */}
      <Card className="p-4">
        <CardContent>
          <h2 className="text-xl font-bold mb-4">生成结果</h2>

          {loading && (
            <div className="space-y-2 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* 标题 */}
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">标题</h3>
                  <Copy size={16} className="cursor-pointer" onClick={() => copyText(result.标题)} />
                </div>
                <p>{result.标题}</p>
              </div>

              {/* 卖点 */}
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">卖点</h3>
                  <Copy
                    size={16}
                    className="cursor-pointer"
                    onClick={() => copyText(result.卖点?.join("\n"))}
                  />
                </div>
                <ul className="list-disc pl-5">
                  {result.卖点?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* 图片 */}
              {result.images && (
                <div>
                  <img
                    src={result.images[0].url}
                    alt="生成图片"
                    className="rounded-2xl shadow"
                  />

                  <Button onClick={downloadImage} className="mt-2 w-full">
                    <Download size={16} className="mr-2" /> 下载主图
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
