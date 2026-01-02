import { NextResponse } from "next/server";
import { POST as authHospitalPOST } from "../../auth/hospital/signin/route";

export async function POST(req: Request) {
  // Delegate to the existing hospital signin handler under /api/auth/hospital/signin
  try {
    return await authHospitalPOST(req as Request);
  } catch (err) {
    console.error("Proxy /api/hospital/signin error:", err);
    return NextResponse.json({ error: "Internal proxy error" }, { status: 500 });
  }
}
