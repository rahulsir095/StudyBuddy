"use client";

import React, { FC, useEffect, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { ThemeSwitcher } from "@/app/utils/ThemeSwitcher";
import { socket } from "@/app/utils/socket"; // renamed for clarity
import {
  useGetAllNotificationsQuery,
  useUpdateNotificationStatusMutation,
} from "@/redux/features/notifications/notificationApi";
import { format } from "timeago.js";
import toast from "react-hot-toast";

type Props = {
  open?: boolean;
  setOpen?: (value: boolean) => void;
};

const DashboardHeader: FC<Props> = ({ open = false, setOpen }) => {
  const { data, refetch } = useGetAllNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [updateNotificationStatus, { isSuccess }] =
    useUpdateNotificationStatusMutation();

  const [notifications, setNotifications] = useState<any[]>([]);

  const [audio] = useState(
    new Audio(
      "https://res.cloudinary.com/duneotegp/video/upload/v1758041913/notification_bowwj5.mp3"
    )
  );

  const playNotificationSound = () => {
    audio.currentTime = 0; 
    audio.play().catch(() => {
      toast.error("Notification sound error.");
    });
  };

  // Update notifications when data changes
  useEffect(() => {
    if (data) {
      setNotifications(
        data.notifications.filter((item: any) => item.status === "unread")
      );
    }
    if (isSuccess) {
      refetch();
    }
    audio.load();
  }, [data, isSuccess]);

  // Socket listener
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = () => {
      refetch();
      playNotificationSound();
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [refetch]);

  // Mark as read
  const handleNotificationStatus = async (id: string) => {
    await updateNotificationStatus(id);
  };

  return (
    <div className="w-full flex items-center justify-end p-6 fixed top-5 right-0 z-50">
      <ThemeSwitcher />

      {/* Bell Icon */}
      <div
        className="relative cursor-pointer m-2"
        onClick={() => setOpen && setOpen(!open)}
      >
        <IoMdNotificationsOutline className="text-2xl cursor-pointer dark:text-white text-black" />
        {notifications.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#3ccbae] rounded-full w-[20px] h-[20px] text-[12px] flex items-center justify-center text-white">
            {notifications.length}
          </span>
        )}
      </div>

      {/* Notifications Dropdown */}
      {open && (
        <div className="w-[350px] h-[50vh] dark:bg-[#111C43] bg-white shadow-xl absolute top-16 right-6 z-10 rounded overflow-auto">
          <h5 className="text-center text-[20px] font-Poppins text-black dark:text-white p-3 border-b border-gray-300 dark:border-gray-600">
            Notifications
          </h5>

          {notifications.length > 0 ? (
            notifications.map((item: any) => (
              <div
                key={item._id}
                className="bg-[#00000013] dark:bg-[#2d3a4e] font-Poppins border-b border-gray-200 dark:border-gray-600"
              >
                <div className="w-full flex items-center justify-between p-2">
                  <p className="text-black dark:text-white">{item.title}</p>
                  <button
                    className="text-sm text-[#01b519] hover:underline cursor-pointer"
                    onClick={() => handleNotificationStatus(item._id)}
                  >
                    Mark as read
                  </button>
                </div>
                <p className="px-2 text-black dark:text-white">
                  {item.message}
                </p>
                <p className="p-2 text-black dark:text-white text-[14px] opacity-80">
                  {format(item.createdAt)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-6">
              No new notifications 🎉
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
