'use client';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { PencilIcon, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Chapter, Course } from '@prisma/client';
import { Input } from '@/components/ui/input';

interface ChaptersFormProps {
    initialData: Course & { chapters: Chapter[] };
    courseId: string;
}

const formSchema = z.object({
    title: z.string().min(1),
});
const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const toggleCreating = () => setIsCreating((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { title: '' },
    });

    const router = useRouter();
    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values);
            toast.success('Chapter created');
            toggleCreating();
            router.refresh();
        } catch (error) {
            toast.error('something went wrong, please try again later');
        }
    };
    return (
        <div className="mt-6 border bg-sky-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course chapters
                <Button variant={'ghost'} onClick={toggleCreating}>
                    {isCreating && <>Cancel</>}
                    {!isCreating && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a chapter
                        </>
                    )}
                </Button>
            </div>
            {isCreating && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input disabled={isSubmitting} placeholder="e.g. This is the chapter name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button disabled={!isValid || isSubmitting} type="submit">
                                Create
                            </Button>
                            <Button variant="ghost" onClick={toggleCreating}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn('text-sm mt-2', !initialData.chapters.length && 'text-slate-500 italic')}>
                    {!initialData.chapters.length && 'No chapters'}
                    {/* {TODO: Add a list of chapters} */}
                </div>
            )}
            {!isCreating && <p className="text-xs text-muted-foreground mt-4">Drag and drop to reorder the chapters</p>}
        </div>
    );
};

export default ChaptersForm;
