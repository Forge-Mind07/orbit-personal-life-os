import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Page } from "@/components/orbit/common/bits";
import { SegmentTabs } from "@/components/orbit/common/SegmentTabs";
import { ExpensesTab } from "@/components/orbit/finance/ExpensesTab";
import { InvestmentsTab } from "@/components/orbit/finance/InvestmentsTab";

export const Route = createFileRoute("/finance")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Finance · ORBIT" },
      { name: "description", content: "Monthly budget, spending categories and a demo investment portfolio in rupees." },
      { property: "og:title", content: "Finance · ORBIT" },
      { property: "og:description", content: "Monthly budget, spending categories and a demo investment portfolio in rupees." },
    ],
  }),
  component: Finance,
});

const TABS = ["Expenses", "Investments"] as const;

function Finance() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Expenses");
  return (
    <Page className="space-y-6 pt-6">
      <SegmentTabs id="finance" label="Finance section" options={TABS} value={tab} onChange={setTab} />
      <div role="tabpanel" aria-label={tab}>{tab === "Expenses" ? <ExpensesTab /> : <InvestmentsTab />}</div>
    </Page>
  );
}
