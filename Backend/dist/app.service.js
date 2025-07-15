"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
let AppService = class AppService {
    list = ['item1', 'item2', 'item3'];
    extendedList = [
        { id: '0', name: 'item1', desc: 'BIPP' },
        { id: '1', name: 'item2', desc: 'BOPP' },
        { id: '2', name: 'item3', desc: 'BLAPP' },
    ];
    getListItems() {
        return this.extendedList;
    }
    getItemInfo(name) {
        const item = this.extendedList.find((item) => item.name === name);
        return item;
    }
    addItem(name) {
        const newItem = {
            id: (0, uuid_1.v4)(),
            name: name,
            desc: 'Sample description',
        };
        this.extendedList.push(newItem);
        return newItem;
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map