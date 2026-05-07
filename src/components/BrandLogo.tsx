import Image from "next/image";
import logo from "../../public/kalyan-logo.png";
import { shopConfig } from "@/config/shop";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  size?: number;
  alt?: string;
  className?: string;
  priority?: boolean;
};

export function BrandLogo({
  size = 40,
  alt,
  className,
  priority = false,
}: BrandLogoProps) {
  return (
    <Image
      src={logo}
      alt={alt ?? `${shopConfig.name} logo`}
      width={size}
      height={size}
      priority={priority}
      className={cn("object-contain", className)}
    />
  );
}

