import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

export function expire(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    let notExpired = true;

    if (control.value < moment().startOf('month')) {
      notExpired = false;
    }

    if (!notExpired) {
      return { expired: true };
    }

    return null;
  };
}
