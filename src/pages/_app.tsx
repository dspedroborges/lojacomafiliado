import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import { QueryClientProvider } from 'react-query'
import { queryClient } from '../react-query.config'
import { SessionProvider } from 'next-auth/react'
import Menu from '@/components/Menu'
import Footer from '@/components/Footer'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter()
  const { pathname } = router

  return <div className="flex">
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Head>
          <title>Loja Afiliado | Loja com sistema de afiliados</title>
          <link rel="shortcut icon" href="/logo.png" type="image/png" />
          <meta name="application-name" content="Loja Afiliado" />
          <meta charSet="UTF-8" />
          <meta name="description" content="Loja com sistema de afiliados" />
          <meta name="keywords" content="loja, afiliado"></meta>
          <meta http-equiv="content-language" content="pt-br" />
          <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
          <meta name="creator" content="Pedro Borges" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />

          <meta itemProp="name" content="Loja Afiliado" />
          <meta itemProp="description" content="Loja com sistema de afiliados" />
          <meta itemProp="image" content="/logo.png" />

          <meta name="twitter:title" content="Loja Afiliado" />
          <meta name="twitter:description" content="Loja com sistema de afiliados" />
          <meta name="twitter:image" content="/logo.png" />

          <meta property="og:title" content="Loja Afiliado" />
          <meta property="og:type" content="article" />
          <meta property="og:url" content="" />
          <meta property="og:image" content="/logo.png" />
          <meta property="og:description" content="Loja com sistema de afiliados" />
          <meta property="og:site_name" content="Loja Afiliado" />

          {/* Google */}
        </Head>
        <div className="w-full">
          <Menu/>

          <Component {...pageProps} />
          {
            pathname.search('/sistema/') === -1 && (
              <>
                <div className="w-[75px] h-[75px] rounded-full fixed bottom-5 right-5 animate-ping bg-green-300 z-50"></div>
                <Link href="https://wa.me/5561998746331?text=Olá, Loja Afiliado%21" target="_blank">
                  <img
                    src="/whatsapp.png"
                    alt="Whatsapp logo"
                    width={75}
                    height={75}
                    className="fixed bottom-5 right-5 cursor-pointer hover:scale-110 transition-all z-50"
                  />
                </Link>
                <Footer />
              </>
            )
          }
        </div>
      </QueryClientProvider>
    </SessionProvider>
  </div>
}
