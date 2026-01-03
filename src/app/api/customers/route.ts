import { NextResponse } from 'next/server';
import { readData, writeData, Customer, defaultCustomers } from '@/lib/storage';

const CUSTOMERS_FILE = 'customers.json';

export async function GET() {
    try {
        const customers = await readData<Customer[]>(CUSTOMERS_FILE, defaultCustomers);
        return NextResponse.json(customers);
    } catch (error) {
        console.error('Error reading customers:', error);
        return NextResponse.json({ error: 'Failed to load customers' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const newCustomer = await request.json() as Customer;
        const customers = await readData<Customer[]>(CUSTOMERS_FILE, defaultCustomers);

        // Generate new ID
        const maxId = Math.max(...customers.map(c => c.id), 0);
        newCustomer.id = maxId + 1;

        customers.push(newCustomer);
        await writeData(CUSTOMERS_FILE, customers);
        return NextResponse.json({ success: true, customer: newCustomer });
    } catch (error) {
        console.error('Error adding customer:', error);
        return NextResponse.json({ error: 'Failed to add customer' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const updatedCustomer = await request.json() as Customer;
        const customers = await readData<Customer[]>(CUSTOMERS_FILE, defaultCustomers);
        const index = customers.findIndex(c => c.id === updatedCustomer.id);

        if (index === -1) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }

        customers[index] = updatedCustomer;
        await writeData(CUSTOMERS_FILE, customers);
        return NextResponse.json({ success: true, message: 'Customer updated successfully' });
    } catch (error) {
        console.error('Error updating customer:', error);
        return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json() as { id: number };
        const customers = await readData<Customer[]>(CUSTOMERS_FILE, defaultCustomers);
        const filtered = customers.filter(c => c.id !== id);

        if (filtered.length === customers.length) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }

        await writeData(CUSTOMERS_FILE, filtered);
        return NextResponse.json({ success: true, message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Error deleting customer:', error);
        return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
    }
}
