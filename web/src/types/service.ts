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