import { Button } from "@/components/ui/button"
import { Spinner } from "./Spinner"
import { ButtonHTMLAttributes } from "react"

interface ButtonLoaderProps extends React.ComponentProps<typeof Button> {
  loading?: boolean
  loadingText?: string
  children: React.ReactNode
}

export default function ButtonWLoader({ loading = false, loadingText, children, ...props }: ButtonLoaderProps) {
  return (
    <Button disabled={loading} {...props}>
      {loading && (
        <>
          <Spinner className="mr-2" size={16} />
          {loadingText || children}
        </>
      )}
      {!loading && children}
    </Button>
  )
}