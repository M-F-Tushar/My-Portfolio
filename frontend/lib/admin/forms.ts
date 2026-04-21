import { revalidatePath } from 'next/cache';
import { parseStringArray } from '@/lib/content/json';

export function requiredString(formData: FormData, name: string, label: string) {
    const value = formData.get(name);

    if (typeof value !== 'string') {
        throw new Error(`${label} is required.`);
    }

    const trimmed = value.trim();

    if (!trimmed) {
        throw new Error(`${label} is required.`);
    }

    return trimmed;
}

export function optionalString(formData: FormData, name: string) {
    const value = formData.get(name);

    if (typeof value !== 'string') {
        return null;
    }

    const trimmed = value.trim();
    return trimmed ? trimmed : null;
}

export function stringWithDefault(formData: FormData, name: string, fallback: string) {
    return optionalString(formData, name) ?? fallback;
}

export function intWithDefault(formData: FormData, name: string, fallback = 0) {
    const value = formData.get(name);

    if (typeof value !== 'string') {
        return fallback;
    }

    const trimmed = value.trim();

    if (!trimmed) {
        return fallback;
    }

    if (!/^-?\d+$/.test(trimmed)) {
        throw new Error(`${name} must be a whole number.`);
    }

    return Number.parseInt(trimmed, 10);
}

export function requiredId(formData: FormData) {
    const id = intWithDefault(formData, 'id', Number.NaN);

    if (!Number.isInteger(id) || id <= 0) {
        throw new Error('A valid record id is required.');
    }

    return id;
}

export function checkboxValue(formData: FormData, name: string) {
    const value = formData.get(name);
    return value === 'on' || value === 'true' || value === '1';
}

export function enumValue<T extends string>(
    formData: FormData,
    name: string,
    allowed: readonly T[],
    fallback: T,
) {
    const value = formData.get(name);

    if (typeof value !== 'string' || !value) {
        return fallback;
    }

    if (!allowed.includes(value as T)) {
        throw new Error(`${name} has an invalid value.`);
    }

    return value as T;
}

export function listFromForm(formData: FormData, name: string) {
    const value = optionalString(formData, name);

    if (!value) {
        return '[]';
    }

    const items = value
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter(Boolean);

    return JSON.stringify(items);
}

export function listInputValue(value: string | null | undefined) {
    return parseStringArray(value).join(', ');
}

export function revalidateAdminPaths(adminPath: string, publicPaths: string[] = ['/']) {
    revalidatePath(adminPath);

    for (const path of publicPaths) {
        revalidatePath(path);
    }
}
