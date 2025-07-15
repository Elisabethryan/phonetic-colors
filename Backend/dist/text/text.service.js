"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextService = void 0;
const common_1 = require("@nestjs/common");
let TextService = class TextService {
    formattedA = {
        id: '1',
        letter: 'A',
        style: 'colored',
    };
    formattedB = {
        id: '2',
        letter: 'B',
        style: 'colored',
    };
    text = {
        id: '12345',
        text: [this.formattedA, this.formattedB, this.formattedB, this.formattedA],
    };
    texts = [this.text];
    getText(textId) {
        console.log(textId);
        const text = this.texts.find((doc) => doc.id === textId);
        return text;
    }
};
exports.TextService = TextService;
exports.TextService = TextService = __decorate([
    (0, common_1.Injectable)()
], TextService);
//# sourceMappingURL=text.service.js.map