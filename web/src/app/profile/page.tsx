"use client"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Avatar from "@/components/Avatar";
import { toast } from "sonner";

export default function page() {
  const [email, setEmail] = useState("");
  const [emailEdit, setEmailEdit] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordEdit, setPasswordEdit] = useState(false);
  const [newPassword, setnewPassword] = useState("");

  useEffect(() => {
    const fetchUserProfile = () => {
      setEmail("e@epitech.eu");
    };
    fetchUserProfile();
  }, []);

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

  return (
    <div className="flex flex-col m-2">
      <h1 className="text-3xl m-5">Profile</h1>
      <Avatar />
      {/* Email Section */}
      <div>
        <p className="m-5 font-bold">Email</p>
        <div className="flex justify-between w-3/12 m-5">
          {emailEdit ? (
            <Input placeholder="enter your email" defaultValue={email} className="w-40" onChange={(e) => setEmail(e.target.value)}/>
          ) : (
            <div>
            <p>{email}</p>
            </div>
          )}
          <Button className="hover:cursor-pointer"
            onClick={() => {emailEdit ? modifEmail() : setEmailEdit(!emailEdit)}}
          >
            {emailEdit ? "Save" : "Edit"}
          </Button>
        </div>
      </div>
      {/* Password Section */}
      <div>
        <p className="m-5 font-bold">Password</p>
        <div className="flex justify-between w-3/12 m-5">
          {passwordEdit ? (
            <div className="flex flex-col gap-2">
              <Input placeholder="enter your current password" className="w-40" value={password} onChange={(e) => setPassword(e.target.value)} type="password"/>
              <Input placeholder="enter your new password" className="w-40" value={newPassword} onChange={(e) => setnewPassword(e.target.value)} type="password"/>
            </div>
          ) : (
            <div>
            <p>*************</p>
            </div>
          )}
          <Button className="hover:cursor-pointer"
            onClick={() => {passwordEdit ? modifPwd() : setPasswordEdit(!passwordEdit)}}
          >
            {passwordEdit ? "Save" : "Edit"}
          </Button>
        </div>
      </div>
    </div>
  )
}

