// Type definitions for laravel-vapor 0.4
// Project: https://github.com/laravel/vapor-js
// Definitions by: saibotk <https://github.com/saibotk>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// Minimum TypeScript Version: 2.9
//

interface VaporStoreOptions {
    bucket?: string | undefined;
    contentType?: string | undefined;
    expires?: string | undefined;
    visibility?: string | undefined;
    baseURL?: string | undefined;
    headers?: any;
    options?: any;
}

declare class Vapor {
    store(file: File, options?: VaporStoreOptions): Promise<any>;
    asset(path: string): string;
}

declare const VaporInstance: Vapor;
export = VaporInstance;
