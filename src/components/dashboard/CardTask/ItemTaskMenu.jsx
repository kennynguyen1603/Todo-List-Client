import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { IoEllipsisHorizontalOutline } from "react-icons/io5";
import { LiaEditSolid } from "react-icons/lia";
import { MdOutlineDelete } from "react-icons/md";
import Prototype from "prop-types";
export default function ItemTaskMenu({ onEdit, onDelete, onOpen }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="menu absolute top-0 left-[50%] translate-x-[-50%]">
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <IoEllipsisHorizontalOutline />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            onEdit();
            onOpen();
          }}
          className="flex items-center justify-start gap-1 hover:text-blue-600"
        >
          <LiaEditSolid className="relative top-[-2px]" />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            onDelete();
          }}
          className="flex items-center justify-start gap-1 hover:text-red-600"
        >
          <MdOutlineDelete className="relative top-[-1px]" />
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
}

ItemTaskMenu.propTypes = {
  onEdit: Prototype.func.isRequired,
  onDelete: Prototype.func.isRequired,
  onOpen: Prototype.func.isRequired,
};
