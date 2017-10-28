import { RegExpOptions } from 'path-to-regexp';
import { Params, AddonGet } from './interface';
export declare type Title = string | ((params?: object, data?: any) => string);
export interface LoadRoute {
    params: object;
    location: object;
    name: string;
}
export declare type LoadFn = (route?: LoadRoute, modifiers?: LoadModifiers, addons?: {
    [key: string]: AddonGet;
}) => Promise<any>;
export declare type PreloadFn = () => Promise<any>;
export declare type ParamParser = (input: string) => any;
export interface ParamParsers {
    [key: string]: ParamParser;
}
export interface Match {
    route: InternalRoute;
    params: Params;
}
export interface RouteDescriptor {
    name: string;
    path: string;
    pathOptions?: RegExpOptions;
    params?: ParamParsers;
    body?: () => any;
    children?: Array<RouteDescriptor>;
    preload?: PreloadFn;
    load?: LoadFn;
    title?: Title;
    extra?: {
        [key: string]: any;
    };
}
export interface Route {
    name: string;
    path: string;
    body: () => any;
    keys: Array<string | number>;
    preload: PreloadFn;
    load: LoadFn;
    extra: {
        [key: string]: any;
    };
}
export interface InternalRoute {
    public: Route;
    title: Title;
    children: Array<InternalRoute>;
    getBody: () => any;
    match: (pathname: string, matches: Array<Match>, parentPath?: string) => boolean;
    paramParsers: ParamParsers;
}
export interface LoadModifiers {
    fail: (err: any) => void;
    redirect: (to: any, status?: number) => void;
    setData: (data: any) => void;
    setStatus: (status: number) => void;
}
declare const createRoute: (options: RouteDescriptor) => InternalRoute;
export default createRoute;