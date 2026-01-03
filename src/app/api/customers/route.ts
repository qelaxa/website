import { NextResponse } from 'next/server';

// Mock database
const customers = [
    {
        id: 'cust_01',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '(419) 555-0123',
        totalOrders: 12,
        totalSpend: 450.50,
        status: 'Active',
        joinedDate: '2023-01-15'
    },
    {
        id: 'cust_02',
        name: 'Mike Chen',
        email: 'mike.chen@example.com',
        phone: '(419) 555-0124',
        totalOrders: 5,
        totalSpend: 125.00,
        status: 'Active',
        joinedDate: '2023-03-22'
    },
    {
        id: 'cust_03',
        name: 'Emily Davis',
        email: 'emily.d@example.com',
        phone: '(419) 555-0125',
        totalOrders: 22,
        totalSpend: 890.00,
        status: 'Active',
        joinedDate: '2022-11-05'
    },
    {
        id: 'cust_04',
        name: 'James Wilson',
        email: 'j.wilson@example.com',
        phone: '(419) 555-0126',
        totalOrders: 1,
        totalSpend: 25.00,
        status: 'Inactive',
        joinedDate: '2023-09-10'
    },
    {
        id: 'cust_05',
        name: 'Jessica Brown',
        email: 'jess.brown@example.com',
        phone: '(419) 555-0127',
        totalOrders: 8,
        totalSpend: 340.25,
        status: 'Active',
        joinedDate: '2023-05-30'
    }
];

export async function GET(request: Request) {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase();

    let filteredCustomers = customers;

    if (search) {
        filteredCustomers = customers.filter(c =>
            c.name.toLowerCase().includes(search) ||
            c.email.toLowerCase().includes(search)
        );
    }

    return NextResponse.json(filteredCustomers);
}

export async function POST(request: Request) {
    const body = await request.json();
    const newCustomer = {
        id: `cust_${Math.floor(Math.random() * 1000)}`,
        ...body,
        totalOrders: 0,
        totalSpend: 0,
        status: 'Active',
        joinedDate: new Date().toISOString().split('T')[0]
    };

    // In a real app, save to DB here
    customers.push(newCustomer);

    return NextResponse.json(newCustomer, { status: 201 });
}
