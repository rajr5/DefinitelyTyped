// Type definitions for oauth2orize 1.8
// Project: https://github.com/jaredhanson/oauth2orize/
// Definitions by: Wonshik Kim <https://github.com/wokim>, Kei Son <https://github.com/heycalmdown>, Steve Hipwell <https://github.com/stevehipwell>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

/// <reference types="node" />
/// <reference types="express" />

import { IncomingMessage, ServerResponse } from "http";

declare global {
  namespace Express {
    interface Request {
      oauth2?: OAuth2 | undefined;
    }
  }
}

export interface OAuth2 {
  client: any;
  user: any;
  transactionID: string;
  redirectURI: string;
  req: OAuth2Req;
  info: OAuth2Info;
}

export interface OAuth2Req {
  clientID: string;
  redirectURI: string;
  scope: string;
  state: string;
  type: string;
  transactionID: string;
}

export interface OAuth2Info {
  scope: string;
}

export interface MiddlewareRequest extends IncomingMessage {
  oauth2?: OAuth2 | undefined;
  user?: any;
}

export interface ServerOptions {
  store: any;
}

export function createServer(options?: ServerOptions): OAuth2Server;

export interface AuthorizeOptions {
  idLength?: number | undefined;
  sessionKey?: string | undefined;
}

export interface DecisionOptions {
  cancelField: string;
  userProperty: string;
  sessionKey: string;
  loadTransaction: boolean;
}

export interface ErrorHandlerOptions {
  mode?: string | undefined;
}

export class OAuth2Error extends Error {
    code: string;
    status: number;
    uri?: string | undefined;

    /**
     * @param code Defaults to *server_error*.
     * @param status Defaults to 500.
     */
    constructor(message?: string, code?: string, uri?: string, status?: number);
}

export type AuthorizationErrorCode = 'invalid_request'
    | 'unauthorized_client'
    | 'access_denied'
    | 'unsupported_response_type'
    | 'invalid_scope'
    | 'temporarily_unavailable';

export class AuthorizationError extends OAuth2Error {
    /**
     * @param code The code sets the status unless status is present. Mapping:
     * invalid_request = 400
     * unauthorized_client = 403
     * access_denied = 403
     * unsupported_response_type = 501
     * invalid_scope = 400
     * temporarily_unavailable = 503
     * Defaults to *server_error*.
     * @param status Defaults to 500 if code is not specified.
     */
    constructor(message?: string, code?: AuthorizationErrorCode | string, uri?: string, status?: number);
}

export type TokenErrorCode = 'invalid_request'
    | 'invalid_client'
    | 'invalid_grant'
    | 'unauthorized_client'
    | 'unsupported_grant_type'
    | 'invalid_scope';

export class TokenError extends OAuth2Error {
    /**
     * @param code The code sets the status unless status is present. Mapping:
     * invalid_request = 400
     * invalid_client = 401
     * invalid_grant = 403
     * unauthorized_client = 403
     * unsupported_grant_type = 501
     * invalid_scope = 400
     * Defaults to server_error.
     * @param status Defaults to 500 if code is not specified.
     */
    constructor(message?: string, code?: TokenErrorCode | string, uri?: string, status?: number);
}

export type MiddlewareFunction = (req: MiddlewareRequest, res: ServerResponse, next: MiddlewareNextFunction) => void;

export type MiddlewareErrorFunction = (err: Error, req: MiddlewareRequest, res: ServerResponse, next: MiddlewareNextFunction) => void;

export type MiddlewareNextFunction = (err?: Error) => void;

export type ValidateFunction = (clientId: string, redirectURI: string, validated: (err: Error | null, client?: any, redirectURI?: string) => void) => void;

export type ImmediateFunction = (client: any, user: any, scope: string[], type: string, areq: any, done: (err: Error | null, allow: boolean, info: any, locals: any) => void) => void;

export type DecisionParseFunction = (req: MiddlewareRequest, done: (err: Error | null, params: any) => void) => void;

export type SerializeClientFunction = (client: any, done: SerializeClientDoneFunction) => void;
export type SerializeClientDoneFunction = (err: Error | null, id: string) => void;

export type DeserializeClientFunction = (id: string, done: DeserializeClientDoneFunction) => void;
export type DeserializeClientDoneFunction = (err: Error | null, client?: any | boolean) => void;

export type IssueGrantCodeFunction = (client: any, redirectUri: string, user: any, res: any, issued: (err: Error | null, code?: string) => void) => void;

export type IssueGrantTokenFunction = (client: any, user: any, ares: any, issued: (err: Error | null, code?: string, params?: any) => void) => void;

export type IssueExchangeCodeFunction = (client: any, code: string, redirectURI: string, issued: ExchangeDoneFunction) => void;

export type ExchangeDoneFunction = (err: Error | null, accessToken?: string | boolean, refreshToken?: string, params?: any) => void;

export class OAuth2Server {
  grant(type: string, fn: MiddlewareFunction): OAuth2Server;
  grant(fn: MiddlewareFunction): OAuth2Server;

  exchange(type: string, fn: MiddlewareFunction): OAuth2Server;
  exchange(fn: MiddlewareFunction): OAuth2Server;

  authorize(options: AuthorizeOptions, validate: ValidateFunction): MiddlewareFunction;
  authorize(validate: ValidateFunction): MiddlewareFunction;

  authorization(options: AuthorizeOptions, validate: ValidateFunction, immediate?: ImmediateFunction): MiddlewareFunction;
  authorization(validate: ValidateFunction, immediate?: ImmediateFunction): MiddlewareFunction;

