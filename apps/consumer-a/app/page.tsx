import { LoginForm } from "@wl/feature-login";
import { DashboardPage } from "@wl/feature-dashboard";

export default function Home() {
  return (
    <>
      <LoginForm />
      <DashboardPage />
    </>
  );
}