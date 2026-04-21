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

export async function createEditCabin(cabinData, id) {
  const hasImagePath = cabinData.image?.startsWith?.(supabaseUrl);
  const imageName = `cabin-${Date.now()}-${cabinData.image.name}`
    .replace("/", "")
    .toLowerCase();
  console.log("image name", imageName);
  const imgPath = hasImagePath
    ? cabinData.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
  // create/edit
  let query = supabase.from("cabins");

  //A) Create
  if (!id) {
    query = query.insert([{ ...cabinData, image: imgPath }]);
  }

  //B) Edit
  if (id) {
    query = query.update({ ...cabinData, image: imgPath }).eq("id", id);
  }

  const { data: cabin, error: cabinError } = await query.select().single();
  if (cabinError) {
    console.error("Error creating cabin:", cabinError);
    throw new Error("Cabin could not be created");
  }
  console.log("Cabin created/edited successfully:", cabin);
  if (hasImagePath) return cabin;
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
