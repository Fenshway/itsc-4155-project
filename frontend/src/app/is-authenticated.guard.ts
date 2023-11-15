import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    const router = inject(Router)
    return router.createUrlTree(['/welcome']);
  }
  return true
};
