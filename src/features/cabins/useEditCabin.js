import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createEditCabin } from "../../services/apiCabins";

export function useEditCabin() {
  const queryClient = useQueryClient();

  const { mutate: editCabin, isPending: isEditing } = useMutation({
    mutationFn: ({ cabinData, id }) => createEditCabin(cabinData, id),
    onSuccess: () => {
      queryClient.invalidateQueries("cabins");

      toast.success("Cabin edited successfully!");
    },
    onError: (error) => {
      toast.error(
        error.message || "An error occurred while editing the cabin.",
      );
    },
  });
  return { editCabin, isEditing };
}
