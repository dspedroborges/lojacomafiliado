import Loading from "@/components/Loading";
import Toast from "@/components/Toast";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react"
import { useMutation, useQuery } from "react-query";

export default function Dados() {
    const [formData, setFormData] = useState<Record<string, string | boolean | string[] | number[]>>({});
    const router = useRouter();
    const { products, amounts } = router.query;

    const mutateSale: Record<string, any> = useMutation(async (data: Record<string, string>) => {
        const response = await fetch("/api/payment/create", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        return response.json()
    });

    useEffect(() => {
        const affiliate = localStorage.getItem("affiliate");

        if (affiliate) {
            setFormData(() => { return { ...formData, affiliate, products: String(products), amounts: String(amounts) } })
        } else {
            setFormData(() => { return { ...formData, products: String(products), amounts: String(amounts) } })
        }
    }, [products, amounts]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        mutateSale.mutate(formData);
    }

    if (mutateSale?.data) {
        router.push(mutateSale?.data?.url);
    }

    return (
        <>
            {
                mutateSale.isLoading && <Loading />
            }

            {
                (mutateSale.isSuccess || mutateSale.isError) && <Toast content={mutateSale?.data?.content} error={mutateSale?.data?.error} />
            }
            <h2 className="text-3xl font-bold text-center mb-4">Finalizar compra</h2>
            <p className="text-center mb-8">Antes de prosseguirmos com a sua compra, precisamos de alguns dados necessários para a entrega e rastreamento do pedido.</p>
            <form onSubmit={(e) => handleSubmit(e)}>
                <div className="flex flex-col lg:flex-row gap-12 justify-center">
                    <div className="p-4 border rounded-xl">
                        <h2 className="text-2xl mb-4">Dados pessoais:</h2>
                        <div className="flex flex-col">
                            <label htmlFor="name" className="font-bold my-2">Nome <span className="text-xs text-red-500">*</span></label>
                            <input required={true} type="text" id="name" className="p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

                            <label htmlFor="email" className="font-bold my-2">E-mail <span className="text-xs text-red-500">*</span></label>
                            <input required={true} type="text" id="email" className="p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

                            <label htmlFor="tel" className="font-bold my-2">Telefone <span className="text-xs text-red-500">*</span></label>
                            <input required={true} type="text" id="tel" className="p-2 border rounded-md" placeholder="(00) 9 0000-0000" onChange={(e) => setFormData({ ...formData, tel: e.target.value })} />

                            <label htmlFor="cpf" className="font-bold my-2">CPF <span className="text-xs text-red-500">*</span></label>
                            <input required={true} type="text" id="cpf" className="p-2 border rounded-md" placeholder="000.000.000-00" onChange={(e) => setFormData({ ...formData, cpf: e.target.value })} />
                        </div>
                    </div>
                    <div className="p-4 border rounded-xl">
                        <h2 className="text-2xl mb-4">Dados para entrega</h2>
                        <div className="flex flex-col">
                            <label htmlFor="cep" className="font-bold my-2">CEP <span className="text-xs text-red-500">*</span></label>
                            <input required={true} type="text" id="cep" className="p-2 border rounded-md" placeholder="00000-000" onChange={(e) => setFormData({ ...formData, cep: e.target.value })} />
                            <label htmlFor="state" className="font-bold my-2">Estado <span className="text-xs text-red-500">*</span></label>
                            <input required={true} type="text" id="state" className="p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
                            <label htmlFor="city" className="font-bold my-2">Município <span className="text-xs text-red-500">*</span></label>
                            <input required={true} type="text" id="city" className="p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                            <label htmlFor="neighborhood" className="font-bold my-2">Bairro <span className="text-xs text-red-500">*</span></label>
                            <input required={true} type="text" id="neighborhood" className="p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })} />
                            <label htmlFor="address" className="font-bold my-2">Endereço <span className="text-xs text-red-500">*</span></label>
                            <input required={true} type="text" id="address" className="p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                            <label htmlFor="number" className="font-bold my-2">Número <span className="text-xs text-red-500">*</span></label>
                            <input required={true} type="text" id="number" className="p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, number: e.target.value })} />
                            <label htmlFor="complement" className="font-bold my-2">Complemento <span className="font-extralight text-xs mb-4">(opcional)</span></label>
                            <input type="text" id="complement" className="p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, complement: e.target.value })} />
                        </div>
                    </div>
                </div>
                <button className="bg-black text-blue-200 p-4 rounded-xl hover:bg-gray-800 min-w-[100px] font-bold text-center block mx-auto my-8">Finalizar compra</button>
            </form>
        </>
    )
}