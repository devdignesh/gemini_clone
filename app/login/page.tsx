"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCountries } from "@/hooks/useCountries";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Country } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";

const phoneSchema = z.object({
  countryCode: z.string().min(1, "Select code"),
  phone: z.string().min(10, "Invalid number"),
});

const otpSchema = z.object({
  otp: z.string().min(6, "Enter valid OTP"),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;
type OTPFormValues = z.infer<typeof otpSchema>;

export default function LoginPage() {
  const countries = useCountries();
  const setPhone = useAuthStore((s) => s.setPhone);
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();
  const [sendOTP, setSendOTP] = useState(false);

  const {
    register: registerPhone,
    handleSubmit: handlePhoneSubmit,
    formState: { errors: phoneErrors },
    control,
  } = useForm<PhoneFormValues>({ resolver: zodResolver(phoneSchema) });

  const onPhoneSubmit = (data: PhoneFormValues) => {
    setPhone(data.countryCode + data.phone);
    setSendOTP(true);
    toast.success("OTP sent!");
  };

  const {
    register: registerOTP,
    handleSubmit: handleOTPSubmit,
    formState: { errors: otpErrors },
  } = useForm<OTPFormValues>({ resolver: zodResolver(otpSchema) });

  const onOTPSubmit = () => {
    setTimeout(() => {
      setAuth(true);
      toast.success("Logged in!");
      router.push("/");
    }, 1000);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          {sendOTP
            ? "Enter the OTP sent to your number"
            : "Enter your number below to login"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!sendOTP ? (
          <form onSubmit={handlePhoneSubmit(onPhoneSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Country Code</Label>
                <Controller
                  control={control}
                  name="countryCode"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="min-w-full">
                        <SelectValue placeholder="Country Code" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((c: Country) => (
                          <SelectItem
                            value={`${c.code}`}
                            key={`${c.dialCode}-${c.name}`}
                          >
                            {c.flag} ({c.dialCode})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Number</Label>
                <Input
                  type="number"
                  {...registerPhone("phone")}
                  placeholder="Enter number"
                />
                {phoneErrors.phone && (
                  <p className="text-red-500 text-sm">
                    {phoneErrors.phone.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Send OTP
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleOTPSubmit(onOTPSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  {...registerOTP("otp")}
                />
                {otpErrors.otp && (
                  <p className="text-sm text-red-500">
                    {otpErrors.otp.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Button type="submit">Verify OTP</Button>
              </div>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
