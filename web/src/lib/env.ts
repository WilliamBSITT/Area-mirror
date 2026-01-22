const required = (v?: string, name?: string) => {
    if (!v) throw new Error(`Missing env var: ${name}`)
    return v
}

export const env = {
    BACKEND_URL: required(process.env.BACKEND_URL, "BACKEND_URL"),
}
