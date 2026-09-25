export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

const GAS_URL = 'https://script.google.com/macros/s/AKfycbzjCDuMKqfxk7Te3H1T45LYMUpqe6HXq2kwoOxCR596-n4w017vwfOwhPaxou0jMSEi/exec';

export async function GET() {
  try {
    const res = await fetch(`${GAS_URL}?action=get_rooms`, { cache: 'no-store' });
    return NextResponse.json(await res.json());
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const res = await fetch(GAS_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'create_room', ...data })
    });
    return NextResponse.json(await res.json());
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
