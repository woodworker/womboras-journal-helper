export const removeTableColumns = (table: HTMLTableElement, columns: number[]): HTMLTableElement => {
    const colCount = tableColumnCount(table);
    const validColumns = columns.filter((column) => {
        return column < colCount;
    });
    if (validColumns.length === 0) return table;

    Array.from(table.rows)
        .reverse()
        .forEach((row) => {
            Array.from(row.cells)
                .reverse()
                .forEach((cell) => {
                    const indicies = getCellColumnIndices(cell);
                    const affectedIndicies = indicies.filter((index) => {
                        return columns.includes(index);
                    });
                    if (affectedIndicies.length === indicies.length) {
                        cell.remove();
                    } else {
                        cell.colSpan = cell.colSpan - affectedIndicies.length;
                    }
                });
        });
    return table;
};

export const getCellColumnIndices = (cell: HTMLTableCellElement): number[] => {
    const parent = cell.parentElement as HTMLTableRowElement | null;
    if (!parent) return [];

    let startIndex = 0;
    for (let i = 0; i < cell.cellIndex; i++) {
        startIndex = startIndex + parent.cells[i].colSpan;
    }

    const indices: number[] = [];
    for (let i = 0; i < cell.colSpan; i++) {
        indices.push(startIndex + i);
    }

    return indices;
};

const tableColumnCount = (table: HTMLTableElement): number => {
    const colCount: number[] = [];
    Array.from(table.rows).forEach((row) => {
        const rowColCount = Array.from(row.cells).reduce((prev, cell) => {
            return prev + cell.colSpan;
        }, 0);
        colCount.push(rowColCount);
    });
    return Math.max(...colCount);
};
