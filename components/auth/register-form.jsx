"use client"
import * as z from "zod"
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
import { RegisterSchema } from "@/schema"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"
import { register } from "@/actions/register"


export const RegisterForm = () => {

    const [isPending,startTransition] = useTransition()
    const [error,setError] = useState("")
    const [success,setSuccess] = useState("")

    const form = useForm({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email:"",
            password:"",
            name:"",
        },
    });

    const onSubmit = (values) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            register(values)
                .then((data) => {
                    setError(data.error);
                    setSuccess(data.success);
                });
        });
    }

    return(
        <CardWrapper 
            headerLabel={"Create an account"}
            backButtonLabel={"Already have an account"}
            backButtonHref={"/auth/login"}
            showSocial
        >
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                    <FormField 
                            control={form.control}
                            name="name"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} {...field} placeholder="Kenan" type="text" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="email"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} {...field} placeholder="Test@test.com" type="email" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                        Create an account
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}