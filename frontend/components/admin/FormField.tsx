'use client';

import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

type BaseFieldProps = {
    label: string;
    hint?: string;
    error?: string;
    className?: string;
};

type InputFieldProps = BaseFieldProps & {
    multiline?: false;
    textarea?: false;
} & InputHTMLAttributes<HTMLInputElement>;

type TextareaFieldProps = BaseFieldProps & {
    multiline?: true;
    textarea?: true;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export type FormFieldProps = InputFieldProps | TextareaFieldProps;

const sharedClassName =
    'mt-2 w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15';

export default function FormField(props: FormFieldProps) {
    const { label, hint, error, className, multiline, textarea, ...fieldProps } = props;
    const fieldId = props.id ?? props.name;
    const wrapperClassName = ['space-y-2', className ?? ''].join(' ');

    return (
        <label className={wrapperClassName} htmlFor={fieldId}>
            <span className="block text-sm font-medium text-slate-200">{label}</span>
            {multiline || textarea ? (
                <textarea
                    {...(fieldProps as TextareaFieldProps)}
                    id={fieldId}
                    className={sharedClassName}
                />
            ) : (
                <input
                    {...(fieldProps as InputFieldProps)}
                    id={fieldId}
                    className={sharedClassName}
                />
            )}
            {hint ? <p className="text-xs leading-5 text-slate-500">{hint}</p> : null}
            {error ? <p className="text-xs leading-5 text-rose-300">{error}</p> : null}
        </label>
    );
}
