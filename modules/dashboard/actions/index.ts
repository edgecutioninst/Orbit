'use server'

import { db } from "@/lib/db"
import { currentUser } from "@/modules/auth/actions"
import { revalidatePath } from "next/cache"

export const getAllPlaygroundForUser = async () => {
    const user = await currentUser()

    try {
        const playground = await db.playground.findMany({
            where: {
                userId: user?.id
            },
            include: {
                user: true,
                starMarks: {
                    where: {
                        userId: user?.id!
                    },
                    select: {
                        isMarked: true
                    }

                }
            }
        })
        return playground
    } catch (error) {
        throw new Error("Failed to retrieve playgrounds for user")
        return null
    }
}

export const createPlayground = async (data: {
    title: string,
    template: "REACT" | "NEXTJS" | "EXPRESS" | "ANGULAR" | "VUE" | "HONO" | "JAVASCRIPT" | "TYPESCRIPT",
    description?: string
}) => {
    const user = await currentUser()

    const { template, title, description } = data;

    if (!user?.id) {
        throw new Error("User ID is required to create a playground");
    }

    try {

        const playground = await db.playground.create({
            data: {
                title,
                template,
                description: description || "",
                userId: user.id
            }
        })
        return playground
    } catch (error) {
        throw new Error("Failed to create playground")
    }
}

export const deleteProjectById = async (id: string) => {
    try {
        await db.playground.delete({
            where: {
                id
            }
        })
        revalidatePath("/dashboard")
    } catch (error) {
        throw new Error("Failed to delete playground")
    }
}

export const editProjectById = async (id: string, data: {
    title: string,
    description: string
}) => {
    try {
        const updatedPlayground = await db.playground.update({
            where: {
                id
            },
            data: {
                title: data.title,
                description: data.description
            }
        })
        revalidatePath("/dashboard")
    } catch (error) {
        throw new Error("Failed to update playground")
    }
}

export const duplicateProjectById = async (id: string) => {
    try {

        const originalPlayground = await db.playground.findUnique({
            where: {
                id
            } //add template and description to the include
        })

        if (!originalPlayground) {
            throw new Error("Original playground not found")
        }

        const duplicatedPlayground = await db.playground.create({
            data: {
                title: `${originalPlayground.title} (Copy)`,
                template: originalPlayground.template,
                description: originalPlayground.description,
                userId: originalPlayground.userId

                //add template and description to the data
            }
        })
        revalidatePath("/dashboard")
        return duplicatedPlayground
    } catch (error) {
        throw new Error("Failed to duplicate playground")
    }
}

export const toggleStarMarked = async (playgroundId: string, isChecked: boolean) => {
    const user = await currentUser()
    const userId = user?.id;

    if (!userId) {
        throw new Error("User ID is required to toggle star marked")
    }

    try {
        if (isChecked) {
            await db.starMark.create({
                data: {
                    userId,
                    playgroundId,
                    isMarked: isChecked
                }
            })
        } else {
            await db.starMark.delete({
                where: {
                    userId_playgroundId: {
                        userId,
                        playgroundId
                    }
                }
            })
        }
        revalidatePath("/dashboard")
        return { success: true, error: null, isMarked: isChecked }

    } catch (error) {
        console.error("Failed to toggle star marked")
        return { success: false, error: "Database error", isMarked: !isChecked }
    }


}