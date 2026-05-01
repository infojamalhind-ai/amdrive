export default function ContactCTA() {
  return (
    <section className="bg-gradient-to-r from-purple-700 to-indigo-700 py-12 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[28px] bg-white/10 p-8 backdrop-blur-sm">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-3 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium">
                AMJDrive Contact
              </p>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Need help with booking your car?
              </h2>
              <p className="mt-4 max-w-xl text-sm text-purple-100 sm:text-base">
                Contact AMJDrive for fast booking support, delivery details, and
                the best rental options in Ajman, Sharjah, Dubai, and UAQ.
              </p>

              <div className="mt-6 space-y-3 text-sm sm:text-base">
                <p>
                  <span className="font-semibold">Call:</span> 0582211457{" "}
                  <span className="font-semibold">/ WhatsApp:</span> +971526959007
                </p>
                <p>
                  <span className="font-semibold">Office:</span>{" "}
                  Al Jawla Al Akheerah Cars Rental LLC
                </p>
                <p>
                  <span className="font-semibold">Address:</span> Al Majaz 2,
                  Al Wahda Street, Dubai-Sharjah Border, opposite Karachi Darbar
                  Restaurant
                </p>
                <p>
                  <span className="font-semibold">Location:</span>{" "}
                  <a
                    href="https://maps.app.goo.gl/hdHNU94hyd212FBt8?g_st=ic"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-white underline underline-offset-4 hover:text-purple-100"
                  >
                    Open in Google Maps
                  </a>
                </p>
                <p>
                  <span className="font-semibold">Delivery Available:</span>{" "}
                  Ajman, Sharjah, Dubai and UAQ
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row md:justify-end">
              <a
                href="tel:+971582211457"
                className="rounded-2xl bg-white px-6 py-4 text-center font-semibold text-purple-700 shadow-lg transition hover:scale-[1.01]"
              >
                Call Now
              </a>

              <a
                href="https://wa.me/971526959007?text=Hi, I want to book a car with AMJDrive"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl bg-green-700 px-6 py-4 text-center font-semibold text-white shadow-lg transition hover:scale-[1.01] hover:bg-green-800"
              >
                WhatsApp Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
