import { FormControl, FormGroup } from '@angular/forms';

import { PasswordValidator } from './password.validator';

describe('PasswordValidator', () => {
  beforeEach(() => {});

  it('should create', () => {
    expect(PasswordValidator).toBeTruthy();
  });

  it('should validate if password is strong and return invalid', () => {
    const control = new FormControl();
    control.setValue('bbb');
    const validation = PasswordValidator.strong(control);
    expect(validation?.strong).toBeTruthy();
  });

  it('should validate if password is strong and return null', () => {
    const control = new FormControl();
    control.setValue('Bbb1!');
    const validation = PasswordValidator.strong(control);
    expect(validation).toBeNull();
  });

  it('should validate if password is not matched and return invalid', () => {
    const group = new FormGroup({
      password: new FormControl('a'),
      confirm_password: new FormControl('b'),
    });
    const validation = PasswordValidator.match('password', 'confirm_password')(group);
    expect(validation?.passwordNotMatched).toBeTrue();
  });

  it('should validate if password is matched and return null', () => {
    const group = new FormGroup({
      password: new FormControl('a'),
      confirm_password: new FormControl('a'),
    });
    const validation = PasswordValidator.match('password', 'confirm_password')(group);
    expect(validation).toBeNull();
  });
});
