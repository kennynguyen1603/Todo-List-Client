import { IoMdNotifications, IoIosMail } from "react-icons/io";
import { useState, useEffect, useContext, useMemo, memo } from "react";
import { AuthContext } from "@context/AuthContext";

function AccessibleBadges() {
  const [isOpenNotifications, setIsOpenNotifications] = useState(false);
  const { invitations, setInvitations, authState, socket } =
    useContext(AuthContext);

  console.log("🚀 ~ AccessibleBadges ~ invitations:", invitations);

  const user = authState.user;

  useEffect(() => {
    if (user) {
      socket.emit("initialize", user.userId);

      const handleAllInvitations = (allInvitations) => {
        const uniqueInvitations = new Map();
        allInvitations.forEach((invitation) => {
          uniqueInvitations.set(invitation._id, invitation);
        });
        setInvitations(Array.from(uniqueInvitations.values()));
      };

      socket.on("allInvitations", handleAllInvitations);

      return () => {
        socket.off("allInvitations", handleAllInvitations);
      };
    }
  }, [setInvitations, socket, user]);

  function notificationsLabel(count) {
    if (count === 0) {
      return "no notifications";
    }
    if (count > 99) {
      return "more than 99 notifications";
    }
    return `${count} notifications`;
  }

  const handleShowNotifications = () => {
    setIsOpenNotifications(!isOpenNotifications);
  };

  const memoizedInvitations = useMemo(() => invitations, [invitations]);

  return (
    <div className="flex text-2xl gap-2">
      <IoIosMail />
      <button onClick={() => handleShowNotifications()}>
        <IoMdNotifications />
      </button>
      {isOpenNotifications && (
        <div className="absolute top-16 right-0 bg-white shadow-md rounded-md p-4 z-10">
          {memoizedInvitations.length > 0 ? (
            memoizedInvitations.map((invitation) => (
              <div
                key={invitation._id}
                className="flex gap-5 text-sm items-center relative mt-4"
              >
                <div className="flex flex-grow gap-2">
                  <p>{invitation.from.username}</p>
                  <p>invite you join</p>
                  <p className="text-red-600">{invitation.teamId.name}</p>
                </div>
                <div className="relative right-0 flex gap-2">
                  <button className="border rounded-lg p-1.5 text-xs bg-blue-500">
                    Accept
                  </button>
                  <button className="border rounded-lg p-1.5 text-xs ">
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No notifications</p>
          )}
        </div>
      )}
    </div>
  );
}

const MemoizedAccessibleBadges = memo(AccessibleBadges);
export default MemoizedAccessibleBadges;
