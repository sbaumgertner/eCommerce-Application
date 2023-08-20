export enum ValidationError {
    TEXT_ERROR = 'Must contain at least one character and no special characters or numbers',
    EMAIL_ERROR = 'Provide a valid email address',
    PASSWORD_ERROR_1 = 'Password is required',
    PASSWORD_ERROR_2 = 'Password must be at least 8 characters',
    PASSWORD_ERROR_3 = 'Password must be at least one uppercase letter (A-Z) and at least one lowercase letter (a-z)',
    PASSWORD_ERROR_4 = 'Password must be at least one digit (0-9) and at least one special character',
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

    public static checkEmail(value: string): ValidationResult {
        const regex =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (regex.test(value)) {
            return { isValid: true };
        }
        if (value.includes(' ') || value != value.trim() || value == '') {
            return { isValid: false, error: ValidationError.EMAIL_ERROR };
        } else return { isValid: false, error: ValidationError.EMAIL_ERROR };
    }

    public static checkPassword(value: string): ValidationResult {
        if (value === '') {
            return { isValid: false, error: ValidationError.PASSWORD_ERROR_1 };
        } else if (value.length < 8) {
            return { isValid: false, error: ValidationError.PASSWORD_ERROR_2 };
        } else if (/[a-z]/g.test(value) == false || /[A-Z]/g.test(value) == false) {
            return { isValid: false, error: ValidationError.PASSWORD_ERROR_3 };
        } else if (/[0-9]/g.test(value) == false || /[!@#$%^&*]/g.test(value) == false) {
            return { isValid: false, error: ValidationError.PASSWORD_ERROR_4 };
        } else {
            return { isValid: true };
        }
    }
}
