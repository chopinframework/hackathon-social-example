export async function login() {
    return fetch("/_chopin/login").then(res => res.json()).then(data => {
        return data.address
    })
}