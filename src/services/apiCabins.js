import supabase from "./supabase";

export async function getCabins() {
  let { data: cabins, error } = await supabase.from("cabins").select("*");
  if (error) {
    console.error("Error fetching cabins:", error);
    return [];
  }
  return cabins;
}

export async function deleteCabin(id) {
  const { data: cabin, error } = await supabase
    .from("cabins")
    .delete()
    .eq("id", id);
  if (error) {
    console.error("Error deleting cabin:", error);
    throw new Error("Cabin could not be deleted");
  }
  return cabin;
}
