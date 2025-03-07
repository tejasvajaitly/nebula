"use client";

import { ReactNode, useEffect } from "react";
import { useOrganization } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { QueryCache } from "@tanstack/react-query";

interface CustomProviderProps {
  children: ReactNode;
}

export function CustomProvider({ children }: CustomProviderProps) {
  const queryClient = useQueryClient();
  const { organization } = useOrganization();
  const queryCache = new QueryCache({
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onSettled: (data, error) => {
      console.log(data, error);
    },
  });

  useEffect(() => {
    if (organization) {
      queryClient.invalidateQueries();
    }
  }, [organization, queryClient]);

  return <>{children}</>;
}
