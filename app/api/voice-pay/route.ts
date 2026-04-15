import { NextResponse } from "next/server";

function extractAmount(input: string) {
  const match = input.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

function extractName(input: string) {
  const match = input.match(/to\s+([a-z]+)/i);
  return match ? match[1] : "contact";
}

export async function POST(request: Request) {
  const body = (await request.json()) as { command?: string };
  const command = body.command ?? "";
  const amount = extractAmount(command);
  const person = extractName(command);

  return NextResponse.json({
    interpreted: `Send ₹${amount || 0} to ${person}`,
    status: amount > 0 ? "Ready for confirmation" : "Could not parse amount"
  });
}
