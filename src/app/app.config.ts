const prod = {
    host: 'http://192.241.211.148',
    port: '3002'
};

const test = {
    host: 'http://localhost',
    port: '3002'
};

const root = '/miConta/v1/';

export const config = {
    api: {
        prod: `${prod.host}${root}`,
        test: `${test.host}:${test.port}${root}`
    }
};
