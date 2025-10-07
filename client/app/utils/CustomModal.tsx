import React, { FC, ComponentType } from 'react';
import { Modal, Box } from '@mui/material';

type ComponentProps = {
  setOpen: (open: boolean) => void;
  setRoute?: (route: string) => void;
  refetch?: () => void;
};
type CustomModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  Component: ComponentType<ComponentProps>;
  setRoute?: (route: string) => void;
  refetch?: () => void;
};

const CustomModal: FC<CustomModalProps> = ({ open, setOpen, setRoute, Component, refetch }) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="800px:w-[450px] w-[80%] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none ">
        <Component setOpen={setOpen} setRoute={setRoute} refetch={refetch} />
      </Box>
    </Modal>
  );
};

export default CustomModal;
