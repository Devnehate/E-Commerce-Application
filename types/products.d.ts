/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IProduct {
    id: any;
    localizeInfos: { title: any };
    price: any;
    attributeValues: {
        p_image: { value: { downloadLink: any } };
        p_title: { value: any }
    };
}