import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    offlineQueue?: Array<{ id: string; amount: number }>;
  };

  const queue = body.offlineQueue ?? [];

  const resolved = queue.map((item, index) => ({
    id: item.id,
    amount: item.amount,
    status: index % 5 === 0 ? "Failed" : "Success"
  }));

  const conflicts = resolved.filter((item) => item.status === "Failed").map((item) => item.id);

  return NextResponse.json({
    syncedAt: new Date().toISOString(),
    resolved,
    conflicts
  });
}

