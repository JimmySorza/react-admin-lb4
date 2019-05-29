import * as _ from 'lodash';

const [
  GET_LIST,
  CREATE,
  UPDATE,
  UPDATE_MANY,
  DELETE,
  DELETE_MANY,
  GET_MANY_REFERENCE,
  GET_ONE,
] = [
  'GET_LIST',
  'CREATE',
  'UPDATE',
  'UPDATE_MANY',
  'DELETE',
  'DELETE_MANY',
  'GET_MANY_REFERENCE',
  'GET_ONE',
];

const lb4Provider = (
  apiUrl: any,
  headers = () => undefined,
  idParamApi = '_id',
  idParamAdmin = 'id',
  ftch = fetch,
) => {
  const getOptions = async (type: any, body: any) => {
    const options = {
      headers: {
        Accept: 'application/json',
        // @ts-ignore
        ...(await headers()),
      },
      body,
      method: '',
    };
    if (body) {
      options.body = JSON.stringify(_.omit(body, [idParamApi, idParamAdmin]));
      options.headers['Content-Type'] = 'application/json';
    }
    switch (type) {
      case CREATE:
        options.method = 'POST';
        break;
      case UPDATE:
      case UPDATE_MANY:
        options.method = 'PATCH';
        break;
      case DELETE:
      case DELETE_MANY:
        options.method = 'DELETE';
        break;
      default:
        options.method = 'GET';
    }

    return options;
  };

  const setWhere = (url: any, filter: any, initKey = 'filter[where]') => {
    const search = url.searchParams;
    const fnWhere = (anyWhere: any, key = initKey) => {
      if (Array.isArray(anyWhere)) {
        anyWhere.forEach(item => {
          search.append(key, item);
        });
        return;
      }
      if (anyWhere instanceof Object) {
        Object.keys(anyWhere).forEach(p => {
          fnWhere(
            anyWhere[p],
            `${key}[${p === idParamAdmin ? idParamApi : p}]`,
          );
        });
        return;
      }
      search.append(key, anyWhere);
    };
    fnWhere(filter);
  };

  const fetchTotal = async (resource: any, filter: any) => {
    const url = new URL(apiUrl);
    const path = url.pathname.split('/');
    path.push(resource, 'count');
    if (filter && Object.keys(filter).length > 0) {
      setWhere(url, filter, 'where');
    }
    url.pathname = path.filter(Boolean).join('/');
    return (await (await ftch(
      url.toString(),
      await getOptions(null, null),
    )).json()).count;
  };

  const setLimitAndOffset = (url: any, { page = 1, perPage = 10 }) => {
    const search = url.searchParams;
    search.append('filter[limit]', `${perPage}`);
    search.append('filter[offset]', `${(page - 1) * perPage}`);
  };

  const setOrder = (url: any, { field = 'createdAt', order = 'DESC' }) => {
    const search = url.searchParams;
    search.append('filter[order]', `${field} ${order}`);
  };

  const mapKeys = (obj: any) =>
    _.mapKeys(obj, (value: any, key: any) => {
      if (key === idParamApi) {
        return idParamAdmin;
      }
      return key;
    });

  const fn = async (
    type: any,
    resource: any,
    // @ts-ignore
    { pagination, sort, filter = {}, data, ids, id, target },
  ) => {
    let total = null;
    if ([GET_LIST, GET_MANY_REFERENCE].indexOf(type) > -1) {
      const totalFilter = JSON.parse(JSON.stringify(filter));
      if (id) {
        totalFilter[target || idParamApi] = id;
      }
      total = await fetchTotal(resource, totalFilter);
    }

    const url = new URL(apiUrl);

    const path = url.pathname.split('/');
    path.push(resource);
    if (id && !target) {
      path.push(id);
    }

    if (id && target) {
      // @ts-ignore
      // eslint-disable-next-line no-param-reassign
      filter[target] = id;
    }
    if (ids) {
      if (type === DELETE_MANY) {
        const r: any = [];
        ids.forEach(async (idDelete: any) => {
          // @ts-ignore
          r.push((await fn(DELETE, resource, { idDelete })).data);
        });
        return { data: r.map((el: any) => el[idParamAdmin]) };
      }
      _.set(filter, `${idParamApi}.inq`, ids);
    }
    if (filter && Object.keys(filter).length > 0) {
      if ([UPDATE_MANY].indexOf(type) > -1) {
        setWhere(url, filter, 'where');
      } else {
        setWhere(url, filter);
      }
    }

    if (pagination) {
      setLimitAndOffset(url, pagination);
    }
    if (sort) {
      setOrder(url, sort);
    }

    const options = await getOptions(type, data);
    let item;
    if ([DELETE].indexOf(type) > -1) {
      // @ts-ignore
      item = await fn(GET_ONE, resource, { id });
    }
    url.pathname = path.filter(Boolean).join('/');
    let response = await ftch(url.toString(), options);
    try {
      response = await response.json();
    } catch (e) {
      if ([DELETE].indexOf(type) === -1) {
        if (id) {
          // @ts-ignore
          return fn(GET_ONE, resource, { id });
        }
        throw e;
      }
    }
    // @ts-ignore
    if (response.error) {
      // @ts-ignore
      throw new Error(response.error.message);
    }
    let result = {
      data,
      total,
    };
    if ([UPDATE_MANY, DELETE_MANY].indexOf(type) > -1) {
      result.data = ids;
    } else if ([DELETE].indexOf(type) > -1) {
      result = item;
    } else {
      result.data = Array.isArray(response)
        ? response.map(mapKeys)
        : mapKeys(response);
    }

    if (typeof total === 'number') {
      result.total = total;
    }

    return result;
  };

  return fn;
};

export default lb4Provider;
