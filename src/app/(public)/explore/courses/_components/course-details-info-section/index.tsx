"use client";
import "./style.css";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { CourseDetailsInfoSectionContent } from "../../types";
import { StickyContactShareButton } from "../../../_components";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
//import 'react-phone-number-input/style.css'
// import PhoneInput from 'react-phone-number-input'
import { useRef, useState, useEffect } from "react";
import { parsePhoneNumberFromString, CountryCode } from "libphonenumber-js";
import { FieldValues, useForm, Controller } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";
import { ErrorToast, SuccessToast } from "@/lib/toast";
import { ServerFetch } from "@/actions/server-fetch";
import OtpDialog from "@/components/otp-dialog/OtpDialog";
//import Flag from "react-world-flags";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { CountryData } from "react-phone-input-2";

interface CourseDetailsInfoSectionProps {
  className?: string;
  content: CourseDetailsInfoSectionContent;
}
interface Country {
  calling_code: string;
  code: string;
  name: string;
  data: { name: string; calling_code: string; code: string };
}
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string;

function CourseDetailsInfoSection({
  className = "",
  content,
}: CourseDetailsInfoSectionProps) {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isRecaptchaError, setIsRecaptchaError] = useState(false);
  //const [selectedCountry, setSelectedCountry] = useState<string>("IN");
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [error1, setError1] = useState("");
  const [isChecked, setIsChecked] = useState(0);
  const [isOtpOpen, setIsOtpOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FieldValues>({});
  const [fullPhone, setFullPhone] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  //    const [countryCode, setCountryCode] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countryList, setCountryList] = useState<Country[]>([]); // State to store the list of countries
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [countries, setCountries] = useState({});
  const [embedUrl, setEmbedUrl] = useState("");
  //    const [value, setValue] = useState<string>("IN");

  //   const handlePhoneChange = (value?: E164Number) => {
  //    const phone = value || '';
  //      setValue(phone);
  //   };

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
      calling_code: ""
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
      data.country_code = selectedCountry;
      if (recaptchadata.success) {
        setIsRecaptchaError(false);
        setFormData(data); // Save form data
        //console.log("data",data);
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
          //for non indian numbers
          const dataPost = {
            course_id: content?.id,
            student_name: data?.name,
            student_email: data?.email,
            student_phone: data.phone,
            student_message: data?.message,
            phone_otp: "",
            is_terms_and_condition_checked_by_student: isChecked,
            calling_code: data?.calling_code,
            mobile_number: data?.mobile_number
          };
          console.log("datapost", dataPost);
          const contactCourse = await ServerFetch(`/course/contact`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataPost),
          });
          if (contactCourse?.status) {
            SuccessToast(contactCourse?.message);
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
            ErrorToast(contactCourse?.message);
            return false;
          }
        }
      } else {
        setIsRecaptchaError(true);
      }
    } else {
      setError1("Please accept terms and conditions.");
    }
    setIsLoading(false);
  };
  const onSubmit = (event: React.FormEvent) => {
    // if (mobileNumber.trim() === "") {
    //    setError("Phone number is required");
    // }
    handleSubmit((data) => handleFormSubmit(data, event))(event);
  };

  const handleOtpSubmit = async (otp: string): Promise<boolean> => {
    const dataPost = {
      course_id: content?.id,
      student_name: formData?.name,
      student_email: formData?.email,
      student_phone: formData.phone,
      student_message: formData?.message,
      phone_otp: otp,
      is_terms_and_condition_checked_by_student: isChecked,
      calling_code: formData?.calling_code,
    mobile_number: formData?.mobile_number
    };
    console.log("datapost", dataPost);
    const contactCourse = await ServerFetch(`/course/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataPost),
    });
    if (contactCourse?.status) {
      SuccessToast(contactCourse?.message);
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
      ErrorToast(contactCourse?.message);
      return false;
    }
  };
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust 768px based on your needs
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Run initially to set state correctly

    return () => window.removeEventListener("resize", handleResize); // Cleanup
  }, []);

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
      setFilteredCountries(filtered);

    //   const filtered = data.data.filter(
    //     (country: Country) => country?.calling_code
    //   );
    //   setFilteredCountries(filtered);
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

  //   const handlePhoneOnChange = (value: any, data: any) => {
  //      //console.log(value,data)
  //      // `value` contains the full phone number with country code
  //      // `data.dialCode` gives the country code
  //      setFullPhone(value);
  //      setCountryCode(data.dialCode);

  //      // Extract the mobile number by removing the country code from the full phone
  //      const numberWithoutCode = value.replace(`+${data.dialCode}`, "").trim();
  //      setMobileNumber(numberWithoutCode);
  //      setValue("phone", value, { shouldValidate: true });
  //   };

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

  //    const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //       setSelectedCountry(event.target.value);
  //    };
  //    console.log("ischecked", isChecked);

//   const handleCountryChange = (countryCode: string) => {
//     setSelectedCountry(countryCode);
//     setIsDropdownOpen(false); // Close the dropdown after selection
//   };
  //console.log("countryLis", countryList);



const extractVideoId = (url: string) => {
    const regex =
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
    };


    useEffect(() => {
    if (content?.introVideoUrl) {
        const videoId = extractVideoId(content.introVideoUrl);
        if (videoId) {
        setEmbedUrl(`https://www.youtube.com/embed/${videoId}`);
        }
    }
    }, [content?.introVideoUrl]);
  return (
    <section className={`cdi__section ${className}`}>
        {embedUrl &&
         <div className="cdiv__container">
            <iframe
               width="100%"
               height="100%"
               src={embedUrl}
               title={content.title}
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
               referrerPolicy="strict-origin-when-cross-origin"
               allowFullScreen
               className="iframe"
            ></iframe>
         </div>
        }
      <div className="cdi__container">
        <div className="cdi__items">
          <p className="text-light">
            <span className="cdi__item-title">
              <Image
                src="/img/icons/time.svg"
                height={22}
                width={22}
                alt="Duration"
              />
              Duration:
            </span>
            <span className="cdi__item-desc">
              {content.duration} {content.period}
            </span>
          </p>
          <p className="text-light">
            <span className="cdi__item-title">
              <Image
                src="/img/icons/calender-time.svg"
                height={22}
                width={22}
                alt="Batch Type"
              />
              Batch Type:
            </span>
            <span className="cdi__item-desc">
              {content.batchType === "Both"
                ? "Weekend and Weekdays"
                : content.batchType}
            </span>
          </p>
          <p className="text-light">
            <span className="cdi__item-title">
              <Image
                src="/img/icons/language.svg"
                height={27}
                width={27}
                alt="Languages"
                className="ebig"
              />
              Languages:
            </span>
            <span
              className="cdi__item-desc"
              title={
                Array.isArray(content.languages)
                  ? content.languages.join(", ")
                  : content.languages
              }
            >
              {Array.isArray(content.languages)
                ? content.languages.join(", ")
                : content.languages}
            </span>
          </p>
          <p className="text-light">
            <span className="cdi__item-title">
              <Image
                src="/img/icons/degree-hat.svg"
                height={24}
                width={24}
                alt="Class Type"
                className="ebig"
              />
              Class Type:
            </span>
            <span className="cdi__item-desc">
              {content.classType === "Both"
                ? "Online and Offline"
                : content.classType}
            </span>
          </p>
          {(content.classType === "Both" || content.classType === "Offline") &&
            content?.city && (
              <p className="text-light ml-1">
                <span className="cdi__item-title">
                  <Image
                    src="/img/icons/address.svg"
                    height={18}
                    width={18}
                    alt="Class Type"
                    className="ebig"
                  />
                  Address:
                </span>
                <span className="cdi__item-desc">
                  {content.area_name}, {content.city}
                </span>
              </p>
            )}
        </div>

        <p className="cd__full-course">
          <span className="cd__full-course--title course_wrapper">
            <Image
              src="/img/icons/price.svg"
              height={18}
              width={18}
              alt="Class Type"
              className="ebig"
            />{" "}
            Course Fee:
          </span>
          {content.feesUponEnquiry ? (
            <span className="fees_call">Call for fee</span>
          ) : (
            <>
              <div className="amount-wrapper">
                <span className="cd__full-course--description">
                  {formatCurrency({ amount: content.amount })}
                </span>
                <span className="period">
                    {/* Per{" "}
                    {content.period.endsWith("s") &&
                    !content.period.toLowerCase().includes("month") &&
                    !content.period.toLowerCase().includes("year")
                        ? content.period.slice(0, -1)
                        : content.period} */}
                        {content?.fee_unit == "Full Course" ? content?.fee_unit : "Per hour"}
                </span>
              </div>
            </>
          )}
        </p>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            {/* <button className="button__primary">test</button> */}
            <StickyContactShareButton
              shareTitle={`Checkout ${content.title} Course on FindMyGuru.`}
              fullContactButton
            >
              {`Contact ${content.courseBy || "Trainer/Institute"}`}
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
                <form onSubmit={onSubmit} className="courseContact">
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
                    {/* <input type="text"
                              className={`form-control input ${errors.phone ? "error-input" : ""}`}
                              placeholder="Phone Number"
                              {...register("phone", {
                                 required: {
                                    value: true,
                                    message: "Please enter your phone number.",
                                 },
                              })}/> */}
                    {/* <PhoneInput
                                 country={"in"}
                                 enableSearch={true} // Allows searching countries in the dropdown
                                 inputProps={{
                                    name: "phone",
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

                    {/* Container for country selector and input */}
                    {/* <div className="country_select_code">
                                 <div
                                    className="country_select_code_dropdown"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                 >
                                    <Flag code={selectedCountry} className="flag_dimension" />
                                    (+
                                    {countryList.find((country) => country.code === selectedCountry)?.calling_code})
                                 </div>
                                 <input
                                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                       if (Number(e.target.value) < 0) e.target.value = "";
                                    }}
                                    className="select_input_number"
                                    // value={mobileNumber}
                                    // onChange={(e) => setMobileNumber(e.target.value)}
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
                            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,12}$/.test(value) ||
                            "Invalid email."
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

                  {/* <button className="button__primary c-btn-contact-trainer">Contact Trainer</button> */}
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
        </Dialog>
      </div>

      <OtpDialog
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onSubmit={handleOtpSubmit}
      />
    </section>
  );
}

export default CourseDetailsInfoSection;
