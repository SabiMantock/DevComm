"use client";

import Button from "@/components/Button";

const AuthButtons = () => {
    return (
        <div className="auth-buttons flex gap-2">
            <Button href="/login" variant="ghost">
                Login
            </Button>
            <Button href="/signup">
                Sign Up
            </Button>
        </div>
    )
}

export default AuthButtons
