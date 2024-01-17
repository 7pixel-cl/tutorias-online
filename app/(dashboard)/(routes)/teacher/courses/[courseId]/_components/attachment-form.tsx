'use client';

import * as z from 'zod';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { File, ImageIcon, Loader2, PencilIcon, PlusCircle, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { Attachment, Course } from '@prisma/client';
import Image from 'next/image';
import { FileUpload } from '@/components/file-upload';

interface AttachmentFormProps {
    initialData: Course & { attachments: Attachment[] };
    courseId: string;
}

const formSchema = z.object({
    url: z.string().min(1),
});
const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const toggleEditing = () => setIsEditing((current) => !current);

    const router = useRouter();
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values);
            toast.success('Course attachments updated');
            toggleEditing();
            router.refresh();
        } catch (error) {
            toast.error('something went wrong, please try again later');
        }
    };
    const onDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success('Course attachment deleted');
            router.refresh();
        } catch (error) {
            toast.error('something went wrong, please try again later');
        } finally {
            setDeletingId(null);
        }
    };
    return (
        <div className="mt-6 border bg-sky-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                {' '}
                Course attachments
                <Button variant={'ghost'} onClick={toggleEditing}>
                    {isEditing && <>Cancel</>}
                    {!isEditing && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a file
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                    {initialData.attachments.length === 0 && (
                        <div className="flex flex-col items-center justify-center mt-4">
                            <ImageIcon className="h-12 w-12" />
                            <span className="text-sm text-slate-700 mt-2">No attachments yet</span>
                        </div>
                    )}
                    {initialData.attachments.length > 0 && (
                        <div className="space-y-2">
                            {initialData.attachments.map((attachment) => (
                                <div
                                    className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                                    key={attachment.id}>
                                    <File className="h-4 w-4 mr-2 flex-shrink-0" />

                                    <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                                        <p className="text-x line-clamp-1">{attachment.url}</p>
                                    </a>
                                    {deletingId === attachment.id && (
                                        <div>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        </div>
                                    )}
                                    {deletingId !== attachment.id && (
                                        <button
                                            className="ml-auto hover:opacity-75 transition"
                                            onClick={() => {
                                                onDelete(attachment.id);
                                            }}>
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="courseAttachment"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ url: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">Add anything your students needs to complete the course</div>
                </div>
            )}
        </div>
    );
};

export default AttachmentForm;
