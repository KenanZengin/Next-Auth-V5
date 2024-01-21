
"use client"
import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";

const SettingsPage =  () => {
  const user = useCurrentUser();

  return (
    <div>
        {JSON.stringify(user)}
        <br />
        <button type="submit" onClick={() => logout()}>Sign Out</button>
        
    </div>
  )
}

export default SettingsPage