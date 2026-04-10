import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="az">
      <Head>
        {/* PWA və digər meta teqlər bura gedir */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />

        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon-192x192.png" type="image/png" />
        
        {/* İkonları public qovluğuna qoymağı unutmayın */}
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}