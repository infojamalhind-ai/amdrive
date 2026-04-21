const reviews = [
  {
    name: "Ahmed",
    text: "Very smooth booking process and clean car. Delivery was on time and the team was helpful.",
  },
  {
    name: "Sara",
    text: "Good service and quick response on WhatsApp. The car was neat and pricing was clear.",
  },
  {
    name: "Rahman",
    text: "Booked for family use and everything was easy. Pickup and return process was simple.",
  },
];

export default function Reviews() {
  return (
    <section className="bg-[#f5f7fb] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            Trusted car rental service in Ajman, Sharjah, Dubai and UAQ.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="rounded-[24px] bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
            >
              <div className="mb-4 flex text-yellow-400">★★★★★</div>
              <p className="text-sm leading-7 text-slate-600 sm:text-base">
                “{review.text}”
              </p>
              <div className="mt-5">
                <p className="font-semibold text-slate-900">{review.name}</p>
                <p className="text-sm text-slate-500">AMJDrive Customer</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}