import FormField from '@/components/admin/FormField';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/session';
import { intWithDefault, optionalString, requiredString, revalidateAdminPaths } from '@/lib/admin/forms';

async function saveProfile(formData: FormData) {
    'use server';

    await requireAdmin();

    const profileImageValue = optionalString(formData, 'profileImageId');
    const profileImageId = profileImageValue ? intWithDefault(formData, 'profileImageId') : null;
    const data = {
        displayName: requiredString(formData, 'displayName', 'Display name'),
        role: requiredString(formData, 'role', 'Role'),
        shortBio: requiredString(formData, 'shortBio', 'Short bio'),
        about: requiredString(formData, 'about', 'About'),
        location: requiredString(formData, 'location', 'Location'),
        email: requiredString(formData, 'email', 'Email'),
        currentFocus: requiredString(formData, 'currentFocus', 'Current focus'),
        yearsLabel: requiredString(formData, 'yearsLabel', 'Metric one label'),
        projectsLabel: requiredString(formData, 'projectsLabel', 'Metric two label'),
        profileImageId,
    };

    await prisma.profile.upsert({
        where: { id: 1 },
        update: data,
        create: { id: 1, ...data },
    });

    revalidateAdminPaths('/admin/profile', ['/', '/resume']);
}

export default async function AdminProfilePage() {
    const profile = await prisma.profile.findUnique({
        where: { id: 1 },
        include: { profileImage: true },
    });

    return (
        <div className="space-y-8">
            <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Profile</p>
                <h1 className="text-3xl font-semibold tracking-tight text-white">Edit profile content</h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-400">
                    Update the owner details, public portrait, and short labels used across the home page and resume page.
                </p>
            </section>

            <form action={saveProfile} className="space-y-6 rounded-lg border border-white/10 bg-slate-900/70 p-5">
                <ImageUploadField
                    fieldName="profileImageId"
                    initialMedia={profile?.profileImage ?? null}
                    label="Hero profile photo"
                    helperText="This portrait appears in the hero AI system visual."
                />
                <div className="grid gap-5 md:grid-cols-2">
                    <FormField label="Display name" name="displayName" required defaultValue={profile?.displayName} />
                    <FormField label="Role" name="role" required defaultValue={profile?.role} />
                    <FormField label="Location" name="location" required defaultValue={profile?.location} />
                    <FormField label="Email" name="email" type="email" required defaultValue={profile?.email} />
                    <FormField label="Metric one label" name="yearsLabel" required defaultValue={profile?.yearsLabel ?? 'CS Undergraduate'} />
                    <FormField label="Metric two label" name="projectsLabel" required defaultValue={profile?.projectsLabel ?? 'AI/ML Projects'} />
                </div>
                <FormField
                    label="Short bio"
                    name="shortBio"
                    required
                    textarea
                    rows={3}
                    defaultValue={profile?.shortBio}
                />
                <FormField label="About" name="about" required textarea rows={6} defaultValue={profile?.about} />
                <FormField
                    label="Current focus"
                    name="currentFocus"
                    required
                    textarea
                    rows={3}
                    defaultValue={profile?.currentFocus}
                />
                <div className="flex justify-end">
                    <button className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200">
                        Save profile
                    </button>
                </div>
            </form>
        </div>
    );
}
