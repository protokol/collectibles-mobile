import { ProtokolConnection } from '@protokol/client';

const connection = (baseUrl: string, timeout = 5000) =>
    new ProtokolConnection(`${baseUrl}/api`).withOptions({
        timeout
    });

export default connection;