import supabase from "./supabase";

export async function getCabins() {
  let { data: cabins, error } = await supabase.from("cabins").select("*");
  if (error) {
    console.error("Error fetching cabins:", error);
    return [];
  }
  return cabins;
}
