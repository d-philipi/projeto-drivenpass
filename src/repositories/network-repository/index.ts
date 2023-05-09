import { prisma } from "@/config";
import { Network } from "@/protocols";

async function createNetwork(network : Network, userId: number) {
    return await prisma.network.create({
        data:{userId,...network}
    })
}

async function findNetworkByTitle(title : string) {
    return await prisma.network.findFirst({
        where: {
            title:title
        }
    })
}

async function findNetworkById(networkId : number) {
    return await prisma.network.findFirst({
        where: {
            id:networkId
        }
    })
}

async function deleteNetwork(networkId : number) {
    return await prisma.network.delete({
        where: {
            id:networkId
        }
    })
}

const networkRepository = {
    createNetwork,
    findNetworkByTitle,
    findNetworkById,
    deleteNetwork
};

export default networkRepository;