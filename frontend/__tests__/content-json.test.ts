import { parseStringArray, stringifyStringArray, toSlug } from '@/lib/content/json';

describe('content JSON helpers', () => {
    it('parses only string array values', () => {
        expect(parseStringArray('["LLMs","MLOps",7,null]')).toEqual(['LLMs', 'MLOps']);
        expect(parseStringArray('not json')).toEqual([]);
    });

    it('serializes non-empty strings and ignores other values', () => {
        expect(stringifyStringArray(['AI', '', 'ML', 10, null])).toBe('["AI","ML"]');
    });

    it('creates stable URL slugs', () => {
        expect(toSlug('LLM Ops: RAG + Evaluation Pipeline')).toBe('llm-ops-rag-evaluation-pipeline');
    });
});
