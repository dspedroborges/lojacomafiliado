import { FormEvent, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Toast from "@/components/Toast";
import { useMutation } from "react-query";
import GoBack from "@/components/GoBack";
import Loading from "@/components/Loading";
import NoPermission from "@/components/NoPermission";

export default function CriarAfiliado() {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        pix: "",
        tel: "",
        comission: "",
        password: "",
        passwordConfirmation: "",
    })

    const mutateAffiliate: Record<string, any> = useMutation(async (data: Record<string, string>) => {
        const response = await fetch("/api/affiliate/create", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        return response.json()
    });

    const session = useSession();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            mutateAffiliate.mutate(formData);
        } catch (e) {
            console.log(e);
        }
    }

    const username = session.data?.user?.name;
    if (session.status !== "authenticated" || username != "admin") {
        return <NoPermission/>
    }

    return (
        <>
            <GoBack />
            {
                mutateAffiliate.isLoading && <Loading/>
            }

            {
                (mutateAffiliate.isSuccess || mutateAffiliate.isError) && <Toast content={mutateAffiliate?.data?.content} error={mutateAffiliate?.data?.error} />
            }

            <h2 className="text-2xl text-center my-4">Criar afiliado</h2>
            <form onSubmit={(e) => handleSubmit(e)} className="mx-auto border p-4 rounded-xl w-1/2 flex flex-col">
                <label htmlFor="name" className="font-bold my-2">Nome completo: <span className="text-xs text-red-500">*</span></label>
                <input required={true} type="text" id="name" className="p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <label htmlFor="email" className="font-bold my-2">Email: <span className="text-xs text-red-500">*</span></label>
                <input required={true} type="text" id="email" className="p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                <label htmlFor="tel" className="font-bold my-2">Telefone: <span className="text-xs text-red-500">*</span></label>
                <input required={true} type="text" id="tel" className="p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, tel: e.target.value })} />
                <label htmlFor="pix" className="font-bold my-2">Pix: <span className="text-xs text-red-500">*</span></label>
                <input required={true} type="text" id="pix" className="p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, pix: e.target.value })} />
                <label htmlFor="comission" className="font-bold my-2">Comissão: <span className="text-xs text-red-500">*</span></label>
                <p className="text-gray-600 text-sm mb-2">A comissão é definida em porcentagem. Então, se você colocar "50", isso significa que esse afiliado receberá 50% dos valores de cada venda.</p>
                <input required={true} type="number" id="comission" className="p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, comission: e.target.value })} />
                <label htmlFor="username" className="font-bold my-2">Nome de usuário: <span className="text-xs text-red-500">*</span></label>
                <p className="text-gray-600 text-sm mb-2">O "nome de usuário" é o nome que será usado no link de venda este afiliado. Por exemplo, se você colocar "maria", então o link será "lojafinapalha.com.br/afiliado/maria"</p>
                <input required={true} type="text" id="username" className="p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                <label htmlFor="password" className="font-bold my-2">Senha: <span className="text-xs text-red-500">*</span></label>
                <input required={true} type="password" id="password" className="p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                <label htmlFor="passwordConfirmation" className="font-bold my-2">Confirme a senha: <span className="text-xs text-red-500">*</span></label>
                <input required={true} type="password" id="passwordConfirmation" className="p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, passwordConfirmation: e.target.value })} />
                <button className="p-4 border rounded-xl text-center cursor-pointer w-1/3 mx-auto my-4 bg-gradient-to-tr from-slate-600 to-black text-white font-bold hover:opacity-95">Criar afiliado</button>
            </form>
        </>
    )
}