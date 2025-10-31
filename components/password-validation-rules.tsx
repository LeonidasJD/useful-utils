"use client";

//**MODULES */
import { IoIosCheckmarkCircle, IoIosCloseCircle } from "react-icons/io";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

//**API SERVICES */
import { resetPasswordNewPasswordSchema } from "@/api/zod-schemas/reset-password-schema";
import { ResetPasswordNewPasswordSchema } from "@/api/zod-schemas/reset-password-schema";
import { resetPassword, logout } from "@/api/services/services";
import { clearTokens } from "@/api/token-storage";

//**COMPONENTS */
import PageContent from "@/components/layout/page-content";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { PasswordValidationRules } from "@/components/ui/password-validation-rules";
const ChangePasswordPage = () => {
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
  const [isAllPasswordRulesValid, setIsAllPasswordRulesValid] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const verificationToken = useSearchParams().get("token");
  // **FORMS REGISTRATION START
  const {
    register: registerNewPassword,
    handleSubmit: handleSubmitNewPassword,
    formState: {
      errors: newPasswordErrors,
      isSubmitting: isNewPasswordSubmitting,
    },
    reset: resetNewPasswordForm,
    watch,
    control,
  } = useForm<ResetPasswordNewPasswordSchema>({
    resolver: zodResolver(resetPasswordNewPasswordSchema),
    mode: "onChange",
  });

  // **track password value from form
  useEffect(() => {
    const subscription = watch((value) => {
      if (value.password) {
        setPassword(value.password);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  // **Check if passwords match
  useEffect(() => {
    const subscription = watch((values) => {
      if (values.password && values.repeatPassword) {
        setPasswordsMatch(values.password === values.repeatPassword);
      } else if (values.repeatPassword) {
        setPasswordsMatch(false);
      } else {
        setPasswordsMatch(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  //** FORM SUBMIT LOGIC
  const onSubmitNewPassword = async (data: ResetPasswordNewPasswordSchema) => {
    if (!isAllPasswordRulesValid) {
      return;
    }

    try {
      const finalData = {
        token: verificationToken ?? "",
        password: data.password,
      };

      await resetPassword(finalData.token, finalData.password);

      setPassword("");

      setIsAllPasswordRulesValid(false);
      resetNewPasswordForm();

      clearTokens();

      router.push("/auth/password-successfully-reset");
    } catch (error) {
      setError(error ? (error as any).response.data.message : "No error");
    }
  };
  return (
    <PageContent
      mobileVariant="full"
      className="flex items-center justify-center pt-0 sm:px-0 sm:pt-15 sm:pb-17"
    >
      <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-lg sm:rounded-2xl">
        <div className="flex flex-col justify-center">
          <Text
            asChild
            variant="h4"
            color="darkGreen"
            className="mb-2 text-center uppercase"
          >
            <h1>Enter a new password</h1>
          </Text>
        </div>
        <form
          onSubmit={handleSubmitNewPassword(onSubmitNewPassword)}
          className="mt-10 space-y-6"
        >
          <div className="space-y-4">
            <Input
              id="newPassword"
              type="password"
              label="New Password"
              placeholder="Enter your new password"
              {...registerNewPassword("password")}
            />
            <PasswordValidationRules
              password={password}
              onValidationChange={setIsAllPasswordRulesValid}
            />
            <Input
              id="repeatPassword"
              type="password"
              label="Repeat New Password"
              placeholder="Repeat your new password"
              {...registerNewPassword("repeatPassword")}
            />
            {passwordsMatch !== null && (
              <div className="flex items-center">
                <span className="mr-2 flex items-center justify-center">
                  {passwordsMatch ? (
                    <IoIosCheckmarkCircle className="text-lg text-green-500" />
                  ) : (
                    <IoIosCloseCircle className="text-lg text-red-500" />
                  )}
                </span>
                <Text
                  variant="p"
                  className={`mt-1 text-sm ${
                    passwordsMatch ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {passwordsMatch
                    ? "Your passwords match"
                    : "Your password doesn't match"}
                </Text>
              </div>
            )}
          </div>
          {error && (
            <Text color="error" className="text-sm font-bold">
              {error}
            </Text>
          )}
          <Button
            type="submit"
            variant="default"
            color="green"
            className="w-full"
            disabled={isNewPasswordSubmitting || !isAllPasswordRulesValid}
          >
            {isNewPasswordSubmitting ? (
              <Spinner className="h-4 w-4" />
            ) : (
              "COMPLETE"
            )}
          </Button>
        </form>
      </div>
    </PageContent>
  );
};

export default ChangePasswordPage;
