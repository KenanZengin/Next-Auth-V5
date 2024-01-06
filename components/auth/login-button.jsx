"use client"
import { useRouter } from "next/navigation";

export const LoginButton = ({children,mode="redirect"}) => {

    const router = useRouter()

    const onClick = () => {
        router.push("/auth/login")
    }

    if(mode==="modal"){
        return(
            <span>
                TODO: Implement modal
            </span>
        )
    }

    return(
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    )
}