import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        const { courseId } = params;
        const values = await req.json();

        const course = await db.course.update({ where: { id: courseId, userId }, data: { ...values } });
        return new NextResponse(JSON.stringify({ course }), { status: 200 });
    } catch (error) {
        console.log('[COURSES_ID]', error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
