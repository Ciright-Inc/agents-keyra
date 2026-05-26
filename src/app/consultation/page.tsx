import Link from "next/link";
import { submitConsultation } from "./actions";

export default function ConsultationPage() {
  return (
    <div className="max-w-[920px] mx-auto px-6 py-12">
      <div className="h-eyebrow mb-2">Request consultation</div>
      <h1 className="h-display">Talk to Keyra</h1>
      <p className="text-[15px] text-muted mt-3 max-w-[68ch]">
        Tell us about your operating context. A Keyra engineer will respond
        with a deployment plan, integration scope, and approval workflow
        tailored to your environment.
      </p>

      <form action={submitConsultation} className="card p-6 mt-8 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field name="organization_name" label="Organization" required />
          <Field name="industry" label="Industry" placeholder="Telecom, Banking, Government, …" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field name="country" label="Country (ISO code)" placeholder="IE" />
          <Field name="contact_name" label="Your name" required />
        </div>
        <Field name="contact_email" label="Contact email" required type="email" />
        <div>
          <label className="h-eyebrow block mb-1">What problem are you solving?</label>
          <textarea name="message" className="textarea" rows={5} placeholder="Operational scope, regulators involved, target go-live, integration constraints…" />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <button className="btn btn-primary btn-lg" type="submit">Submit</button>
          <Link href="/marketplace" className="btn">Browse marketplace</Link>
        </div>
        <div className="text-[11.5px] text-muted pt-3 border-t border-[color:var(--border)]">
          Submission creates a consultation record. Keyra will be in touch.
        </div>
      </form>
    </div>
  );
}

function Field({
  name,
  label,
  required,
  placeholder,
  type = "text",
}: {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="h-eyebrow block mb-1">
        {label}{required ? <span className="text-[color:var(--critical)]"> *</span> : null}
      </label>
      <input className="input" name={name} type={type} placeholder={placeholder} required={required} />
    </div>
  );
}
