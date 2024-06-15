import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import { Notifications } from "@mui/icons-material";

function notificationsLabel(count) {
  if (count === 0) {
    return "no notifications";
  }
  if (count > 99) {
    return "more than 99 notifications";
  }
  return `${count} notifications`;
}

export default function AccessibleBadges() {
  return (
    <div>
      <IconButton aria-label={notificationsLabel(100)}>
        <Badge badgeContent={100} color="secondary">
          <MailIcon />
        </Badge>
      </IconButton>
      <IconButton aria-label={notificationsLabel(100)}>
        <Badge badgeContent={100} color="primary">
          <Notifications color="action" />
        </Badge>
      </IconButton>
    </div>
  );
}
