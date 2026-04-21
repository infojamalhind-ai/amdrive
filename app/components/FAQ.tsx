const faqs = [
  {
    question: "What is the minimum car rental price?",
    answer:
      "Our car rental prices start from AED 75 per day depending on the vehicle and rental duration.",
  },
  {
    question: "Do I need to pay a deposit?",
    answer:
      "Some cars are available with a no deposit option. For selected vehicles, a one-time AED 59 waiver fee applies instead of deposit. Other cars may already be available without deposit.",
  },
  {
    question: "Which locations do you serve?",
    answer:
      "We provide delivery and pickup in Ajman, Sharjah, Dubai, and Umm Al Quwain.",
  },
  {
    question: "What documents are required to rent a car?",
    answer:
      "Residents usually need Emirates ID and UAE driving license. Tourists usually need passport, visit visa, driving license, and entry stamp.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "Refundable deposits, if applicable, are usually returned within 10–15 days after rental ends, after checking fines, Salik, and damages.",
  },
  {
    question: "Can I add additional drivers to my rental agreement?",
    answer:
      "Yes, additional drivers can be added by providing valid documents and driving license. Extra charges may apply.",
  },
  {
    question: "What happens if I return the car late?",
    answer:
      "Please inform us at least 2 hours before. Late returns may result in extra hourly or daily charges depending on the delay.",
  },
  {
    question: "What is extra comprehensive insurance?",
    answer:
      "Extra comprehensive insurance reduces your financial liability in case of damage or accident, depending on the selected insurance plan.",
  },
  {
    question: "What type of insurance is included?",
    answer:
      "All cars come with basic insurance. Optional upgrades like CDW or SCDW may be available for better coverage.",
  },
  {
    question: "How are extra charges like fines and Salik calculated?",
    answer:
      "Salik is charged per crossing with applicable admin fee. Traffic fines are charged at actual amount plus admin fee. Any black points related handling may also be charged.",
  },
  {
    question: "How are fines and Salik charged after rental?",
    answer:
      "All fines and Salik are checked from official systems after rental and shared with full transparency before charging.",
  },
];

export default function FAQ() {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            Quick answers about booking, delivery, deposit, insurance, and rental requirements.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <summary className="cursor-pointer list-none font-semibold text-slate-900">
                <div className="flex items-center justify-between gap-4">
                  <span>{faq.question}</span>
                  <span className="text-xl text-purple-600 transition group-open:rotate-45">
                    +
                  </span>
                </div>
              </summary>
              <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}