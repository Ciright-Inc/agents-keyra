import Link from "next/link";

export default function ConsultationThanks() {
  return (
    <div className="max-w-[720px] mx-auto px-6 py-24 text-center">
      <div className="h-eyebrow mb-2">Consultation</div>
      <h1 className="h-display">Request received.</h1>
      <p className="text-[15px] text-muted mt-4 max-w-[60ch] mx-auto">
        A Keyra engineer will be in touch with a deployment plan tailored to
        your environment. In the meantime, browse the marketplace.
      </p>
      <div className="flex items-center justify-center gap-2 mt-7">
        <Link href="/marketplace" className="btn btn-primary btn-lg">Browse marketplace</Link>
        <Link href="/" className="btn btn-lg">Back home</Link>
      </div>
    </div>
  );
}
