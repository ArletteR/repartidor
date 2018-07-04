import { FormControl } from '@angular/forms';

export class PasswordValidator {
    static isValid(control: FormControl) {
        const re = /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(control.value);

        if (re) {
            return null;
        }


        return { 'invalidPassword': true };
    }
}