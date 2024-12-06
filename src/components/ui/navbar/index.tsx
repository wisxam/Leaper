import MaxWidthWrapper from "@/components/maxWidthWrapper";
import Link from "next/link";
import { buttonVariants } from "../button";
import {
  LoginLink,
  RegisterLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";

const Navabr = () => {
  return (
    <nav className="sticky inset-x-0 top-0 z-30 h-14 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link className="z-40 flex font-semibold" href="/">
            <span>Leaper</span>
          </Link>
          <div className="hidden items-center space-x-4 sm:flex">
            <>
              <Link
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
                href="/pricing"
              >
                Pricing
              </Link>
              <LoginLink
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Log In
              </LoginLink>
              <RegisterLink
                className={`group ${buttonVariants({
                  size: "sm",
                })}`}
              >
                Get Started
                <ArrowRight className="ml-1 h-5 w-5 duration-300 ease-in-out group-hover:translate-x-1" />
              </RegisterLink>
              <LogoutLink
                className={`group ${buttonVariants({
                  size: "sm",
                })}`}
              >
                Logout
                <ArrowRight className="ml-1 h-5 w-5 duration-300 ease-in-out group-hover:translate-x-1" />
              </LogoutLink>
            </>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navabr;
