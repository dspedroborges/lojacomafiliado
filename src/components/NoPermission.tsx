export default function NoPermission() {
    return (
        <div className="flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold">Sem permissão!</h2>
            <p>Você precisa se autenticar para ver essa página. Por favor, acesse a página de login e informe suas credenciais.</p>
        </div>
    )
}