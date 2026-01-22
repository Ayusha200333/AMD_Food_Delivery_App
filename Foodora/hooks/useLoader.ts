import { LoaderContext } from "@/context/LoaderContext"
import { useContext } from "react"

export const useLoader = () => {
  const context = useContext(LoaderContext)
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider")
  }
  return context
}