"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextController = void 0;
const common_1 = require("@nestjs/common");
const text_service_1 = require("./text.service");
let TextController = class TextController {
    textService;
    constructor(textService) {
        this.textService = textService;
    }
    getListItem(id) {
        const extendedItem = this.textService.getText(id);
        return extendedItem;
    }
};
exports.TextController = TextController;
__decorate([
    (0, common_1.Get)('text/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], TextController.prototype, "getListItem", null);
exports.TextController = TextController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [text_service_1.TextService])
], TextController);
//# sourceMappingURL=text.controller.js.map