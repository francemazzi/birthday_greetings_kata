export interface ValidationResult {
  success: boolean;
  errors?: string[];
}

export interface CSVResponse<T> {
  success: boolean;
  data?: T[];
  message: string;
  errors?: string[];
}
