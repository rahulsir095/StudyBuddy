'use client';
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store"; // your store type

interface ProtectedProps {
  children: ReactNode;
}

export default function AdminProtected({ children }: ProtectedProps) {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user || user.role !== "admin") {
    redirect("/"); 
    return null;
  }

  return <>{children}</>;
}
