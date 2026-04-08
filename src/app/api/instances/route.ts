import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ACCOUNTS_API = "https://accounts.api.zesty.io/v1/instances";

export async function GET() {
  const cookieStore = await cookies();
  const sid =
    cookieStore.get("APP_SID")?.value ??
    cookieStore.get("DEV_APP_SID")?.value;

  if (!sid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(ACCOUNTS_API, {
    headers: { Authorization: `Bearer ${sid}` },
    // Don't cache — instance list can change
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch instances" },
      { status: res.status }
    );
  }

  const body = await res.json();
  // Accounts API returns { data: [...] }
  const raw: { ZUID: string; name: string }[] = body.data ?? body ?? [];
  const instances = raw.map(({ ZUID, name }) => ({ ZUID, name }));

  return NextResponse.json(instances);
}
