"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const chat_gateway_1 = require("./chat.gateway");
describe('ChatGateway', () => {
    let gateway;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [chat_gateway_1.ChatGateway],
        }).compile();
        gateway = module.get(chat_gateway_1.ChatGateway);
    });
    it('should be defined', () => {
        expect(gateway).toBeDefined();
    });
});
//# sourceMappingURL=chat.gateway.spec.js.map