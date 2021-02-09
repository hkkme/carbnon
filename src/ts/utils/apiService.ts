import axios from 'axios';

const ApiService = {
    requestPOST: (url: string | undefined, data: IApiServiceData, headers: IApiServiceHeaders = {}):Promise<IInput> => {

        return axios({
            method: 'post',
            url,
            data,
            headers,
        })
            .then(res => {
                return res;
            })
            .catch(err => {
                // handle err
                return err;
            });

    },
};

export default ApiService;