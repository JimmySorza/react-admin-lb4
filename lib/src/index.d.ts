declare const lb4Provider: (apiUrl: any, headers?: () => any, idParamApi?: string, idParamAdmin?: string, ftch?: typeof fetch) => (type: any, resource: any, { pagination, sort, filter, data, ids, id, target }: {
    pagination: any;
    sort: any;
    filter?: {};
    data: any;
    ids: any;
    id: any;
    target: any;
}) => Promise<any>;
export default lb4Provider;
