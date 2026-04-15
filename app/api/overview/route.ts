import { NextResponse } from "next/server";
import { overviewData } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(overviewData);
}

