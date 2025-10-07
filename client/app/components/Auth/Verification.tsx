"use client";

import React, { FC, useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { styles } from "../../../app/styles/style";
import { useActivationMutation } from "../../../redux/features/auth/authApi";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";

type Props = {
  setRoute?: (route: string) => void;
};

type VerifyNumber = Record<"0" | "1" | "2" | "3" | "4" | "5", string>;

const Verification: FC<Props> = ({ setRoute }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [activation, { isSuccess, error }] = useActivationMutation();
  const [invalidError, setInvalidError] = useState(false);

  // Use a fixed array of refs
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    "0": "",
    "1": "",
    "2": "",
    "3": "",
    "4": "",
    "5": "",
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account activated successfully");
      setRoute?.("Login");
    }

    if (error && "data" in error) {
      toast.error((error as { data: { message: string } }).data.message);
      setInvalidError(true);
    }
  }, [isSuccess, error, setRoute]);

  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    if (!/^\d?$/.test(value)) return;

    setVerifyNumber((prev) => ({ ...prev, [index]: value }));

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verificationHandler = async () => {
    const verificationNumber = Object.values(verifyNumber).join("");
    if (verificationNumber.length !== 6) {
      setInvalidError(true);
      return;
    }

    await activation({
      activationToken: token,
      activationCode: verificationNumber,
    });
  };

  return (
    <div>
      <h1 className={`${styles.title}`}>Verify Your Account</h1>
      <div className="w-full flex items-center justify-center mt-2">
        <div className="w-[80px] h-[80px] rounded-full bg-[#497DF2] flex items-center justify-center">
          <VscWorkspaceTrusted size={40} />
        </div>
      </div>

      <div className="m-auto flex items-center justify-around max-w-[360px] mt-6">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            key={key}
           ref={(el) => {inputRefs.current[index] = el!;}}
            inputMode="numeric"
            pattern="[0-9]*"
            className={`w-[50px] h-[55px] ml-[3px] bg-transparent border-[3px] rounded-[10px] text-center text-black dark:text-white text-[18px] font-Poppins outline-none ${
              invalidError ? "shake border-red-500" : "dark:border-white border-[#0000004a]"
            }`}
            value={verifyNumber[key as keyof VerifyNumber]}
            onChange={(e) => handleInputChange(index, e.target.value.slice(-1))}
          />
        ))}
      </div>

      <div className="w-full flex justify-center mt-6">
        <button className={`${styles.button}`} onClick={verificationHandler}>
          Verify OTP
        </button>
      </div>

      <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
        Go back to sign in?
        <span className="text-[#2190ff] pl-1 cursor-pointer" onClick={() => setRoute?.("Login")}>
          Sign in
        </span>
      </h5>
    </div>
  );
};

export default Verification;
