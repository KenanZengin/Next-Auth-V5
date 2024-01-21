"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { useState, useTransition } from "react"
import { 
    Form,
    FormControl,
    FormItem,
    FormField,
    FormLabel,
    FormMessage 
} from "../ui/form"
import { CardWrapper } from "./card-wrapper"
import { NewPasswordSchema } from "@/schema"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"
import { newPassword } from "@/actions/new-password"


export const NewPasswordForm = () => {

    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [isPending,startTransition] = useTransition();
    const [error,setError] = useState("");
    const [success,setSuccess] = useState("");

   

    const form = useForm({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password:"",
        },
    });

    const onSubmit = (values) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            newPassword(values,token)
                .then((data) => {
                    setError(data?.error);
                    setSuccess(data?.success);
                });
        });
    }

    return(
        <CardWrapper 
            headerLabel={"Enter your new password"}
            backButtonLabel={"Go back to login"}
            backButtonHref={"/auth/login"}
        >
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        <FormField 
                            control={form.control}
                            name="password"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} {...field} placeholder="******" type="password" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                       
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                    >
                        Reset password
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}