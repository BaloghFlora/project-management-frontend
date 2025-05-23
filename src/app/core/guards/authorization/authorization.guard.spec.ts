import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { hasAuthorization } from './authorization.guard';


describe('hasAuthorization', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => hasAuthorization(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
