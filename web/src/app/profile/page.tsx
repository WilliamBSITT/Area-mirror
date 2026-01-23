"use client"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Avatar from "@/components/avatar";
import { toast } from "sonner";
import { useUser } from "@/hooks/user/useUser";
import { useDeleteUser } from "@/hooks/user/useDeleteUser";
import { usePutUser } from "@/hooks/user/useUpdateUser";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { useLogout } from "@/hooks/auth/useLogout";
import * as React from "react";
import { Switch } from "@/components/ui/switch";

export default function Page() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [emailEdit, setEmailEdit] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordEdit, setPasswordEdit] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const { logout, loading: loggingOut } = useLogout();

    const fetchUser = useUser();
    const deleteUser = useDeleteUser();
    const { putUser, loading: updating } = usePutUser();
    const router = useRouter();
    const [colorblindMode, setColorblindMode] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setIsLoading(true);
                const userData = await fetchUser();
                setUser(userData);
                setNewEmail(userData.email);
            } catch (error) {
                toast.error("Unable to load profile");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserProfile();
    }, [fetchUser]);

    // Enable or disable colorblind theme on the entire site
    useEffect(() => {
        const root = document.documentElement;
        if (colorblindMode) {
            root.classList.add("colorblind");
        } else {
            root.classList.remove("colorblind");
        }
    }, [colorblindMode]);

    const modifPwd = async () => {
        if (!newPassword || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        const tid = toast.loading("Changing password...");
        try {
            await putUser({ password: newPassword });
            toast.success("Password changed!", { id: tid });
            setPasswordEdit(false);
            setPassword("");
            setNewPassword("");
        } catch (error) {
            toast.error("Failed to change password", { id: tid });
        }
    };

    const modifEmail = async () => {
        if (!newEmail) {
            toast.error("Please enter an email");
            return;
        }

        const tid = toast.loading("Changing email...");
        try {
            const updatedUser = await putUser({ email: newEmail });
            setUser(updatedUser);
            toast.success("Email changed!", { id: tid });
            setEmailEdit(false);
        } catch (error) {
            toast.error("Failed to change email", { id: tid });
        }
    };

    const handleImageUpload = async (file: File) => {
        const tid = toast.loading("Uploading image...");
        try {
            const updatedUser = await putUser({}, file);
            setUser(updatedUser);
            toast.success("Image uploaded!", { id: tid });
        } catch (error) {
            toast.error("Failed to upload image", { id: tid });
        }
    };

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
    };

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
                <Avatar
                    currentImage={user.pictures}
                    onUpload={handleImageUpload}
                    isLoading={updating}
                />

                <div className="w-full mt-5">
                    <p className="mb-3 font-bold text-center">Email</p>
                    <div className="flex justify-between items-center gap-4">
                        {emailEdit ? (
                            <Input
                                placeholder="enter your email"
                                value={newEmail}
                                className="flex-1"
                                onChange={(e) => setNewEmail(e.target.value)}
                            />
                        ) : (
                            <p className="flex-1">{user.email}</p>
                        )}
                        <Button
                            className="hover:cursor-pointer"
                            onClick={() => {
                                if (emailEdit) {
                                    modifEmail();
                                } else {
                                    setEmailEdit(true);
                                }
                            }}
                            disabled={updating}
                        >
                            {emailEdit ? "Save" : "Edit"}
                        </Button>
                    </div>
                </div>

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
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    type="password"
                                />
                            </div>
                        ) : (
                            <p className="flex-1">*************</p>
                        )}
                        <Button
                            className="hover:cursor-pointer"
                            onClick={() => {
                                if (passwordEdit) {
                                    modifPwd();
                                } else {
                                    setPasswordEdit(true);
                                }
                            }}
                            disabled={updating}
                        >
                            {passwordEdit ? "Save" : "Edit"}
                        </Button>
                    </div>
                </div>

                <div className="w-full mt-8">
                    <div className="flex items-center justify-between gap-4">
                        <p className="font-bold">Colorblindness mode</p>
                        <Switch
                            checked={colorblindMode}
                            onCheckedChange={setColorblindMode}
                            aria-label="Enable or disable color blindness mode"
                        />
                    </div>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            className="mt-8 bg-red-500 hover:bg-red-600"
                        >
                            Delete Account
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account and remove all your data from our servers.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button
                                onClick={handleDeleteAccount}
                                className="bg-red-500 hover:bg-red-600"
                            >
                                Delete Account
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
