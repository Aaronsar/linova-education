interface PageHeroProps {
  title: string;
  highlight?: string;
  description?: string;
}

export default function PageHero({ title, highlight, description }: PageHeroProps) {
  return (
    <section className="bg-navy py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
          {title}
          {highlight && (
            <>
              <br />
              <span className="text-teal">{highlight}</span>
            </>
          )}
        </h1>
        {description && (
          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
