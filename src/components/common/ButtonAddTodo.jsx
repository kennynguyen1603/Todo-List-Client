import { useState } from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
// import FormAddTask from "./FormAddTask";
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

const ButtonAddTodo = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div className="taskButton">
      <Button onClick={handleOpen} className="task-button">
        + add task
      </Button>
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

export default ButtonAddTodo;
