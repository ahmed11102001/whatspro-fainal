import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 

export async function GET() {
  try {
    // 1. جلب البيانات من Neon
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    // 2. تنسيق البيانات بنفس الشكل اللي صفحة التقارير مستنياه
    const formatted = campaigns.map((c) => ({
      id: c.id,
      name: c.name || "بدون اسم",
      status: c.status || "unknown",
      sentCount: c.sentCount ?? 0,
      deliveredCount: c.deliveredCount ?? 0,
      failedCount: c.failedCount ?? 0,
      createdAt: c.createdAt,
    }));

    // 3. الرد باستخدام NextResponse (طريقة الـ App Router)
    return NextResponse.json(formatted);
  } catch (error) {
    console.error("❌ Database Error:", error);
    return NextResponse.json(
      { error: "مشكلة في قراءة البيانات" }, 
      { status: 500 }
    );
  }
}