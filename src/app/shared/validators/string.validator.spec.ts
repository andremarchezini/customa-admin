import { FormControl, FormGroup } from '@angular/forms';

import { StringValidator } from './string.validator';

describe('StringValidator', () => {
  beforeEach(() => {});

  it('should create', () => {
    expect(StringValidator).toBeTruthy();
  });

  it('should validate if string is filled only with spaces and return invalid', () => {
    const control = new FormControl();
    control.setValue('    ');
    const validation = StringValidator.empty(control);
    expect(validation?.empty).toBeTruthy();
  });

  it('should validate if string has text and return null', () => {
    const control = new FormControl();
    control.setValue('a a');
    const validation = StringValidator.empty(control);
    expect(validation).toBeNull();
  });

  it('should check if text hasnt been entered and return null', () => {
    const control = new FormControl();
    control.setValue('');
    const validation = StringValidator.empty(control);
    expect(validation).toBeNull();
  });

  it('should validate if string is not matched and return invalid', () => {
    const group = new FormGroup({
      control1: new FormControl('a'),
      control2: new FormControl('b'),
    });
    const validation = StringValidator.match('control1', 'control2')(group);
    expect(validation?.notMatched).toBeTrue();
  });

  it('should validate if string is matched and return null', () => {
    const group = new FormGroup({
      control1: new FormControl('a'),
      control2: new FormControl('a'),
    });
    const validation = StringValidator.match('control1', 'control2')(group);
    expect(validation).toBeNull();
  });
});
