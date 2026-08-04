import PostForm from "../PostForm";

export const dynamic = "force-dynamic";

// Creating a post already-published auto-generates its narration in the same
// request, so allow the extra time synthesis can take (Vercel Pro ceiling).
export const maxDuration = 300;

export default function NewPostPage() {
  return <PostForm />;
}
