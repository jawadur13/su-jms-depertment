export type FacultyType = 'leadership' | 'full-time' | 'part-time';

/**
 * Flexible section content. A section can be:
 *  - a plain paragraph (string)
 *  - a simple bullet list (string[])
 *  - grouped lists with subheadings ({ heading, items }[])
 */
export type SectionContent =
  | string
  | string[]
  | { heading: string; items: string[] }[];

export interface Faculty {
  slug: string;
  name: string;
  designation: string;
  /** Used by leadership cards above the name (e.g. "Dean", "Head of Department"). */
  badge?: string;
  /** Optional second line under the designation (e.g. "Professor"). */
  secondaryTitle?: string;
  type: FacultyType;
  photo?: string;
  email?: string;
  suId?: string;
  phone?: string;

  // Detail sections — optional, fill in as content arrives.
  personalInfo?: { label: string; value: string }[];
  academicQualification?: SectionContent;
  trainingExperience?: SectionContent;
  teachingArea?: SectionContent;
  publications?: SectionContent;
  research?: SectionContent;
  awards?: SectionContent;
  membership?: SectionContent;
  previousEmployment?: SectionContent;
}
