import * as XLSX from 'xlsx';

// Internal buffer cache for uploaded files (keyed by file ID or slug)
const fileBufferCache = new Map<string, { buffer: Buffer; filename: string; mimeType: string; size: number }>();

export interface ParsedSpreadsheet {
  columns: string[];
  totalRows: number;
  previewRows: Record<string, any>[];
  sheetNames: string[];
}

export const storage = {
  // Parse CSV or XLSX buffer
  parseSpreadsheet: (buffer: Buffer, originalFilename: string): ParsedSpreadsheet => {
    try {
      // Read workbook from buffer
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const firstSheetName = workbook.SheetNames[0];
      if (!firstSheetName) {
        throw new Error('No sheets found in spreadsheet');
      }

      const worksheet = workbook.Sheets[firstSheetName];
      
      // Parse as array of arrays (header + rows)
      const rawData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
      if (rawData.length === 0) {
        throw new Error('The spreadsheet is completely empty');
      }

      // First row as headers
      const rawHeaders = rawData[0] || [];
      const columns: string[] = rawHeaders.map((col: any, idx: number) => {
        const str = String(col || '').trim();
        return str.length > 0 ? str : `Column_${idx + 1}`;
      });

      const totalRows = Math.max(0, rawData.length - 1);

      // Generate preview rows (up to 10)
      const previewRows: Record<string, any>[] = [];
      const previewLimit = Math.min(rawData.length, 11);

      for (let r = 1; r < previewLimit; r++) {
        const row = rawData[r];
        if (!row || row.length === 0 || row.every((val: any) => String(val).trim() === '')) {
          continue; // Skip entirely blank rows
        }

        const rowObj: Record<string, any> = {};
        columns.forEach((col, idx) => {
          rowObj[col] = row[idx] !== undefined ? String(row[idx]).trim() : '';
        });
        previewRows.push(rowObj);
      }

      return {
        columns,
        totalRows,
        previewRows,
        sheetNames: workbook.SheetNames
      };
    } catch (err: any) {
      console.error('Spreadsheet parsing failed:', err);
      throw new Error(`Failed to parse spreadsheet file: ${err.message || 'Invalid format'}`);
    }
  },

  // Store file in buffer cache (or Vercel Blob if configured)
  saveFile: async (id: string, filename: string, buffer: Buffer, mimeType: string): Promise<string> => {
    fileBufferCache.set(id, {
      buffer,
      filename,
      mimeType,
      size: buffer.length
    });

    // If Vercel Blob token is set, we could push to Vercel Blob
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        console.log(`[Storage] Vercel Blob configured. Ready for external blob upload for file ${filename}.`);
      } catch (e) {
        console.error('Vercel Blob error:', e);
      }
    }

    // Return a protected internal API URL for downloading
    return `/api/lead-samples/download/${id}`;
  },

  // Retrieve stored file
  getFile: (id: string) => {
    return fileBufferCache.get(id);
  },

  // Delete stored file
  deleteFile: (id: string) => {
    fileBufferCache.delete(id);
  }
};
