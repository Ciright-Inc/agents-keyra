/**
 * Seed for agents.keyra.ie
 *
 * Mirrors agents from the ciright.agents.keyra.ie catalog (if available on
 * disk via the sibling project's SQLite db) and falls back to a static seed
 * dataset otherwise. Then layers on bundles and a few demonstration
 * customers + subscriptions so the marketplace and portal feel populated.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SeedAgent = {
  keyra_agent_id?: string;
  ciright_parent_agent_id?: string | null;
  agent_name: string;
  agent_slug: string;
  agent_category: string;
  agent_industry: string;
  agent_function: string;
  agent_type: string;
  agent_description: string;
  capabilities: string[];
  inputs: string[];
  outputs: string[];
  permissions: string[];
  integrations: string[];
  countries: string[];
  knowledge_pack_required: boolean;
  human_approval_required: boolean;
  security: "Public" | "Internal" | "Restricted" | "Sovereign";
  regulatory: "None" | "KYC" | "AML" | "GDPR" | "HIPAA" | "PSD2" | "Sovereign";
  subscription_type: "Standard" | "Regulated" | "Sovereign" | "Bespoke";
  billing_model: "seat" | "event" | "metered" | "sovereign-contract";
};

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// ---------------------------------------------------------------------------
// Static seed dataset (mirrors the families seeded into the catalog).
// ---------------------------------------------------------------------------

function makeAgent(
  name: string,
  industry: SeedAgent["agent_industry"],
  fn: string,
  type: string,
  category: string,
  opts: Partial<SeedAgent> = {},
): SeedAgent {
  return {
    agent_name: name,
    agent_slug: slug(name),
    agent_category: category,
    agent_industry: industry,
    agent_function: fn,
    agent_type: type,
    agent_description:
      opts.agent_description ??
      `${name} — governed digital worker designed for ${industry.toLowerCase()} operations. Deployed as a clean operational design; customer data, experience, and transaction history remain inside the customer tenant world.`,
    capabilities: opts.capabilities ?? [
      "Real-time signal ingestion",
      "Operational alerting",
      "Audit-grade traceability",
      "Human-in-the-loop escalation",
    ],
    inputs: opts.inputs ?? ["Event streams", "Reference data"],
    outputs: opts.outputs ?? ["Alerts", "Operational reports"],
    permissions: opts.permissions ?? ["tenant.read", "tenant.write.audit"],
    integrations: opts.integrations ?? ["Tenant Core"],
    countries: opts.countries ?? ["ALL"],
    knowledge_pack_required: opts.knowledge_pack_required ?? true,
    human_approval_required: opts.human_approval_required ?? false,
    security: opts.security ?? "Restricted",
    regulatory: opts.regulatory ?? "GDPR",
    subscription_type: opts.subscription_type ?? "Standard",
    billing_model: opts.billing_model ?? "seat",
  };
}

const STATIC_AGENTS: SeedAgent[] = [
  // Telecom
  makeAgent("SIM Activation Monitoring Agent", "Telecom", "Monitoring", "Monitoring Agent", "Telecom Agents", { regulatory: "GDPR", subscription_type: "Regulated" }),
  makeAgent("SIM Swap Detection Agent", "Telecom", "Fraud detection", "Monitoring Agent", "Telecom Agents", { human_approval_required: true, subscription_type: "Regulated" }),
  makeAgent("eSIM Provisioning Agent", "Telecom", "Activation", "Workflow Agent", "Telecom Agents"),
  makeAgent("Subscriber Identity Integrity Agent", "Telecom", "Identity verification", "Compliance Agent", "Telecom Agents", { subscription_type: "Regulated" }),
  makeAgent("Roaming Usage Agent", "Telecom", "Monitoring", "Monitoring Agent", "Telecom Agents"),
  makeAgent("Network Usage Intelligence Agent", "Telecom", "Intelligence", "Intelligence Agent", "Telecom Agents"),
  makeAgent("Fraud Pattern Detection Agent", "Telecom", "Fraud detection", "Monitoring Agent", "Telecom Agents", { human_approval_required: true, billing_model: "event" }),
  makeAgent("Activation Funnel Agent", "Telecom", "Reporting", "Intelligence Agent", "Telecom Agents"),
  makeAgent("Device Change Monitoring Agent", "Telecom", "Monitoring", "Monitoring Agent", "Telecom Agents"),
  makeAgent("Port-Out Risk Agent", "Telecom", "Risk scoring", "Monitoring Agent", "Telecom Agents", { human_approval_required: true }),

  // Government
  makeAgent("Population Monitoring Agent", "Government", "Data aggregation", "Intelligence Agent", "Government Agents", { security: "Sovereign", regulatory: "Sovereign", subscription_type: "Sovereign", billing_model: "sovereign-contract", human_approval_required: true }),
  makeAgent("Birth Reporting Agent", "Government", "Reporting", "Data Agent", "Government Agents", { security: "Sovereign", regulatory: "Sovereign", subscription_type: "Sovereign", billing_model: "sovereign-contract", human_approval_required: true }),
  makeAgent("Death Reporting Agent", "Government", "Reporting", "Data Agent", "Government Agents", { security: "Sovereign", regulatory: "Sovereign", subscription_type: "Sovereign", billing_model: "sovereign-contract", human_approval_required: true }),
  makeAgent("National Statistics Agent", "Government", "Reporting", "Intelligence Agent", "Government Agents", { security: "Sovereign", regulatory: "Sovereign", subscription_type: "Sovereign", billing_model: "sovereign-contract" }),
  makeAgent("Hospital Reporting Agent", "Government", "Data aggregation", "Data Agent", "Government Agents", { security: "Sovereign", regulatory: "HIPAA", subscription_type: "Sovereign", billing_model: "sovereign-contract" }),
  makeAgent("Border Activity Agent", "Government", "Monitoring", "Monitoring Agent", "Government Agents", { security: "Sovereign", regulatory: "Sovereign", subscription_type: "Sovereign", billing_model: "sovereign-contract" }),
  makeAgent("Identity Verification Agent", "Government", "Identity verification", "Compliance Agent", "Government Agents", { security: "Sovereign", regulatory: "Sovereign", subscription_type: "Sovereign" }),
  makeAgent("Census Sync Agent", "Government", "Reporting", "Data Agent", "Government Agents", { security: "Sovereign", regulatory: "Sovereign", subscription_type: "Sovereign" }),
  makeAgent("Regional Infrastructure Agent", "Government", "Monitoring", "Monitoring Agent", "Government Agents", { security: "Sovereign", regulatory: "Sovereign", subscription_type: "Sovereign" }),
  makeAgent("Public Service Utilization Agent", "Government", "Intelligence", "Intelligence Agent", "Government Agents", { security: "Sovereign", regulatory: "Sovereign", subscription_type: "Sovereign" }),

  // Banking
  makeAgent("Customer Onboarding Agent", "Banking", "Customer onboarding", "Workflow Agent", "Banking Agents", { regulatory: "KYC", subscription_type: "Regulated", human_approval_required: true }),
  makeAgent("AML Monitoring Agent", "Banking", "Compliance", "Monitoring Agent", "Banking Agents", { regulatory: "AML", subscription_type: "Regulated", human_approval_required: true, billing_model: "event" }),
  makeAgent("KYC Review Agent", "Banking", "Identity verification", "Approval Agent", "Banking Agents", { regulatory: "KYC", subscription_type: "Regulated", human_approval_required: true }),
  makeAgent("Account Risk Agent", "Banking", "Risk scoring", "Monitoring Agent", "Banking Agents", { regulatory: "PSD2", subscription_type: "Regulated" }),
  makeAgent("Transaction Anomaly Agent", "Banking", "Fraud detection", "Monitoring Agent", "Banking Agents", { regulatory: "PSD2", subscription_type: "Regulated", billing_model: "event" }),
  makeAgent("Regulatory Reporting Agent", "Banking", "Compliance", "Compliance Agent", "Banking Agents", { regulatory: "PSD2", subscription_type: "Regulated", human_approval_required: true }),
  makeAgent("Fraud Case Preparation Agent", "Banking", "Fraud detection", "Approval Agent", "Banking Agents", { human_approval_required: true, subscription_type: "Regulated" }),
  makeAgent("Device Trust Agent", "Banking", "Identity verification", "Monitoring Agent", "Banking Agents", { subscription_type: "Regulated" }),
  makeAgent("Customer Identity Agent", "Banking", "Identity verification", "Compliance Agent", "Banking Agents", { regulatory: "KYC", subscription_type: "Regulated" }),
  makeAgent("Compliance Review Agent", "Banking", "Compliance", "Approval Agent", "Banking Agents", { human_approval_required: true, subscription_type: "Regulated" }),

  // University
  makeAgent("Student Application Monitoring Agent", "University / Education", "Monitoring", "Monitoring Agent", "University Agents"),
  makeAgent("Admissions Funnel Agent", "University / Education", "Reporting", "Intelligence Agent", "University Agents"),
  makeAgent("Transcript Verification Agent", "University / Education", "Identity verification", "Approval Agent", "University Agents", { human_approval_required: true }),
  makeAgent("Enrollment Activation Agent", "University / Education", "Activation", "Workflow Agent", "University Agents"),
  makeAgent("Provost Intelligence Agent", "University / Education", "Intelligence", "Intelligence Agent", "University Agents"),
  makeAgent("Applicant Status Agent", "University / Education", "Monitoring", "Monitoring Agent", "University Agents"),
  makeAgent("International Student Visa Agent", "University / Education", "Approval routing", "Approval Agent", "University Agents", { human_approval_required: true }),
  makeAgent("Scholarship Review Agent", "University / Education", "Approval routing", "Approval Agent", "University Agents", { human_approval_required: true }),
  makeAgent("Student Identity Agent", "University / Education", "Identity verification", "Compliance Agent", "University Agents"),
  makeAgent("Academic Integrity Agent", "University / Education", "Compliance", "Compliance Agent", "University Agents", { human_approval_required: true }),

  // Enterprise
  makeAgent("CRM Lead Enrichment Agent", "Enterprise", "Workflow execution", "Workflow Agent", "Enterprise Agents", { security: "Internal", regulatory: "None", subscription_type: "Standard", knowledge_pack_required: false }),
  makeAgent("Proposal Preparation Agent", "Enterprise", "Document preparation", "Workflow Agent", "Enterprise Agents", { security: "Internal", regulatory: "None", subscription_type: "Standard", knowledge_pack_required: false }),
  makeAgent("RFP Response Agent", "Enterprise", "Document preparation", "Workflow Agent", "Enterprise Agents", { security: "Internal", regulatory: "None", subscription_type: "Standard", knowledge_pack_required: false }),
  makeAgent("Meeting Prep Agent", "Enterprise", "Document preparation", "Workflow Agent", "Enterprise Agents", { security: "Internal", regulatory: "None", subscription_type: "Standard", knowledge_pack_required: false }),
  makeAgent("Follow-Up Agent", "Enterprise", "Workflow execution", "Workflow Agent", "Enterprise Agents", { security: "Internal", regulatory: "None", subscription_type: "Standard", knowledge_pack_required: false }),
  makeAgent("Sales Pipeline Agent", "Enterprise", "Intelligence", "Intelligence Agent", "Enterprise Agents", { security: "Internal", regulatory: "None", subscription_type: "Standard", knowledge_pack_required: false }),
  makeAgent("Partner Onboarding Agent", "Enterprise", "Customer onboarding", "Workflow Agent", "Enterprise Agents", { security: "Internal", regulatory: "None", subscription_type: "Standard", knowledge_pack_required: false }),
  makeAgent("Developer Onboarding Agent", "Enterprise", "Customer onboarding", "Workflow Agent", "Enterprise Agents", { security: "Internal", regulatory: "None", subscription_type: "Standard", knowledge_pack_required: false }),
  makeAgent("Contract Review Prep Agent", "Enterprise", "Document preparation", "Workflow Agent", "Enterprise Agents", { security: "Internal", regulatory: "None", subscription_type: "Standard", human_approval_required: true, knowledge_pack_required: false }),
  makeAgent("Executive Briefing Agent", "Enterprise", "Document preparation", "Intelligence Agent", "Enterprise Agents", { security: "Internal", regulatory: "None", subscription_type: "Standard", human_approval_required: true, knowledge_pack_required: false }),
];

// ---------------------------------------------------------------------------
// Bundles
// ---------------------------------------------------------------------------

const BUNDLES: { name: string; industry: string; description: string; positioning?: string; highlight?: boolean; members: string[] }[] = [
  {
    name: "Telecom Bundle",
    industry: "Telecom",
    description: "End-to-end SIM lifecycle, fraud, and network intelligence for tier-1 carriers.",
    positioning: "Operate the subscriber estate as a single governed surface.",
    highlight: true,
    members: [
      "SIM Activation Monitoring Agent",
      "SIM Swap Detection Agent",
      "eSIM Provisioning Agent",
      "Network Usage Intelligence Agent",
      "Roaming Usage Agent",
      "Fraud Pattern Detection Agent",
      "Subscriber Identity Integrity Agent",
    ],
  },
  {
    name: "Government Population Bundle",
    industry: "Government",
    description: "Civil registry, hospital reporting, and national statistics in one sovereign package.",
    positioning: "Build a country's daily population pulse on a sovereign substrate.",
    highlight: true,
    members: [
      "Population Monitoring Agent",
      "Birth Reporting Agent",
      "Death Reporting Agent",
      "Hospital Reporting Agent",
      "Census Sync Agent",
      "National Statistics Agent",
    ],
  },
  {
    name: "University Admissions Bundle",
    industry: "University / Education",
    description: "Applicant lifecycle visibility from interest to enrollment.",
    positioning: "Give the provost real-time admissions intelligence.",
    members: [
      "Student Application Monitoring Agent",
      "Admissions Funnel Agent",
      "Applicant Status Agent",
      "Transcript Verification Agent",
      "Provost Intelligence Agent",
      "Enrollment Activation Agent",
    ],
  },
  {
    name: "Banking Trust Bundle",
    industry: "Banking",
    description: "KYC, AML, fraud, and regulatory reporting under a single trust framework.",
    positioning: "Stand up a defensible compliance posture in weeks, not quarters.",
    highlight: true,
    members: [
      "KYC Review Agent",
      "AML Monitoring Agent",
      "Customer Onboarding Agent",
      "Transaction Anomaly Agent",
      "Fraud Case Preparation Agent",
      "Regulatory Reporting Agent",
    ],
  },
  {
    name: "Enterprise Growth Bundle",
    industry: "Enterprise",
    description: "Revenue-operations digital workers across CRM, proposals, RFPs, and briefings.",
    positioning: "Compress the time from lead to signed agreement.",
    members: [
      "CRM Lead Enrichment Agent",
      "Proposal Preparation Agent",
      "RFP Response Agent",
      "Meeting Prep Agent",
      "Follow-Up Agent",
      "Executive Briefing Agent",
    ],
  },
];

// ---------------------------------------------------------------------------
// Sample customers + subscriptions (so portal isn't empty)
// ---------------------------------------------------------------------------

const SAMPLE_CUSTOMERS = [
  {
    organization_name: "Northwind Telecom",
    industry: "Telecom",
    country: "IE",
    contact_name: "Ada Roe",
    contact_email: "ada@northwind.example",
    tenant_domain: "agents.northwind.example",
    subscribe: [
      "SIM Activation Monitoring Agent",
      "SIM Swap Detection Agent",
      "eSIM Provisioning Agent",
      "Fraud Pattern Detection Agent",
    ],
  },
  {
    organization_name: "Republic of Ardalia",
    industry: "Government",
    country: "AE",
    contact_name: "Minister Kael",
    contact_email: "ministry@ardalia.gov.example",
    tenant_domain: "agents.ardalia.gov.example",
    subscribe: [
      "Population Monitoring Agent",
      "Birth Reporting Agent",
      "Hospital Reporting Agent",
      "National Statistics Agent",
    ],
  },
  {
    organization_name: "Meridian Bank",
    industry: "Banking",
    country: "GB",
    contact_name: "James Carter",
    contact_email: "james@meridian.example",
    tenant_domain: "agents.meridian.example",
    subscribe: [
      "KYC Review Agent",
      "AML Monitoring Agent",
      "Transaction Anomaly Agent",
      "Regulatory Reporting Agent",
    ],
  },
];

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

async function main() {
  console.log("• Seeding marketplace agents");

  for (const a of STATIC_AGENTS) {
    await prisma.marketplaceAgent.upsert({
      where: { agent_slug: a.agent_slug },
      update: {
        agent_name: a.agent_name,
        agent_category: a.agent_category,
        agent_industry: a.agent_industry,
        agent_function: a.agent_function,
        agent_type: a.agent_type,
        agent_description: a.agent_description,
        agent_capabilities: JSON.stringify(a.capabilities),
        required_inputs: JSON.stringify(a.inputs),
        expected_outputs: JSON.stringify(a.outputs),
        required_permissions: JSON.stringify(a.permissions),
        required_integrations: JSON.stringify(a.integrations),
        country_applicability: JSON.stringify(a.countries),
        knowledge_pack_required: a.knowledge_pack_required,
        human_approval_required: a.human_approval_required,
        security_classification: a.security,
        regulatory_classification: a.regulatory,
        subscription_type: a.subscription_type,
        billing_model: a.billing_model,
      },
      create: {
        keyra_agent_id: `keyra-${a.agent_slug}`,
        ciright_parent_agent_id: null,
        agent_name: a.agent_name,
        agent_slug: a.agent_slug,
        agent_category: a.agent_category,
        agent_industry: a.agent_industry,
        agent_function: a.agent_function,
        agent_type: a.agent_type,
        agent_description: a.agent_description,
        agent_capabilities: JSON.stringify(a.capabilities),
        required_inputs: JSON.stringify(a.inputs),
        expected_outputs: JSON.stringify(a.outputs),
        required_permissions: JSON.stringify(a.permissions),
        required_integrations: JSON.stringify(a.integrations),
        country_applicability: JSON.stringify(a.countries),
        knowledge_pack_required: a.knowledge_pack_required,
        human_approval_required: a.human_approval_required,
        security_classification: a.security,
        regulatory_classification: a.regulatory,
        subscription_type: a.subscription_type,
        billing_model: a.billing_model,
      },
    });
  }

  console.log("• Seeding bundles");
  for (const b of BUNDLES) {
    const bundle = await prisma.bundle.upsert({
      where: { slug: slug(b.name) },
      update: {
        name: b.name,
        industry: b.industry,
        description: b.description,
        positioning: b.positioning,
        highlight: b.highlight ?? false,
      },
      create: {
        name: b.name,
        slug: slug(b.name),
        industry: b.industry,
        description: b.description,
        positioning: b.positioning,
        highlight: b.highlight ?? false,
      },
    });
    for (const memberName of b.members) {
      const agent = await prisma.marketplaceAgent.findUnique({
        where: { agent_slug: slug(memberName) },
      });
      if (agent) {
        await prisma.bundleItem.upsert({
          where: {
            bundle_id_keyra_agent_id: {
              bundle_id: bundle.id,
              keyra_agent_id: agent.keyra_agent_id,
            },
          },
          update: {},
          create: { bundle_id: bundle.id, keyra_agent_id: agent.keyra_agent_id },
        });
      }
    }
  }

  console.log("• Seeding sample customers and subscriptions");
  for (const c of SAMPLE_CUSTOMERS) {
    const customer = await prisma.customer.upsert({
      where: { contact_email: c.contact_email },
      update: {
        organization_name: c.organization_name,
        industry: c.industry,
        country: c.country,
        contact_name: c.contact_name,
        tenant_domain: c.tenant_domain,
        status: "Active",
      },
      create: {
        organization_name: c.organization_name,
        industry: c.industry,
        country: c.country,
        contact_name: c.contact_name,
        contact_email: c.contact_email,
        tenant_domain: c.tenant_domain,
        status: "Active",
      },
    });

    for (const agentName of c.subscribe) {
      const agent = await prisma.marketplaceAgent.findUnique({
        where: { agent_slug: slug(agentName) },
      });
      if (!agent) continue;
      const instanceId = `tnt-${slug(c.organization_name)}-${slug(agentName)}`;
      await prisma.agentSubscription.upsert({
        where: { tenant_agent_instance_id: instanceId },
        update: {},
        create: {
          customer_id: customer.id,
          organization_name: customer.organization_name,
          industry: customer.industry,
          country: customer.country,
          keyra_agent_id: agent.keyra_agent_id,
          ciright_parent_agent_id: agent.ciright_parent_agent_id,
          tenant_agent_instance_id: instanceId,
          subscription_status: "Active",
          deployment_status: "Deployed",
          subscription_start_date: new Date(),
          billing_model: agent.billing_model,
          knowledge_pack_attached: agent.knowledge_pack_required,
          security_approval_status: "Approved",
          legal_approval_status: "Approved",
          usage_metering_enabled: agent.billing_model === "event" || agent.billing_model === "metered",
        },
      });
    }
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
