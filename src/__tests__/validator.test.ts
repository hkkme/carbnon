import validator from '../ts/utils/validator';

let testVals = ['0.165','.14',',003','0,333','0','11','5453.432'];

testVals.map(val => {
    test(`validator ${val}`, () => {
        const result = validator.isPositiveDecimal(val);
        expect(result).toBe(true);
    });
})

testVals = ['00677','1a','01.1','-3333','456%','12,234,44'];

testVals.map(val => {
    test(`validator ${val}`, () => {
        const result = validator.isPositiveDecimal(val);
        expect(result).toBe(false);
    });
});