export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch("https://api.dify.ai/v1/workflows/run", {
      method: "POST",
      headers: {
        Authorization: "Bearer app-RlJJVyGQLN7plp0el7VJKZ50",
        "Content-Type": "application/json; charset=utf-8", // 👈 关键
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    console.log("Dify返回👇", text);

    return new Response(text, {
      headers: {
        "Content-Type": "application/json; charset=utf-8", // 👈 关键
      },
    });
  } catch (error) {
    console.error("后端真实错误👇", error);
    return Response.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}