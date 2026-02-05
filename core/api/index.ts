export { apiClient, api, setBaseUrl } from './client';
export { setTenantId, getTenantId } from './interceptors/tenant-interceptor';
export { errorResponseInterceptor } from './interceptors/error-interceptor';
export {
  authRequestInterceptor,
  createAuthResponseInterceptor,
  setupAuthInterceptors,
} from './interceptors/auth-interceptor';