  decision(options: DecisionOptions, parse: DecisionParseFunction): MiddlewareFunction;
  decision(parse: DecisionParseFunction): MiddlewareFunction;
  decision(): MiddlewareFunction;

  token(options?: any): MiddlewareFunction;

  errorHandler(options?: any): MiddlewareErrorFunction;

  serializeClient(fn: SerializeClientFunction): void;
  serializeClient(client: any, done: SerializeClientDoneFunction): void;

  deserializeClient(fn: DeserializeClientFunction): void;
  deserializeClient(obj: any, done: DeserializeClientDoneFunction): void;
}

export namespace grant {
  interface Options {
    // For maximum flexibility, multiple scope spearators can optionally be
    // allowed.  This allows the server to accept clients that separate scope
    // with either space or comma (' ', ',').  This violates the specification,
    // but achieves compatibility with existing client libraries that are already
    // deployed.
    scopeSeparator?: string | undefined;
  }

  function code(options: Options, issue: IssueGrantCodeFunction): MiddlewareFunction;
  function code(issue: IssueGrantCodeFunction): MiddlewareFunction;

  function token(options: Options, issue: IssueGrantTokenFunction): MiddlewareFunction;
  function token(issue: IssueGrantTokenFunction): MiddlewareFunction;
}

export namespace exchange {
  interface Options {
    // The 'user' property of `req` holds the authenticated user.  In the case
    // of the token endpoint, the property will contain the OAuth 2.0 client.
    userProperty?: string | undefined;

    // For maximum flexibility, multiple scope spearators can optionally be
    // allowed.  This allows the server to accept clients that separate scope
    // with either space or comma (' ', ',').  This violates the specification,
    // but achieves compatibility with existing client libraries that are already
    // deployed.
    scopeSeparator?: string | undefined;
  }

  function authorizationCode(options: Options, issue: IssueExchangeCodeFunction): MiddlewareFunction;
  function authorizationCode(issue: IssueExchangeCodeFunction): MiddlewareFunction;

  function code(options: Options, issue: IssueExchangeCodeFunction): MiddlewareFunction;
  function code(issue: IssueExchangeCodeFunction): MiddlewareFunction;

  // arity == 5; issue(client, scope, req.body, req.authInfo, issued);
  function clientCredentials(options: Options, issue: (client: any, scope: string[], body: any, authInfo: any, issued: ExchangeDoneFunction) => void): MiddlewareFunction;
  // arity == 4; issue(client, scope, req.body, issued);
  function clientCredentials(options: Options, issue: (client: any, scope: string[], body: any, issued: ExchangeDoneFunction) => void): MiddlewareFunction;
  // arity == 3; issue(client, scope, issued);
  function clientCredentials(options: Options, issue: (client: any, scope: string[], issued: ExchangeDoneFunction) => void): MiddlewareFunction;
  // arity == 2; issue(client, issued);
  function clientCredentials(options: Options, issue: (client: any, issued: ExchangeDoneFunction) => void): MiddlewareFunction;
  function clientCredentials(issue: (client: any, scope: string[], issued: ExchangeDoneFunction) => void): MiddlewareFunction;
  function clientCredentials(issue: (client: any, issued: ExchangeDoneFunction) => void): MiddlewareFunction;

  // arity == 7; issue(client, username, passwd, scope, req.body, req.authInfo, issued);
  function password(options: Options, issue: (client: any, username: string, password: string, scope: string[], body: any, authInfo: any, issued: ExchangeDoneFunction) => void): MiddlewareFunction;
  // arity == 6; issue(client, username, passwd, scope, req.body, issued);
  function password(options: Options, issue: (client: any, username: string, password: string, scope: string[], body: any, issued: ExchangeDoneFunction) => void): MiddlewareFunction;
  // arity == 5; issue(client, username, passwd, scope, issued);
  function password(options: Options, issue: (client: any, username: string, password: string, scope: string[], issued: ExchangeDoneFunction) => void): MiddlewareFunction;
  // arity == 4; issue(client, username, passwd, issued);
  function password(options: Options, issue: (client: any, username: string, password: string, issued: ExchangeDoneFunction) => void): MiddlewareFunction;
  function password(issue: (client: any, username: string, password: string, scope: string[], issued: ExchangeDoneFunction) => void): MiddlewareFunction;
  function password(issue: (client: any, username: string, password: string, issued: ExchangeDoneFunction) => void): MiddlewareFunction;

  // arity == 6; issue(client, refreshToken, scope, req.body, req.authInfo, issued);
  function refreshToken(options: Options, issue: (client: any, refreshToken: string, scope: string[], body: any, authInfo: any, issued: ExchangeDoneFunction) => void): MiddlewareFunction;
  // arity == 5; issue(client, refreshToken, scope, req.body, issued);
  function refreshToken(options: Options, issue: (client: any, refreshToken: string, scope: string[], body: any, issued: ExchangeDoneFunction) => void): MiddlewareFunction;
  // arity == 4; issue(client, refreshToken, scope, issued);
  function refreshToken(options: Options, issue: (client: any, refreshToken: string, scope: string[], issued: ExchangeDoneFunction) => void): MiddlewareFunction;
  // arity == 3; issue(client, refreshToken, issued);
  function refreshToken(options: Options, issue: (client: any, refreshToken: string, issued: ExchangeDoneFunction) => void): MiddlewareFunction;
  function refreshToken(issue: (client: any, refreshToken: string, scope: string[], issued: ExchangeDoneFunction) => void): MiddlewareFunction;
  function refreshToken(issue: (client: any, refreshToken: string, issued: ExchangeDoneFunction) => void): MiddlewareFunction;
}
