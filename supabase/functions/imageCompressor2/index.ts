// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";
import * as imagescript from "https://deno.land/x/imagescript@v1.2.14/mod.ts";
import { Buffer } from "https://deno.land/std@0.161.0/streams/mod.ts";
import { v4 as uuidV4 } from "https://esm.sh/uuid@9.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "Authorization, x-client-info, apikey, content-type, content-length, accept",
};

console.log(corsHeaders);

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders, status: 200 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const image = await req.blob();
  const imageId = `${uuidV4()}-${Date.now()}-serverSideCompression`;
  const buffer = new Buffer(await image.arrayBuffer()).bytes();

  const compressedImage = await (
    await imagescript.Image.decode(buffer)
  ).encodeJPEG(40);

  const { data, error } = await supabase.storage
    .from("images")
    .upload(imageId, compressedImage, {
      contentType: "image/jpeg",
    });

  if (error) throw error;
  console.log(error);

  return new Response(JSON.stringify({ data }), {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Authorization, x-client-info, apikey, content-type, content-length, accept",
      "Content-Type": "application/json",
    },
    status: 200,
  });
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
