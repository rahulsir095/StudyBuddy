import React, { FC, useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { VscWorkspaceTrusted } from 'react-icons/vsc';
import { styles } from '../../../app/styles/style';
import { useActivationMutation } from '../../../redux/features/auth/authApi';
import { useSelector } from 'react-redux';

type Props = {
    setRoute: (route: string) => void;
};

type VerifyNumber = {
    "0": string;
    "1": string;
    "2": string;
    "3": string;
    "4": string;
    "5": string;
};

const Verification: FC<Props> = ({ setRoute }) => {
    const { token } = useSelector((state: any) => state.auth);
    const [activation, { isSuccess, error }] = useActivationMutation();
    const [invalidError, setInvalidError] = useState<boolean>(false);

    const inputRefs = Array.from({ length: 6 }, () =>
        useRef<HTMLInputElement>(null)
    );


    useEffect(() => {
        if (isSuccess) {
            toast.success("Account activated successfully");
            setRoute("Login");
        }

        if (error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData.data.message);
                setInvalidError(true);
            } else {
                console.log("An error occurred:", error);
            }
        }
    }, [isSuccess, error]);
    const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
        "0": "",
        "1": "",
        "2": "",
        "3": "",
        "4": "",
        "5": "",
    });

    const handleInputChange = (index: number, value: string) => {
        setInvalidError(false);
        if (!/^\d?$/.test(value)) return;

        const newVerifyNumber = { ...verifyNumber, [index]: value };
        setVerifyNumber(newVerifyNumber);

        if (value && index < 5) {
            inputRefs[index + 1].current?.focus();
        }

        if (!value && index > 0) {
            inputRefs[index - 1].current?.focus();
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
            <br />
            <div className="w-full flex items-center justify-center mt-2">
                <div className="w-[80px] h-[80px] rounded-full bg-[#497DF2] flex items-center justify-center">
                    <VscWorkspaceTrusted size={40} />
                </div>
            </div>
            <br />
            <br />
            <div className="m-auto flex items-center justify-around max-w-[360px]">
                {Object.keys(verifyNumber).map((key, index) => (
                    <input
                        key={key}
                        ref={inputRefs[index]}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className={`w-[50px] h-[55px] ml-[3px] bg-transparent border-[3px] rounded-[10px] text-center text-black dark:text-white text-[18px] font-Poppins outline-none ${invalidError
                                ? "shake border-red-500"
                                : "dark:border-white border-[#0000004a]"
                            }`}
                        value={verifyNumber[key as keyof VerifyNumber]}
                        onChange={(e) => handleInputChange(index, e.target.value.slice(-1))}
                    />
                ))}
            </div>
            <br />
            <br />
            <div className="w-full flex justify-center">
                <button className={`${styles.button}`} onClick={verificationHandler}>
                    Verify OTP
                </button>
            </div>
            <br />
            <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
                Go back to sign in?
                <span
                    className="text-[#2190ff] pl-1 cursor-pointer"
                    onClick={() => setRoute("Login")}
                >
                    Sign in
                </span>
            </h5>
        </div>
    );
};

export default Verification;
