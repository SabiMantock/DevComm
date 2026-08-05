"use client";

import Link from "next/link";

const AuthButtons = () => {
    return (
        <div className="auth-buttons flex gap-2">
            <Link href="/login" className="login-button">
                Login
            </Link>
            <Link href="/signup" className="signup-button">
                Sign Up
            </Link>
        </div>
    )
}

export default AuthButtons
