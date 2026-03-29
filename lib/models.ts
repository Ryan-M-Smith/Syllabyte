/**
 * @file models.ts
 * @description Data models for the Syllabyte application
 * @authors Ryan Smith <rysmith2113@gmail.com>
 *          Kenneth Tran <kwtran09@gmail.com>
 *          Simon Ramsey <ramsey2005s@gmail.com>
 *          Obed Mavungu <obedmavungu1@gmail.com>
 * @created March 29, 2026
 * @copyright 2026 Syllabyte Team
 */

/**
 * Course interface representing a university course with relevant metadata
 */
export interface Course {
	code: 		string;
	name: 		string;
	professor: 	string;
	fileCount: 	number;
}