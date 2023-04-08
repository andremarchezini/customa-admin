import { TestBed } from '@angular/core/testing';

import { STORAGE_TOKEN } from '../storage/storage.keys';
import { StorageService } from '../storage/storage.service';
import { StorageServiceMock } from '../storage/storage.service.mock';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  let storageSvcSpy: jasmine.SpyObj<StorageService>;

  const dummyToken = 'ABCDEF';

  beforeEach(() => {
    storageSvcSpy = StorageServiceMock.instance();

    TestBed.configureTestingModule({
      providers: [AuthenticationService, { provide: StorageService, useValue: storageSvcSpy }],
    });
    service = TestBed.inject(AuthenticationService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should return not authenticated', async () => {
    service.token = null;
    storageSvcSpy.get.and.returnValue(Promise.resolve(null));
    const isAuthenticated = await service.isAuthenticated();
    expect(isAuthenticated).toBeFalsy();
  });

  it('should return authenticated', async () => {
    service.token = 'test';
    const isAuthenticated = await service.isAuthenticated();
    expect(isAuthenticated).toBeTruthy();
  });

  it('should get the token from then cached', async () => {
    service.token = dummyToken;
    const token = await service.getToken();
    expect(token).toBe(dummyToken);
  });

  it('should get token from the localStorage', async () => {
    service.e2e = true;
    storageSvcSpy.getToken.and.returnValue(dummyToken);
    const token = await service.getToken();
    expect(storageSvcSpy.getToken).toHaveBeenCalled();
    expect(token).toBe(dummyToken);
  });

  it('should get token from the ionic storage', async () => {
    storageSvcSpy.get.and.resolveTo(dummyToken);
    const token = await service.getToken();
    expect(storageSvcSpy.get).toHaveBeenCalledWith(STORAGE_TOKEN);
    expect(token).toBe(dummyToken);
  });

  it('should set token to the localStorage', async () => {
    service.e2e = true;
    await service.setToken(dummyToken);
    expect(storageSvcSpy.setToken).toHaveBeenCalledWith(dummyToken);
    expect(service.token).toBe(dummyToken);
  });

  it('should set token to the ionic storage', async () => {
    await service.setToken(dummyToken);
    expect(storageSvcSpy.set).toHaveBeenCalledWith(STORAGE_TOKEN, dummyToken);
    expect(service.token).toBe(dummyToken);
  });

  it('should remove token from the localStorage', async () => {
    service.e2e = true;
    await service.setToken(null);
    expect(storageSvcSpy.removeToken).toHaveBeenCalled();
    expect(service.token).toBeNull();
  });

  it('should remove token from the ionic storage', async () => {
    await service.setToken(null);
    expect(storageSvcSpy.remove).toHaveBeenCalledWith(STORAGE_TOKEN);
    expect(service.token).toBeNull();
  });
});
