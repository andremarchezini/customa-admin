import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';

export class StringValidator {
  static empty(control: FormControl) {
    if (control.value != null && control.value !== '') {
      if (control.value.trim().length === 0) {
        return { empty: true };
      }
      return null;
    }
    return null;
  }

  static maxLength(control: FormControl, length: number) {
    if (control.value != null && control.value !== '') {
      if (control.value.length > length) {
        return { maxLength: true };
      }
      return null;
    }
    return null;
  }
}
