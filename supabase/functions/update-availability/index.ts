import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all movies
    const { data: movies, error: fetchError } = await supabase
      .from("movies")
      .select("id, available_seats, availability_status");

    if (fetchError) throw fetchError;

    const updates: { id: string; availability_status: string }[] = [];

    for (const movie of movies || []) {
      let newStatus = movie.availability_status;

      // Update availability based on seats
      if (movie.available_seats <= 0 && movie.availability_status === "available") {
        newStatus = "sold_out";
      } else if (movie.available_seats > 0 && movie.availability_status === "sold_out") {
        newStatus = "available";
      }

      if (newStatus !== movie.availability_status) {
        updates.push({ id: movie.id, availability_status: newStatus });
      }
    }

    // Apply updates
    for (const update of updates) {
      await supabase
        .from("movies")
        .update({ availability_status: update.availability_status })
        .eq("id", update.id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${movies?.length || 0} movies, updated ${updates.length} availability statuses`,
        updates,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error("Error updating movie availability:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
