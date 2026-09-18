"use client";

import Image from "next/image";
import { useState } from "react";
import { DashboardIcon } from "@/components/dashboard/DashboardIcon";
import {
  BILLING_ASSETS,
  BILLING_COMPARISON,
  BILLING_CONFIG,
  BILLING_PLANS,
  type BillingCycle,
  type BillingPlan,
} from "@/components/dashboard/billingConfig";

function CheckMark({ included }: { included: boolean }) {
  return (
    <span
      className={
        included
          ? "grid size-5 shrink-0 place-items-center rounded-full bg-heather text-white"
          : "grid size-5 shrink-0 place-items-center rounded-full bg-ink/10 text-ink/35"
      }
      aria-hidden="true"
    >
      {included ? <DashboardIcon name="check" className="size-3" /> : <span className="text-xs">×</span>}
    </span>
  );
}

function planPrice(plan: BillingPlan, cycle: BillingCycle) {
  if (plan.id === "free") {
    return { amount: "€0", suffix: "forever", detail: null };
  }

  return cycle === "monthly"
    ? {
        amount: "€" + plan.monthlyPrice,
        suffix: "month",
        detail: "€" + plan.yearlyPrice + " / year",
      }
    : {
        amount: "€" + plan.yearlyPrice,
        suffix: "year",
        detail: "€" + plan.monthlyPrice + " / month",
      };
}

