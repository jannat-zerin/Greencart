import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, total, paymentMethod, deliveryAddress, customerName } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    if (typeof total !== 'number' || total <= 0) {
      return NextResponse.json(
        { error: 'Invalid total' },
        { status: 400 }
      );
    }

    if (!paymentMethod || !['cash', 'bkash'].includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Payment method must be cash or bkash' },
        { status: 400 }
      );
    }

    await connectDB();

    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'You must be logged in to place an order' },
        { status: 401 }
      );
    }

    if (!deliveryAddress || deliveryAddress.trim() === '') {
      return NextResponse.json(
        { error: 'Delivery address is required' },
        { status: 400 }
      );
    }

    const order = new Order({
      items: items.map((item: { product: { id: number; name: string; price: number; image: string }; quantity: number }) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        quantity: item.quantity,
      })),
      total,
      status: 'pending',
      statusHistory: [{ status: 'pending', updatedAt: new Date() }],
      paymentMethod,
      deliveryAddress: deliveryAddress.trim(),
      customerName: typeof customerName === 'string' ? customerName.trim() : '',
      userId: session.id,
    });

    await order.save();

    return NextResponse.json(
      {
        id: order._id.toString(),
        items: order.items,
        total: order.total,
        status: order.status,
        statusHistory: order.statusHistory,
        paymentMethod: order.paymentMethod,
        deliveryAddress: order.deliveryAddress,
        customerName: order.customerName,
        createdAt: order.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
