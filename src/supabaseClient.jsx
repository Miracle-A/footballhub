import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://akjcobrjuoflcwkmgdpz.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFramNvYnJqdW9mbGN3a21nZHB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQzMjYwNDIsImV4cCI6MjAyOTkwMjA0Mn0.ccr92oAHj9j3Sx51Xz9K1Pr7z8QisZ8w7trN2ZNaEm0";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
