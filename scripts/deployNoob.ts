import { toNano } from '@ton/core';
import { Noob } from '../wrappers/Noob';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const noob = provider.open(
        Noob.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                counter: 0,
            },
            await compile('Noob')
        )
    );

    await noob.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(noob.address);

    console.log('ID', await noob.getID());
}
