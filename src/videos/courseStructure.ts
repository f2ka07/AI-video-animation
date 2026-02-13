// Course structure for multi-course support
// This file defines all courses and their modules

export type CourseStatus = 'active' | 'archived';

export interface Course {
	id: string;
	title: string;
	description: string;
	moduleCount: number;
	status: CourseStatus;      // 'active' or 'archived'
	archivedAt?: string;       // ISO date when archived
}

// Define all courses
// Note: Runtime course state (status, archivedAt) is managed in courses.json
// This array provides the base course definitions
export const courses: Course[] = [
	{
		id: 'aws-pulumi',
		title: 'AWS Infrastructure as Code with Pulumi',
		description: 'Complete course on building AWS infrastructure using Pulumi and TypeScript',
		moduleCount: 12,
		status: 'active'
	},
	{
		id: 'tech-news',
		title: 'Are Solo Developers Replacing Small Companies?',
		description: 'This angle hits three strong psychological levers for general audiences: fear, novelty and identity. It also avoids the sleaze of side-hustle content.',
		moduleCount: 2,
		status: 'active'
	},
	{
		id: 'the-one-person-company-era-just-started',
		title: 'The One-Person Company Era Just Started',
		description: 'Companies with fifty employees used to build software like this. Now one developer with a laptop and an AI stack can do the same job in a weekend. No offices, no meetings and no fundraising. This is not a prediction. It is already happening.',
		moduleCount: 0,
		status: 'active'
	},
	{
		id: 'iac-story',
		title: 'IaC Story',
		description: 'Infrastructure as Code Story',
		moduleCount: 0,
		status: 'active'
	}
];

// Course-to-module mapping
// This maps which modules belong to which course
export const courseModuleMapping: Record<string, number[]> = {'aws-pulumi': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
	// Add more mappings:
	// 'docker-fundamentals': [1, 2, 3, 4, 5, 6, 7, 8],
		'tech-news': [20, 19],
		'the-one-person-company-era-just-started': [],
		'iac-story': []
};

// Get modules for a course
export function getModulesForCourse(courseId: string): number[] {
	return courseModuleMapping[courseId] || [];
}

// Get course by ID
export function getCourseById(courseId: string): Course | undefined {
	return courses.find(c => c.id === courseId);
}

// Get default course (for backward compatibility)
export function getDefaultCourse(): Course {
	return courses[0] || { id: 'default', title: 'Default Course', description: '', moduleCount: 0, status: 'active' };
}

// Get active courses only
export function getActiveCourses(): Course[] {
	return courses.filter(c => c.status === 'active');
}

// Get archived courses only
export function getArchivedCourses(): Course[] {
	return courses.filter(c => c.status === 'archived');
}
