/**
 * @file config/schools.ts
 * @description School and course data types and static configuration
 * @authors Ryan Smith <rysmith2113@gmail.com>
 *          Kenneth Tran <kwtran09@gmail.com>
 *          Simon Ramsey <ramsey2005s@gmail.com>
 *          Obed Mavungu <obedmavungu1@gmail.com>
 * @created March 29, 2026
 * @copyright 2026 Syllabyte Team
 */

export type Course = {
  course_id: string;
  name: string;
  professor: string;
  file_count: number;
  files: string[];
};

export type School = {
  id: string;
  name: string;
  short: string;
  color: string;
  students: number;
  courses: Course[];
};

export const PENN_STATE: School = {
  id: "penn-state",
  name: "Penn State University",
  short: "PSU",
  color: "from-navy-900 to-navy-700",
  students: 142,
  courses: [
    {
      course_id: "CS-101",
      name: "Intro to Computer Science",
      professor: "Dr. Smith",
      file_count: 3,
      files: ["syllabus.pdf", "lecture1.md", "assignment1.py"],
    },
    {
      course_id: "MATH-201",
      name: "Linear Algebra",
      professor: "Dr. Johnson",
      file_count: 2,
      files: ["syllabus.pdf", "formulas.md"],
    },
    {
      course_id: "ENG-150",
      name: "Technical Writing",
      professor: "Dr. Williams",
      file_count: 4,
      files: ["syllabus.pdf", "reading-list.md", "essay-guide.pdf", "rubric.md"],
    },
  ],
};