import React from "react";
import Head from "next/head";
import {
  Monitor,
  Bell,
  MapPin,
  Globe,
  Moon,
  Volume2,
  Shield,
  Sun,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Simple toggle component since Shadcn Switch isn't installed yet, or we simulate it
function Switch({
  id,
  defaultChecked = false,
}: {
  id: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-center space-x-2 dir-ltr">
      <input
        type="checkbox"
        id={id}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <label
        htmlFor={id}
        className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background bg-input peer-checked:bg-primary"
      >
        <span className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200 ease-in-out translate-x-0 peer-checked:translate-x-5" />
      </label>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <React.Fragment>
      <Head>
        <title>الريّان - الإعدادات</title>
      </Head>

      <div className="container mx-auto p-6 max-w-4xl space-y-8">
        <h1 className="text-3xl font-bold font-quran mb-6 border-b pb-4">
          الإعدادات
        </h1>

        <div className="grid gap-6">
          {/* General / Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                الموقع والتوقيت
              </CardTitle>
              <CardDescription>
                إعدادات الموقع الجغرافي لحساب مواقيت الصلاة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>تحديد الموقع تلقائياً</Label>
                  <p className="text-xs text-muted-foreground">
                    استخدام GPS لتحديد المدينة الحالية
                  </p>
                </div>
                <Switch id="auto-loc" defaultChecked />
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>طريقة الحساب</Label>
                  <select className="w-full p-2 rounded-md border bg-background text-sm">
                    <option>الهيئة المصرية العامة للمساحة</option>
                    <option>أم القرى - مكة المكرمة</option>
                    <option>رابطة العالم الإسلامي</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>المذهب الفقهي (العصر)</Label>
                  <select className="w-full p-2 rounded-md border bg-background text-sm">
                    <option>الجمهور (شافعي، مالكي، حنبلي)</option>
                    <option>الحنفي</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                التنبيهات والأذان
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: "تنبيهات الصلوات",
                  sub: "إشعار عند دخول وقت الصلاة",
                  id: "notif-prayers",
                },
                {
                  label: "صوت الأذان",
                  sub: "تشغيل الأذان كاملاً",
                  id: "adhan-sound",
                },
                {
                  label: "أذكار الصباح والمساء",
                  sub: "تذكير يومي",
                  id: "notif-azkar",
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <Label htmlFor={item.id}>{item.label}</Label>
                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                  </div>
                  <Switch id={item.id} defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-primary" />
                المظهر
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2 border-primary bg-primary/5"
              >
                <Sun className="w-6 h-6" />
                <span>فاتح</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2">
                <Moon className="w-6 h-6" />
                <span>داكن</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2">
                <Monitor className="w-6 h-6" />
                <span>النظام</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
}
