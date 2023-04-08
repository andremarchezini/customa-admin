import { ConnectService } from './connect.service';

export class ConnectServiceMock {
  static instance(): jasmine.SpyObj<ConnectService> {
    return jasmine.createSpyObj('ConnectService', {
      get: Promise.resolve(),
      getToken: Promise.resolve(),
      create: Promise.resolve(),
      createMultiPart: Promise.resolve(),
      update: Promise.resolve(),
      updateMultiPart: Promise.resolve(),
      delete: Promise.resolve(),
      handleError: null,
    });
  }
}
