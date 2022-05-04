export const dataProvider =
`
import { fetchUtils } from "react-admin";
import { stringify } from "query-string";

const apiUrl = "http://localhost:8000";
const httpClient = fetchUtils.fetchJson;

export const dataProvider = {
  getList: async (resource: any, params: { pagination: { page: any; perPage: any; }; sort: { field: any; order: any; }; filter: any; }) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify(params.filter),
    };
    const url = \`\${apiUrl}/\${resource}?\${stringify(query)}\`;
    
    const { json } = await httpClient(url);
    return json;
  },

  getOne: (resource: any, params: { id: any; }) =>
    httpClient(\`\${apiUrl}/\${resource}/\${params.id}\`).then(({ json }) => ({
      data: json,
    })),

  getMany: async (resource: any, params: { ids: any; }) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const url = \`\${apiUrl}/\${resource}?\${stringify(query)}\`;
    const { json } = await httpClient(url);
    return ({ data: json });
  },

  getManyReference: async (resource: any, params: { pagination: { page: any; perPage: any; }; sort: { field: any; order: any; }; filter: any; target: any; id: any; }) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify({
        ...params.filter,
        [params.target]: params.id,
      }),
    };
    const url = \`\${apiUrl}/\${resource}?\${stringify(query)}\`;

    const { headers, json } = await httpClient(url);
    return ({
      data: json,
      // @ts-ignore
      total: parseInt(headers.get("content-range").split("/").pop(), 10),
    });
  },

  update: (resource: any, params: { id: any; data: any; }) =>
    httpClient(\`\${apiUrl}/\${resource}/\${params.id}\`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json })),

  updateMany: async (resource: any, params: { ids: any; data: any; }) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const { json } = await httpClient(\`\${apiUrl}/\${resource}?\${stringify(query)}\`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    });
    return ({ data: json });
  },

  create: (resource: any, params: { data: any; }) =>
    httpClient(\`\${apiUrl}/\${resource}\`, {
      method: "POST",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: { ...params.data, id: json.id },
    })),

  delete: (resource: any, params: { id: any; }) =>
    httpClient(\`\${apiUrl}/\${resource}/\${params.id}\`, {
      method: "DELETE",
    }).then(({ json }) => ({ data: json })),

  deleteMany: async (resource: any, params: { ids: any; }) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const { json } = await httpClient(\`\${apiUrl}/\${resource}?\${stringify(query)}\`, {
      method: "DELETE",
    });
    return ({ data: json });
  },
};
`
