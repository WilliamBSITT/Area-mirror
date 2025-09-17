import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-[#EFFF] shadow-md">
      <div className="flex items-center">
        <Link href="/">
          <img src="/logo.png" alt="Logo" className="h-50 w-50" />
        </Link>
        <Link href="/dashboard">
            <p className="ml-20 font-semibold hover:underline text-3xl">Dashboard</p>
        </Link>
        <Link href="/services">
            <p className="ml-20 font-semibold hover:underline text-3xl">Services</p>
        </Link>
        <Link href="/abouts">
            <p className="ml-20 font-semibold hover:underline text-3xl">Services</p>
        </Link>
      </div>
    </nav>
  );
}
