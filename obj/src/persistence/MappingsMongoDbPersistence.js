"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_mongodb_node_1 = require("pip-services3-mongodb-node");
const MappingV1_1 = require("../data/version1/MappingV1");
class MappingsMongoDbPersistence extends pip_services3_mongodb_node_1.IdentifiableMongoDbPersistence {
    constructor() {
        super('mappings');
        this._defaultTTL = 7 * 24 * 60 * 60 * 1000;
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let criteria = [];
        var collection = filter.getAsNullableString("collection");
        var id = filter.getAsNullableString("id");
        var internalId = filter.getAsNullableString("internal_id");
        var externalId = filter.getAsNullableString("external_id");
        var search = filter.getAsNullableString("search");
        if (id != null) {
            var searchFilter = [];
            searchFilter.push({ external_id: id });
            searchFilter.push({ internal_id: id });
            criteria.push({ $or: searchFilter });
        }
        if (collection != null)
            criteria.push({ collection: collection });
        if (internalId != null)
            criteria.push({ internal_id: internalId });
        if (externalId != null)
            criteria.push({ external_id: externalId });
        if (search != null) {
            var searchFilter = [];
            searchFilter.push({ external_id: search });
            searchFilter.push({ internal_id: search });
            criteria.push({ $or: searchFilter });
        }
        return criteria.length > 0 ? { $and: criteria } : null;
    }
    makeId(collection, internalId, externalId) {
        return collection + "_" + internalId + "_" + externalId;
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }
    createFromParams(correlationId, collection, internalId, externalId, ttl, callback) {
        ttl = ttl > 0 ? ttl : this._defaultTTL;
        var mapping = new MappingV1_1.MappingV1(collection, internalId, externalId, new Date(Date.now() + ttl));
        mapping.id = this.makeId(collection, internalId, externalId);
        super.create(correlationId, mapping, callback);
    }
    getCollectionNames(correlationId, callback) {
        this._collection.aggregate([
            {
                "$group": { _id: "$collection", count: { $sum: 1 } }
            }
        ]).toArray((err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            var items = [];
            for (var item of results) {
                items.push(item._id);
            }
            callback(null, items);
        });
    }
    getByInternalId(correlationId, collection, internalId, callback) {
        var filter = [];
        filter.push({ collection: collection });
        filter.push({ internal_id: internalId });
        super.getListByFilter(correlationId, { $and: filter }, null, null, (err, items) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, items.length > 0 ? items[0].external_id : null);
        });
    }
    getByExternalId(correlationId, collection, externalId, callback) {
        var filter = [];
        filter.push({ collection: collection });
        filter.push({ external_id: externalId });
        super.getListByFilter(correlationId, { $and: filter }, null, null, (err, items) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, items.length > 0 ? items[0].internal_id : null);
        });
    }
    delete(correlationId, collection, internalId, externalId, callback) {
        var id = this.makeId(collection, internalId, externalId);
        super.deleteById(correlationId, id, callback);
    }
    deleteExpired(correlationId, callback) {
        var now = new Date();
        var filter = { expiration_time: { $lte: now } };
        super.deleteByFilter(correlationId, filter, callback);
    }
}
exports.MappingsMongoDbPersistence = MappingsMongoDbPersistence;
//# sourceMappingURL=MappingsMongoDbPersistence.js.map