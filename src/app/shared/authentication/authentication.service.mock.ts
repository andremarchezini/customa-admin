import { AuthenticationService } from './authentication.service';

export class AuthenticationServiceMock {
  static instance(): jasmine.SpyObj<AuthenticationService> {
    return jasmine.createSpyObj(AuthenticationService.name, {
      setToken: Promise.resolve(),
      getToken: Promise.resolve(),
      isAuthenticated: Promise.resolve(true),
    });
  }
}
