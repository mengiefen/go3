import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/users/sign_out", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "X-CSRF-Token": document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content") || "",
        },
      });

      if (!res.ok) throw new Error("Logout failed");
    },
    onSuccess: () => {
      // 🔥 clear everything auth-related
      queryClient.clear();
    },
  });
}