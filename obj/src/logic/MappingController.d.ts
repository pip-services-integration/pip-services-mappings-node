import { ConfigParams } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { ICommandable } from 'pip-services3-commons-node';
import { CommandSet } from 'pip-services3-commons-node';
import { MappingV1 } from '../data/version1/MappingV1';
import { IMappingController } from './IMappingController';
import { Timing } from 'pip-services3-components-node';
export declare class MappingController implements IConfigurable, IReferenceable, ICommandable, IMappingController {
    private static _defaultConfig;
    readonly component: string;
    private _logger;
    private _counters;
    private _dependencyResolver;
    private _persistence;
    private _commandSet;
    constructor();
    configure(config: ConfigParams): void;
    setReferences(references: IReferences): void;
    getCommandSet(): CommandSet;
    protected instrument(correlationId: string, methodName: string, message: string): Timing;
    protected handleError(correlationId: string, methodName: string, ex: any): void;
    getCollectionNames(correlationId: string, callback: (err: any, items: string[]) => void): void;
    getMappings(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<MappingV1>) => void): void;
    addMapping(correlationId: string, collection: string, internalId: string, externalId: string, timeToLive: number, callback: (err: any) => void): void;
    mapToExternal(correlationId: string, collection: string, internalId: string, callback: (err: any, externalId: string) => void): void;
    mapToInternal(correlationId: string, collection: string, externalId: string, callback: (err: any, internalId: string) => void): void;
    deleteMapping(correlationId: string, collection: string, internalId: string, externalId: string, callback: (err: any) => void): void;
    deleteExpiredMappings(correlationId: string, callback: (err: any) => void): void;
}
