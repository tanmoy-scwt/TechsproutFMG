"use client";
import { StickyContactShareButton } from "../../../_components";
import "./style.css";
import { FieldValues, useForm, Controller } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";
import { useState, useEffect } from "react";
import { ServerFetch } from "@/actions/server-fetch";
import { ErrorToast, SuccessToast } from "@/lib/toast";
import OtpDialog from "@/components/otp-dialog/OtpDialog";
import { parsePhoneNumberFromString, CountryCode } from "libphonenumber-js";
//import Flag from "react-world-flags";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { CountryData } from "react-phone-input-2";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string;

interface WebinarFormSectionProps {
  id: number;
  className?: string;
  title: string;
  host: string;
}

interface Country {
  calling_code: string;
  code: string;
  name: string;
  data: { name: string; calling_code: string; code: string };
}

function WebinarFormSection({
  className = "",
  id,
  title,
  host,
}: WebinarFormSectionProps) {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isRecaptchaError, setIsRecaptchaError] = useState(false);

  const [isOtpOpen, setIsOtpOpen] = useState<boolean>(false);

  const [formData, setFormData] = useState<FieldValues>({});
  const [fullPhone, setFullPhone] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  //const [selectedCountry, setSelectedCountry] = useState<string>("IN");
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(
    null
  );

  const [countryList, setCountryList] = useState<Country[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [error1, setError1] = useState("");
  const [isChecked, setIsChecked] = useState(0);

  const [countries, setCountries] = useState({});

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      fname: "",
      lname: "",
      email: "",
      phone: "",
      message: "",
      isChecked: 0,
      mobile_number: "",
      calling_code: "",
    },
  });

  const handleFormSubmit = async (data: FieldValues) => {
    if (isChecked === 1) {
      const response = await fetch("/api/verify-captcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: captchaToken }),
      });

      const recaptchadata = await response.json();

      if (recaptchadata.success) {
        setIsRecaptchaError(false);
        //data.country_code = selectedCountry;
        setFormData(data); // Save form data

        const phoneNumber = data.phone.replace(/\D/g, ""); // Remove non-numeric characters
        const callingCode = selectedCountry?.dialCode
          ? selectedCountry.dialCode.replace(/\D/g, "")
          : "";
        data.calling_code = callingCode;
        data.mobile_number = phoneNumber.replace(callingCode, "").trim();

        if (callingCode == "91") {
          const dataPost = {
            phone: data.mobile_number,
          };
          const otp = await ServerFetch(`/course/student/send-otp`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataPost),
          });

          if (otp?.status) {
            setIsOtpOpen(true); // Open OTP dialog
            SuccessToast(otp?.message);
          } else {
            ErrorToast(otp?.message);
          }
        } else {
          //if non indian ph no
          const dataPost = {
            webinar_id: id,
            student_name: data?.fname + " " + data?.lname,
            student_email: data?.email,
            student_phone: data?.phone,
            student_message: data.message,
            phone_otp: "",
            is_terms_and_condition_checked_by_student: isChecked,
            calling_code: data?.calling_code,
            mobile_number: data?.mobile_number,
          };

          const webinarDetails = await ServerFetch(`/webinar/contact`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataPost),
          });
          if (webinarDetails?.status) {
            SuccessToast(webinarDetails?.message);
            reset();
            return true;
          } else {
            ErrorToast(webinarDetails?.message);
            return false;
          }
        }
      } else {
        setIsRecaptchaError(true);
      }
    } else {
      setError1("Please accept terms and conditions.");
    }
  };

  //    const handleCountryChange = (countryCode: string) => {
  //       setSelectedCountry(countryCode);
  //       setIsDropdownOpen(false); // Close the dropdown after selection
  //    };

  const getCountryList = async () => {
    try {
      setLoading(true); // Set loading to true when the request starts

      // Fetch the country list from your API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/country/listing`
      );

      // Check if the response is okay
      if (!response.ok) {
        throw new Error("Failed to fetch country list");
      }

      // Parse the response as JSON
      const data = await response.json();

      // Set the country data into state
      setCountryList(data?.data);
      //console.log(data?.data);
      const countryLists: Record<string, string> = {}; // Explicitly define as dictionary

      const countryData: Country[] = data?.data || []; // Ensure TypeScript recognizes the type

      countryData.forEach((country: Country) => {
        countryLists[country.code.toLowerCase()] = country.calling_code;
      });
      console.log("countryLists", countryLists);
      setCountries(countryLists);
      const filtered = data.data.filter(
        (country: Country) => country?.calling_code
      );
      setFilteredCountries(filtered);
      console.log("countries", countries);
    } catch (error) {
      // Handle errors
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false); // Set loading to false when the request is done
    }
  };


  const handleOtpSubmit = async (otp: string): Promise<boolean> => {
    const dataPost = {
      webinar_id: id,
      student_name: formData?.fname + " " + formData?.lname,
      student_email: formData?.email,
      student_phone: formData?.phone,
      student_message: formData.message,
      phone_otp: otp,
      is_terms_and_condition_checked_by_student: isChecked,
      calling_code: formData?.calling_code,
      mobile_number: formData?.mobile_number,
    };

    const webinarDetails = await ServerFetch(`/webinar/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataPost),
    });
    if (webinarDetails?.status) {
      SuccessToast(webinarDetails?.message);
      reset();
      return true;
    } else {
      ErrorToast(webinarDetails?.message);
      return false;
    }
  };

  const handleChange = () => {
    setIsChecked((prevState) => {
      const newState = prevState === 0 ? 1 : 0;
      if (newState === 0) {
        setError1("Please accept terms and conditions.");
      } else {
        setError1(""); // Clear error if checked
      }
      return newState;
    });
  };

  // const handlePhoneOnChange = (value:any, data:any) => {

  //     setFullPhone(value);
  //     setCountryCode(data.dialCode);

  //     // Extract the mobile number by removing the country code from the full phone
  //     const numberWithoutCode = value.replace(`+${data.dialCode}`, '').trim();
  //     setMobileNumber(numberWithoutCode);
  //     setValue("phone", value, { shouldValidate: true });
  // };

  useEffect(() => {
    getCountryList(); // Fetch the country list when the component mounts
  }, []);

  return (
    <section className={`wfs__section ${className}`}>
      <div className="wfs__container">
        <h2 className="subtitle">Register now?</h2>
        <form className="wfs__form" onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="wfs__form--item">
            <label htmlFor="first-name" className="label">
              First Name
            </label>
            <input
              type="text"
              id="first-name"
              autoComplete="fname"
              className={`input ${errors.fname ? "error-input" : ""}`}
              placeholder="First Name"
              {...register("fname", {
                required: {
                  value: true,
                  message: "Please enter your first name.",
                },
              })}
            />
            {errors.fname && <p className="error">{errors.fname.message}</p>}
          </div>
          <div className="wfs__form--item">
            <label htmlFor="last-name" className="label">
              Last Name
            </label>
            <input
              type="text"
              id="last-name"
              autoComplete="lname"
              className={`input ${errors.fname ? "error-input" : ""}`}
              placeholder="Last Name"
              {...register("lname", {
                required: {
                  value: true,
                  message: "Please enter your last name.",
                },
              })}
            />
            {errors.lname && <p className="error">{errors.lname.message}</p>}
          </div>
          <div className="wfs__form--item">
            <label htmlFor="phone" className="label">
              Phone
            </label>
            {/* <input type="tel" id="phone"
                  autoComplete="tel"
                  className={`input ${errors.phone ? "error-input" : ""}`}
                  placeholder="Phone Number"
                  {...register("phone", {
                     required: {
                        value: true,
                        message: "Please enter your phone number.",
                     },
                  })}
                  />
                  {errors.phone && <p className="error">{errors.phone.message}</p>} */}
            {/* <PhoneInput
                        country={'in'}
                        enableSearch={true} // Allows searching countries in the dropdown
                        inputProps={{
                        name: 'phone',
                        }}
                        value={mobileNumber}
                        onChange={(value, data) => {
                            handlePhoneOnChange(value, data); // Call your custom handler
                            const { onChange } = register("phone", {
                                required: {
                                    value: true,
                                    message: "Please enter your phone number.",
                                },
                            });
                            if (onChange) onChange({ target: { value } }); // Trigger react-hook-form's onChange
                        }}
                    /> */}
            {/* <div className="country_select_code">
                     <div className="country_select_code_dropdown" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        <Flag code={selectedCountry} className="flag_dimension" />
                        (+
                        {countryList.find((country) => country.code === selectedCountry)?.calling_code})
                     </div>
                     <input
                        className="select_input_number"
                        type="tel"
                        placeholder="Enter your phone number"
                        {...register("phone", {
                        required: {
                            value: true,
                            message: "Please enter your phone number.",
                        },
                        minLength: {
                            value: 10,
                            message: "Phone number must be 10 digits.",
                        },
                        maxLength: {
                            value: 10,
                            message: "Phone number must be 10 digits.",
                        },
                    })}
                     />
                  </div>
                  {error && <p className="error">{error}</p>}
                  {isDropdownOpen && (
                     <div className="drop_down_country_code">
                        {countryList.map((country) => (
                           <div
                              className="flag_list"
                              key={country.code}
                              onClick={() => handleCountryChange(country.code)}
                           >
                              <Flag code={country.code} className="flag_dimension" />
                           </div>
                        ))}
                     </div>
                  )}
                  {errors.phone && <p className="error">{errors.phone.message}</p>} */}
            {countries && Object.keys(countries).length > 0 ? (
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: "Please enter your phone number.",
                  validate: (value) => {
                    //console.log(selectedCountry);
                    //const phoneNumber = parsePhoneNumberFromString(value, selectedCountry?.countryCode?.toUpperCase() || "IN"); // Default country
                    const countryCode =
                      (selectedCountry?.countryCode?.toUpperCase() ||
                        "IN") as CountryCode;

                    const phoneNumber = parsePhoneNumberFromString(
                      value,
                      countryCode
                    );
                    if (!phoneNumber || !phoneNumber.isValid()) {
                      return "Invalid phone number.";
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    enableSearch={true}
                    country={"in"} // Default country
                    onlyCountries={
                      countries && Object.keys(countries).length > 0
                        ? Object.keys(countries)
                        : ["in"]
                    }
                    inputStyle={{ width: "100%" }}
                    onChange={(value, country) => {
                      if (country) {
                        setSelectedCountry(country as CountryData); // Fix TypeScript issue
                      }
                      field.onChange(value);
                    }}
                  />
                )}
              />
            ) : (
              ""
            )}
            {errors.phone && <p className="error">{errors.phone.message}</p>}
          </div>
          <div className="wfs__form--item">
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              type="text"
              id="email"
              autoComplete="email"
              className={`input ${errors.email ? "error-input" : ""}`}
              placeholder="Email"
              {...register("email", {
                required: {
                  value: true,
                  message: "Please enter your email.",
                },
                validate: (value) => {
                  return (
                    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,12}$/.test(value) ||
                    "Invalid email."
                  );
                },
              })}
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>
          <div className="wfs__form--item">
            <label>Massage</label>
            <textarea
              className={`form-control input ${
                errors.message ? "error-input" : ""
              }`}
              placeholder="Message"
              {...register("message", {
                required: {
                  value: true,
                  message: "Please enter your message.",
                },
              })}
            ></textarea>
            {errors.message && (
              <p className="error">{errors.message.message}</p>
            )}
          </div>
          <div className="c-input-area">
            <input
              checked={isChecked === 1} // Only checked if state is 1
              onChange={handleChange}
              type="checkbox"
            />
            <span className="agree_check_box ">
              I Agree with {""}
              <a
                href={`${process.env.NEXT_PUBLIC_URL}/terms-and-conditions`}
                target="_blank" // Opens the link in a new tab
                rel="noopener noreferrer" // Recommended for security when using target="_blank"
                // Customize the link's appearance
              >
                Terms & Conditions
              </a>{" "}
              and Read the
              <a
                href={`${process.env.NEXT_PUBLIC_URL}/privacy-policy`}
                target="_blank"
                rel="noopener noreferrer"
                // Customize the link's appearance
              >
                {""} Privacy Policy
              </a>
            </span>
            {error1 && <p className="error_text">{error1}</p>}
          </div>
          <div>
            <ReCAPTCHA
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={(token) => setCaptchaToken(token)} // Store the token on success
              onExpired={() => setCaptchaToken(null)} // Handle expiration
            />
            {isRecaptchaError && (
              <p className="error">Please verify reCAPTCHA.</p>
            )}
          </div>
          <StickyContactShareButton
            shareTitle={
              title && host
                ? `Checkout Upcoming Webinar, ${title} by ${host} on FindMyGuru`
                : "Checkout this upcoming Webinar on FindMyGuru"
            }
            sticky={false}
            fullContactButton
          >
            Contact Host
          </StickyContactShareButton>
        </form>
      </div>
      <OtpDialog
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onSubmit={handleOtpSubmit}
      />
    </section>
  );
}

export default WebinarFormSection;
