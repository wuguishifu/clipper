import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import axiosRetry, {
  isNetworkOrIdempotentRequestError,
  isRetryableError,
} from 'axios-retry';

export class AxiosService {
  private readonly instance: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    const axiosConfig = config ?? {};
    axiosConfig.timeout = axiosConfig.timeout ?? 5000; // Set a default timeout
    this.instance = axios.create(axiosConfig);
    axiosRetry(this.instance, {
      retries: 3,
      shouldResetTimeout: true,
      retryDelay: axiosRetry.exponentialDelay,
      // Note: We use custom retry condition because by default, `axios-retry` does not retry network timeouts which we want to consider a retryable error.
      retryCondition: (error) =>
        isNetworkOrIdempotentRequestError(error) ||
        isRetryableError(error) ||
        error.code === 'ECONNABORTED',
    });
  }

  public get = <Response>(url: string, config?: AxiosRequestConfig) => {
    return this.instance.get<Response>(url, config);
  };

  public post = <Response, Data = unknown>(
    url: string,
    data?: Data,
    config?: AxiosRequestConfig,
  ) => {
    return this.instance.post<Response>(url, data, config);
  };

  public patch = <Response, Data>(
    url: string,
    data?: Data,
    config?: AxiosRequestConfig,
  ) => {
    return this.instance.patch<Response>(url, data, config);
  };

  public delete = <Response>(url: string, config?: AxiosRequestConfig) => {
    return this.instance.delete<Response>(url, config);
  };
}
