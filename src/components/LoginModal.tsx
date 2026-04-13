"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { MessageCircle, Mail, Lock, User, Phone } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onLogin,
}: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = new FormData(e.currentTarget);

    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (res?.ok) {
      onLogin?.();
      onClose();
      router.push("/Dashboard"); // ✅ هنا التعديل
    } else {
      alert("بيانات الدخول غلط أو المستخدم غير موجود");
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = new FormData(e.currentTarget);

    const name = form.get("name") as string;
    const email = form.get("reg-email") as string;
    const phone = form.get("phone") as string;
    const password = form.get("reg-password") as string;

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error");
      }

      alert("تم إنشاء الحساب بنجاح 🎉");

      // رجّع المستخدم لتسجيل الدخول
      const loginTab = document.querySelector(
        '[data-value="login"]'
      ) as HTMLElement;

      loginTab?.click();
    } catch (err: any) {
      alert(err.message);
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>

          <DialogTitle className="text-2xl font-bold">
            مرحباً بك في <span className="text-green-500">واتس برو</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
            <TabsTrigger value="register">إنشاء حساب</TabsTrigger>
          </TabsList>

          {/* LOGIN */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>البريد الإلكتروني</Label>
                <Input name="email" type="email" required />
              </div>

              <div className="space-y-2">
                <Label>كلمة المرور</Label>
                <Input name="password" type="password" required />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-500 text-white"
              >
                {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </form>
          </TabsContent>

          {/* REGISTER */}
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4 mt-4">
              <Input name="name" placeholder="الاسم" required />
              <Input name="reg-email" placeholder="الإيميل" required />
              <Input name="phone" placeholder="رقم الهاتف" required />
              <Input name="reg-password" type="password" placeholder="كلمة المرور" required />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-500 text-white"
              >
                {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}