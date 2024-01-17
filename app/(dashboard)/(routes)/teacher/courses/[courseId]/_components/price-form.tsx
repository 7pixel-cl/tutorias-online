'use client';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Course } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { formatPrice } from '../../../../../../../lib/format';

interface PriceFormProps {
    initialData: Course;
    courseId: string;
}

const formSchema = z.object({
    price: z.coerce.number().positive(),
});
const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEditing = () => setIsEditing((current) => !current);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { price: initialData?.price || undefined },
    });
    const router = useRouter();
    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success('Course price updated');
            toggleEditing();
            router.refresh();
        } catch (error) {
            toast.error('something went wrong, please try again later');
        }
    };
    return (
        <div className="mt-6 border bg-sky-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                {' '}
                Course price
                <Button variant={'ghost'} onClick={toggleEditing}>
                    {isEditing && <>Cancel</>}
                    {!isEditing && (
                        <>
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Edit price
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn('text-sm mt-2', !initialData.price && 'text-slate-500 italic')}>
                    {initialData.price ? formatPrice(initialData?.price) : 'No price'}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type="number" step={0.01} disabled={isSubmitting} placeholder="e.g. $100" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button disabled={!isValid || isSubmitting} type="submit">
                                Save
                            </Button>
                            <Button variant="ghost" onClick={toggleEditing}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};

export default PriceForm;