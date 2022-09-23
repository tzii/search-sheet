import { Box, Flex, Input, InputGroup, InputLeftAddon, Text } from '@chakra-ui/react';
import { useDataStore } from '@stores';
import Image from 'next/image';
import DataGrid from 'react-data-grid';
import { useEffect, useState, ChangeEventHandler, useTransition } from 'react';
import { SearchIcon } from '@chakra-ui/icons';
import Fuse from 'fuse.js';

const options: Fuse.IFuseOptions<unknown> = {
	threshold: 0.2,
	includeScore: true,
	minMatchCharLength: 1,
};

export const ViewData = () => {
	const [search, setSearch] = useState('');
	const { tableData, columns, viewColumns, indexKeys } = useDataStore();
	const [fuse, setFuse] = useState(new Fuse(tableData || [], { ...options, keys: indexKeys }));
	const [filtedData, SetFiltedData] = useState(tableData);
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		setFuse(new Fuse(tableData || [], { ...options, keys: indexKeys }));
		console.log(indexKeys);
	}, [tableData, indexKeys]);

	useEffect(() => {
		startTransition(() => {
			if (search == '') {
				SetFiltedData(tableData);
				return;
			}
			const result = fuse.search(search);
			console.log(result);
			SetFiltedData(result.map((x) => x.item));
		});
	}, [fuse, search]);

	const onSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		setSearch(e.target.value);
	};

	return (
		<Flex py="2" px="3" flex="1" flexDirection="column" overflow="hidden" blockSize="100vh">
			<Flex justifyContent="center" mb="3" alignItems="center">
				<Text fontSize="4xl" fontWeight="semibold" textAlign="center" mr="5">
					Đông bán thuốc
				</Text>
				<Image src="/dong.gif" width={42} height={39} alt="dong-ban-thuoc" />
			</Flex>

			<InputGroup mb="3">
				<InputLeftAddon pointerEvents="none">
					<SearchIcon color="gray.300" />
				</InputLeftAddon>
				<Input type="tel" placeholder="Nhập từ cần tìm kiếm" value={search} onChange={onSearchChange} />
			</InputGroup>

			{!tableData ? (
				<Text>Không có dữ liệu</Text>
			) : !filtedData ? (
				<Text>Không tìm thấy kết quả</Text>
			) : (
				<DataGrid
					rows={filtedData}
					columns={viewColumns}
					defaultColumnOptions={{
						resizable: true,
					}}
					style={{ blockSize: '100%' }}
				/>
			)}
		</Flex>
	);
};
