import { countries } from '../components/address-fields/address-fields';

export enum ValidationError {
    TEXT_ERROR = 'Must contain at least one character and no special characters or numbers',
    EMAIL_ERROR = 'Provide a valid email address',
    PASSWORD_ERROR_1 = 'Password is required',
    PASSWORD_ERROR_2 = 'Password must be at least 8 characters',
    PASSWORD_ERROR_3 = 'Password must be at least one uppercase letter (A-Z) and at least one lowercase letter (a-z)',
    PASSWORD_ERROR_4 = 'Password must be at least one digit (0-9) and at least one special character',
    DATE_FORMAT_ERROR = 'Must match the format DD.MM.YYYY',
    DATE_AGE_ERROR = 'Must be more than 10 years old',
    COUNTRY_ERROR = 'Must be selected from the list',
    ZIP_GE_ERROR = 'Must contain 4 digits',
    ZIP_ERROR = 'Must contain 6 digits',
    EMPTY_ERROR = 'Must contain at least one character',
}

export type ValidationResult = {
    isValid: boolean;
    error?: ValidationError;
};

export class Validation {
    public static checkText(value: string): ValidationResult {
        const regex = /^[a-zA-Zа-яА-Я\s]+$/;
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

    public static checkDate(value: string): ValidationResult {
        const birthDate = new Date(value);
        if (isNaN(Number(birthDate))) {
            return { isValid: false, error: ValidationError.DATE_FORMAT_ERROR };
        }
        const diff: number = Number(new Date()) - Number(birthDate);
        const years: number = diff / 31600800000;
        if (years < 10) {
            return { isValid: false, error: ValidationError.DATE_AGE_ERROR };
        }
        return { isValid: true };
    }

    public static checkCountry(value: string): ValidationResult {
        if (countries.has(value)) {
            return { isValid: true };
        }
        return { isValid: false, error: ValidationError.COUNTRY_ERROR };
    }

    public static checkZip(value: string, country: string): ValidationResult {
        const regex = country === 'GE' ? /^\d\d\d\d$/ : /^\d\d\d\d\d\d$/;
        const error = country === 'GE' ? ValidationError.ZIP_GE_ERROR : ValidationError.ZIP_ERROR;
        if (regex.test(value)) {
            return { isValid: true };
        }
        return { isValid: false, error: error };
    }

    public static checkNotEmpty(value: string): ValidationResult {
        if (value.length === 0) {
            return { isValid: false, error: ValidationError.EMPTY_ERROR };
        }
        return { isValid: true };
    }
}
