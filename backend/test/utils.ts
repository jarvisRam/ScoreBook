import nock from 'nock';
import { config } from '../src/config';

export const setupRapidApiMock = (host: string, path: string, response: any, statusCode: number = 200) => {
    return nock(`https://${host}`)
        .get(path)
        .query(true) // match any query params
        .reply(statusCode, response);
};

export const clearMocks = () => {
    nock.cleanAll();
};

export const mockHosts = config.rapidApiHosts;
