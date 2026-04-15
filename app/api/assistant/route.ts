import { NextResponse } from "next/server";
import { categorySpending, overviewData } from "@/lib/mock-data";

export async function POST(request: Request) {
  const body = (await request.json()) as { message?: string };
  const message = body.message?.toLowerCase() ?? "";

  let reply =
    "You are tracking well. Food and shopping remain the biggest levers if you want to improve savings this month.";

  if (message.includes("week")) {
    reply =
      "You spent ₹6,420 this week. Food made up the largest share, followed by travel and merchant purchases.";
  } else if (message.includes("save")) {
    reply =
      "You can save more by trimming food spend by 12% and shifting large merchant payments to reward-eligible offers.";
  } else if (message.includes("budget")) {
    const usedPct = Math.round((overviewData.budgetUsed / overviewData.monthlyBudget) * 100);
    reply = `You have used ${usedPct}% of your monthly budget. A soft cap of ₹2,600 for the rest of this week would keep you on track.`;
  } else if (message.includes("category")) {
    const top = [...categorySpending].sort((a, b) => b.value - a.value)[0];
    reply = `${top.name} is your top category at ₹${top.value.toLocaleString("en-IN")} this month.`;
  }

  return NextResponse.json({
    reply,
    suggestions: [
      "Set a tighter weekend food budget",
      "Use travel reward offers for metro and fuel",
      "Review large merchant transactions before checkout"
    ]
  });
}

