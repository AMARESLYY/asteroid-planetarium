// src/api/collisionProbabilityApi.test.ts
import { getSentryTrackedAsteroids, getTrackedAsteroidInfo } from '../../src/api/collisionProbabilityApi';

global.fetch = jest.fn() as jest.Mock;

describe('collisionProbabilityApi', () => {
    beforeEach(() => {
        (fetch as jest.Mock).mockClear();
    });

    it('should fetch sentry tracked asteroids', async () => {
        const mockResponse = {
            count: "1798",
            signature: {
                source: "NASA/JPL Sentry Data API",
                version: "2.0"
            },
            data: [
                {
                    range: "2056-2113",
                    diameter: "0.66",
                    fullname: "(1979 XB)",
                    ps_max: "-3.01",
                    id: "bJ79X00B",
                    des: "1979 XB",
                    n_imp: 4,
                    h: "18.54",
                    ps_cum: "-2.71",
                    v_inf: "23.7606234552547",
                    ts_max: "0",
                    last_obs: "1979-12-15",
                    last_obs_jd: "2444222.5",
                    ip: "8.515158e-07"
                }
            ]
        };

        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const data = await getSentryTrackedAsteroids();
        expect(data).toEqual(mockResponse);
        expect(fetch).toHaveBeenCalledWith('https://ssd-api.jpl.nasa.gov/sentry.api');
    });

    it('should throw an error if fetching sentry tracked asteroids fails', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            statusText: 'Internal Server Error',
        });

        await expect(getSentryTrackedAsteroids()).rejects.toThrow('Error fetching sentry tracked asteroids: Internal Server Error');
    });

    it('should fetch collision probability for a specific asteroid', async () => {
        const mockResponse = {
            count: "1",
            signature: {
                source: "NASA/JPL Sentry Data API",
                version: "2.0"
            },
            data: [
                {
                    range: "2056-2113",
                    diameter: "0.66",
                    fullname: "(1979 XB)",
                    ps_max: "-3.01",
                    id: "bJ79X00B",
                    des: "1979 XB",
                    n_imp: 4,
                    h: "18.54",
                    ps_cum: "-2.71",
                    v_inf: "23.7606234552547",
                    ts_max: "0",
                    last_obs: "1979-12-15",
                    last_obs_jd: "2444222.5",
                    ip: "8.515158e-07"
                }
            ]
        };

        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const asteroid_designation = '1979 XB';
        const data = await getTrackedAsteroidInfo(asteroid_designation);
        expect(data).toEqual(mockResponse);
        expect(fetch).toHaveBeenCalledWith(`https://ssd-api.jpl.nasa.gov/sentry.api?des=${asteroid_designation}`);
    });


    it('should fetch detailed collision probability data for a specific asteroid', async () => {
        const mockResponse = {
            count: "1",
            signature: {
                source: "NASA/JPL Sentry Data API",
                version: "2.0"
            },
            data: [
                {
                    ip: "1.772e-08",
                    energy: "1.079e-01",
                    sigma_vi: "1.0444",
                    date: "2120-11-18.22",
                    ps: "-8.99",
                    ts: "0"
                },
                {
                    date: "2119-11-18.02",
                    sigma_vi: "1.1175",
                    energy: "1.083e-01",
                    ip: "8.637e-09",
                    ts: "0",
                    ps: "-9.30"
                }
            ]
        };

        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const asteroid_designation = '1979 XB';
        const data = await getTrackedAsteroidInfo(asteroid_designation);
        expect(data).toEqual(mockResponse);
        expect(fetch).toHaveBeenCalledWith(`https://ssd-api.jpl.nasa.gov/sentry.api?des=${asteroid_designation}`);
    });
});