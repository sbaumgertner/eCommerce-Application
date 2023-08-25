export const togglePasswordVisibility = (element: HTMLInputElement): void => {
    if (element.type === 'password') {
        element.type = 'text';
    } else {
        element.type = 'password';
    }
};

export const isValidEmail = (email: string): boolean => {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

const setError = (element: HTMLElement, message: string): void => {
    const inputControl = element.parentElement as HTMLElement;
    const errorDisplay = inputControl.querySelector('.error') as HTMLElement;

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
};

const setSuccess = (element: HTMLElement): void => {
    const inputControl = element.parentElement as HTMLElement;
    const errorDisplay = inputControl.querySelector('.error') as HTMLElement;

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

export const emailValidation = (emailInput: HTMLInputElement): void => {
    if (emailInput.value === '') {
        setError(emailInput, 'Email is required');
    } else if (!isValidEmail(emailInput.value)) {
        setError(emailInput, 'Provide a valid email address');
    } else {
        setSuccess(emailInput);
    }
};

export const passwordValidation = (password: HTMLInputElement): void => {
    if (password.value === '') {
        setError(password, 'Password is required');
    } else if (password.value.length < 8) {
        setError(password, 'Password must be at least 8 characters');
    } else if (/[a-z]/g.test(password.value) == false || /[A-Z]/g.test(password.value) == false) {
        setError(
            password,
            'Password must be at least one uppercase letter (A-Z) and at least one lowercase letter (a-z)'
        );
    } else if (/[0-9]/g.test(password.value) == false || /[!@#$%^&*]/g.test(password.value) == false) {
        setError(
            password,
            'Password must be at least one digit (0-9) and at least one special character (e.g., !@#$%^&*)'
        );
    } else {
        setSuccess(password);
    }
};

export const passwordSecondValidation = (password1: HTMLInputElement, password2: HTMLInputElement): void => {
    if (password2.value === '') {
        setError(password2, 'Please confirm your password');
    } else if (password2.value !== password1.value) {
        setError(password2, "Passwords doesn't match");
    } else {
        setSuccess(password2);
    }
};
