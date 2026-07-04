"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SearchModule = void 0;
var common_1 = require("@nestjs/common");
var bull_1 = require("@nestjs/bull");
var queues_constants_1 = require("../queues/queues.constants");
var search_index_processor_1 = require("./search-index.processor");
/**
 * SearchModule — Phase 2
 *
 * Consumes the 'search-index' BullMQ queue and keeps an OpenSearch/
 * Elasticsearch index in sync with the PostgreSQL jobs & freelance_jobs tables.
 *
 * To activate:
 *   1. Install: npm install @opensearch-project/opensearch
 *   2. Add OPENSEARCH_URL to .env
 *   3. Uncomment the OpenSearchService provider below
 *   4. Add SearchModule to app.module.ts imports
 */
var SearchModule = /** @class */ (function () {
    function SearchModule() {
    }
    SearchModule = __decorate([
        (0, common_1.Module)({
            imports: [bull_1.BullModule.registerQueue({ name: queues_constants_1.QUEUE_NAMES.SEARCH_INDEX })],
            providers: [search_index_processor_1.SearchIndexProcessor]
        })
    ], SearchModule);
    return SearchModule;
}());
exports.SearchModule = SearchModule;
