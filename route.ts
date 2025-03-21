// app/api/someEndpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  // 1) The cookies() helper gives you an API to read from the request cookies
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'No access token found.' }, { status: 401 });
  }

  // 2) Do something with the token...
  return NextResponse.json({ success: true, token: accessToken });
}
