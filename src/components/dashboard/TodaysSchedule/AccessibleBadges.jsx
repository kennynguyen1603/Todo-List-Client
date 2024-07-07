// import IconButton from "@mui/material/IconButton";
// import Badge from "@mui/material/Badge";
// import MailIcon from "@mui/icons-material/Mail";
// import { Notifications } from "@mui/icons-material";
import { IoMdNotifications, IoIosMail } from "react-icons/io";
// function notificationsLabel(count) {
//   if (count === 0) {
//     return "no notifications";
//   }
//   if (count > 99) {
//     return "more than 99 notifications";
//   }
//   return `${count} notifications`;
// }

export default function AccessibleBadges() {
  return (
    <div className="flex text-2xl gap-2">
      {/* <IconButton aria-label={notificationsLabel(100)}>
        <Badge badgeContent={100} color="secondary">
          <MailIcon />
        </Badge>
      </IconButton>
      <IconButton aria-label={notificationsLabel(100)}>
        <Badge badgeContent={100} color="primary">
          <Notifications color="action" />
        </Badge>
      </IconButton> */}
      <IoIosMail />
      <IoMdNotifications />
    </div>
  );
}
