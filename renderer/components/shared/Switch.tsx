import { cn } from "@/lib/utils";

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
}

export function Switch({
  id,
  className,
  defaultChecked,
  ...props
}: SwitchProps) {
  return (
    <div className={cn("flex items-center space-x-2 dir-ltr", className)}>
      <input
        type="checkbox"
        id={id}
        defaultChecked={defaultChecked}
        className="peer sr-only"
        {...props}
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
