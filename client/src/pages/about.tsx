import SEOHead from "@/components/SEOHead";

export default function AboutPage() {
  return (
    <>
      <SEOHead
        title="Sobre Nós"
        description="Conheça mais sobre o Closer Brasil, nossa missão e valores."
      />

      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Sobre o Closer Brasil</h1>
        
        <div className="prose prose-lg">
          <p className="text-gray-600 mb-6">
            O Closer Brasil é um portal de notícias dedicado a trazer informações relevantes
            e análises aprofundadas sobre tecnologia, cultura e negócios no Brasil.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Nossa Missão</h2>
          <p className="text-gray-600 mb-6">
            Nosso objetivo é aproximar os brasileiros das principais tendências e
            acontecimentos que moldam nosso futuro, com jornalismo de qualidade e
            compromisso com a verdade.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Nossos Valores</h2>
          <ul className="list-disc list-inside text-gray-600 mb-6">
            <li>Compromisso com a verdade e a precisão das informações</li>
            <li>Independência editorial</li>
            <li>Inovação e adaptação às mudanças tecnológicas</li>
            <li>Respeito à diversidade de opiniões</li>
          </ul>
        </div>
      </div>
    </>
  );
}
