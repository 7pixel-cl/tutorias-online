import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request, { params }: { params: { courseId: string; attachmentsId: string } }) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const courseOwner = await db.course.findUnique({
            where: { id: params.courseId, userId: userId },
        });
        if (!courseOwner) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const Attachment = await db.attachment.delete({
            where: {
                courseId: params.courseId,
                id: params.attachmentsId,
            },
        });
        return NextResponse.json(Attachment);
    } catch (error) {
        console.log('COURSE_ID_ATTACHMENTS_DELETE_ERROR: ', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
