'use client'

import Link from 'next/link'
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import Image from 'next/image'
import LogoTriggerHub from "@/../public/logo_trigger_hub.png"

import { useLogout } from "@/hooks/auth/useLogout"
import { useAuthLoading, useIsAuthenticated } from "@/hooks/auth/useAuth"
import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'

import { Switch } from './ui/switch'
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

export function Navbar() {
    const loading = useAuthLoading()
    const isLoggedIn = useIsAuthenticated()
    const { logout, loading: loggingOut } = useLogout()
    const [darkTheme, setDarkTheme] = useState<boolean>(false);

    useEffect(() => {
        if (darkTheme) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [darkTheme])

    //classname
    const commonClassName = "lg:text-md xl:text-2xl"

    return (
        <nav className="p-2">
            <div className="flex justify-between items-center">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link href="/">
                                    <Image
                                        src={LogoTriggerHub}
                                        alt="LogoTriggerHub"
                                        width={100}
                                        priority
                                        className='lg:h-6 xl:h-10 lg:w-30 xl:w-40 object-contain'
                                    />
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem className="hidden md:flex">
                            <NavigationMenuLink asChild>
                                <Link href="/workflows" className={commonClassName}>
                                    Workflows
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem className="hidden md:flex">
                            <NavigationMenuLink asChild>
                                <Link href="/services" className={commonClassName}>
                                    Services
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem className="hidden md:flex">
                            <NavigationMenuLink asChild>
                                <Link href="/templates" className={commonClassName}>
                                    Templates
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem className="hidden md:flex">
                            <NavigationMenuLink asChild>
                                <Link href="/about" className={commonClassName}>
                                    About
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                <div className="hidden md:flex flex items-center gap-2">
                    <Button asChild>
                        <Link href="/download">Download</Link>
                    </Button>
                    <Switch defaultChecked={darkTheme} onCheckedChange={setDarkTheme} />
                    {loading ? (
                        <div className="h-9 w-32 rounded-md bg-gray-200 animate-pulse" />
                    ) : isLoggedIn ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="h-9 px-2 gap-2 bg-secondary-foreground" aria-label="User menu">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={undefined} alt="User" />
                                        <AvatarFallback className='bg-primary'>U</AvatarFallback>
                                    </Avatar>
                                    <span className="hidden lg:inline">Account</span>
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel className="text-xs">Signed in</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild><Link href="/profile">Profile</Link></DropdownMenuItem>
                                <DropdownMenuItem asChild><Link href="/settings">Settings</Link></DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout} disabled={loggingOut}>
                                    {loggingOut ? "Logging out..." : "Log out"}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button asChild className="bg-indigo-800 text-white">
                            <Link href="/login">Login</Link>
                        </Button>
                    )}
                </div>

                <Sheet>
                    <SheetTrigger aria-label="Ouvrir le menu" className="inline-flex h-9 w-9 items-center justify-center rounded-md md:hidden hover:bg-[#F8CACF] focus-visible:outline-none">
                        <Menu className="h-5 w-5" />
                    </SheetTrigger>
                    <SheetContent side="left">
                        <VisuallyHidden>
                            <SheetTitle>Menu</SheetTitle>
                        </VisuallyHidden>
                        <div className="p-4">
                            <div className="flex items-center gap-2">
                                <Link href="/">
                                    <Image
                                        src={LogoTriggerHub}
                                        alt="LogoTriggerHub"
                                        width={100}
                                        priority
                                        className='lg:h-6 xl:h-10 lg:w-30 xl:w-40 object-contain'
                                    />
                                </Link>
                            </div>

                            <nav className="px-3 py-2 rounded-lg mt-4 grid gap-1">
                                <Link href="/workflows" className={commonClassName}>
                                    Workflows
                                </Link>
                                <Link href="/services" className={commonClassName}>
                                    Services
                                </Link>
                                <Link href="/about" className={commonClassName}>
                                    About
                                </Link>
                                <br/>
                                <Button asChild>
                                    <Link href="/download">Download</Link>
                                </Button>
                                <br/>
                                <Switch defaultChecked={darkTheme} onCheckedChange={setDarkTheme} />
                            </nav>

                            <div className="mt-5 border-t border-black/10 pt-4">
                                {loading ? (
                                    <div className="h-9 w-32 rounded-md bg-gray-200 animate-pulse" />
                                ) : isLoggedIn ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button className="h-9 px-2 gap-2 bg-secondary-foreground" aria-label="User menu">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={undefined} alt="User" />
                                                    <AvatarFallback className='bg-primary'>U</AvatarFallback>
                                                </Avatar>
                                                <span className="hidden lg:inline">Account</span>
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end" className="w-56">
                                            <DropdownMenuLabel className="text-xs">Signed in</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild><Link href="/profile">Profile</Link></DropdownMenuItem>
                                            <DropdownMenuItem asChild><Link href="/settings">Settings</Link></DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={logout} disabled={loggingOut}>
                                                {loggingOut ? "Logging out..." : "Log out"}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <Button asChild className="bg-indigo-800 text-white">
                                        <Link href="/login">Login</Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    )
}
