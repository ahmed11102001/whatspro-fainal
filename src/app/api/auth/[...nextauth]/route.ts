import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  // ربط NextAuth مع قاعدة بيانات Neon عبر Prisma
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 1. التأكد أن المستخدم أدخل البيانات
        if (!credentials?.email || !credentials?.password) {
          throw new Error("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
        }

        // 2. البحث عن المستخدم في الداتابيز
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // 3. لو المستخدم مش موجود
        if (!user || !user.password) {
          throw new Error("المستخدم غير موجود");
        }

        // 4. التحقق من صحة كلمة المرور المشفرة
        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("كلمة المرور غير صحيحة");
        }

        // 5. لو كله تمام، رجّع بيانات المستخدم للجلسة (Session)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  // استخدام JSON Web Tokens لتخزين الجلسة
  session: {
    strategy: "jwt",
  },

  // تحديد صفحة اللوجن الخاصة بنا
  pages: {
    signIn: "/", // أو "/login" حسب مسار صفحتك
  },

  // الكود السري للتشفير (الموجود في .env)
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };