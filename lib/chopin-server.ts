import { headers } from 'next/headers'


export async function getAddress() {
    const headersList = await headers()
    return headersList.get("x-address")
}