// mocks/auth.mock.ts

import { CanActivate, ExecutionContext } from '@nestjs/common';

export const mockAuthGuard = () => {
  class MockAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      return true;
    }
  }
  return new MockAuthGuard();
};

export const getRolesGuard = () => {
  class MockRoleGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      return true;
    }
  }
  return new MockRoleGuard();
};
