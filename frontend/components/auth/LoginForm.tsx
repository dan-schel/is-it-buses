import React from "react";

import { useUser } from "@/frontend/components/auth/use-user";
import { Column } from "@/frontend/components/core/Column";
import { Text } from "@/frontend/components/core/Text";
import { Input } from "@/frontend/components/core/Input";
import { SimpleButton } from "@/frontend/components/common/SimpleButton";
import { Spacer } from "@/frontend/components/core/Spacer";
import { Link } from "@/frontend/components/core/Link";

type LoginFormProps = {
  onLoginSuccess?: () => void;
};

export function LoginForm(props: LoginFormProps) {
  const { login } = useUser();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await login(username, password);

      if (!response.success) {
        const message = {
          "invalid-credentials": "Invalid username or password.",
        }[response.error];
        setError(message);
      } else {
        setError(null);
        props.onLoginSuccess?.();
      }
    } finally {
      setPassword("");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <Column align="left" className="max-w-120">
        <Column as="label" className="w-full gap-2">
          <Text>Username</Text>
          <Input value={username} onChange={setUsername} />
        </Column>
        <Spacer h="8" />
        <Column as="label" className="w-full gap-2">
          <Text>Password</Text>
          <Input value={password} onChange={setPassword} password />
        </Column>
        {error != null && (
          <>
            <Spacer h="4" />
            <Text style="small-red">{error}</Text>
          </>
        )}
        <Spacer h="8" />
        <SimpleButton text="Login" theme="primary" loading={loading} submit />
        <Spacer h="8" />
        <Text style="tiny-weak">
          Admin dashboard access is for site admins only.{" "}
          <Link href="/">Back to main site.</Link>
        </Text>
      </Column>
    </form>
  );
}
