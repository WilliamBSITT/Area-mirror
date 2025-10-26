"use client"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Avatar from "@/components/Avatar";
import { toast } from "sonner";
import { useUser } from "@/hooks/user/useUser";
import { useDeleteUser } from "@/hooks/user/useDeleteUser";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { useLogout } from "@/hooks/auth/useLogout";

export default function page() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [emailEdit, setEmailEdit] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordEdit, setPasswordEdit] = useState(false);
    const [newPassword, setnewPassword] = useState("");
    const { logout, loading: loggingOut } = useLogout()

    const fetchUser = useUser();
    const deleteUser = useDeleteUser();
    const router = useRouter();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setIsLoading(true);
                const userData = await fetchUser();
                setUser(userData);
            } catch (error) {
                console.error("Erreur lors du chargement du profil:", error);
                toast.error("Impossible de charger le profil");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserProfile();
    }, [fetchUser]);

    const modifPwd = () => {
        const tid = toast.loading("Changing password...");
        setTimeout(() => {
            toast.success("Password changed!", { id: tid });
        }, 1000);
    }

    const modifEmail = () => {
        const tid = toast.loading("Changing email...");
        setTimeout(() => {
            toast.success("Email changed!", { id: tid });
        }, 1000);
    }

    const handleDeleteAccount = async () => {
        const tid = toast.loading("Deleting account...");
        try {
            await deleteUser();
            await logout();
            toast.success("Account deleted successfully!", { id: tid });
            router.push("/");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete account", { id: tid });
        }
    }

    if (isLoading) {
        return <div className="flex items-center justify-center m-5">Loading...</div>;
    }

    if (!user) {
        return <div className="flex items-center justify-center m-5">No user data</div>;
    }

    return (
        <div className="flex items-start justify-center min-h-screen pt-10">
            <div className="flex flex-col items-center w-full max-w-md">
                <h1 className="text-3xl mb-5">Profile</h1>
                <Avatar />

                {/* Email Section */}
                <div className="w-full mt-5">
                    <p className="mb-3 font-bold text-center">Email</p>
                    <div className="flex justify-between items-center gap-4">
                        {emailEdit ? (
                            <Input
                                placeholder="enter your email"
                                defaultValue={user.email}
                                className="flex-1"
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                            />
                        ) : (
                            <p className="flex-1">{user.email}</p>
                        )}
                        <Button
                            className="hover:cursor-pointer"
                            onClick={() => {emailEdit ? modifEmail() : setEmailEdit(!emailEdit)}}
                        >
                            {emailEdit ? "Save" : "Edit"}
                        </Button>
                    </div>
                </div>

                {/* Password Section */}
                <div className="w-full mt-5">
                    <p className="mb-3 font-bold text-center">Password</p>
                    <div className="flex justify-between items-start gap-4">
                        {passwordEdit ? (
                            <div className="flex flex-col gap-2 flex-1">
                                <Input
                                    placeholder="enter your current password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                />
                                <Input
                                    placeholder="enter your new password"
                                    value={newPassword}
                                    onChange={(e) => setnewPassword(e.target.value)}
                                    type="password"
                                />
                            </div>
                        ) : (
                            <p className="flex-1">*************</p>
                        )}
                        <Button
                            className="hover:cursor-pointer"
                            onClick={() => {passwordEdit ? modifPwd() : setPasswordEdit(!passwordEdit)}}
                        >
                            {passwordEdit ? "Save" : "Edit"}
                        </Button>
                    </div>
                </div>

                <Button
                    className="mt-8 bg-red-500 hover:bg-red-600"
                    onClick={handleDeleteAccount}
                >
                    Delete Account
                </Button>
            </div>
        </div>
    )
}
