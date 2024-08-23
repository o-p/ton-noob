import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type NoobConfig = {
    id: number;
    counter: number;
    newVar?: number;
};

export function noobConfigToCell(config: NoobConfig): Cell {
    return beginCell()
      .storeUint(config.id, 32)
      .storeUint(config.counter, 32)
      .storeUint(config.newVar ?? 0, 32)
      .endCell();
}

export const Opcodes = {
    increase: 0x7e8764ef,
    reset: 0xf6ce5dcc,
};

export class Noob implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Noob(address);
    }

    static createFromConfig(config: NoobConfig, code: Cell, workchain = 0) {
        const data = noobConfigToCell(config);
        const init = { code, data };
        return new Noob(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendIncrease(
        provider: ContractProvider,
        via: Sender,
        opts: {
            increaseBy: number;
            value: bigint;
            queryID?: number;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.increase, 32)
                .storeUint(opts.queryID ?? 0, 64)
                .storeUint(opts.increaseBy, 32)
                .endCell(),
        });
    }

    async sendReset(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(Opcodes.reset, 32).endCell(),
        });
    }

    async getCounter(provider: ContractProvider) {
        const result = await provider.get('get_counter', []);
        return result.stack.readNumber();
    }

    async getID(provider: ContractProvider) {
        const result = await provider.get('get_id', []);
        return result.stack.readNumber();
    }

    async getNewVar(provider: ContractProvider) {
        const result = await provider.get('get_new_var', []);
        return result.stack.readNumber();
    }
}
