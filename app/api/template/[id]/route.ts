import {
    readTemplateStructureFromJson,
    saveTemplateStructureToJson,
} from "@/modules/playground/lib/path-to-json";
import { db } from "@/lib/db";
import { templatePaths } from "@/lib/template";
import path from "path";
import fs from "fs/promises";
import os from "os";
import { NextRequest } from "next/server";

function validateJsonStructure(data: unknown): boolean {
    try {
        JSON.parse(JSON.stringify(data));
        return true;
    } catch (error) {
        console.error("Invalid JSON structure:", error);
        return false;
    }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if (!id) {
        return Response.json({ error: "ID is required" }, { status: 400 });
    }

    const playground = await db.playground.findUnique({
        where: { id },
        select: {
            template: true,
            templateFile: true, // Fetch the related TemplateFile array
        },
    });

    if (!playground) {
        return Response.json({ error: "Playground not found" }, { status: 404 });
    }

    if (playground.templateFile && playground.templateFile.length > 0) {
        return Response.json({
            success: true,
            templateJson: playground.templateFile[0].content
        }, { status: 200 });
    }

    const templateKey = playground.template as keyof typeof templatePaths;
    const templatePath = templatePaths[templateKey];

    if (!templatePath) {
        return Response.json({ error: "Template not found for this playground" }, { status: 404 });
    }

    try {
        const inputPath = path.join(process.cwd(), templatePath);

        const outputFile = path.join(os.tmpdir(), `${templateKey}-${id}.json`);

        await saveTemplateStructureToJson(inputPath, outputFile);
        const result = await readTemplateStructureFromJson(outputFile);

        if (!validateJsonStructure(result.items)) {
            return Response.json({ error: "Invalid JSON structure in template output" }, { status: 400 });
        }

        await fs.unlink(outputFile);

        await db.templateFile.create({
            data: {
                content: result as any,
                playgroundId: id,
            }
        });

        return Response.json({ success: true, templateJson: result }, { status: 200 });

    } catch (error) {
        console.error("Error processing template:", error);
        return Response.json({ error: "Failed to process template" }, { status: 500 });
    }
}