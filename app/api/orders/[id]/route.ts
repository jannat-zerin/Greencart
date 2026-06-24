import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    const order = await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: order._id.toString(),
      items: order.items,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
    });
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
