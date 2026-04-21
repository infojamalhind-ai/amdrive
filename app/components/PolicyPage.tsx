import Link from "next/link";

type PolicyPageProps = {
  title: string;
  intro: string;
  children: React.ReactNode;
};

export default function PolicyPage({
  title,
  intro,
  children,
}: PolicyPageProps) {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 md:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm font-medium text-purple-700 transition hover:text-purple-900"
          >
            Back to Home
          </Link>
        </div>

        <article className="rounded-3xl bg-white p-6 shadow-sm md:p-10">
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">{intro}</p>

          <div className="prose prose-slate mt-8 max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-li:text-slate-700">
            {children}
          </div>
        </article>
      </div>
    </main>
  );
}
