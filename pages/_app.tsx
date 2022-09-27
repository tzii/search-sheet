import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import 'react-data-grid/lib/styles.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider>
			<Head>
				{/* <title>Đông bán thuốc</title> */}
				{/* <link rel="icon" href="/dong.gif" type="image/gif" /> */}
				<title>Bệnh viện đa khoa Thủy Nguyên</title>
				<link rel="icon" href="/logo-bv.png" type="image/png" />
				{/* <meta name="viewport" content="initial-scale=1.0, width=device-width" /> */}
			</Head>
			<Component {...pageProps} />
		</ChakraProvider>
	);
}

export default MyApp;

