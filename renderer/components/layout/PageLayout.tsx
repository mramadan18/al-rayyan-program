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
  const fullTitle = `الريّان - ${title}`;

  return (
    <div className={cn("min-h-screen", className)}>
      <Head>
        <title>{fullTitle}</title>
      </Head>

      <main
        className={cn("container mx-auto p-6 max-w-5xl", containerClassName)}
      >
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
