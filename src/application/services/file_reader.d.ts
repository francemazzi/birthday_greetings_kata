export interface CSVRecord {
  [key: string]: string | number | boolean | null;
}
export interface UserCSVRecord extends CSVRecord {
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
}
