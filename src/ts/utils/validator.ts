const validator = {
    isPositiveDecimal(val: string): boolean {
        const regex = new RegExp(/^(?:([0]?)|([0]?)([.,]{1})([0-9]*)|([1-9]+)([0-9]*)([.,]?)([0-9]*))$/);
        return regex.test(val);
    },
};

export default validator;