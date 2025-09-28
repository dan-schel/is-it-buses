import React from "react";

import { useUser } from "@/components/auth/use-user";
import { Column } from "@/components/core/Column";
import { Text } from "@/components/core/Text";
import { Input } from "@/components/core/Input";
import { SimpleButton } from "@/components/common/SimpleButton";

export type LoginFormProps = {
  onLoginSuccess?: () => void;
};

export function LoginForm(props: LoginFormProps) {
  const { login } = useUser();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

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
  }

  return (
    <form onSubmit={handleLogin}>
      <Column className="gap-4">
        <Input value={username} onChange={setUsername} />
        <Input value={password} onChange={setPassword} />
        {error != null && <Text style="small-red">{error}</Text>}
        <SimpleButton text="Login" submit />
      </Column>
    </form>
  );
}
