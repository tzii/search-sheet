import { Box, Flex, Input, InputGroup, InputLeftAddon, Text } from '@chakra-ui/react';
import { useDataStore } from '@stores';
import Image from 'next/image';
import DataGrid from 'react-data-grid';
import { useEffect, useState, ChangeEventHandler, useTransition } from 'react';
import { SearchIcon } from '@chakra-ui/icons';
import Fuse from 'fuse.js';

export const ViewData = () => {
	const [search, setSearch] = useState('');
	const { tableData, columns } = useDataStore();
	const [fuse, setFuse] = useState(
		new Fuse(tableData || [], { includeScore: true, minMatchCharLength: 2, keys: columns.map((c) => c.key) })
	);
	const [filtedData, SetFiltedData] = useState(tableData);
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		setFuse(new Fuse(tableData || [], { includeScore: true, minMatchCharLength: 2, keys: columns.map((c) => c.key) }));
		console.log(columns.map((c) => c.key));
	}, [tableData]);

	const onSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		const searchString = e.target.value;
		setSearch(e.target.value);
		startTransition(() => {
			if (searchString == '') {
				SetFiltedData(tableData);
				return;
			}
			const result = fuse.search(searchString);
			console.log(result);
			SetFiltedData(result.map((x) => x.item));
		});
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
