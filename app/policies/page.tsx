export default function PoliciesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-slate-900 mb-10">Policies</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-800 mb-3">Privacy Policy</h2>
        <p className="text-slate-500 leading-relaxed">
          GreenCart collects only the information necessary to process your orders and improve your shopping experience. We never sell your personal data to third parties. Your information is stored securely and used solely for order fulfillment and communication.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-800 mb-3">Return & Refund Policy</h2>
        <p className="text-slate-500 leading-relaxed">
          If you receive a damaged or incorrect item, please contact us within 24 hours of delivery. We will arrange a replacement or full refund. Perishable items cannot be returned unless they arrive damaged or spoiled.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-800 mb-3">Terms of Service</h2>
        <p className="text-slate-500 leading-relaxed">
          By using GreenCart, you agree to provide accurate information during registration and checkout. We reserve the right to cancel orders in case of pricing errors or stock unavailability. GreenCart is not liable for delays caused by circumstances beyond our control.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-3">Delivery Policy</h2>
        <p className="text-slate-500 leading-relaxed">
          We currently deliver across Dhaka, Chattogram, and selected areas. Standard delivery takes 2-3 hours within Dhaka. Delivery charges may apply based on your location and order size.
        </p>
      </section>
    </div>
  );
}