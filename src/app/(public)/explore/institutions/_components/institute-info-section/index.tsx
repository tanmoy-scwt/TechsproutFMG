"use client";
import "./style.css";
import Image from "next/image";
import PreviewImage from "@/components/preview-image";
import RatingStar from "@/components/rating-star";
import { InstituteInfoSectionContent } from "../../types";
//import { StickyContactShareButton } from "../../../_components";
import ShareButton from "@/components/share-button";
//import Flag from "react-world-flags";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { FieldValues, useForm, Controller } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";
import { ErrorToast, SuccessToast } from "@/lib/toast";
import { ServerFetch } from "@/actions/server-fetch";
import { useRef, useState, useEffect } from "react";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import OtpDialog from "@/components/otp-dialog/OtpDialog";
import HTMLRenderer from "@/components/html-renderer";
import { CountryData } from "react-phone-input-2";
import { parsePhoneNumberFromString, CountryCode } from "libphonenumber-js";

interface InstituteInfoSectionProps {
  content: InstituteInfoSectionContent;
}
interface Country {
  calling_code: string;
  code: string;
  name: string;
  data: { name: string; calling_code: string; code: string };
}
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string;

function InstituteInfoSection({ content }: InstituteInfoSectionProps) {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isRecaptchaError, setIsRecaptchaError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(0);
  const [isOtpOpen, setIsOtpOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FieldValues>({});
  const [error, setError] = useState("");
  const [error1, setError1] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  //    const [fullPhone, setFullPhone] = useState("");
  //    const [countryCode, setCountryCode] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countryList, setCountryList] = useState<Country[]>([]); // State to store the list of countries
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  //const [selectedCountry, setSelectedCountry] = useState<string>("IN");
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(
    null
  );

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
      name: "",
      email: "",
      phone: "",
      message: "",
      isChecked: 0,
      mobile_number: "",
      calling_code: "",
    },
  });

  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

  const handleFormSubmit = async (
    data: FieldValues,
    event: React.FormEvent
  ) => {
    setIsLoading(true);
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
            setIsOpen(false);
            setIsLoading(false);
            setIsOtpOpen(true); // Open OTP dialog
            SuccessToast(otp?.message);
          } else {
            ErrorToast(otp?.message);
          }
        } else {
          //if non indian ph no
          const dataPost = {
            user_id: content?.id,
            student_name: data.name,
            student_email: data.email,
            student_phone: data.phone,
            student_message: data.message,
            phone_otp: "",
            is_terms_and_condition_checked_by_student: isChecked,
            calling_code: data?.calling_code,
            mobile_number: data?.mobile_number,
          };

          const webinarDetails = await ServerFetch(`/user/contact`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataPost),
          });
          if (webinarDetails?.status) {
            SuccessToast("Institute will contact you soon.");
            reset();
            setIsOpen(false);
            setIsOtpOpen(false);
            //(event.currentTarget as HTMLFormElement).reset();
            if (recaptchaRef.current) {
              recaptchaRef.current.reset();
            }
            setCaptchaToken(null);
            setIsRecaptchaError(false);
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
  const onSubmit = (event: React.FormEvent) => {
    handleSubmit((data) => handleFormSubmit(data, event))(event);
  };

  const handleOtpSubmit = async (otp: string): Promise<boolean> => {
    const dataPost = {
      user_id: content?.id,
      student_name: formData.name,
      student_email: formData.email,
      student_phone: formData.phone,
      student_message: formData.message,
      phone_otp: otp,
      is_terms_and_condition_checked_by_student: isChecked,
      calling_code: formData?.calling_code,
      mobile_number: formData?.mobile_number,
    };

    const webinarDetails = await ServerFetch(`/user/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataPost),
    });
    if (webinarDetails?.status) {
      SuccessToast("Institute will contact you soon.");
      reset();
      setIsOpen(false);
      setIsOtpOpen(false);
      //(event.currentTarget as HTMLFormElement).reset();
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setCaptchaToken(null);
      setIsRecaptchaError(false);
      return true;
    } else {
      ErrorToast(webinarDetails?.message);
      return false;
    }
  };

  //    const handlePhoneOnChange = (value: any, data: any) => {
  //       setFullPhone(value);
  //       setCountryCode(data.dialCode);

  //       // Extract the mobile number by removing the country code from the full phone
  //       const numberWithoutCode = value.replace(`+${data.dialCode}`, "").trim();
  //       setMobileNumber(numberWithoutCode);
  //       setValue("phone", value, { shouldValidate: true });
  //    };

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
      const countryLists: Record<string, string> = {}; // Explicitly define as dictionary

      const countryData: Country[] = data?.data || []; // Ensure TypeScript recognizes the type

      countryData.forEach((country: Country) => {
        countryLists[country.code.toLowerCase()] = country.calling_code;
      });

      setCountries(countryLists);

      const filtered = data.data.filter(
        (country: Country) => country?.calling_code
      );
      //console.log("countries", countries);
    } catch (error) {
      // Handle errors
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false); // Set loading to false when the request is done
    }
  };

  useEffect(() => {
    getCountryList(); // Fetch the country list when the component mounts
  }, []);

  //    const handlePhoneOnChange = (value: any, data: any) => {
  //       //console.log(value,data)
  //       // `value` contains the full phone number with country code
  //       // `data.dialCode` gives the country code
  //       setFullPhone(value);
  //       setCountryCode(data.dialCode);

  //       // Extract the mobile number by removing the country code from the full phone
  //       const numberWithoutCode = value.replace(`+${data.dialCode}`, "").trim();
  //       setMobileNumber(numberWithoutCode);
  //       setValue("phone", value, { shouldValidate: true });
  //    };

  //    const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //       setSelectedCountry(event.target.value);
  //    };
  //    console.log("ischecked", isChecked);

  //    const handleCountryChange = (countryCode: string) => {
  //       setSelectedCountry(countryCode);
  //       setIsDropdownOpen(false); // Close the dropdown after selection
  //    };
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust 768px based on your needs
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Run initially to set state correctly

    return () => window.removeEventListener("resize", handleResize); // Cleanup
  }, []);
  return (
    <>
      <section className="section">
        <div className="container ii__info--container">
          <PreviewImage
            src={content.image}
            blurDataURL={content.previewImage}
            alt={`${content.name} Profile Pic`}
            width={200}
            height={220}
            className="ii__info--img"
          />
          <div className="ii__info">
            <div className="ii__info--details">
              <h1 className="ex-title ii__name">{content.name}</h1>

              <p className="ii__info--item-text">
                {"Ratings "}
                <span>
                  <RatingStar
                    rating={+content.averageRatings}
                    width={17}
                    height={17}
                  />
                  {`${content.averageRatings} (${content.totalReviews} Ratings)`}
                </span>
              </p>
              <p className="ii__info--item-text">
                {"Total Students "}
                <span>{content.totalStudents}</span>
              </p>
              <p className="ii__info--item-text">
                {"Experience "}
                <span>{`${content.experience} Years`}</span>
              </p>
              <p className="ii__info--item-text">
                {"Location "}
                <span>{content.location}</span>
              </p>
              {/* <HTMLRenderer
                        htmlString={
                           Array.isArray(content?.highlights)
                              ? content.highlights.join(" ") // Join array into a string
                              : typeof content?.highlights === "string"
                              ? content.highlights // Use the string directly
                              : "" // Fallback if undefined or invalid type
                        }
                     /> */}
            </div>

            <div className={`scs-button}`}>
                <ShareButton title={`Checkout ${content.name}'s Profile on FindMyGuru.`} />
            </div>
            {/* <StickyContactShareButton
                  onClick={() => setIsOpen(true)}
                  shareTitle={`Checkout ${content.name}'s Profile on FindMyGuru.`}
                >
                  Contact Institute
                </StickyContactShareButton> */}
            {/* <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <StickyContactShareButton
                  onClick={() => setIsOpen(true)}
                  shareTitle={`Checkout ${content.name}'s Profile on FindMyGuru.`}
                >
                  Contact Institute
                </StickyContactShareButton>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[1094px] c-connected-card-modal">
                <div className="c-connected-card-modal__grid">
                  <div className="c-connected-card-modal__col c-connected-card-modal__image-area">
                    {!isMobile && (
                      <Image
                        src="/img/icons/sammy-no-connection.png"
                        height={565}
                        width={559}
                        alt="Class Type"
                        className="ebig"
                      />
                    )}
                  </div>
                  <div className="c-connected-card-modal__col c-connected-card-modal__form-area">
                    <h2>Hey, We are glad you Found Your Guru</h2>
                    <h3>
                      <span>Lets get started</span>
                    </h3>
                    <form onSubmit={onSubmit} className="contactInstitute">
                      <div className="c-input-area">
                        <label>Name</label>
                        <input
                          type="text"
                          className={`form-control input ${
                            errors.name ? "error-input" : ""
                          }`}
                          placeholder="Name"
                          {...register("name", {
                            required: {
                              value: true,
                              message: "Please enter your name.",
                            },
                          })}
                        />
                        {errors.name && (
                          <p className="error">{errors.name.message}</p>
                        )}
                      </div>
                      <div className="c-input-area">
                        <label>Mobile number</label>



                        {countries && Object.keys(countries).length > 0 ? (
                          <Controller
                            name="phone"
                            control={control}
                            rules={{
                              required: "Please enter your phone number.",
                              validate: (value) => {
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
                                onlyCountries={Object.keys(countries)} // Dynamically loaded countries
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
                        {errors.phone && (
                          <p className="error">{errors.phone.message}</p>
                        )}
                      </div>
                      <div className="c-input-area">
                        <label>Email</label>
                        <input
                          type="email"
                          className={`form-control input ${
                            errors.email ? "error-input" : ""
                          }`}
                          placeholder="Email"
                          {...register("email", {
                            required: {
                              value: true,
                              message: "Please enter your email.",
                            },
                            validate: (value) => {
                              return (
                                /^[\w-\.]+@([\w-]+\.)+[\w-]{2,12}$/.test(
                                  value
                                ) || "Invalid email."
                              );
                            },
                          })}
                        />
                        {errors.email && (
                          <p className="error">{errors.email.message}</p>
                        )}
                      </div>
                      <div className="c-input-area">
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
                        <span className="agree_check_box">
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
                      <div className="c-input-area">
                        <ReCAPTCHA
                          sitekey={RECAPTCHA_SITE_KEY}
                          onChange={(token) => setCaptchaToken(token)} // Store the token on success
                          onExpired={() => setCaptchaToken(null)} // Handle expiration
                          ref={recaptchaRef}
                        />
                        {isRecaptchaError && (
                          <p className="error">Please verify reCAPTCHA.</p>
                        )}
                      </div>


                      <button
                        className="button__primary c-btn-contact-trainer"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="loader"></span>
                        ) : (
                          "Contact Trainer"
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </DialogContent>
            </Dialog> */}
          </div>
        </div>
        <OtpDialog
          isOpen={isOtpOpen}
          onClose={() => setIsOtpOpen(false)}
          onSubmit={handleOtpSubmit}
        />
      </section>
      <section className="container ii__about-section section">
        <h2 className="subtitle">{`About ${content.name}`}</h2>
        <HTMLRenderer htmlString={content.about} className="ex-desc" />
      </section>
    </>
  );
}

export default InstituteInfoSection;
