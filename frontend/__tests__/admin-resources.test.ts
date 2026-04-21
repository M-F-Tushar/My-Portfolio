import { adminResourceLabels, isAdminResource } from '@/lib/admin/resources';

describe('admin resources', () => {
    it('allows only supported admin resource names', () => {
        expect(isAdminResource('projects')).toBe(true);
        expect(isAdminResource('blog-posts')).toBe(false);
    });

    it('does not expose blog resources in the private admin API allowlist', () => {
        expect(Object.keys(adminResourceLabels)).not.toContain('blog-posts');
    });
});
