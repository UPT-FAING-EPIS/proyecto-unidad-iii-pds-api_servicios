// To parse this data:
//
//   import { Convert, AxiosError } from "./file";
//
//   const axiosError = Convert.toAxiosError(json);

export type AxiosError = {
    message: string;
    name:    string;
    stack:   string;
    config:  Config;
    code:    string;
    status:  number;
}

export type Config = {
    transitional:      Transitional;
    adapter:           string[];
    transformRequest:  null[];
    transformResponse: null[];
    timeout:           number;
    xsrfCookieName:    string;
    xsrfHeaderName:    string;
    maxContentLength:  number;
    maxBodyLength:     number;
    headers:           Headers;
    method:            string;
    url:               string;
    data:              string;
}



export type Headers = {
    Accept:         string;
    "Content-Type": string;
}

export type Transitional = {
    silentJSONParsing:   boolean;
    forcedJSONParsing:   boolean;
    clarifyTimeoutError: boolean;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toAxiosError(json: string): AxiosError {
        return JSON.parse(json);
    }

    public static axiosErrorToJson(value: AxiosError): string {
        return JSON.stringify(value);
    }
}
