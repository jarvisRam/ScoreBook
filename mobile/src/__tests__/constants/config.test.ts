describe('ENV_URLS.prod', () => {
    const original = process.env.EXPO_PUBLIC_API_BASE_URL;

    afterEach(() => {
        if (original === undefined) delete process.env.EXPO_PUBLIC_API_BASE_URL;
        else process.env.EXPO_PUBLIC_API_BASE_URL = original;
    });

    const loadConfig = () => {
        let config: typeof import('../../constants/config');
        jest.isolateModules(() => {
            config = require('../../constants/config');
        });
        return config!;
    };

    it('defaults to the hosted backend', () => {
        delete process.env.EXPO_PUBLIC_API_BASE_URL;

        const { ENV_URLS, DEFAULT_PROD_API_URL } = loadConfig();

        expect(ENV_URLS.prod).toBe(DEFAULT_PROD_API_URL);
    });

    it('uses EXPO_PUBLIC_API_BASE_URL when it is set', () => {
        process.env.EXPO_PUBLIC_API_BASE_URL = 'http://localhost:3000/api';

        expect(loadConfig().ENV_URLS.prod).toBe('http://localhost:3000/api');
    });

    it('treats an empty value as unset', () => {
        process.env.EXPO_PUBLIC_API_BASE_URL = '';

        const { ENV_URLS, DEFAULT_PROD_API_URL } = loadConfig();

        expect(ENV_URLS.prod).toBe(DEFAULT_PROD_API_URL);
    });
});
