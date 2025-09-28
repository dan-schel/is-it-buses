import { z } from "zod";
import React from "react";
import axios, { AxiosError } from "axios";
import { useData } from "vike-react/useData";
import { Data } from "@/pages/admin/old-account/+data";
import { navigate, reload } from "vike/client/router";

import { Row } from "@/components/core/Row";
import { Text } from "@/components/core/Text";
import { With } from "@/components/core/With";
import { Column } from "@/components/core/Column";
import { Spacer } from "@/components/core/Spacer";
import { TextInput } from "@/components/common/TextInput";
import { PagePadding } from "@/components/common/PagePadding";
import { PageCenterer } from "@/components/common/PageCenterer";
import { SimpleButton } from "@/components/common/SimpleButton";
import { BackNavigation } from "@/components/navigation/BackNavigation";
import { MingcutePencil2Fill } from "@/components/icons/MingcutePencil2Fill";
import { MingcuteCloseCircleFill } from "@/components/icons/MingcuteCloseCircleFill";

const schema = z
  .object({
    username: z.string().trim().nonempty("This field is required"),
    password: z
      .string()
      .trim()
      .refine((value) => (value ? value.trim().length >= 8 : true), {
        message: "Password must contain at least 8 characters",
      }),
    confirm: z.string(),
  })
  .refine(
    ({ password, confirm }) =>
      password.length === 0 || confirm.trim() === password.trim(),
    { message: "Passwords does not match", path: ["confirm"] },
  );

export default function Page() {
  const { id, username: _username } = useData<Data>();
  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  const [username, setUsername] = React.useState<string>(_username);
  const [formData, setFormData] = React.useState<z.input<typeof schema>>({
    username: _username,
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = React.useState<
    z.core.$ZodFlattenedError<z.input<typeof schema>>["fieldErrors"] | null
  >(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const data = {
      ...formData,
      [e.target.name]: e.target.value,
    };

    const { error, success } = schema.safeParse(data);
    // Only validate on change if the form has been submitted before
    if (errors !== null) {
      setErrors(!success ? z.flattenError(error).fieldErrors : {});
    }

    setFormData(data);
  }

  function resetForm(newUsername?: string) {
    setFormData({
      username: newUsername ?? username,
      password: "",
      confirm: "",
    });
    if (newUsername) setUsername(newUsername);
    setErrors(null);
  }

  async function updateAccount(e: React.FormEvent) {
    e.preventDefault();

    const { data, error, success } = schema.safeParse(formData);
    if (!success) {
      setErrors(z.flattenError(error).fieldErrors);
      return;
    }

    await axios
      .put(`/api/admin/users/${id}`, {
        username: data.username,
        password: data.password.length > 0 ? data.password : undefined,
      })
      .then(async () => {
        resetForm(data.username);
        setIsEditing(false);
      })
      .catch(async (error: AxiosError<{ error: string }>) => {
        const statusCode = error.response?.status;
        if (statusCode === 401) {
          await reload();
        } else if (statusCode === 403) {
          await navigate("/admin");
        } else if (statusCode === 409 && error.response) {
          setErrors({ username: [error.response.data.error] });
        }
      });
  }

  return (
    <Column>
      <BackNavigation name="Admin" href="/admin" />
      <PageCenterer>
        <PagePadding>
          <Column>
            <Row align="center" justify="space-between">
              <Text style="title">Account</Text>
              <SimpleButton
                text={isEditing ? "Cancel" : "Edit Details"}
                theme={isEditing ? "error" : "default"}
                icon={
                  isEditing ? (
                    <MingcuteCloseCircleFill />
                  ) : (
                    <MingcutePencil2Fill />
                  )
                }
                onClick={() => {
                  if (isEditing) {
                    resetForm();
                  }
                  setIsEditing(!isEditing);
                }}
              />
            </Row>

            <Spacer h="6" />

            {isEditing ? (
              <form onSubmit={updateAccount}>
                <Column className="gap-4">
                  <TextInput
                    label="Username"
                    placeholder="Enter a username"
                    autoComplete="username"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={errors?.username?.at(0)}
                  />
                  <TextInput
                    label="Password"
                    placeholder="Enter your new password (optional)"
                    autoComplete="new-password"
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors?.password?.at(0)}
                  />
                  {formData.password.length > 0 && (
                    <TextInput
                      placeholder="Re-enter password"
                      autoComplete="none"
                      type="password"
                      id="confirm"
                      name="confirm"
                      value={formData.confirm}
                      onChange={handleChange}
                      error={errors?.confirm?.at(0)}
                    />
                  )}

                  <SimpleButton text="Update" submit />
                </Column>
              </form>
            ) : (
              <>
                <Text style="subtitle">Username</Text>
                <Spacer h="4" />
                <With className="p-1 px-2">
                  <Text>{username}</Text>
                </With>
              </>
            )}
          </Column>
        </PagePadding>
      </PageCenterer>
    </Column>
  );
}
