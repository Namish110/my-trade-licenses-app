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