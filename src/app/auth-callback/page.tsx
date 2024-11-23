"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import { useEffect } from "react";

// Sync the logged in user with the database (for the first time only)

const Page = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const origin = searchParams.get("origin");

  const { data, isLoading } = trpc.authCallback.useQuery(undefined);

  useEffect(() => {
    if (!isLoading && data?.success) {
      router.push(origin ? `/${origin}` : "/dashboard");
    }
  }, [data, isLoading, router, origin]);

  if (isLoading) {
    return <div>Loading...</div>;
  }



  return <div>{data?.success}</div>;
};

export default Page;
