import { FormEvent, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Toast from "@/components/Toast";

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  const [result, setResult] = useState({
    error: false,
    show: false,
    content: ""
  })
  const router = useRouter()
  const session = useSession()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (formData.username !== "" && formData.password !== "") {
      const res = await signIn("credentials", {
        username: formData.username,
        password: formData.password,
        redirect: false,
      })

      if (res?.ok) {
        const username = session.data?.user?.name;
        if (formData.username === "admin") {
          router.push("/admin/menu");
        } else {
          router.push("/afiliado/menu");
        }
      } else {
        setResult({
          error: true,
          show: true,
          content: "Credenciais inválidas."
        })
      }
    }
  }

  if (session.status === 'authenticated') {
    return (
      <>
        <button onClick={() => signOut()}>Logout</button>
        <div>Sem permissão.</div>
      </>
    )
  }

  return (
    <>
      {
        result.show && <Toast content={result.content} error={result.error} />
      }
        <h2 className="text-2xl text-center my-4">Autenticação de usuário</h2>
        <form onSubmit={(e) => handleSubmit(e)} className="mx-auto border p-4 rounded-xl w-full lg:w-1/2 flex flex-col">
          <label htmlFor="cep" className="font-bold my-2">Nome de usuário: <span className="text-xs text-red-500">*</span></label>
          <input required={true} type="text" id="cep" className="p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
          <label htmlFor="state" className="font-bold my-2">Senha: <span className="text-xs text-red-500">*</span></label>
          <input required={true} type="password" id="state" className="p-2 border rounded-md" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <button className="p-4 border rounded-xl text-center cursor-pointer w-1/3 mx-auto my-4 bg-gradient-to-tr from-slate-600 to-black text-white font-bold hover:opacity-95">Login</button>
        </form>
    </>
  )
}