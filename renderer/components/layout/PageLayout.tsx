import Head from "next/head";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  className?: string;
  containerClassName?: string;
  showTitle?: boolean;
}

export function PageLayout({
  children,
  title,
  className,
  containerClassName,
  showTitle = true,
}: PageLayoutProps) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  const fullTitle = `${appName} - ${title}`;

  return (
    <div className={cn(className)}>
      <Head>
        <title>{fullTitle}</title>
      </Head>

      <main className={cn(" mx-auto p-6", containerClassName)}>
        {showTitle && (
          <h1 className="text-3xl font-bold font-quran mb-8 border-b pb-4">
            {title}
          </h1>
        )}
        {children}
      </main>
    </div>
  );
}
