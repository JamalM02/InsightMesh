'use client';

import Breadcrumbs from "@/components/breadcrumbs";
import { cn } from "@/lib/utils";
import {usePathname} from "next/navigation";

export default function Page() {
    const pathname = usePathname();

    return (
        <>
            <Breadcrumbs
                items={[
                    { title: "Main", url: "" },
                    { title: "Home", url: "/dashboard" },
                ]}
            />
            <h1 className={cn("text-white")}>Dashboard Page</h1>
            <iframe
                key={pathname}
                className="px-5 py-10 h-full"
                src={process.env.NEXT_PUBLIC_METABASE_DASHBOARD_URL}
                frameBorder="0"
                allowFullScreen
                loading="lazy"
            />
        </>
    );
}
