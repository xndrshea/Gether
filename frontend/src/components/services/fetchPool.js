import { Asset, PoolType } from '@dedust/sdk';
import factory from './factory';

export const fetchPool = async (tokenAddress) => {
    const TON = Asset.native();
    const TOKEN = Asset.jetton(tokenAddress);
    const pool = await factory.getPool(PoolType.VOLATILE, [TON, TOKEN]);

    if (!pool || (await pool.getReadinessStatus()) !== 'READY') {
        throw new Error('Pool is not deployed or ready.');
    }

    return pool;
};
