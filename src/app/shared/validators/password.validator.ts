import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';

export class PasswordValidator {
  static strong(control: FormControl) {
    const hasNumber = /\d/.test(control.value);
    const hasUpper = /[A-Z]/.test(control.value);
    const hasLower = /[a-z]/.test(control.value);
    const hasSpecial = /[$&+,:;=\\\\?@#|/'<>.^*()%!-]/.test(control.value);
    const valid = hasNumber && hasUpper && hasLower && hasSpecial && control.value.length >= 8;
    if (!valid) {
      return { strong: true };
    }
    return null;
  }

  static match(passwordFieldName: string, confirmPasswordFieldName: string): ValidatorFn {
    return (form: AbstractControl) => {
      if (form.get(passwordFieldName)!.value !== form.get(confirmPasswordFieldName)!.value) {
        return { passwordNotMatched: true };
      }
      return null;
    };
  }
}
