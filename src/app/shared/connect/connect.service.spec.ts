import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AuthenticationService } from '../authentication';
import { AuthenticationServiceMock } from '../authentication/authentication.service.mock';
import { ConnectService } from './connect.service';

describe('ConnectService', () => {
  let service: ConnectService;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let authSvcSpy: jasmine.SpyObj<AuthenticationService>;

  beforeEach(async () => {
    httpSpy = jasmine.createSpyObj('HTTP', {
      get: of(),
      post: of(),
      put: of(),
      delete: of(),
    });
    authSvcSpy = AuthenticationServiceMock.instance();

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpSpy },
        { provide: AuthenticationService, useValue: authSvcSpy },
      ],
    });
    service = TestBed.inject(ConnectService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should set token on the header', async () => {
    authSvcSpy.getToken.and.resolveTo('ABC123');
    await service.setAuthenticatedHeader(true);
    expect(service.headers.get('Content-Type')).toBe('application/json');
    expect(service.headers.get('Authorization')).toBe(`Bearer ABC123`);
  });

  it('should NOT set token on the header', async () => {
    authSvcSpy.getToken.and.resolveTo('ABC123');
    await service.setAuthenticatedHeader(false);
    expect(service.headers.get('Content-Type')).toBe('application/json');
    expect(service.headers.get('Authorization')).toBe(null);
  });

  it('should login user and return request', async () => {
    httpSpy.post = jasmine.createSpy().and.returnValue(of('abcd'));
    await service.getToken('email', 'password').then((request) => {
      expect(request).toBe('abcd');
    });
  });

  it('should get from api', async () => {
    httpSpy.get = jasmine.createSpy().and.returnValue(of('abcd'));
    await service.get<string>('endpoint', true).then((request) => {
      expect(request).toBe('abcd');
    });
  });

  it('should post data', async () => {
    httpSpy.post = jasmine.createSpy().and.returnValue(of('abcd'));
    await service.create('endpoint', { test: '123' }, true).then((request) => {
      expect(request).toBe('abcd');
    });
  });

  it('should post multi-part data', async () => {
    httpSpy.post = jasmine.createSpy().and.returnValue(of('abcd'));
    const formData = new FormData();
    formData.append('test', '123');
    await service.createMultiPart('endpoint', formData, true).then((request) => {
      expect(request).toBe('abcd');
    });
  });

  it('should update data', async () => {
    httpSpy.put = jasmine.createSpy().and.returnValue(of('abcd'));
    await service.update('endpoint', { test: '123' }, true).then((request) => {
      expect(request).toBe('abcd');
    });
  });

  it('should update multi-part data', async () => {
    httpSpy.put = jasmine.createSpy().and.returnValue(of('abcd'));
    const formData = new FormData();
    formData.append('test', '123');
    await service.updateMultiPart('endpoint', formData, true).then((request) => {
      expect(request).toBe('abcd');
    });
  });

  it('should delete data', async () => {
    httpSpy.delete = jasmine.createSpy().and.returnValue(of('abcd'));
    await service.delete('endpoint', true).then((request) => {
      expect(request).toBe('abcd');
    });
  });
});
