import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-[#EFFF] shadow-md">
      <div className="flex items-center">
        <Link href="/">
          <img src="/logo_crop.png" alt="Logo" className="h-28 w-70" />
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
      <div>
        <Link href="/login">
            <button className="bg-[#483f94] text-white px-8 py-2 rounded-full hover:bg-[#362d6f] transition-colors text-xl">
            Login
            </button>
        </Link>
        <Link href="/signup" className="ml-4">
          <button className="bg-[#483f94] text-white px-8 py-2 rounded-full hover:bg-[#362d6f] transition-colors text-xl">
            Sign Up
          </button>
        </Link>
      </div>
    </nav>
  );
}
