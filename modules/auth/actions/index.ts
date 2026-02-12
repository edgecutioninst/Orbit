"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const getUserById = async (id: string) => {
    try {
        const user = await db.user.findUnique({
            where: { id },
            include: { accounts: true }
        });

        return user;
    } catch (error) {
        throw new Error("Failed to retrieve user");
        return null;
    }
}

export const getAccountByUserId = async (userId: string) => {
    try {

        const account = await db.account.findFirst({
            where: { userId },
        });

        return account;
    } catch (error: any) {
        throw new Error("Failed to retrieve account");
        return null;
    }
}

export const currentUser = async () => {
    try {

        const user = await auth();
        return user?.user;

    } catch (error) {
        throw new Error("Failed to retrieve current user");
        return null;
    }
}