"use client";

import { useRouter } from "next/navigation";
import {
  UserButton,
  OrganizationSwitcher,
  useOrganization,
} from "@clerk/nextjs";
import Link from "next/link";
import { memo } from "react";
import {CreditCard} from "lucide-react";

const Navbar = () => {
  const router = useRouter();
  const { organization } = useOrganization(); // ✅ get active org

  const handleDashboardClick = () => {
    if (organization) {
      router.push(`/dashboard`);
    } else {
      alert("No organization selected.");
    }
  };

  return (
    <nav className="w-full h-16 flex items-center justify-between px-6 border-b bg-white shadow-sm dark:bg-gray-900 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-lg font-semibold text-gray-800 dark:text-white"
        >
          MyApp
        </Link>

        <OrganizationSwitcher
          appearance={{
            elements: {
              rootBox: "border border-gray-200 rounded-md px-2 py-1",
            },
          }}
          createOrganizationUrl="/org/create"
          hidePersonal
        />
      </div>

      <div className="flex items-center gap-4">
        <button
            onClick={handleDashboardClick}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-4 py-2 rounded-md transition cursor-pointer"
        >
          Dashboard
        </button>
        <button
            onClick={() => router.push("/reveal-key")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-md transition cursor-pointer"
        >
          Reveal Key
        </button>
        <button
            onClick={() => router.push("/settings")}
            className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition cursor-pointer"
        >
          <CreditCard className="w-4 h-4"/>
            Payment Methods
        </button>
        <UserButton afterSignOutUrl="/sign-in"/>
      </div>
    </nav>
  );
};

export default memo(Navbar);
