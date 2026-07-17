export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP";

// Shape passed from server components to the public careers UI.
export interface PublicJobRole {
  slug: string;
  titleEn: string;
  titleFr: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  summaryEn: string;
  summaryFr: string;
}
