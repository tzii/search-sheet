import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { utils, WorkBook } from 'xlsx';
import { Column } from 'react-data-grid';
import Fuse from 'fuse.js';

interface DataState {
	fileName: string | null;
	importDate: Date | null;
	selectedSheet: string | null;
	columns: Column<unknown, unknown>[];
	viewColumns: Column<unknown, unknown>[];
	workBook: WorkBook | null;
	tableData: unknown[] | null;
	fuseOptions: Fuse.IFuseOptions<unknown>;
	importWorkBook: (workBook: WorkBook, fileName: string) => void;
	updateViewColumns: (cs: string[]) => void;
	updateIndexKeys: (keys: string[]) => void;
	updateThreshold: (t: number) => void;
	changeSheet: (s: string) => void;
	clear: () => void;
}

export const useDataStore = create<DataState>()(
	devtools(
		persist(
			(set, get) => ({
				fileName: null,
				selectedSheet: null,
				importDate: null,
				columns: [],
				viewColumns: [],
				workBook: null,
				tableData: null,
				fuseOptions: {
					threshold: 0.2,
					includeScore: true,
					ignoreLocation: true,
					keys: [] as string[],
				},
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
						viewColumns: Object.keys(headerMap).map((key) => ({ key, name: headerMap[key] })),
						fuseOptions: { ...get().fuseOptions, keys: Object.keys(headerMap) },
						importDate: new Date(),
					});
				},

				updateViewColumns: (cs: string[]) => {
					set({ viewColumns: cs.map((c) => get().columns.find((column) => column.key == c) as Column<unknown>) });
				},
				updateIndexKeys: (keys: string[]) => {
					set({ fuseOptions: { ...get().fuseOptions, keys } });
				},
				updateThreshold: (t: number) => {
					set({ fuseOptions: { ...get().fuseOptions, threshold: t } });
				},
				changeSheet: (s) => {
					const workBook = get().workBook;
					const data = utils.sheet_to_json(workBook!.Sheets[s], { header: 'A' });
					const [first, ...tableData] = data;
					const headerMap = first as Record<string, string>;
					set({
						selectedSheet: s,
						tableData,
						columns: Object.keys(headerMap).map((key) => ({ key, name: headerMap[key] })),
						viewColumns: Object.keys(headerMap).map((key) => ({ key, name: headerMap[key] })),
						fuseOptions: { ...get().fuseOptions, keys: Object.keys(headerMap) },
					});
				},
				clear: () => {
					set({
						fileName: null,
						selectedSheet: null,
						importDate: null,
						columns: [],
						viewColumns: [],
						workBook: null,
						tableData: null,
						fuseOptions: {
							threshold: 0.2,
							includeScore: true,
							ignoreLocation: true,
							keys: [] as string[],
						},
					});
				},
			}),
			{
				name: 'data',
			}
		)
	)
);
