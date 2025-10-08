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

import Image from 'next/image'
import LogoTriggerHub from "@/../public/logo_trigger_hub.png"

import { useLogout } from "@/hooks/auth/useLogout"
import { useAuthLoading, useIsAuthenticated } from "@/hooks/auth/useAuth"

export function Navbar() {
    const loading = useAuthLoading()
    const isLoggedIn = useIsAuthenticated()
    const { logout, loading: loggingOut } = useLogout()

    return (
        <nav className="p-2 bg-cyan-50">
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
                                    />
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link href="/workflows">
                                    Workflows
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link href="/services">
                                    Services
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link href="/about">
                                    About
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                <div className="flex items-center gap-2">
                    {loading ? (
                        <div className="h-9 w-32 rounded-md bg-gray-200 animate-pulse" />
                    ) : isLoggedIn ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-9 px-2 gap-2" aria-label="User menu">
                                    <Avatar className="h-6 w-6">
                                        {/* Pas d'avatar connu → image vide + fallback */}
                                        <AvatarImage src={undefined} alt="User" />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                    <span className="hidden sm:inline">Account</span>
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
        </nav>
    )
}
