import { TemplateFolder } from "@/modules/playground/lib/path-to-json";

export const starterTemplates: Record<string, TemplateFolder> = {
    CPP: {
        folderName: "cpp-playground",
        items: [
            {
                filename: "main",
                fileExtension: "cpp",
                content: "#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Hello World!\\n\";\n    return 0;\n}"
            }
        ]
    },
    C: {
        folderName: "c-playground",
        items: [
            {
                filename: "main",
                fileExtension: "c",
                content: "#include <stdio.h>\n\nint main() {\n    printf(\"Hello World!\\n\");\n    return 0;\n}"
            }
        ]
    },
    JAVA: {
        folderName: "java-playground",
        items: [
            {
                filename: "Main",
                fileExtension: "java",
                content: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello World!\");\n    }\n}"
            }
        ]
    },
    PYTHON: {
        folderName: "python-playground",
        items: [
            {
                filename: "main",
                fileExtension: "py",
                content: "def main():\n    print('Hello World!')\n\nif __name__ == '__main__':\n    main()"
            }
        ]
    },
    JAVASCRIPT: {
        folderName: "js-playground",
        items: [
            {
                filename: "index",
                fileExtension: "js",
                content: "console.log('Hello World!');"
            }
        ]
    },
    TYPESCRIPT: {
        folderName: "ts-playground",
        items: [
            {
                filename: "index",
                fileExtension: "ts",
                content: "const greeting: string = 'Hello World!';\nconsole.log(greeting);"
            }
        ]
    },
    RUST: {
        folderName: "rust-playground",
        items: [
            {
                filename: "main",
                fileExtension: "rs",
                content: "fn main() {\n    println!(\"Hello World!\");\n}"
            }
        ]
    },
    RUBY: {
        folderName: "ruby-playground",
        items: [
            {
                filename: "main",
                fileExtension: "rb",
                content: "puts 'Hello World!'"
            }
        ]
    }
};