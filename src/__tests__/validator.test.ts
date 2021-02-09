import validator from '../ts/utils/validator';

let testVals = ['1.1', '.1', '333,33333'];

testVals.map(val => {
    test(`validator ${val}`, () => {
        const result = validator.isPositiveDecimal(val);
        expect(result).toBe(true);
    });
})

testVals = ['1a', '01.1', '-3333'];

testVals.map(val => {
    test(`validator ${val}`, () => {
        const result = validator.isPositiveDecimal(val);
        expect(result).toBe(false);
    });
});