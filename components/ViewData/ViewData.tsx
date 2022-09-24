import { SearchIcon } from '@chakra-ui/icons';
import { Flex, Input, InputGroup, InputLeftAddon, Text } from '@chakra-ui/react';
import { useDataStore } from '@stores';
import Fuse from 'fuse.js';
import Image from 'next/image';
import { ChangeEventHandler, useEffect, useMemo, useState, useTransition } from 'react';
import DataGrid, { CopyEvent, HeaderRendererProps } from 'react-data-grid';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DraggableHeaderRenderer } from './DragableHeader';

const options: Fuse.IFuseOptions<unknown> = {
	threshold: 0.2,
	includeScore: true,
	minMatchCharLength: 1,
};

export const ViewData = () => {
	const [search, setSearch] = useState('');
	const { tableData, columns, viewColumns, updateViewColumns, fuseOptions } = useDataStore();
	const [fuse, setFuse] = useState(new Fuse(tableData || [], { ...fuseOptions }));
	const [filtedData, SetFiltedData] = useState(tableData);
	const [isPending, startTransition] = useTransition();
	const draggableColumns = useMemo(() => {
		function headerRenderer(props: HeaderRendererProps<unknown>) {
			return <DraggableHeaderRenderer {...props} onColumnsReorder={handleColumnsReorder} />;
		}

		function handleColumnsReorder(sourceKey: string, targetKey: string) {
			const sourceColumnIndex = viewColumns.findIndex((c) => c.key === sourceKey);
			const targetColumnIndex = viewColumns.findIndex((c) => c.key === targetKey);
			const reorderedColumns = [...viewColumns];

			reorderedColumns.splice(targetColumnIndex, 0, reorderedColumns.splice(sourceColumnIndex, 1)[0]);

			// setColumns(reorderedColumns);
			updateViewColumns(reorderedColumns.map((c) => c.key));
		}

		return viewColumns.map((c) => ({ ...c, headerRenderer }));
	}, [viewColumns]);
	useEffect(() => {
		setFuse(new Fuse(tableData || [], { ...fuseOptions }));
	}, [tableData, fuseOptions]);

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
	function handleCopy({ sourceRow, sourceColumnKey }: CopyEvent<unknown>): void {
		if (window.isSecureContext) {
			// @ts-ignore
			navigator.clipboard.writeText(sourceRow[sourceColumnKey]);
		}
	}

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
				<DndProvider backend={HTML5Backend}>
					<DataGrid
						rows={filtedData}
						columns={draggableColumns}
						defaultColumnOptions={{
							resizable: true,
						}}
						onCopy={handleCopy}
						style={{ blockSize: '100%' }}
					/>
				</DndProvider>
			)}
		</Flex>
	);
};
