// Type definitions for @adobe/node-fetch-retry 1.0
// Project: https://github.com/adobe/node-fetch-retry#readme
// Definitions by: Ricardo Souza <https://github.com/ricardoatsouza>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import { Request, RequestInit, Response } from 'node-fetch';

declare namespace fetchRetry {
    /**
     * options for fetch-retry
     */
    interface Options extends RequestInit {
        /**
         * options for retry or false if want to disable retry
         * ... other options for fetch call (method, headers, etc...)
         */
        retryOptions?: RetryOptions | undefined;
    }

    /**
     * options for retry or false if want to disable retry
     */
    interface RetryOptions {
        /**
         * time (in milliseconds) to retry until throwing an error
         */
        retryMaxDuration?: number | undefined;
        /**
         * time to wait between retries in milliseconds
         */
        retryInitialDelay?: number | undefined;
        /**
         * a function determining whether to retry on a specific HTTP code
         */
        retryOnHttpResponse?: ((response: Response) => boolean) | undefined;
        /**
         * backoff factor for wait time between retries (defaults to 2.0)
         */
        retryBackoff?: number | undefined;
        /**
         * Optional socket timeout in milliseconds (defaults to 60000ms)
         */
        socketTimeout?: number | undefined;
        /**
         * If true, socket timeout will be forced to use `socketTimeout` property declared (defaults to false)
         */
        forceSocketTimeout?: boolean | undefined;
    }
}

declare function fetchRetry(url: string | Request, options: fetchRetry.Options): Promise<Response>;
export = fetchRetry;
