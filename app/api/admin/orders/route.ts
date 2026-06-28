import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';
import { getSession } from '@/lib/auth';

const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

function normalizeStatus(status: string) {
  return allowedStatuses.includes(status) ? status : 'pending';
}

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
      status: normalizeStatus(o.status || 'pending'),
      statusHistory: o.statusHistory || [],
      paymentMethod: o.paymentMethod,
      deliveryAddress: o.deliveryAddress,
      createdAt: o.createdAt,
    }));

    return NextResponse.json({ orders: mapped });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Order ID and status are required' }, { status: 400 });
    }

    const nextStatus = normalizeStatus(status);
    await connectDB();

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const statusHistory = Array.isArray(order.statusHistory) ? order.statusHistory : [];
    if (statusHistory.length === 0 && order.status) {
      statusHistory.push({ status: order.status, updatedAt: order.createdAt || new Date() });
    }

    const latestStatus = statusHistory.at(-1)?.status;
    if (order.status !== nextStatus || latestStatus !== nextStatus) {
      order.status = nextStatus;
      order.statusHistory = statusHistory;
      if (latestStatus !== nextStatus) {
        statusHistory.push({ status: nextStatus, updatedAt: new Date() });
        order.statusHistory = statusHistory;
      }
      await order.save();
    }

    return NextResponse.json({
      order: {
        id: order._id.toString(),
        userId: order.userId,
        items: order.items,
        total: order.total,
        status: order.status,
        statusHistory: order.statusHistory,
        paymentMethod: order.paymentMethod,
        deliveryAddress: order.deliveryAddress,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}