export type AreaPublic = {
    id: number
    name: string
    status: "success" | "processing" | "failed"
    amount?: number
    enabled?: boolean
}
