import { useState } from "react";
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import NewFormAddTask from "@components/dashboard/Forms/NewFormAddTask";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 550,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const ButtonAddTodo = ({ content = "+ add task" }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div className="absolute top-[-3px] right-0">
      <button
        onClick={handleOpen}
        className={`text-sm desktop:text-base px-2 py-1.5 font-semibold rounded-lg text-[#5accbb] hover:bg-[#5accbb] hover:text-white capitalize`}
      >
        {content}
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <NewFormAddTask />
        </Box>
      </Modal>
    </div>
  );
};

ButtonAddTodo.propTypes = {
  content: PropTypes.string,
};

export default ButtonAddTodo;
