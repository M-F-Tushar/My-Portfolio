export const adminResourceLabels = {
    projects: 'Projects',
    demos: 'Demos',
    experience: 'Experience',
    education: 'Education',
    certifications: 'Certifications',
    achievements: 'Achievements',
    social: 'Social links',
    skills: 'Skills',
} as const;

export type AdminResource = keyof typeof adminResourceLabels;

export function isAdminResource(resource: string): resource is AdminResource {
    return Object.prototype.hasOwnProperty.call(adminResourceLabels, resource);
}
