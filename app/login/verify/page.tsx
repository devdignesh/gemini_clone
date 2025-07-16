'use client';

import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation"; 
import { useForm } from "react-hook-form";
import { Button } from "@/components/Button";

export default function VerifyPage() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ otp: string }>();

  useEffect(() => {
    setTimeout(() => {
      toast.success("OTP sent!");
    }, 1000);
  }, []);

  const onSubmit = () => {
    setTimeout(() => {
      setAuth(true);
      toast.success("Logged in!");
      router.push("/");
    }, 1000);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-4 space-y-4"
    >
      <p className="mb-2">Enter the OTP sent to your number:</p>
      <input
        type="text"
        placeholder="Enter OTP"
        className="border w-full p-2 rounded"
        {...register("otp", { required: "OTP is required" })}
      />
      {errors.otp && (
        <p className="text-sm text-red-500">{errors.otp.message}</p>
      )}
      <Button type="submit">Verify OTP</Button>
    </form>
  );
}
