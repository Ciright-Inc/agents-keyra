"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function submitConsultation(formData: FormData) {
  const organization_name = String(formData.get("organization_name") ?? "").trim();
  const industry = String(formData.get("industry") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const contact_name = String(formData.get("contact_name") ?? "").trim();
  const contact_email = String(formData.get("contact_email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!organization_name || !contact_email || !contact_name) {
    throw new Error("Missing required fields");
  }

  await prisma.consultationRequest.create({
    data: {
      organization_name,
      industry: industry || "—",
      country: country || "—",
      contact_name,
      contact_email,
      message,
    },
  });

  redirect("/consultation/thanks");
}
