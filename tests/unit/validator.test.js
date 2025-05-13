import { describe, it, expect, vi } from 'vitest';
import { validateUserCode } from '../../src/helpers/validator.js';

describe('CSS Validator', () => {
    // Mock document functions since we're not in a browser
    document.createElement = vi.fn().mockImplementation(() => {
        return {
            textContent: '',
            parentNode: { removeChild: vi.fn() }
        };
    });

    // document.head = {
    //     appendChild: vi.fn(),
    //     removeChild: vi.fn()
    // };

    describe('validateUserCode', () => {
        it('should pass when no validations are specified', () => {
            const userCode = 'div { color: red; }';
            const lesson = { title: 'Test Lesson' };

            const result = validateUserCode(userCode, lesson);

            expect(result.isValid).toBe(true);
            expect(result.message).toContain('No validations specified');
        });

        it('should pass with empty validations array', () => {
            const userCode = 'div { color: red; }';
            const lesson = {
                title: 'Test Lesson',
                validations: []
            };

            const result = validateUserCode(userCode, lesson);

            expect(result.isValid).toBe(true);
            expect(result.message).toBe('Your code looks good!');
        });

        it('should validate "contains" rule correctly', () => {
            const userCode = 'div { color: red; }';
            const lesson = {
                validations: [
                    { type: 'contains', value: 'color: red', message: 'Should use red color' }
                ]
            };

            const result = validateUserCode(userCode, lesson);
            expect(result.isValid).toBe(true);

            const failLesson = {
                validations: [
                    { type: 'contains', value: 'color: blue', message: 'Should use blue color' }
                ]
            };

            const failResult = validateUserCode(userCode, failLesson);
            expect(failResult.isValid).toBe(false);
            expect(failResult.message).toBe('Should use blue color');
        });

        it('should validate "not_contains" rule correctly', () => {
            const userCode = 'div { color: red; }';
            const lesson = {
                validations: [
                    { type: 'not_contains', value: 'color: blue', message: 'Should not use blue color' }
                ]
            };

            const result = validateUserCode(userCode, lesson);
            expect(result.isValid).toBe(true);

            const failLesson = {
                validations: [
                    { type: 'not_contains', value: 'color: red', message: 'Should not use red color' }
                ]
            };

            const failResult = validateUserCode(userCode, failLesson);
            expect(failResult.isValid).toBe(false);
            expect(failResult.message).toBe('Should not use red color');
        });

        it('should validate "regex" rule correctly', () => {
            const userCode = 'div { color: #ff0000; }';
            const lesson = {
                validations: [
                    { type: 'regex', value: '#[a-f0-9]{6}', message: 'Should use hex color' }
                ]
            };

            const result = validateUserCode(userCode, lesson);
            expect(result.isValid).toBe(true);

            const failLesson = {
                validations: [
                    { type: 'regex', value: 'rgb\\(\\d+,\\s*\\d+,\\s*\\d+\\)', message: 'Should use RGB color' }
                ]
            };

            const failResult = validateUserCode(userCode, failLesson);
            expect(failResult.isValid).toBe(false);
            expect(failResult.message).toBe('Should use RGB color');
        });

        it('should validate "property_value" rule correctly', () => {
            const userCode = 'div { display: flex; }';
            const lesson = {
                validations: [
                    {
                        type: 'property_value',
                        value: { property: 'display', expected: 'flex' },
                        message: 'Should use display: flex'
                    }
                ]
            };

            const result = validateUserCode(userCode, lesson);
            expect(result.isValid).toBe(true);

            const failLesson = {
                validations: [
                    {
                        type: 'property_value',
                        value: { property: 'display', expected: 'grid' },
                        message: 'Should use display: grid'
                    }
                ]
            };

            const failResult = validateUserCode(userCode, failLesson);
            expect(failResult.isValid).toBe(false);
            expect(failResult.message).toBe('Should use display: grid');
        });

        it('should handle complex validation chains', () => {
            const userCode = 'div { display: flex; color: red; }';
            const lesson = {
                validations: [
                    { type: 'contains', value: 'display: flex' },
                    { type: 'contains', value: 'color: red' },
                    { type: 'not_contains', value: 'float:' }
                ]
            };

            const result = validateUserCode(userCode, lesson);
            expect(result.isValid).toBe(true);

            // First failing validation should cause early return
            const failLesson = {
                validations: [
                    { type: 'contains', value: 'display: flex' },
                    { type: 'contains', value: 'border: 1px solid black', message: 'Missing border' },
                    { type: 'not_contains', value: 'color: green' }
                ]
            };

            const failResult = validateUserCode(userCode, failLesson);
            expect(failResult.isValid).toBe(false);
            expect(failResult.message).toBe('Missing border');
        });

        it('should validate "custom" rule correctly', () => {
            const userCode = 'div { margin: 10px; }';
            const customValidator = (code) => {
                return {
                    isValid: code.includes('margin'),
                    message: 'Should include margin property'
                };
            };

            const lesson = {
                validations: [
                    {
                        type: 'custom',
                        validator: customValidator
                    }
                ]
            };

            const result = validateUserCode(userCode, lesson);
            expect(result.isValid).toBe(true);

            const failValidator = (code) => {
                return {
                    isValid: code.includes('padding'),
                    message: 'Should include padding property'
                };
            };

            const failLesson = {
                validations: [
                    {
                        type: 'custom',
                        validator: failValidator,
                        message: 'Custom validation failed'
                    }
                ]
            };

            const failResult = validateUserCode(userCode, failLesson);
            expect(failResult.isValid).toBe(false);
            expect(failResult.message).toBe('Should include padding property');
        });

        it('should handle options in validations', () => {
            // Case insensitive test
            const userCode = 'div { COLOR: Red; }';
            const lesson = {
                validations: [
                    {
                        type: 'contains',
                        value: 'color: red',
                        options: { caseSensitive: false }
                    }
                ]
            };

            const result = validateUserCode(userCode, lesson);
            expect(result.isValid).toBe(true);

            // With exact match required
            const exactLesson = {
                validations: [
                    {
                        type: 'property_value',
                        value: { property: 'color', expected: 'red' },
                        options: { exact: true }
                    }
                ]
            };

            const failExactResult = validateUserCode('div { color: RED; }', exactLesson);
            expect(failExactResult.isValid).toBe(false);
        });
    });
});