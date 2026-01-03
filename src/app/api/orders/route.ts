import { NextResponse } from 'next/server';
import { readData, writeData, Order, defaultOrders } from '@/lib/storage';

const ORDERS_FILE = 'orders.json';

export async function GET() {
    try {
        const orders = await readData<Order[]>(ORDERS_FILE, defaultOrders);
        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error reading orders:', error);
        return NextResponse.json({ error: 'Failed to load orders' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const orders = await request.json() as Order[];
        await writeData(ORDERS_FILE, orders);
        return NextResponse.json({ success: true, message: 'Orders saved successfully' });
    } catch (error) {
        console.error('Error saving orders:', error);
        return NextResponse.json({ error: 'Failed to save orders' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const updatedOrder = await request.json() as Order;
        const orders = await readData<Order[]>(ORDERS_FILE, defaultOrders);
        const index = orders.findIndex(o => o.id === updatedOrder.id);

        if (index === -1) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        orders[index] = updatedOrder;
        await writeData(ORDERS_FILE, orders);
        return NextResponse.json({ success: true, message: 'Order updated successfully' });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
