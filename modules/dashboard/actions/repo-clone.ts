"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function createPlaygroundFromGithub(data: {
    title: string;
    description: string;
    template: string;
    githubFiles: { path: string; url: string }[];
}) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            throw new Error("Unauthorized: You must be logged in to import a repo.");
        }

        // 1. Initialize the root structure exactly matching TemplateFolder
        const editorContent: { folderName: string; items: any[] } = {
            folderName: data.title, // Give the root folder the name of the repo
            items: []
        };

        // 2. Build the nested file tree
        data.githubFiles.forEach((file) => {
            const parts = file.path.split('/');
            const fullFileName = parts.pop() || "untitled";

            let currentFolder = editorContent;

            // Loop through folders and create them if they don't exist
            for (const part of parts) {
                let existingFolder = currentFolder.items.find((item: any) => 'folderName' in item && item.folderName === part);

                if (!existingFolder) {
                    existingFolder = { folderName: part, items: [] };
                    currentFolder.items.push(existingFolder);
                }

                currentFolder = existingFolder;
            }

            // Extract filename without extension, and the extension itself
            const lastDotIndex = fullFileName.lastIndexOf('.');
            let filename = fullFileName;
            let fileExtension = "txt";

            if (lastDotIndex !== -1 && lastDotIndex !== 0) {
                filename = fullFileName.substring(0, lastDotIndex);
                fileExtension = fullFileName.substring(lastDotIndex + 1);
            }

            // Push the file object matching your TemplateFile EXACTLY
            currentFolder.items.push({
                filename: filename,            // E.g., "index"
                fileExtension: fileExtension,  // E.g., "js"
                content: `// File imported from GitHub: ${file.path}\n// Content will load when you open the file.`, // Note: 'content', not 'code'
                githubUrl: file.url            // Keeping this custom property so we can fetch the real code
            });
        });

        // 3. Save to MongoDB
        const playground = await db.playground.create({
            data: {
                title: data.title,
                description: data.description,
                // @ts-ignore
                template: data.template,
                userId: userId,
                templateFile: {
                    create: {
                        content: editorContent as any // Cast as any because Prisma stores it as JSON
                    }
                }
            }
        });

        return playground.id;

    } catch (error) {
        console.error("Error creating playground from GitHub:", error);
        return null;
    }
}