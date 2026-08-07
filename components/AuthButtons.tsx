"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Button from "@/components/Button";

const AuthButtons = () => {
    return (
        <div className="auth-buttons flex gap-2">
            <Show when="signed-out">
                <SignInButton>
                    <Button variant="ghost">Login</Button>
                </SignInButton>
                <SignUpButton>
                    <Button>Sign Up</Button>
                </SignUpButton>
            </Show>
            <Show when="signed-in">
                <UserButton />
            </Show>
        </div>
    )
}

export default AuthButtons
