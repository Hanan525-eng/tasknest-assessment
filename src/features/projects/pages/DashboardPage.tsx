//  src/features/projects/pages/DashboardPage.tsx

import { useAuthStore } from "../../../stores/auth.store";
import { Button } from "../../../components/Button";

/**
 * DashboardPage
 * -----------------------------------------------------------------------
 * Temporary shell: just proves the protected route + logout flow works
 * end-to-end. The real Projects list/CRUD UI replaces this content in
 * the next step (feature/projects-crud).
 * -----------------------------------------------------------------------
 */

function DashboardPage() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-(--color-background) p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-(--color-text)">
            Dashboard
          </h1>
          {user && (
            <p className="text-sm text-(--color-text-muted)">
              Logged in as {user.name} ({user.email})
            </p>
          )}
        </div>

        <Button variant="secondary" onClick={logout}>
          Log out
        </Button>
      </header>

      <p className="text-sm text-(--color-text-muted)">
        Projects will appear here.
      </p>
    </div>
  );
}

export default DashboardPage;