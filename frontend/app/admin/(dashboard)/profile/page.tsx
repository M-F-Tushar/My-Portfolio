import FormField from '@/components/admin/FormField';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/session';
import { requiredString, revalidateAdminPaths } from '@/lib/admin/forms';

async function saveProfile(formData: FormData) {
    'use server';

    await requireAdmin();

    const data = {
        displayName: requiredString(formData, 'displayName', 'Display name'),
        role: requiredString(formData, 'role', 'Role'),
        shortBio: requiredString(formData, 'shortBio', 'Short bio'),
        about: requiredString(formData, 'about', 'About'),
        location: requiredString(formData, 'location', 'Location'),
        email: requiredString(formData, 'email', 'Email'),
        currentFocus: requiredString(formData, 'currentFocus', 'Current focus'),
    };

    await prisma.profile.upsert({
        where: { id: 1 },
        update: data,
        create: { id: 1, ...data },
    });

    revalidateAdminPaths('/admin/profile', ['/', '/resume']);
}

export default async function AdminProfilePage() {
    const profile = await prisma.profile.findUnique({ where: { id: 1 } });

    return (
        <div className="space-y-8">
            <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Profile</p>
                <h1 className="text-3xl font-semibold tracking-tight text-white">Edit profile content</h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-400">
                    Update the owner details used across the home page and resume page.
                </p>
            </section>

            <form action={saveProfile} className="space-y-6 rounded-lg border border-white/10 bg-slate-900/70 p-5">
                <div className="grid gap-5 md:grid-cols-2">
                    <FormField label="Display name" name="displayName" required defaultValue={profile?.displayName} />
                    <FormField label="Role" name="role" required defaultValue={profile?.role} />
                    <FormField label="Location" name="location" required defaultValue={profile?.location} />
                    <FormField label="Email" name="email" type="email" required defaultValue={profile?.email} />
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
