import { canActivateAuth } from './lib/auth/access.guard';
import { authTokenInterceptor } from './lib/auth/auth.interceptor';
import { AuthService } from '../../data-access/src/lib/services/auth/auth.service';

export * from './lib/feature-login'
export {
  canActivateAuth,
  authTokenInterceptor,
  AuthService,
}
