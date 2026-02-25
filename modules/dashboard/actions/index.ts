'use server'

import { db } from "@/lib/db"
import { currentUser } from "@/modules/auth/actions"
import { revalidatePath } from "next/cache"

// 1. Define our new lightweight templates right here!
const starterTemplates = {
    CPP: { folderName: "cpp-playground", items: [{ filename: "main", fileExtension: "cpp", content: "#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Hello World!\\n\";\n    return 0;\n}" }] },
    C: { folderName: "c-playground", items: [{ filename: "main", fileExtension: "c", content: "#include <stdio.h>\n\nint main() {\n    printf(\"Hello World!\\n\");\n    return 0;\n}" }] },
    JAVA: { folderName: "java-playground", items: [{ filename: "Main", fileExtension: "java", content: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello World!\");\n    }\n}" }] },
    PYTHON: { folderName: "python-playground", items: [{ filename: "main", fileExtension: "py", content: "def main():\n    print('Hello World!')\n\nif __name__ == '__main__':\n    main()" }] },
    JAVASCRIPT: { folderName: "js-playground", items: [{ filename: "index", fileExtension: "js", content: "console.log('Hello World!');" }] },
    TYPESCRIPT: { folderName: "ts-playground", items: [{ filename: "index", fileExtension: "ts", content: "const greeting: string = 'Hello World!';\nconsole.log(greeting);" }] },
    RUST: { folderName: "rust-playground", items: [{ filename: "main", fileExtension: "rs", content: "fn main() {\n    println!(\"Hello World!\");\n}" }] },
    RUBY: { folderName: "ruby-playground", items: [{ filename: "main", fileExtension: "rb", content: "puts 'Hello World!'" }] }
};


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
    }
}

// 2. Updated to use the new template enums and inject the initial file
export const createPlayground = async (data: {
    title: string,
    template: "CPP" | "C" | "JAVA" | "PYTHON" | "RUST" | "RUBY" | "JAVASCRIPT" | "TYPESCRIPT",
    description?: string
}) => {
    const user = await currentUser()

    const { template, title, description } = data;

    if (!user?.id) {
        throw new Error("User ID is required to create a playground");
    }

    // Grab the starter code based on what the user picked
    const initialContent = starterTemplates[template];

    try {
        const playground = await db.playground.create({
            data: {
                title,
                template,
                description: description || "",
                userId: user.id,
                // Create the initial file structure in the database right away!
                templateFile: {
                    create: {
                        content: initialContent as any
                    }
                }
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

// 3. Updated to also duplicate the files inside the playground!
export const duplicateProjectById = async (id: string) => {
    try {
        // Include the templateFile so we can copy it
        const originalPlayground = await db.playground.findUnique({
            where: { id },
            include: { templateFile: true }
        })

        if (!originalPlayground) {
            throw new Error("Original playground not found")
        }

        const duplicatedPlayground = await db.playground.create({
            data: {
                title: `${originalPlayground.title} (Copy)`,
                template: originalPlayground.template,
                description: originalPlayground.description,
                userId: originalPlayground.userId,
                // Check if the array exists AND has at least one item, then grab the first one [0]
                ...(originalPlayground.templateFile && originalPlayground.templateFile.length > 0 && {
                    templateFile: {
                        create: {
                            content: originalPlayground.templateFile[0].content as any
                        }
                    }
                })
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

export const executeCodeOnServer = async (content: string, extension: string, stdin: string = "") => {
    const languageMap: Record<string, { lang: string, versionIndex: string }> = {
        "py": { lang: "python3", versionIndex: "4" },
        "cpp": { lang: "cpp17", versionIndex: "1" },
        "cc": { lang: "cpp17", versionIndex: "1" },
        "c": { lang: "c", versionIndex: "5" },
        "java": { lang: "java", versionIndex: "4" },
        "rs": { lang: "rust", versionIndex: "4" },
        "rb": { lang: "ruby", versionIndex: "4" },
        "js": { lang: "nodejs", versionIndex: "4" }
    };

    const config = languageMap[extension] || languageMap["js"];

    try {
        const response = await fetch("https://api.jdoodle.com/v1/execute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                script: content,
                language: config.lang,
                versionIndex: config.versionIndex,
                stdin: stdin
            }),
        });

        const result = await response.json();

        // JDoodle returns the terminal text inside result.output
        return { output: result.output || result.error || "Execution failed with no output." };
    } catch (error) {
        return { output: "Failed to connect to execution API." };
    }
}