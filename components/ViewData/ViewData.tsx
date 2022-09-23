import { Box, Flex, Text } from '@chakra-ui/react';
import { useDataStore } from '@stores';
import DataGrid from 'react-data-grid';

export const ViewData = () => {
	const { tableData, columns } = useDataStore();
	return (
		<Flex py="2" px="3" flex="1" flexDirection="column" overflow="hidden" blockSize="100vh">
			<Text fontSize="4xl" fontWeight="semibold" textAlign="center" mb="3">
				Đông bán thuốc
			</Text>
			{!tableData ? (
				<Text>Không có dữ liệu</Text>
			) : (
				<DataGrid
					rows={tableData}
					columns={columns}
					defaultColumnOptions={{
						sortable: true,
						resizable: true,
					}}
					style={{ blockSize: '100%' }}
				/>
			)}
		</Flex>
	);
};
