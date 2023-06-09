export type ApplicationError = {
    name: string;
    message: string;
};

export type RequestError = {
    status: number;
    data: object | null;
    statusText: string;
    name: string;
    message: string;
};

export type Credential = {
    title: string,
    url: string,
    username: string,
    password: string
}

export type Network = {
    title: string,
    network: string,
    password: string
}