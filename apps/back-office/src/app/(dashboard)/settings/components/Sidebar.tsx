"use client";

import type React from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@mcw/utils";
import { Accordion } from "@mcw/ui";

interface SidebarProps {
  mobile?: boolean;
}

interface NavigationItem {
  label: string;
  href: string;
  description: string;
  children?: NavigationItem[];
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

const OPERATIONS_ITEMS: NavigationSection = {
  title: "OPERATIONS",
  items: [
    {
      label: "Profile",
      href: "/settings/profile",
      description: "Manage your profile settings",
    },
    {
      label: "Practice",
      href: "/settings/practice",
      description: "Practice management settings",
    },
    {
      label: "Team",
      href: "/settings/team",
      description: "Team management settings",
    },
  ],
};

const BILLING_ITEMS: NavigationSection = {
  title: "BILLING",
  items: [
    {
      label: "Client billing and insurance",
      href: "/billing/client",
      description: "Manage client billing",
    },
    {
      label: "Payment processing",
      href: "/billing/payment",
      description: "Payment settings",
    },
    {
      label: "Services and products",
      href: "/settings/services-products",
      description: "Manage services and products",
      children: [
        {
          label: "Services",
          href: "/settings/services",
          description: "Manage services and set rates",
        },
        {
          label: "Products",
          href: "/settings/products",
          description: "Manage products and inventory",
        },
      ],
    },
  ],
};

const CLIENT_CARE_ITEMS: NavigationSection = {
  title: "CLIENT CARE",
  items: [
    {
      label: "Scheduling and inquiries",
      href: "/settings/scheduling",
      description: "Manage scheduling",
    },
    {
      label: "Documentation",
      href: "/settings/documentation",
      description: "Documentation settings",
    },
    {
      label: "Client notifications",
      href: "/settings/notifications",
      description: "Notification settings",
    },
    {
      label: "Messaging",
      href: "/settings/messaging",
      description: "Messaging settings",
    },
  ],
};

function NavigationSection({
  title,
  items,
  currentPath,
  onNavigate,
}: {
  title: string;
  items: NavigationItem[];
  currentPath: string;
  onNavigate: (href: string) => void;
}) {
  return (
    <div>
      <div>
        <p className="text-sm font-bold text-[#2D8467] text-14px leading-[14px]">
          {title}
        </p>
      </div>
      <Accordion
        items={items.map((item) => ({
          title: item.label,
          content: item.description,
          value: item.href,
          children: item.children,
          onClick: () => onNavigate(item.href),
          className: cn(
            "cursor-pointer px-2 py-1 rounded hover:bg-gray-100",
            currentPath === item.href && "bg-[#E0F2F1]",
          ),
        }))}
      />
    </div>
  );
}

export default function Sidebar({ mobile = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  return (
    <div
      className={cn(
        "w-[230px] min-w-[320px] bg-white border-r border-[#e5e7eb] p-3",
        !mobile && "hidden md:block",
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <nav className="py-2 flex flex-col gap-5">
        <NavigationSection
          title={OPERATIONS_ITEMS.title}
          items={OPERATIONS_ITEMS.items}
          currentPath={pathname}
          onNavigate={handleNavigate}
        />
        <NavigationSection
          title={BILLING_ITEMS.title}
          items={BILLING_ITEMS.items}
          currentPath={pathname}
          onNavigate={handleNavigate}
        />
        <NavigationSection
          title={CLIENT_CARE_ITEMS.title}
          items={CLIENT_CARE_ITEMS.items}
          currentPath={pathname}
          onNavigate={handleNavigate}
        />
      </nav>
    </div>
  );
}
