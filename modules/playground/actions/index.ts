"use server"

import { db } from "@/lib/db"
import { TemplateFolder } from "../lib/path-to-json"
import { currentUser } from "@/modules/auth/actions"

export const getPlaygroundById = async (id: string) => {
    try {

        const playground = await db.playground.findUnique({
            where: {
                id
            },
            include: {
                templateFile: {
                    select: {
                        content: true
                    }
                }
            }
        })

        return playground

    } catch (error) {
        console.error("Error fetching playground:", error)
        throw new Error("Failed to fetch playground")
    }
}

export const saveUpdatedCode = async (playgroundId: string, data: TemplateFolder) => {
    const user = await currentUser()
    if (!user) {
        throw new Error("Unauthorized")
    }

    try {
        const updatedFile = await db.templateFile.upsert({
            where: {
                playgroundId: playgroundId
            },
            update: {
                content: data as any,
            },
            create: {
                playgroundId: playgroundId,
                content: data as any,
            }
        })
        return updatedFile
    } catch (error) {
        console.error("Error saving updated code:", error)
        throw new Error("Failed to save updated code")
    }
}