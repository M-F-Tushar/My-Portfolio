import { contactSchema } from '@/lib/validations/contact';

describe('contactSchema', () => {
    it('accepts a complete contact message', () => {
        const parsed = contactSchema.parse({
            name: 'Mahir Faysal Tusher',
            email: 'mahir@example.com',
            message: 'I would like to discuss an AI engineering opportunity.',
        });

        expect(parsed).toEqual({
            name: 'Mahir Faysal Tusher',
            email: 'mahir@example.com',
            message: 'I would like to discuss an AI engineering opportunity.',
        });
    });

    it('rejects invalid email and very short messages', () => {
        const result = contactSchema.safeParse({
            name: 'M',
            email: 'not-an-email',
            message: 'short',
        });

        expect(result.success).toBe(false);
    });
});
