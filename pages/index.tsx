import { Box, Container, Flex, Input } from '@chakra-ui/react';
import { ViewData } from '@components/ViewData';
import type { NextPage } from 'next';
import { SettingsBar } from '../components/SettingsBar';
import { useState, useEffect } from 'react';

const Home: NextPage = () => {
	const [binded, setBinded] = useState(false);

	useEffect(() => {
		setBinded(true);
	}, []);

	if (!binded) return <></>;
	return (
		<Flex w="100vw">
			<SettingsBar />
			<ViewData />
		</Flex>
	);
};

export default Home;

