import chai from 'chai';
let assert = chai.assert;

import {Geo} from '../src/geo';
import simplePolygon from './fixtures/simple-polygon.json';

describe('Geo', () => {

    let tmp_tile_scale,
        tmp_units_per_pixel,
        tmp_units_per_meter;

    // capture modules variables before we run the test suite so the
    // different tests don't pollute each other
    beforeEach(() => {
        tmp_tile_scale = Geo.tile_scale;
        tmp_units_per_pixel = Geo.units_per_pixel;
        tmp_units_per_meter = Geo.units_per_meter;
    });

    afterEach(() => {
        Geo.tile_scale = tmp_tile_scale;
        Geo.units_per_pixel = tmp_units_per_pixel;
        Geo.units_per_meter = tmp_units_per_meter;
    });

    describe('Geo.setTileScale(scale)', () => {
        let subject = Geo.setTileScale;

        it('sets the value of the tile_scale', () => {
            subject(8);
            assert.strictEqual(Geo.tile_scale, 8);
        });

        it('calculates the value of the units per pixel', () => {
            subject(128);
            assert.strictEqual(Geo.units_per_pixel, 128 / 256);
        });

        it('builds an array of units per meter for each zoom level', () => {
            subject(32);
            assert.strictEqual(Geo.units_per_meter[0],  7.985024747729079e-7);
            assert.strictEqual(Geo.units_per_meter[10], 0.0008176665341674576);
            assert.strictEqual(Geo.units_per_meter[20], 0.8372905309874766);
        });

    });

    describe('Geo.metersForTile(tile)', () => {
        let subject = Geo.metersForTile;
        it('converts the location to mercator meters', () => {
            assert.deepEqual(
                subject({z: 10, x: 10, y: 10}),
                {x: -19646150.75796914, y: 19646150.75796914}
            );
        });
    });

    describe('Geo.tileForMeters(meters)', () => {
        let subject = Geo.tileForMeters;
        it('converts a location to X/Y/Z', () => {
            assert.deepEqual(subject([1, 2], 12), {x: 2048, y: 2047, z: 12});
        });
    });

    describe('Geo.metersToLatLng([x, y])', () => {
        let subject = Geo.metersToLatLng;
        it('conert mercator meters to lat-lng', () => {
            assert.deepEqual(subject([1, 2]), [0.000008983152841195214, 0.000017966305681987637]);
        });
    });

    describe('Geo.latLngToMeters([x, y])', () => {
        let subject = Geo.latLngToMeters;
        it('converts lat long to meters', () => {
            assert.deepEqual(subject([1, 2]), [111319.49079327358, 222684.20850554458]);
        });
    });

    describe('Geo.transformGeometry(geometry, transformGeometry)', () => {

    });

    describe('Geo.findBoundingBox(polygon)', () => {
        let bbox;
        beforeEach(() => {
            bbox = Geo.findBoundingBox(simplePolygon.geometry.coordinates);
        });

        it('calculates the expected bounding box', () => {
            assert.deepEqual(bbox, simplePolygon.properties.bounds);
        });
    });

});
