
import React from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { SiGoogle as Chrome, SiGithub as Github } from "react-icons/si";
import { signIn } from "@/auth";

async function handleGoogleSignIn() {
    "use server"
    await signIn("google")
}

async function handleGithubSignIn() {
    "use server"
    await signIn("github")
}

const SignInFormClient = () => {
    return (
        <Card className="w-full max-w-md border-neutral-800 bg-neutral-900">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center text-white">
                    Sign In
                </CardTitle>
                <CardDescription className="text-center text-neutral-400">
                    Choose your preferred sign-in method
                </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4">
                <form action={handleGoogleSignIn}>
                    <Button
                        type="submit"
                        variant="outline"
                        className="w-full border-neutral-700 bg-transparent text-white hover:bg-violet-600 hover:text-white transition-colors"
                    >
                        <Chrome className="mr-2 h-4 w-4 text-violet-400 group-hover:text-white" />
                        <span>Sign in with Google</span>
                    </Button>
                </form>
                <form action={handleGithubSignIn}>
                    <Button
                        type="submit"
                        variant="outline"
                        className="w-full border-neutral-700 bg-transparent text-white hover:bg-violet-600 hover:text-white transition-colors"
                    >
                        <Github className="mr-2 h-4 w-4 text-violet-400 group-hover:text-white" />
                        <span>Sign in with GitHub</span>
                    </Button>
                </form>
            </CardContent>

            <CardFooter>
                <p className="text-sm text-center text-neutral-500 w-full">
                    By signing in, you agree to our{" "}
                    <a href="#" className="underline hover:text-violet-400 transition-colors">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="underline hover:text-violet-400 transition-colors">
                        Privacy Policy
                    </a>
                    .
                </p>
            </CardFooter>
        </Card>
    );
};

export default SignInFormClient;


