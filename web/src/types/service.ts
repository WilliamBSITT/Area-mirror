export type Area = {
    id: number
    name: string
    status: "success" | "processing" | "failed"
    amount?: number
    enabled?: boolean
}

export type Service = {
    id: number;
    name: string;
    description: string;
    image: string;
};

export type ServiceDetails = {
    name: string;
    actions: Actions[];
    reactions: Reactions[];
    description: string;
    image: string;
};

export type Actions = {
    name: string;
    description: string;
}

export type Reactions = {
    name: string;
    description: string;
}

export type ServicesActionsParams = {
    action: string;
    params: Params[];
    service: string;
}

export type ServicesReactionsParams = {
    params: Params[];
    action: string;
    service: string;
}

export type Params = {
    description: string;
    name: string;
    required: boolean;
    type: string;
}