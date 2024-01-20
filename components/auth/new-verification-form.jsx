"use client"

import { newVerification } from "@/actions/new-verification"
import { CardWrapper } from "./card-wrapper"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import {BeatLoader} from "react-spinners"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"

const NewVerificationForm = () => {
    
  const searchParams = useSearchParams();
  
  const [error,setError] = useState("");
  const [success,setSuccess] = useState("");

  const token = searchParams.get("token");

  const onSubmit = useCallback(()=>{


    if (!token){
        setError("missing token");
        return;
    };

    newVerification(token)
        .then((data)=>{
            setSuccess(data.success);
            setError(data.error)
        })
        .catch(()=>{
            setError("Something went wrong");
        })
  },[token])

  useEffect(()=>{
    onSubmit();
  },[onSubmit])

  return (
    <CardWrapper
        headerLabel={"Confirming Verification"}
        backButtonHref={"/auth/login"}
        backButtonLabel={"Back to Login"}    
    >
        <div className="flex items-center w-full justify-center">
            {!success && !error && (<BeatLoader />)}
            <FormSuccess message={success}/>
            {!success && (<FormError message={error}/>)}
        </div>
    </CardWrapper>
  )
}

export default NewVerificationForm