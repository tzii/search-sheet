import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import 'react-data-grid/lib/styles.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider>
			<Head>
				<title>Đông bán thuốc</title>
				{/* <meta name="viewport" content="initial-scale=1.0, width=device-width" /> */}
			</Head>
			<Component {...pageProps} />
		</ChakraProvider>
	);
}

export default MyApp;

