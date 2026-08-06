import "server-only";
import { createClient } from "@/lib/supabase/server";
export type ApplicationViewer="anonymous"|"candidate"|"employer"|"administrator"|"authenticated";
export async function getApplicationViewer():Promise<ApplicationViewer>{const supabase=await createClient();const{data:{user}}=await supabase.auth.getUser();if(!user)return"anonymous";const role=await supabase.rpc("has_role",{requested_role:"admin"});if(!role.error&&role.data)return"administrator";const profile=await supabase.from("profiles").select("account_type").eq("id",user.id).maybeSingle();if(profile.data?.account_type==="candidate")return"candidate";if(profile.data?.account_type==="employer")return"employer";return"authenticated";}
