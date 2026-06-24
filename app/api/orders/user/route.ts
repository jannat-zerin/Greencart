import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    await connectDB();
    const orders = await Order.find({ userId: session.id })
      .sort({ createdAt: -1 })
      .lean();

    const mapped = orders.map((o) => ({
      id: o._id.toString(),
      items: o.items,
      total: o.total,
      status: o.status,
      paymentMethod: o.paymentMethod,
      deliveryAddress: o.deliveryAddress,
      createdAt: o.createdAt,
    }));

    return NextResponse.json({ orders: mapped });
  } catch (error) {
    console.error('Failed to fetch user orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
