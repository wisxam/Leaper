"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import { useEffect } from "react";
import { Heart, Loader2 } from "lucide-react";

// Sync the logged in user with the database (for the first time only)

const Page = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const origin = searchParams.get("origin");

  const { data, isLoading, error } = trpc.authCallback.useQuery(undefined, {
    retry: true, // If any error just send the request again until the route returns something successful
    retryDelay: 500, // Every half second just check if the user is synced to the db
  });

  useEffect(() => {
    if (!isLoading && data?.success) {
      router.push(origin ? `/${origin}` : "/dashboard");
    }
  }, [data, isLoading, router, origin, error]);

  if (error?.data?.code === "UNAUTHORIZED") {
    router.push("/sign-in");
  }

  if (isLoading) {
    return (
      <div className="mt-24 w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
          <h3 className="text-xl font-semibold">Setting up your account...</h3>
          <p>
            You will be redirected automatically <Heart className="text-red" />
          </p>
        </div>
      </div>
    );
  }

  return <div className="w-full items-center justify-center">Redirecting</div>;
};

export default Page;
