interface IInput {
    input: {
        showGraph: boolean;
        makeCalc: boolean;
        consumptionWeek: {
            country: string;
            region: string;
            days: {
                [key: string]: {
                    eUnit: string;
                    eVal: string;
                    gCarb: string;
                }
            }
        };
    }
}

interface IUser {
    user: {
        isSignUp: boolean;
        isAbout: boolean;
        userName: boolean;
        loggedIn: boolean;
    };
}

interface IConsumptionWeek {
        country: string;
        region: string;
        days: {
            [key: string]: {
                eUnit: string;
                eVal: string;
                gCarb: string;
            }
        }
}

interface IApiServiceHeaders {
    [key: string]: string
}

interface IApiServiceData {
    type: string;
    country: string;
    state: string;
    electricity_unit: string | undefined;
    electricity_value: string;
}

interface IrLabels {
    [key: string]: string;
}

interface IregionData {
    label: string;
    disabled: boolean;
    regions: {
        [key: string]: string;
    }
}

interface IresRequestPOST {
    [key: string]: any;
}