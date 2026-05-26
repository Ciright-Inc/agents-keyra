"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function submitDeployment(formData: FormData) {
  const agentSlug = String(formData.get("agentSlug") ?? "");
  const organization_name = String(formData.get("organization_name") ?? "").trim();
  const industry = String(formData.get("industry") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const contact_name = String(formData.get("contact_name") ?? "").trim();
  const contact_email = String(formData.get("contact_email") ?? "").trim();
  const tenant_domain = String(formData.get("tenant_domain") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!agentSlug || !organization_name || !contact_email || !tenant_domain) {
    throw new Error("Missing required fields");
  }

  const agent = await prisma.marketplaceAgent.findUnique({ where: { agent_slug: agentSlug } });
  if (!agent) throw new Error("Agent not found");

  const customer = await prisma.customer.upsert({
    where: { contact_email },
    update: {
      organization_name,
      industry: industry || agent.agent_industry,
      country: country || "ALL",
      contact_name,
      tenant_domain,
    },
    create: {
      organization_name,
      industry: industry || agent.agent_industry,
      country: country || "ALL",
      contact_name,
      contact_email,
      tenant_domain,
      status: "Onboarding",
    },
  });

  const plan = await prisma.deploymentPlan.create({
    data: {
      customer_id: customer.id,
      organization_name: customer.organization_name,
      industry: customer.industry,
      country: customer.country,
      notes,
      status: "Submitted",
      items: {
        create: [
          {
            keyra_agent_id: agent.keyra_agent_id,
            agent_name: agent.agent_name,
            agent_industry: agent.agent_industry,
          },
        ],
      },
    },
  });

  redirect(`/deployment/${plan.id}`);
}
