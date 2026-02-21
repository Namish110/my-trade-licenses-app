export interface LocationDetails{
  success: boolean;
  message: string;
  latitude: number | null;
  longitude: number | null,
  roadID: string,
  roadWidthMtrs: number | null,
  roadCategoryCode: string,
  roadCategory: string,
  isConfirmed: boolean,
  entryDate: Date | null
}

export interface LicensesApplicationDocument {
  ApplicationDocumentID: number;
  LicenceApplicationID: number;
  DocumentID: number;
  documentName: string;
  FileName: string;
  FilePath: string;
  FileExtension: string;
  FileSizeKB: number;
  EntryDate: string; // ISO date string
}
