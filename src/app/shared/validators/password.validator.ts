import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function strong(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const hasNumber = /\d/.test(control.value);
    const hasUpper = /[A-Z]/.test(control.value);
    const hasLower = /[a-z]/.test(control.value);
    const hasSpecial = /[$&+,:;=\\\\?@#|/'<>.^*()%!-]/.test(control.value);
    const valid = hasNumber && hasUpper && hasLower && hasSpecial && control.value.length >= 8;
    if (!valid) {
      return { strong: true };
    }
    return null;
  };
}
