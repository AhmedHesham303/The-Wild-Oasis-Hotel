import supabase, { supabaseUrl } from "./supabase";
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

export async function createCabin(cabinData) {
  const imageName = `cabin-${Date.now()}-${cabinData.image.name}`
    .replace("/", "")
    .toLowerCase();
  const imgPath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  const { data: cabin, cabinError } = await supabase
    .from("cabins")
    .insert([{ ...cabinData, image: imgPath }])
    .select();
  if (cabinError) {
    console.error("Error creating cabin:", cabinError);
    throw new Error("Cabin could not be created");
  }
  const { error: imageUploadError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, cabinData.image);

  if (imageUploadError) {
    await supabase.from("cabins").delete().eq("id", cabinData.id);
    throw new Error(
      "Cabin image could not be uploaded and the cabin was not created",
    );
  }

  return cabin;
}
