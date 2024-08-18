import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type SwapContractConfig = {};

export function swapContractConfigToCell(config: SwapContractConfig): Cell {
    return beginCell().endCell();
}

export class SwapContract implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new SwapContract(address);
    }

    static createFromConfig(config: SwapContractConfig, code: Cell, workchain = 0) {
        const data = swapContractConfigToCell(config);
        const init = { code, data };
        return new SwapContract(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
