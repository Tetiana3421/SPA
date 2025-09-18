import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AdminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const u = auth.user();
  if (u && u.role === 'admin') return true;

  const returnUrl = location.pathname + location.search;
  return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl } }) as UrlTree;
};