function PlanCard({ plan, cycle }: { plan: BillingPlan; cycle: BillingCycle }) {
  const price = planPrice(plan, cycle);
  const isCurrent = plan.id === BILLING_CONFIG.currentPlan;
  const buttonClassName = isCurrent
    ? "border border-heather/35 bg-white/60 text-ink/70"
    : plan.id === "basic"
      ? "bg-heather text-white hover:bg-[#756486]"
      : "bg-ink text-white hover:bg-heather";

  return (
    <article
      className={
        "relative flex min-h-[31rem] flex-col rounded-[1.6rem] border-2 p-6 shadow-[0_12px_35px_rgba(81,68,91,0.04)] transition-transform hover:-translate-y-0.5 sm:p-7 " +
        plan.accent +
        " " +
        plan.cardBackground
      }
    >
      {plan.id === "basic" && (
        <span className="absolute right-5 top-5 rounded-full bg-candy px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
          Most popular
        </span>
      )}
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-white/75 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-heather">
          {plan.label}
        </span>
      </div>
      <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em] text-ink">{plan.label}</h2>
      <p className="mt-1 min-h-10 text-sm leading-5 text-ink/55">{plan.description}</p>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-4xl font-semibold tracking-[-0.055em] text-ink">{price.amount}</span>
        <span className="text-sm text-ink/55">/ {price.suffix}</span>
      </div>
      {price.detail ? (
        <p className="mt-1 text-xs text-ink/45">{price.detail}</p>
      ) : (
        <p className="mt-1 text-xs text-ink/45">No commitment</p>
      )}

      <ul className="mt-6 grid gap-2.5">
        {plan.features.map((feature) => (
          <li
            key={feature.label}
            className={
              "flex items-start gap-2 text-sm leading-5 " +
              (feature.included ? "text-ink/75" : "text-ink/40")
            }
          >
            <CheckMark included={feature.included} />
            <span>{feature.label}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={"mt-auto min-h-11 rounded-full px-5 text-sm font-semibold transition-colors focus-visible:outline-2 " + buttonClassName}
        aria-disabled={isCurrent}
        title={
          isCurrent
            ? "This is the presentation-only current plan state."
            : "Billing integration coming soon"
        }
      >
        {isCurrent ? "Current plan" : "Upgrade to " + plan.label}
      </button>
    </article>
  );
}

export default function BillingPage() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const monthlyActive =
    "min-h-9 rounded-full bg-heather px-5 text-sm font-semibold text-white transition-colors";
  const monthlyInactive =
    "min-h-9 rounded-full px-5 text-sm font-semibold text-ink/60 transition-colors hover:text-heather";

  return (
    <section className="w-full py-4 sm:py-8">
      <section className="relative min-h-44 overflow-hidden rounded-[1.75rem] border border-heather/25 bg-sandstone/25 p-7 sm:min-h-52 sm:p-9">
        <Image
          src={BILLING_ASSETS.heroImage}
          alt=""
          fill
          sizes="(min-width: 1536px) 1400px, (min-width: 1024px) 1100px, 100vw"
          className="object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cream/95 via-cream/75 to-cream/20" />
        <div className="relative max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-heather">
            Subscription &amp; billing
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">
            Find the plan that fits you<span className="text-candy">.</span>
          </h1>
          <p className="mt-3 max-w-xl text-base leading-6 text-ink/60">
            More visibility, more opportunities, more time for the work you love.
          </p>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <div
          className="inline-flex rounded-full border border-heather/25 bg-white/70 p-1"
          role="group"
          aria-label="Billing cycle"
        >
          <button
            type="button"
            aria-pressed={cycle === "monthly"}
            onClick={() => setCycle("monthly")}
            className={cycle === "monthly" ? monthlyActive : monthlyInactive}
          >
            Monthly
          </button>
          <button
            type="button"
            aria-pressed={cycle === "yearly"}
            onClick={() => setCycle("yearly")}
            className={cycle === "yearly" ? monthlyActive : monthlyInactive}
          >
            Yearly
          </button>
        </div>
        <span className="rounded-full bg-candy/15 px-3 py-1.5 text-xs font-bold text-[#a95d76]">
          {BILLING_CONFIG.yearlyDiscount}
        </span>
      </div>

      <section className="mt-6 grid gap-5 lg:grid-cols-3" aria-label="Subscription plans">
        {BILLING_PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} cycle={cycle} />
        ))}
      </section>

      <section className="mt-6 overflow-hidden rounded-[1.6rem] border border-heather/25 bg-white/70">
        <div className="border-b border-heather/15 px-6 py-5 sm:px-7">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-heather">Compare plans</p>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.025em] text-ink">
            Choose the space that feels right
          </h2>
        </div>
        <div className="scrollbar-hidden overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead>
              <tr className="border-b border-heather/15 text-xs font-bold uppercase tracking-[0.12em] text-ink/45">
                <th scope="col" className="w-[42%] px-6 py-4 font-bold sm:px-7">
                  Feature
                </th>
                {BILLING_PLANS.map((plan) => (
                  <th key={plan.id} scope="col" className="px-4 py-4 font-bold">
                    {plan.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BILLING_COMPARISON.map((row) => (
                <tr key={row.label} className="border-b border-heather/10 last:border-b-0">
                  <th scope="row" className="px-6 py-3 text-sm font-semibold text-ink/70 sm:px-7">
                    {row.label}
                  </th>
                  {row.values.map((value, index) => (
                    <td
                      key={row.label + "-" + BILLING_PLANS[index].id}
                      className="px-4 py-3 text-sm text-ink/60"
                    >
                      {typeof value === "boolean" ? <CheckMark included={value} /> : value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_1.5fr]" aria-label="Billing support">
        <article className="rounded-[1.6rem] border border-viridian/30 bg-viridian/10 p-6 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#477b7b]">
            Need a little guidance?
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-ink">
            Not sure which plan is right for you?
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink/60">
            Start with Free and change your plan whenever your creative space grows.
          </p>
          <button
            type="button"
            className="mt-5 rounded-full border border-heather/30 bg-white/65 px-4 py-2 text-sm font-semibold text-heather"
          >
            Learn more about our plans
          </button>
        </article>

        <article className="rounded-[1.6rem] border border-heather/25 bg-white/70 p-6 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-heather">
            Frequently asked questions
          </p>
          <div className="mt-3 divide-y divide-heather/15">
            {[
              "Can I change my plan later?",
              "What happens to my data if I downgrade?",
              "Do you offer refunds?",
              "Is there a limit to the number of events?",
            ].map((question) => (
              <details key={question} className="group py-3">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-ink/75">
                  {question}
                  <span className="text-heather transition-transform group-open:rotate-180" aria-hidden="true">
                    ⌄
                  </span>
                </summary>
                <p className="mt-2 max-w-2xl text-sm leading-5 text-ink/55">
                  Billing details will be available when subscription payments are introduced.
                </p>
              </details>
            ))}
          </div>
        </article>
      </section>
    </section>
  );
}
