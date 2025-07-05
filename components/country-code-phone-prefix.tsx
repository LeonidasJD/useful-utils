"use client";

//**MODULES */
import { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { LiaSearchSolid } from "react-icons/lia";
import { useFormContext } from "react-hook-form";
import Image from "next/image";

//**COMPONENTS */
import { Text } from "@/components/ui/text";
import { Input } from "./input";
import { Divider } from "./divider";

//**UTILS */
import { allCountries } from "@/utils/allCountries";
import { loadFlagImages } from "@/utils/load-flag-images";

const countryOptions = allCountries.map((country) => ({
  value: country.countryPrefix,
  label: `${country.countryPrefix} ${country.name}`,
  code: country.code,
  flag: country.flag.path,
  name: country.name,
}));

type CountryPrefixPhoneInputProps = {
  value?: string;
  onChange: (value: string) => void;
  phoneNumber?: string;
  onPhoneNumberChange?: (value: string) => void;
  onCountryCodeChange?: (countryCode: string) => void;
  initialCountryCode?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  prefixFieldName?: string;
  phoneFieldName?: string;
};

const CountryPrefixPhoneInput = ({
  value,
  onChange,
  phoneNumber = "",
  onPhoneNumberChange,
  onCountryCodeChange,
  initialCountryCode,
  label = "Phone number *",
  error,
  disabled = false,
  prefixFieldName,
  phoneFieldName,
  ...props
}: CountryPrefixPhoneInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(countryOptions);
  const [flagImages, setFlagImages] = useState<Record<string, string>>({});
  const [localPhoneNumber, setLocalPhoneNumber] = useState(phoneNumber);

  // Initialize with proper country code based on value or default to US
  const getInitialCountryCode = () => {
    if (value && value !== "+1") {
      const option = countryOptions.find((opt) => opt.value === value);
      console.log("🏠 Option:", option);
      return option?.code || "US";
    }
    return "US";
  };

  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(
    initialCountryCode || getInitialCountryCode()
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const initialValue = value || "+1";

  const formContext = useFormContext();
  const { register, setValue, watch } = formContext || {};

  const watchedPrefix =
    prefixFieldName && formContext ? watch(prefixFieldName) : undefined;
  const watchedPhoneNumber =
    phoneFieldName && formContext ? watch(phoneFieldName) : undefined;

  const effectivePrefix = watchedPrefix || value || initialValue;
  const effectivePhoneNumber =
    watchedPhoneNumber || phoneNumber || localPhoneNumber;

  useEffect(() => {
    const loadFlags = async () => {
      const images = await loadFlagImages("all");
      setFlagImages(images);
    };
    loadFlags();
  }, []);

  // Initialize selectedCountryCode based on initial value
  useEffect(() => {
    // Only update if we don't have a selectedCountryCode and we have a prefix that's not +1
    if (
      effectivePrefix &&
      effectivePrefix !== "+1" &&
      selectedCountryCode === "US"
    ) {
      const option = countryOptions.find(
        (opt) => opt.value === effectivePrefix
      );
      if (option) {
        setSelectedCountryCode(option.code);
      }
    }
  }, [effectivePrefix, selectedCountryCode]);

  useEffect(() => {
    if (watchedPrefix) {
      // Update selected country code when prefix changes externally
      const option = countryOptions.find((opt) => opt.value === watchedPrefix);
      if (option) {
        setSelectedCountryCode(option.code);
      }
    }
  }, [watchedPrefix]);

  useEffect(() => {
    if (watchedPhoneNumber) {
      setLocalPhoneNumber(watchedPhoneNumber);
    }
  }, [watchedPhoneNumber]);

  useEffect(() => {
    if (initialCountryCode) {
      setSelectedCountryCode(initialCountryCode);
    }
  }, [initialCountryCode]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredOptions(countryOptions);
    } else {
      const filtered = countryOptions.filter(
        (option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          option.value?.includes(searchTerm)
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        toggleRef.current &&
        !toggleRef.current.contains(target)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Direct focus for better iOS compatibility
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggleOpen = () => {
    if (disabled) return;

    setIsOpen((prev) => !prev);

    // For iOS Chrome - focus immediately when opening
    if (!isOpen) {
      // Chrome iOS specific: Focus needs to be called synchronously in user event
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }

      // Backup for iOS Chrome
      requestAnimationFrame(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      });
    }
  };

  // Detect iOS for platform-specific handling
  const isIOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Only use touchEnd for iOS, let Android use regular click
    if (isIOS) {
      e.preventDefault();
      handleToggleOpen();
    }
  };

  const handleSelect = (selectedValue: string, countryCode?: string) => {
    if (disabled) return;

    // Use the passed country code or find it from the value
    let actualCountryCode = countryCode;
    if (!actualCountryCode) {
      const selectedOption = countryOptions.find(
        (option) => option.value === selectedValue
      );
      if (selectedOption) {
        actualCountryCode = selectedOption.code;
        setSelectedCountryCode(selectedOption.code);
      }
    } else {
      setSelectedCountryCode(actualCountryCode);
    }

    if (formContext && prefixFieldName && setValue) {
      setValue(prefixFieldName, selectedValue, { shouldValidate: true });
    }

    if (onChange) {
      onChange(selectedValue);
    }

    if (onCountryCodeChange && actualCountryCode) {
      onCountryCodeChange(actualCountryCode);
    }

    setIsOpen(false);
    setSearchTerm("");
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalPhoneNumber(newValue);

    if (formContext && phoneFieldName && setValue) {
      setValue(phoneFieldName, newValue, { shouldValidate: true });
    }

    if (onPhoneNumberChange) {
      onPhoneNumberChange(newValue);
    }
  };

  const selectedOption = countryOptions.find((option) => {
    // If we have a tracked country code, use it
    if (selectedCountryCode) {
      return option.code === selectedCountryCode;
    }
    // Otherwise, find by prefix
    return option.value === effectivePrefix;
  });

  // If no option found, default to US
  const displayOption =
    selectedOption || countryOptions.find((option) => option.code === "US");

  const renderSelectedOption = (option: (typeof countryOptions)[0]) => (
    <div className="flex items-center gap-2">
      <div className="relative overflow-hidden rounded-sm">
        {flagImages[option.code] ? (
          <Image
            src={flagImages[option.code]}
            alt={option.name}
            width={24}
            height={24}
          />
        ) : (
          <div className="h-full w-full bg-gray-200"></div>
        )}
      </div>
      <span>{option.value}</span>
    </div>
  );

  const renderDropdownOption = (option: (typeof countryOptions)[0]) => (
    <div className="flex items-center gap-2">
      <div className="relative overflow-hidden rounded-sm">
        {flagImages[option.code] ? (
          <Image
            src={flagImages[option.code]}
            alt={option.name}
            width={24}
            height={24}
          />
        ) : (
          <div className="h-full w-full bg-gray-200"></div>
        )}
      </div>

      <span className="text-gray-600">{option.name}</span>
      <span className="font-medium text-gray-600">{option.value}</span>
    </div>
  );

  return (
    <div>
      {label && (
        <Text
          className={`mb-2 text-sm font-bold text-gray-900 ${
            disabled ? "opacity-50" : ""
          }`}
        >
          {label}
        </Text>
      )}

      <div className="flex rounded-lg border-b border-gray-300">
        <div className="relative">
          <div
            className={`bg-white-100 flex items-center justify-between rounded-tl-lg rounded-bl-lg border-gray-300 px-4 py-3 text-gray-600 ${
              isOpen ? "border-gray-500" : ""
            } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
            onClick={handleToggleOpen}
            onTouchEnd={handleTouchEnd}
            ref={toggleRef}
          >
            <div className="flex items-center gap-2">
              {displayOption ? (
                renderSelectedOption(displayOption)
              ) : (
                <span className="text-gray-500">Select</span>
              )}
            </div>
            <IoIosArrowDown
              className={`transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Dropdown */}
          {isOpen && !disabled && (
            //previous width of dropdown was 260px
            <div
              className="absolute left-0 z-50 mt-1 w-[280px] rounded-lg border border-gray-300 bg-white shadow-lg md:w-[320px]"
              ref={dropdownRef}
            >
              {/*search Input */}
              <div className="border-white-100 bg-white-100 sticky top-0 z-10 m-4 flex items-center gap-2 rounded-lg border-b p-2">
                <LiaSearchSolid className="text-gray-500" size={20} />
                {isIOS ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (filteredOptions.length > 0) {
                        handleSelect(
                          filteredOptions[0].value || "",
                          filteredOptions[0].code
                        );
                      }
                    }}
                    className="flex-1"
                  >
                    <input
                      ref={searchInputRef}
                      type="text"
                      inputMode="text"
                      className="w-full border-none bg-transparent p-1 text-base outline-none"
                      placeholder="Country name or code"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      //saving values when user types out the country name and hits enter
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && filteredOptions.length > 0) {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSelect(
                            filteredOptions[0].value || "",
                            filteredOptions[0].code
                          );
                        }
                      }}
                      onKeyUp={(e) => {
                        // Fallback for mobile devices that might not trigger onKeyDown properly
                        if (e.key === "Enter" && filteredOptions.length > 0) {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSelect(
                            filteredOptions[0].value || "",
                            filteredOptions[0].code
                          );
                        }
                      }}
                      data-country-search
                    />
                  </form>
                ) : (
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="w-full border-none bg-transparent p-1 text-base outline-none"
                    placeholder="Country name or code"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    //saving values when user types out the country name and hits enter
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && filteredOptions.length > 0) {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSelect(
                          filteredOptions[0].value || "",
                          filteredOptions[0].code
                        );
                      }
                    }}
                    onKeyUp={(e) => {
                      // Fallback for mobile devices that might not trigger onKeyDown properly
                      if (e.key === "Enter" && filteredOptions.length > 0) {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSelect(
                          filteredOptions[0].value || "",
                          filteredOptions[0].code
                        );
                      }
                    }}
                    data-country-search
                  />
                )}
              </div>

              {/* options list */}
              <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:min-h-[30px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-green-500 [&::-webkit-scrollbar-track]:bg-gray-100">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option, index) => (
                    <div
                      key={index}
                      className="flex cursor-pointer items-center gap-2 px-4 py-3 hover:bg-gray-100"
                      onClick={() =>
                        handleSelect(option.value || "", option.code)
                      }
                    >
                      {renderDropdownOption(option)}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500">
                    No countries found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="py-3">
          <Divider orientation="vertical" />
        </div>

        <Input
          type="number"
          value={effectivePhoneNumber}
          onChange={handlePhoneNumberChange}
          inputMode="numeric"
          className="flex-1 gap-0 [&_input]:rounded-none [&_input]:rounded-tr-lg [&_input]:rounded-br-lg [&_input]:border-0 [&_input]:border-none"
          disabled={disabled}
          style={{ border: "none", borderWidth: 0 }}
          {...props}
        />
      </div>

      {error && (
        <Text color="error" className="mt-1 text-xs font-bold">
          {error}
        </Text>
      )}
    </div>
  );
};

export default CountryPrefixPhoneInput;
