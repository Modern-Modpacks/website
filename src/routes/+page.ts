import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

// Config
export const load: PageLoad = () => {
    redirect(301, "/projects")
} 