import { logoutAction } from "@/app/admin/actions";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button type="submit" className="type-eyebrow link-draw text-ink-muted">
        Log out
      </button>
    </form>
  );
}
