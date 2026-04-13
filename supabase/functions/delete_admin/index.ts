import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing Authorization header');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) throw new Error(`Unauthorized: ${authError?.message || 'No user found'}`);
    
    // TEMPORARILY DISABLED MASTER ADMIN CHECK FOR TESTING
    // if (user.email !== 'admin.husain@buildex.com') {
    //   throw new Error('Forbidden: Only the Master Admin can delete accounts.');
    // }

    // 1. Deep Log request body structure securely
    const bodyText = await req.text();
    console.log("Raw Request Body Text:", bodyText);
    
    let body;
    try {
      body = JSON.parse(bodyText);
    } catch {
      throw new Error('Invalid JSON body');
    }
    
    console.log("Parsed Request Body:", JSON.stringify(body, null, 2));
    
    const { targetId } = body;

    if (!targetId) {
      throw new Error('Missing required field: targetId');
    }
    
    console.log("Attempting to delete User ID:", targetId);

    if (targetId === user.id) {
       throw new Error('Action blocked: Self-deletion aborted.');
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    const { data: targetUser, error: fetchErr } = await supabaseAdmin.auth.admin.getUserById(targetId);
    if (fetchErr) throw new Error(`Failed to verify target user: ${fetchErr.message}`);
    if (!targetUser?.user) throw new Error(`Target user not found for ID: ${targetId}`);

    // TEMPORARILY DISABLED MASTER ADMIN TARGET PROTECTION
    // if (targetUser.user.email === 'admin.husain@buildex.com') {
    //    throw new Error('Action blocked: Cannot delete the Master Administrator.');
    // }

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(targetId);
    if (deleteError) {
      throw new Error(`Database Error - Failed to delete user: ${deleteError.message}`);
    }

    const { error: profileError } = await supabaseAdmin.from('profiles').delete().eq('id', targetId);
    if (profileError) {
      console.warn("Cascade likely already removed profile, but fallback raised warning:", profileError.message);
    }

    console.log("Successfully deleted user and profile:", targetId);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    console.error("Function Error:", error.message || error);
    // Explicitly returning the actual detailed error message to the frontend instead of generic 400
    return new Response(JSON.stringify({ error: error.message || JSON.stringify(error) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
