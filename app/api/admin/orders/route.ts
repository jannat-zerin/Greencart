import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean();

    const mapped = orders.map((o: any) => ({
      id: o._id.toString(),
      userId: o.userId,
      items: o.items,
      total: o.total,
      status: o.status,
      paymentMethod: o.paymentMethod,
      deliveryAddress: o.deliveryAddress,
      createdAt: o.createdAt,
    }));

    return NextResponse.json({ orders: mapped });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}