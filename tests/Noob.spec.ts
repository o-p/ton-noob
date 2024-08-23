import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { Noob } from '../wrappers/Noob';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

import Debug from 'debug'

const debug = Debug('test:noob')

describe('Noob', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Noob');
        debug('Code compiled, %d bits', code.bits.length);
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let noob: SandboxContract<Noob>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        noob = blockchain.openContract(
            Noob.createFromConfig(
                {
                    id: 0,
                    counter: 0,
                },
                code
            )
        );

        deployer = await blockchain.treasury('deployer');

        const deployResult = await noob.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: noob.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and noob are ready to use
    });

    it('should increase counter', async () => {
        const increaseTimes = 3;
        for (let i = 0; i < increaseTimes; i++) {
            const debug = Debug(`test:noob:increase(${i + 1})`);

            const increaser = await blockchain.treasury('increaser' + i);
            debug('Sender: %s', increaser.getSender().address);

            const counterBefore = await noob.getCounter();
            debug('counter before increasing %d', counterBefore);

            const increaseBy = Math.floor(Math.random() * 100);
            debug('increasing by %d', increaseBy);

            const increaseResult = await noob.sendIncrease(increaser.getSender(), {
                increaseBy,
                value: toNano('0.05'),
            });

            expect(increaseResult.transactions).toHaveTransaction({
                from: increaser.address,
                to: noob.address,
                success: true,
            });

            const counterAfter = await noob.getCounter();
            debug('counter after increasing %d', counterAfter);

            expect(counterAfter).toBe(counterBefore + increaseBy);
        }
    });
});
