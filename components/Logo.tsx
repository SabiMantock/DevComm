import Image from "next/image";
import Link from "next/link";

const Logo = () => {
    return (
        <Link href="/" className="logo">
            <Image src="/icons/logo.png" alt="DevComm Logo" width={24} height={24} />
            <p>DevComm</p>
        </Link>
    )
}

export default Logo
