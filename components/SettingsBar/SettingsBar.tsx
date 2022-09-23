import { Box, Button, Text } from '@chakra-ui/react';
import { useDataStore } from '@stores';
import { ChangeEventHandler, useState } from 'react';
import { read, utils } from 'xlsx';

export const SettingsBar = () => {
	const [isImporting, setIsImporting] = useState(false);
	const { importWorkBook, fileName, importDate } = useDataStore();
	const onFileChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
		if (!e.target.files?.length) return;
		setIsImporting(true);
		const file = e.target.files[0];
		const data = await file.arrayBuffer();
		const workbook = read(data);
		importWorkBook(workbook, file.name);
		setIsImporting(false);
		// @ts-ignore
		e.target.value = null;
	};
	return (
		<Box w="72" borderRight="1px" borderColor="gray.400" h="100vh" px="3" py="2">
			{fileName ? <Text color="green.700">{fileName}</Text> : <Text color="orange.500">Chưa có dữ liệu, vui lòng tải file</Text>}

			<Text fontSize="lg" fontWeight="semibold" mt="3">
				Tải file excel (.xlsx, .xls, .csv)
			</Text>
			<label htmlFor="excel-input">
				<Button as="span" isLoading={isImporting}>
					Tải file
				</Button>
				<input
					type="file"
					id="excel-input"
					hidden
					accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
					onChange={onFileChange}
				/>
			</label>
		</Box>
	);
};
