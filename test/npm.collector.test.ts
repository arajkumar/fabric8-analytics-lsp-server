import { expect } from 'chai';
import { DependencyCollector } from '../src/collector';

describe('npm package.json parser test', () => {
    const collector = new DependencyCollector(null);

    it('tests empty package.json', async () => {
        const deps = await collector.collect(`
        {}
        `);
        expect(deps.length).equal(0);
    });

    it('tests empty dependencies key', async () => {
        const deps = await collector.collect(`
        {
          "hello":[],
          "dependencies": {}
        }
        `);
        console.log(deps);
        expect(deps.length).equal(0);
    });

    it('tests single dependency ', async () => {
        const deps = await collector.collect(`{
          "hello":{},
          "dependencies": {
            "hello": "1.0"
          }
        }`);
        expect(deps.length).equal(1);
        expect(deps[0]).is.eql({
          name: {value: "hello", position: {line: 4, column: 14}},
          version: {value: "1.0", position: {line: 4, column: 23}}
        });
    });

    it('tests single dependency with version in next line', async () => {
        const deps = await collector.collect(`{
          "hello":{},
          "dependencies": {
            "hello":
              "1.0"
          }
        }`);
        expect(deps.length).equal(1);
        expect(deps[0]).is.eql({
          name: {value: "hello", position: {line: 4, column: 14}},
          version: {value: "1.0", position: {line: 5, column: 16}}
        });
    });

    it('tests 3 dependencies with spaces', async () => {
        const deps = await collector.collect(`{
          "hello":{},
          "dependencies": {
           "hello":                "1.0",
              "world":"^1.0",


        "foo":

          "     10.0.1"
          }
        }`);
        expect(deps.length).equal(3);
        expect(deps[0]).is.eql({
          name: {value: "hello", position: {line: 4, column: 13}},
          version: {value: "1.0", position: {line: 4, column: 37}}
        });
        expect(deps[1]).is.eql({
          name: {value: "world", position: {line: 5, column: 16}},
          version: {value: "^1.0", position: {line: 5, column: 24}}
        });
        expect(deps[2]).is.eql({
          name: {value: "foo", position: {line: 8, column: 10}},
          version: {value: "     10.0.1", position: {line: 10, column: 12}}
        });
    });
});