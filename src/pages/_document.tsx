import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-br">
      <Head>
          {/* Adicione o código do Google Tag Manager aqui */}
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-48328PKK66"></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-48328PKK66');
              `,
            }}
          />
          {/* Fim do código do Google Tag Manager */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
