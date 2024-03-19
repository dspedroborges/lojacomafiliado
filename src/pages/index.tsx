import ProductGrid from "@/components/ProductGrid";

export default function Home() {
    return (
        <>
            <section className="mx-auto max-w-screen-2xl px-4 md:px-8">
                <div className="mb-8 flex flex-wrap justify-between md:mb-16">
                    <div className="mb-6 flex w-full flex-col justify-center sm:mb-12 lg:mb-0 lg:w-1/3 lg:pb-24 lg:pt-48">
                        <h1 className="mb-4 text-4xl font-bold text-black sm:text-5xl md:mb-8 md:text-6xl">
                            Produto de qualidade
                            <br />
                            com afiliado recompensado!
                        </h1>
                        <p className="max-w-md leading-relaxed text-gray-500 xl:text-lg">
                            Loja com sistema de afiliados
                        </p>
                    </div>
                    <div className="mb-12 flex w-full md:mb-16 lg:w-2/3">
                        <div className="relative left-12 top-12 z-10 -ml-12 overflow-hidden rounded-lg bg-gray-100 shadow-lg md:left-16 md:top-16 lg:ml-0">
                            <img
                                src="https://picsum.photos/id/237/200/300"
                                loading="lazy"
                                alt="Foto aleatória"
                                className="h-full w-full object-cover object-center"
                            />
                        </div>
                        <div className="overflow-hidden rounded-lg bg-gray-100 shadow-lg">
                            <img
                                src="https://picsum.photos/id/238/200/300"
                                loading="lazy"
                                alt="Foto aleatória"
                                className="h-full w-full object-cover object-center"
                            />
                        </div>
                    </div>
                </div>
            </section>
            <ProductGrid />
        </>
    )
}
