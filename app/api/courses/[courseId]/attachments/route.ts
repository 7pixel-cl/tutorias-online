import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { Attachment } from '@prisma/client';

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const { userId } = auth();
        const { url } = await req.json();
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const courseOwner = await db.course.findUnique({
            where: { id: params.courseId, userId: userId },
        });

        if (!courseOwner) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const Attachment = await db.attachment.create({
            data: {
                url: url,
                name: url.split('/').pop(),
                courseId: params.courseId,
            },
        });
        return NextResponse.json(Attachment);
    } catch (error) {
        console.log('COURSE_ID_ATTACHMENTS_POST_ERROR: ', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
