// import IconButton from "@mui/material/IconButton";
// import Badge from "@mui/material/Badge";
// import MailIcon from "@mui/icons-material/Mail";
// import { Notifications } from "@mui/icons-material";
import { IoMdNotifications, IoIosMail } from "react-icons/io";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@context/AuthContext";

export default function AccessibleBadges() {
  const [isOpenNotifications, setIsOpenNotifications] = useState(false);
  const { invitations, setInvitations, authState, socket } =
    useContext(AuthContext);

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

      // const handleTaskDeleted = (data) => {
      //   const { taskId } = data;
      //   setInvitations((prevInvitations) =>
      //     prevInvitations.filter((invitation) => invitation.taskId !== taskId)
      //   );
      // };

      socket.on("allInvitations", handleAllInvitations);
      // socket.on("taskDeleted", handleTaskDeleted);

      return () => {
        socket.off("allInvitations", handleAllInvitations);
        // socket.off("taskDeleted", handleTaskDeleted);
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

  return (
    <div className="flex text-2xl gap-2">
      <IoIosMail />
      <button onClick={() => handleShowNotifications()}>
        <IoMdNotifications />
      </button>
      {isOpenNotifications && (
        <div className="absolute top-16 right-0 bg-white shadow-md rounded-md p-4">
          {invitations.length > 0 ? (
            invitations.map((invitation) => (
              <div key={invitation._id} className="flex gap-2">
                <p>{invitation.from}</p>
                <button>Accept</button>
                <button>Reject</button>
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
