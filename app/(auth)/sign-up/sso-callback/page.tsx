import { AuthenticateWithRedirectCallback } from "@clerk/nextjs"

export default function SignUpSSOCallback() {
  return <AuthenticateWithRedirectCallback />
}
