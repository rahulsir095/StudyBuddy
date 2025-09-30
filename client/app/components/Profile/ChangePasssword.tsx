'use client';

import { useUpdatePasswordMutation } from '@/redux/features/user/userApi';
import React, { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Props = {};

const ChangePassword: FC<Props> = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [updatePassword, { isSuccess, error }] = useUpdatePasswordMutation();

    const passwordChangeHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('New password and confirm password do not match.');
            return;
        } else {
            await updatePassword({ oldPassword, newPassword });
        }
    };
    useEffect(() => {
        if (isSuccess) {
            toast.success("Password Changed Successfully");
        }
        if (error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData.data.message);
            }
        }
    }, [isSuccess, error])

    return (
        <form
            onSubmit={passwordChangeHandler}
            className="w-[90%] 800px:w-[50%] mx-auto mt-8 bg-white dark:bg-slate-800 p-4 800px:p-8 rounded-lg shadow-md"
        >
            <h2 className="text-xl 800px:text-2xl font-bold mb-6 text-center text-black dark:text-white">
                Change Password
            </h2>

            {/* Old Password */}
            <div className="mb-4">
                <label className="block mb-2 text-sm 800px:text-base font-medium text-black dark:text-white">
                    Old Password
                </label>
                <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-black dark:text-white rounded px-3 py-2 text-sm 800px:text-base"
                    required
                />
            </div>

            {/* New Password */}
            <div className="mb-4">
                <label className="block mb-2 text-sm 800px:text-base font-medium text-black dark:text-white">
                    New Password
                </label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-black dark:text-white rounded px-3 py-2 text-sm 800px:text-base"
                    required
                />
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
                <label className="block mb-2 text-sm 800px:text-base font-medium text-black dark:text-white">
                    Confirm New Password
                </label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-black dark:text-white rounded px-3 py-2 text-sm 800px:text-base"
                    required
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded text-sm 800px:text-base transition"
            >
                Update Password
            </button>
        </form>
    );
};

export default ChangePassword;
