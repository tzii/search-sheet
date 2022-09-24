import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
	Button,
	Checkbox,
	CheckboxGroup,
	Slider,
	SliderFilledTrack,
	SliderMark,
	SliderThumb,
	SliderTrack,
	Stack,
	Text,
	Tooltip,
} from '@chakra-ui/react';
import { useDataStore } from '@stores';
import { ChangeEventHandler, startTransition, useState } from 'react';
import { read, utils } from 'xlsx';
import ThresholdSetting from './ThresholdSetting';

export const SettingsBar = () => {
	const [showTooltip, setShowTooltip] = useState(false);
	const [isImporting, setIsImporting] = useState(false);
	const { importWorkBook, fileName, columns, viewColumns, updateViewColumns, fuseOptions, updateIndexKeys, updateThreshold } =
		useDataStore();
	const [slide, setSlide] = useState(fuseOptions.threshold);
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

	const onSlideChange = (v: number) => {
		setSlide(v);
		// startTransition(() => {
		// 	updateThreshold(v);
		// });
	};

	return (
		<Box w="72" borderRight="1px" borderColor="gray.400" h="100vh" px="3" py="2" overflow="auto">
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
			<Accordion allowMultiple mt={3} defaultIndex={[]}>
				<AccordionItem>
					<h2>
						<AccordionButton>
							<Box flex="1" textAlign="left">
								Cột hiển thị
							</Box>
							<AccordionIcon />
						</AccordionButton>
					</h2>
					<AccordionPanel pb={4}>
						<CheckboxGroup colorScheme="green" value={viewColumns.map((x) => x.key)} onChange={updateViewColumns}>
							<Stack spacing="1" direction="column">
								{columns.map((column) => (
									<Checkbox key={column.key} value={column.key}>
										{column.name}
									</Checkbox>
								))}
							</Stack>
						</CheckboxGroup>
					</AccordionPanel>
				</AccordionItem>
				<AccordionItem>
					<h2>
						<AccordionButton>
							<Box flex="1" textAlign="left">
								Giới hạn độ chính xác
							</Box>
							<AccordionIcon />
						</AccordionButton>
					</h2>
					<AccordionPanel pb={4}>
						<ThresholdSetting />
					</AccordionPanel>
				</AccordionItem>
				<AccordionItem>
					<h2>
						<AccordionButton>
							<Box flex="1" textAlign="left">
								Đánh chỉ mục tìm kiếm theo cột
							</Box>
							<AccordionIcon />
						</AccordionButton>
					</h2>
					<AccordionPanel pb={4}>
						<CheckboxGroup colorScheme="green" value={fuseOptions.keys as (string | number)[]} onChange={updateIndexKeys}>
							<Stack spacing="1" direction="column">
								{columns.map((column) => (
									<Checkbox key={column.key} value={column.key}>
										{column.name}
									</Checkbox>
								))}
							</Stack>
						</CheckboxGroup>
					</AccordionPanel>
				</AccordionItem>
			</Accordion>
		</Box>
	);
};
