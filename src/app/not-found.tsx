import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-start justify-center px-4 py-24">
      <p className="eyebrow">Not found</p>
      <h1 className="mt-3 font-serif text-4xl text-fg">This page isn’t in the dataset.</h1>
      <p className="mt-3 text-muted">
        The person or page you’re looking for doesn’t exist here. We don’t add people or links
        without a source.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/people" className="btn btn-primary">Browse people</Link>
        <Link href="/" className="btn btn-ghost">Home</Link>
      </div>
    </div>
  );
}
