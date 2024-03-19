export default function PaginaNaoEncontrada() {
    return (
        <>
            <div className="text-center border p-8 rounded-xl m-4">
                <h2 className="text-2xl font-extrabold">Página não encontrada!</h2>

                <p className="mb-8 mt-4">A página que você está buscando não existe.</p>

                <img src="https://picsum.photos/id/237/200/300" className="mx-auto rounded-xl" />
            </div>
        </>
    )
}