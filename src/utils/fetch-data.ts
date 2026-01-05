export interface IFetch {
  api: string;
  method: "GET" | "PUT" | "POST" | "DELETE";
  payload?: any;
  headers?: any;
  params?: any;
  retry?: number;
  requestContentType?: "json" | "formData" | "text";
  responseType?: "json" | "text" | "blob";
}

export const fetchData = <T>({
  api,
  method,
  payload,
  headers = {},
  params,
  requestContentType = "json",
  responseType = "json",
  retry = 0,
}: IFetch): Promise<T | null> => {
  const getData = (retry: number) => {
    if (typeof params === "object" && Object.keys(params).length >= 0) {
      const queryParams = new URLSearchParams(params);
      api += `?${queryParams}`;
    }

    if (requestContentType === "formData") {
    } else if (requestContentType === "text") {
      headers = {
        ...headers,
        "Content-Type": "text/plain",
      };
    } else {
      headers = {
        ...headers,
        "Content-Type": "application/json",
      };
    }

    // add access token to headers if exists
    if (localStorage.getItem("access_token") || sessionStorage.getItem("access_token")) {
      const accessToken = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      headers = {
        ...headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }

    return new Promise<T | null>(async (resolve, reject) => {
      try {
        let response;
        if (method === "POST") {
          response = await fetch(api, {
            method,
            body: requestContentType === "formData" ? payload : JSON.stringify(payload),
            headers,
          });
        } else if (method === "GET") {
          response = await fetch(api, {
            method,
            headers,
          });
        }
        if (response?.status !== 200 && response?.status !== 201 && response?.status !== 204) {
          throw Error("not success");
        }

        if (responseType === "json") {
          const contentType = response.headers.get("content-type");
          if (contentType?.includes("application/json")) {
            const data = await response.json();
            resolve(data);
          } else {
            resolve(null);
          }
        } else if (responseType === "text") {
          const data = await response.text();
          resolve(data as unknown as T);
        } else if (responseType === "blob") {
          const data = await response.blob();
          resolve(data as unknown as T);
        }
      } catch (err) {
        if (retry > 0) {
          return getData(retry - 1);
        } else {
          reject(err);
        }
      }
    });
  };

  return getData(retry);
};
