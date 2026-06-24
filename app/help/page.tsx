import Link from 'next/link';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'How do I place an order?',
    answer: 'Browse products, click "Add to Cart" on any item, then go to your Cart and click Checkout to complete your order.',
  },
  {
    question: 'How can I track my order?',
    answer: 'Go to My Profile and open the Order History tab to see the status of your past and current orders.',
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'GreenCart currently supports cash on delivery and standard online payment methods. More options are coming soon.',
  },
  {
    question: 'How do I change my delivery address?',
    answer: 'Go to My Profile and open the Delivery Address tab to add or update your address.',
  },
  {
    question: 'How do I reset my password?',
    answer: 'Go to My Profile and open the Change Password tab to set a new password.',
  },
];

export default function HelpPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Help Center</h1>
      <p className="text-slate-600 mb-10">Find answers to common questions below.</p>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-base font-semibold text-slate-900 mb-1.5">{faq.question}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-green-100 bg-green-50 p-5 text-center">
        <p className="text-sm text-slate-700 mb-1">Still need help?</p>
        <p className="text-sm text-slate-500">
          Contact us at{' '}
          <a href="mailto:support@greencart.com" className="text-green-600 font-medium hover:underline">
            support@greencart.com
          </a>
        </p>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-green-600 hover:text-green-700 font-medium text-sm">
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}