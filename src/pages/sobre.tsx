export default function Sobre() {
    return (
        <>
            <div className="bg-white py-4 sm:py-4 lg:py-6 mt-12">
                <div className="mx-auto max-w-screen-md px-4 md:px-8">
                    <h1 className="mb-4 text-center text-2xl font-bold text-gray-800 sm:text-3xl md:mb-6">
                        Sobre nós
                    </h1>
                    <p className="mb-6 text-gray-500 sm:text-lg md:mb-8">
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iure, dolorum dolore! Tempore provident dolorem error! Velit tempore aliquam vero deleniti eum corporis cumque, odio voluptatem in officiis. Sequi, et at!
                        <br />
                        <br />
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Molestiae, tenetur veniam magni excepturi dolorem autem libero rerum facilis doloremque voluptatem, quasi numquam minus, dolorum error at quibusdam blanditiis quae dolores.
                        <br />
                        <br />
                    </p>
                    {/* <h2 className="mb-2 text-xl font-semibold text-gray-800 sm:text-2xl md:mb-4">
                        No que acreditamos
                    </h2>
                    <p className="mb-6 text-gray-500 sm:text-lg md:mb-8">
                        Os valores do Instituto NS são os pilares que sustentam a sua atuação no mercado e que expressam a sua identidade e o seu propósito. Eles foram definidos ao longo da história da clínica, a qual sempre teve como meta oferecer serviços de excelência e acessibilidade para as pessoas que buscam cuidar da sua beleza e da sua saúde. Esses valores são:
                    </p>
                    <ul className="mb-6 list-inside list-disc text-gray-500 sm:text-lg md:mb-8">
                        <li className="mb-4"><span className="font-bold">Ética:</span> A clínica segue as normas e os princípios da biomedicina estética, respeitando os limites e as indicações dos procedimentos, bem como a autonomia e a vontade dos clientes.</li>
                        <li className="mb-4"><span className="font-bold">Qualidade:</span> A clínica utiliza os melhores equipamentos, produtos e técnicas do mercado, garantindo a segurança e a eficácia dos tratamentos.</li>
                        <li className="mb-4"><span className="font-bold">Acessibilidade:</span> A clínica oferece preços justos e facilitados para os clientes, além de disponibilizar formas de pagamento variadas e parceladas.</li>
                        <li className="mb-4"><span className="font-bold">Atendimento:</span> A clínica proporciona um atendimento personalizado e humanizado para os clientes, ouvindo suas necessidades, expectativas e desejos, e orientando-os sobre os procedimentos mais adequados para cada caso.</li>
                        <li className="mb-4"><span className="font-bold">Satisfação:</span> A clínica busca a satisfação plena dos clientes, entregando resultados naturais, harmoniosos e duradouros, que valorizem a beleza individual de cada um.</li>
                    </ul>
                    <blockquote className="mb-6 border-l-4 pl-4 italic text-gray-500 sm:text-lg md:mb-8 md:pl-6">
                        “O Instituto NS Estética Avançada é um sonho realizado para mim e para as pessoas que buscam cuidar da sua beleza e da sua saúde. Aqui, nós oferecemos os melhores tratamentos estéticos do mercado, com qualidade, segurança e acessibilidade. Nós valorizamos a ética, o atendimento, a satisfação e a inovação. Nós queremos que você se sinta bem consigo mesmo, que você realce a sua beleza natural e que você viva com mais autoestima e confiança.” (Dra. Nathália Stewart)
                    </blockquote> */}
                    <div className="relative mb-6 overflow-hidden rounded-lg bg-gray-100 shadow-lg md:mb-8">
                        <img
                            src="https://picsum.photos/id/237/200/300"
                            loading="lazy"
                            alt="Foto aleatória"
                            className="h-full w-full object-cover object-center"
                        />
                    </div>
                    {/* <h2 className="mb-2 text-xl font-semibold text-gray-800 sm:text-2xl md:mb-4">
                        Features
                    </h2>
                    <p className="text-gray-500 sm:text-lg">
                        This is a section of some simple filler text, also known as placeholder
                        text. It shares some characteristics of a real written text but is random
                        or otherwise generated. It may be used to display a sample of fonts or
                        generate text for testing. Filler text is dummy text which has no meaning
                        however looks very similar to real text.
                    </p> */}
                </div>
            </div>

        </>
    )
}