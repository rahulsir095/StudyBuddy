import { useSelector } from "react-redux";
import { RootState } from "@/redux/store"; // adjust the path to your store

// Custom hook must start with `use`
export default function useUserAuth(): boolean {
  const user = useSelector((state: RootState) => state.auth.user);
  return !!user;
}
