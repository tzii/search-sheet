import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { utils, WorkBook } from 'xlsx';
import { Column } from 'react-data-grid';

interface DataState {
	fileName: string | null;
	importDate: Date | null;
	selectedSheet: string | null;
	columns: Column<unknown, unknown>[];
	viewHeaders: string[];
	workBook: WorkBook | null;
	tableData: unknown[] | null;
	importWorkBook: (workBook: WorkBook, fileName: string) => void;
}

export const useDataStore = create<DataState>()(
	devtools(
		persist(
			(set) => ({
				fileName: null,
				selectedSheet: null,
				importDate: null,
				columns: [],
				viewHeaders: [],
				workBook: null,
				tableData: null,
				importWorkBook: (workBook, fileName: string) => {
					if (!workBook.SheetNames.length) return;
					const selectedSheet = workBook.SheetNames[0];
					const data = utils.sheet_to_json(workBook.Sheets[selectedSheet], { header: 'A' });
					const [first, ...tableData] = data;
					const headerMap = first as Record<string, string>;
					set({
						fileName,
						selectedSheet,
						columns: Object.keys(headerMap).map((key) => ({ key, name: headerMap[key] })),
						workBook,
						tableData,
						viewHeaders: Object.keys(headerMap),
						importDate: new Date(),
					});
				},
			}),
			{
				name: 'data',
			}
		)
	)
);
