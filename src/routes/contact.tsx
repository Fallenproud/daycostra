import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, CheckCircle2, CircleAlert, Mail } from "lucide-react";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact Daycostra" },
      { name: "description", content: "Request platform access or talk to the Daycostra team." },
    ],
  }),
});

const schema = z.object({
  name: z.string().min(2, "Enter your name."),
  email: z.string().email("Enter a valid email address."),
  organization: z.string().min(2, "Enter your organization."),
  role: z.string().min(2, "Enter your role."),
  useCase: z.string().min(20, "Tell us a little more about what you want to evaluate."),
});

type FormValues = z.infer<typeof schema>;
type SubmitState = "idle" | "submitting" | "success" | "error" | "unconfigured";

function ContactPage() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    if (!endpoint) {
      setSubmitState("unconfigured");
      setServerMessage("The request-access submission endpoint is not configured in this preview yet. Your details were validated locally but were not sent anywhere.");
      return;
    }

    setSubmitState("submitting");
    setServerMessage("");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error(`Request failed with ${response.status}`);
      setSubmitState("success");
      setServerMessage("Your request was delivered successfully.");
      reset();
    } catch (error) {
      setSubmitState("error");
      setServerMessage(error instanceof Error ? error.message : "The request could not be delivered.");
    }
  };

  return (
    <main className="dc-page">
      <section className="dc-route-hero dc-route-hero--detail">
        <div className="dc-shell dc-contact-hero">
          <div>
            <div className="dc-kicker">Request Platform Access</div>
            <h1>Start with the operating problem.</h1>
            <p>Tell us what you need to detect, understand or coordinate. We will keep the conversation grounded in the platform capabilities that actually exist.</p>
            <div className="dc-contact-notes">
              <span><CheckCircle2 size={16} /> No pricing commitment required</span>
              <span><CheckCircle2 size={16} /> Human evaluation path</span>
              <span><CheckCircle2 size={16} /> No fabricated “instant approval” flow</span>
            </div>
          </div>

          <form className="dc-contact-form dc-glass dc-elev-7" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="dc-form-grid">
              <label>
                <span>Name</span>
                <input autoComplete="name" {...register("name")} aria-invalid={Boolean(errors.name)} />
                {errors.name && <small role="alert">{errors.name.message}</small>}
              </label>
              <label>
                <span>Work email</span>
                <input type="email" autoComplete="email" {...register("email")} aria-invalid={Boolean(errors.email)} />
                {errors.email && <small role="alert">{errors.email.message}</small>}
              </label>
              <label>
                <span>Organization</span>
                <input autoComplete="organization" {...register("organization")} aria-invalid={Boolean(errors.organization)} />
                {errors.organization && <small role="alert">{errors.organization.message}</small>}
              </label>
              <label>
                <span>Role</span>
                <input autoComplete="organization-title" {...register("role")} aria-invalid={Boolean(errors.role)} />
                {errors.role && <small role="alert">{errors.role.message}</small>}
              </label>
            </div>
            <label>
              <span>What do you want to evaluate?</span>
              <textarea rows={6} {...register("useCase")} aria-invalid={Boolean(errors.useCase)} />
              {errors.useCase && <small role="alert">{errors.useCase.message}</small>}
            </label>

            <button className="dc-button dc-button--primary dc-contact-submit" type="submit" disabled={submitState === "submitting"}>
              {submitState === "submitting" ? "Sending…" : "Request Access"} <ArrowRight size={16} />
            </button>

            {submitState !== "idle" && submitState !== "submitting" && (
              <div className={`dc-form-status dc-form-status--${submitState}`} role="status" aria-live="polite">
                {submitState === "success" ? <CheckCircle2 size={18} /> : submitState === "unconfigured" ? <CircleAlert size={18} /> : <Mail size={18} />}
                <span>{serverMessage}</span>
              </div>
            )}
          </form>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
