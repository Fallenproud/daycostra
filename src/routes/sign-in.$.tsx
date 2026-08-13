import { SignIn } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-in/$")({
  component: SignInPage,
  head: () => ({
    meta: [{ title: "Sign in — Daycostra" }, { name: "robots", content: "noindex" }],
  }),
});

function SignInPage() {
  return (
    <main className="relative z-20 grid min-h-dvh place-items-center px-5 py-24">
      <div className="w-full max-w-md">
        <SignIn fallbackRedirectUrl="/ide" signUpUrl="/sign-up" />
      </div>
    </main>
  );
}
