// src/api/asteroidInfoApi.test.ts
import { getGeneralAsteroidInfo, getSpecificAsteroidInfo } from '../../src/api/asteroidInfoApi';
import dotenv from 'dotenv';

dotenv.config({ path: './pipe.env' });

global.fetch = jest.fn((url) => {
    if (url.includes('feed')) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
                near_earth_objects: {
                    "2022-09-07": [
                        {
                            id: '3542519',
                            name: '(2010 PK9)',
                            estimated_diameter: {
                                kilometers: {
                                    estimated_diameter_min: 0.1154928176,
                                    estimated_diameter_max: 0.258249791
                                }
                            },
                            is_potentially_hazardous_asteroid: true
                        }
                    ]
                }
            }),
        });
    } else if (url.includes('neo')) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
                links: {
                    self: "http://api.nasa.gov/neo/rest/v1/neo/3542519?api_key=DEMO_KEY"
                },
                id: "3542519",
                neo_reference_id: "3542519",
                name: "(2010 PK9)",
                designation: "2010 PK9",
                nasa_jpl_url: "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=3542519",
                absolute_magnitude_h: 21.81,
                estimated_diameter: {
                    kilometers: {
                        estimated_diameter_min: 0.1154928176,
                        estimated_diameter_max: 0.258249791
                    },
                    meters: {
                        estimated_diameter_min: 115.4928175848,
                        estimated_diameter_max: 258.2497910326
                    },
                    miles: {
                        estimated_diameter_min: 0.0717638876,
                        estimated_diameter_max: 0.1604689309
                    },
                    feet: {
                        estimated_diameter_min: 378.9134556449,
                        estimated_diameter_max: 847.2762444114
                    }
                },
                is_potentially_hazardous_asteroid: true
            }),
        });
    }
    return Promise.reject(new Error('Unknown URL'));
}) as jest.Mock;

describe('Asteroid Info API', () => {
    it('should fetch general asteroid info', async () => {
        const start_date = '2022-09-07';
        const end_date = '2022-09-08';
        const data = await getGeneralAsteroidInfo(start_date, end_date);
        expect(data).toBeDefined();
        const asteroid = data.near_earth_objects["2022-09-07"][0];
        expect(asteroid.id).toBe('3542519');
        expect(asteroid.name).toBe('(2010 PK9)');
        expect(asteroid.estimated_diameter.kilometers.estimated_diameter_min).toBe(0.1154928176);
        expect(asteroid.estimated_diameter.kilometers.estimated_diameter_max).toBe(0.258249791);
        expect(asteroid.is_potentially_hazardous_asteroid).toBe(true);
    });

    it('should fetch specific asteroid info', async () => {
        const asteroidId = '3542519';
        const data = await getSpecificAsteroidInfo(asteroidId);
        expect(data).toBeDefined();
        expect(data.id).toBe('3542519');
        expect(data.neo_reference_id).toBe('3542519');
        expect(data.name).toBe('(2010 PK9)');
        expect(data.designation).toBe('2010 PK9');
        expect(data.nasa_jpl_url).toBe('https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=3542519');
        expect(data.absolute_magnitude_h).toBe(21.81);
        expect(data.estimated_diameter.kilometers.estimated_diameter_min).toBe(0.1154928176);
        expect(data.estimated_diameter.kilometers.estimated_diameter_max).toBe(0.258249791);
        expect(data.is_potentially_hazardous_asteroid).toBe(true);
    });
});