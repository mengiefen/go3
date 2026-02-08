import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";

type LoginInput = {
  email: string;
  password: string;
};

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginInput) =>
      apiClient<void>("/users/sign_in", "POST", {
        user: data,
      }),
  });
}
