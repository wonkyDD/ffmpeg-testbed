import {
    expect,
    test,
    describe,
    // beforeEach,
    // afterEach,
    // beforeAll,
    // afterAll,
    // vi
} from 'vitest'
import { string_sum } from '@/src/util'

describe('util test', () => {
    test('string_sum test', () => {
        expect(string_sum("0.000000", "1.960000")).toBe("1.960000");
        expect(string_sum("0.921000", "1.964000")).toBe("2.885000");
        expect(string_sum("0.885000", "1.970000")).toBe("2.855000");
        expect(string_sum("0.096000", "1.973000")).toBe("2.069000");
        expect(string_sum("0.057000", "1.976000")).toBe("2.033000");
        expect(string_sum("1.061000", "1.979000")).toBe("3.040000");
        expect(string_sum("0.605000", "1.982000")).toBe("2.587000");
        expect(string_sum("1.317000", "1.985000")).toBe("3.302000");
        expect(string_sum("0.069000", "1.988000")).toBe("2.057000");
        expect(string_sum("0.698000", "1.991000")).toBe("2.689000");
        expect(string_sum("12.698000", "1.991000")).toBe("14.689000");
    });
    
    // test('merge test', () => {
    //     expect(string_sum("12.698000", "1.991000")).toBe("14.689000");
    // });
});
