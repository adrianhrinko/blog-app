import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link 
        prefetch={true} 
        href={{
          pathname: `/${encodeURIComponent("ejdzej")}`,
        }}
      >
        Ejdzej
      </Link>
    </div>
  );
}
