export function filterErrors(error: any, errors: string[]) {
  for (const [key, value] of Object.entries(error.error.errors)) {
    error.error.errors[key].forEach((error: any) => {
      errors.push(error);
    });
  }
}
