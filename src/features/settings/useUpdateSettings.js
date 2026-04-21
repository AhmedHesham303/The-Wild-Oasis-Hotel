import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateSetting } from "../../services/apiSettings";

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  const { mutate: updateSettings, isPending: isUpdating } = useMutation({
    mutationFn: updateSetting,
    onSuccess: () => {
      queryClient.invalidateQueries("settings");

      toast.success("Settings updated successfully!");
    },
    onError: (error) => {
      toast.error(
        error.message || "An error occurred while editing the settings.",
      );
    },
  });
  return { updateSettings, isUpdating };
}
