"use client";
import { useForm } from "react-hook-form"; 
import { z } from "zod";
import { useCountries } from "@/hooks/useCountries";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation"; 
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { zodResolver } from "@hookform/resolvers/zod";

const phoneSchema = z.object({
  countryCode: z.string().min(1, "Select code"),
  phone: z.string().min(5, "Invalid number"),
});

type FormValues = z.infer<typeof phoneSchema>;

export default function LoginPage() {
  const countries = useCountries();
  const setPhone = useAuthStore((s) => s.setPhone);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(phoneSchema) });

  const onSubmit = (data: FormValues) => {
    setPhone(data.countryCode + data.phone);
    router.push("/login/verify");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-4 space-y-4"
    >
      <select
        {...register("countryCode")}
        className="w-full border p-2 rounded"
      >
        <option value="">Select Country Code</option>
        {countries.map((c: any) => (
          <option key={c.code} value={c.dialCode}>
            {c.flag} {c.name} ({c.dialCode})
          </option>
        ))}
      </select>
      <Input label="Phone Number" {...register("phone")} />
      {errors.phone && (
        <p className="text-red-500 text-sm">{errors.phone.message}</p>
      )}
      <Button type="submit">Send OTP</Button>
    </form>
  );
}
