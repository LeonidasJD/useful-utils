"use client";

//**MODULES */
import React, { useState, useEffect } from "react";
import { IoIosCheckmarkCircle, IoIosCloseCircle } from "react-icons/io";

//**API ZOD SCHEMAS */
import { passwordValidators } from "@/api/zod-schemas/reset-password-schema";

//**COMPONENTS */
import { Text } from "@/components/ui/text";

// PASSWORD CHECKLIST COMPONENT
interface PasswordValidationRulesProps {
  password: string;
  onValidationChange?: (isValid: boolean) => void;
}

export const PasswordValidationRules: React.FC<
  PasswordValidationRulesProps
> = ({ password, onValidationChange }) => {
  const [validationStatus, setValidationStatus] = useState({
    length: false,
    numberOrSpecialChar: false,
    uppercaseLowercase: false,
  });

  useEffect(() => {
    if (!password) {
      setValidationStatus({
        length: false,
        numberOrSpecialChar: false,
        uppercaseLowercase: false,
      });
      if (onValidationChange) onValidationChange(false);
      return;
    }

    // ZOD VALIDATORS - only check for rules that are displayed and match the main schema
    const newStatus = {
      length: passwordValidators.length.safeParse(password).success,
      numberOrSpecialChar:
        passwordValidators.specialChar.safeParse(password).success, // Only check for special characters, not numbers
      uppercaseLowercase:
        passwordValidators.uppercaseLowercase.safeParse(password).success,
    };

    setValidationStatus(newStatus);

    if (onValidationChange) {
      const allValid = Object.values(newStatus).every((status) => status);
      onValidationChange(allValid);
    }
  }, [password, onValidationChange]);

  const rules = [
    {
      id: "length",
      text: "Use 8-32 characters",
      isValid: validationStatus.length,
    },
    {
      id: "numberOrSpecialChar",
      text: "Include special symbol",
      isValid: validationStatus.numberOrSpecialChar,
    },
    {
      id: "uppercaseLowercase",
      text: "Include uppercase and lowercase letters",
      isValid: validationStatus.uppercaseLowercase,
    },
  ];

  return (
    <div className="mt-2 space-y-1">
      {rules.map((rule) => (
        <div key={rule.id} className={"flex items-center text-xs"}>
          <span className="mr-2 flex items-center justify-center">
            {password ? (
              rule.isValid ? (
                <IoIosCheckmarkCircle className="text-lg text-green-500" />
              ) : (
                <IoIosCloseCircle className="text-lg text-red-500" />
              )
            ) : (
              <span className="text-lg text-gray-400">•</span>
            )}
          </span>
          <Text
            variant="p"
            className={`text-sm ${
              password
                ? rule.isValid
                  ? "text-green-500"
                  : "text-red-500"
                : "text-gray-500"
            }`}
          >
            {rule.text}
          </Text>
        </div>
      ))}
    </div>
  );
};
