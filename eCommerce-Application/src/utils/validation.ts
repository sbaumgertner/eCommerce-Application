export enum ValidationError {
    TEXT_ERROR = 'Must contain at least one character and no special characters or numbers',
}

export type ValidationResult = {
    isValid: boolean;
    error?: ValidationError;
};

export class Validation {
    public static checkText(value: string): ValidationResult {
        const regex = /^[a-zA-Z]+$/;
        if (regex.test(value)) {
            return { isValid: true };
        }
        return { isValid: false, error: ValidationError.TEXT_ERROR };
    }
}
