import { FormEvent, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Toast from "@/components/Toast";
import { useMutation, useQuery } from "react-query";
import GoBack from "@/components/GoBack";
import Link from "next/link";
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
    });
    const [result, setResult] = useState({
        error: false,
        show: false,
        content: ""
    });
    const session = useSession();
    const [isInfoLoadedOnObject, setIsInfoLoadedOnObject] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const router = useRouter();
    const affiliateId = router.query.id;

    const affiliate = useQuery([`/api/affiliate/readOne?id=${affiliateId}`], async () => {
        const response = await fetch(`/api/affiliate/readOne?id=${affiliateId}`)
        return response.json()
    }, {
        refetchInterval: 10000,
        refetchOnWindowFocus: false,
    });

    if (affiliate?.data && !affiliate.isLoading && !isInfoLoadedOnObject) {
        setFormData({
            name: affiliate.data.name,
            username: affiliate.data.user.username,
            email: affiliate.data.email,
            pix: affiliate.data.pix,
            tel: affiliate.data.tel,
            comission: affiliate.data.comission,
            password: "",
            passwordConfirmation: "",
        });

        setIsInfoLoadedOnObject(true);
    }

    const mutateAffiliate: Record<string, any> = useMutation(async (data: Record<string, string>) => {
        const response = await fetch(`/api/affiliate/update?id=${affiliateId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        return response.json()
    });

    const deleteAffiliate: Record<string, any> = useMutation(async (data: Record<string, string>) => {
        const response = await fetch(`/api/affiliate/delete?id=${affiliateId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        return response.json()
    });

    const handleDelete = () => {
        deleteAffiliate.mutate();
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        mutateAffiliate.mutate(formData);
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
                deleteAffiliate.isLoading && <Loading/>
            }
            {
                (mutateAffiliate.isSuccess || mutateAffiliate.isError) && <Toast content={mutateAffiliate?.data?.content} error={mutateAffiliate?.data?.error} />
            }
            {
                (deleteAffiliate.isSuccess || deleteAffiliate.isError) && <Toast content={deleteAffiliate?.data?.content} error={deleteAffiliate?.data?.error} />
            }
            <h2 className="text-2xl text-center my-4">Editar afiliado</h2>
            {
                affiliate && affiliate.data ? (
                    <>
                        <form onSubmit={(e) => handleSubmit(e)} className="mx-auto border p-4 rounded-xl w-1/2 flex flex-col">
                            <label htmlFor="name" className="font-bold my-2">Nome completo: <span className="text-xs text-red-500">*</span></label>
                            <input defaultValue={affiliate.data.name} required={true} type="text" id="name" className="p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            <label htmlFor="email" className="font-bold my-2">Email: <span className="text-xs text-red-500">*</span></label>
                            <input defaultValue={affiliate.data.email} required={true} type="text" id="email" className="p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            <label htmlFor="tel" className="font-bold my-2">Telefone: <span className="text-xs text-red-500">*</span></label>
                            <input defaultValue={affiliate.data.tel} required={true} type="text" id="tel" className="p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, tel: e.target.value })} />
                            <label htmlFor="pix" className="font-bold my-2">Pix: <span className="text-xs text-red-500">*</span></label>
                            <input defaultValue={affiliate.data.pix} required={true} type="text" id="pix" className="p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, pix: e.target.value })} />
                            <label htmlFor="comission" className="font-bold my-2">Comissão: <span className="text-xs text-red-500">*</span></label>
                            <p className="text-gray-600 text-sm mb-2">A comissão é definida em porcentagem. Então, se você colocar "50", isso significa que esse afiliado receberá 50% dos valores de cada venda.</p>
                            <input defaultValue={affiliate.data.comission} required={true} type="number" id="comission" className="p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, comission: e.target.value })} />
                            <label htmlFor="username" className="font-bold my-2">Nome de usuário: <span className="text-xs text-red-500">*</span></label>
                            <p className="text-gray-600 text-sm mb-2">O "nome de usuário" é o nome que será usado no link de venda este afiliado. Por exemplo, se você colocar "maria", então o link será "lojafinapalha.com.br/afiliado/maria"</p>
                            <input defaultValue={affiliate.data.user?.username} required={true} type="text" id="username" className="p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                            <label htmlFor="password" className="font-bold my-2">Senha: <span className="text-xs text-red-500">*</span></label>
                            <input required={true} type="password" id="password" className="p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                            <label htmlFor="passwordConfirmation" className="font-bold my-2">Confirme a senha: <span className="text-xs text-red-500">*</span></label>
                            <input required={true} type="password" id="passwordConfirmation" className="p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, passwordConfirmation: e.target.value })} />
                            <button className="p-4 border rounded-xl text-center cursor-pointer w-1/3 mx-auto my-4 bg-gradient-to-tr from-slate-600 to-black text-white font-bold hover:opacity-95">Enviar mudanças</button>
                        </form>

                        {
                            showDeleteConfirmation ? (
                                <div className="flex flex-col items-center justify-center bg-red-50 p-4 mt-8">
                                    <p className="text-gray-950 text-sm mb-2">Este afiliado será deletado permanentemente do servidor. Tem certeza que deseja fazer isso?</p>
                                    <button onClick={() => handleDelete()} className="block mt-4 bg-red-700 p-2 rounded-xl text-center text-white font-bold hover:bg-red-800">Tenho certeza!</button>
                                </div>
                            ) : (
                                <button onClick={() => {
                                    setShowDeleteConfirmation(true);
                                    setTimeout(() => {
                                        setShowDeleteConfirmation(false);
                                    }, 5000);
                                }} className="block mx-auto mt-4 bg-red-600 p-2 rounded-xl text-center text-white font-bold hover:bg-red-700">Deletar</button>
                            )
                        }

                    </>
                ) : (
                    <p className="text-red-900 text-center my-8 font-bold">Afiliado não encontrado.</p>
                )
            }
        </>
    )
}