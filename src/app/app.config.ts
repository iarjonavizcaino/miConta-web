const prod = {
    host: 'http://167.99.108.179',
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
