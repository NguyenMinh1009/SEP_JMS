import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import CustomButton from "./CustomButton";
import { cn } from "../../utils/className";

interface ICustomDialog {
  openDialog: boolean;
  handleClose: () => void;
  title: string;
  description: string;
  primaryBtnText: string;
  secondaryBtnText: string;
  primaryBtnCallback: () => void;
  secondaryBtnCallback: () => void;
  renderCustomChildren?: () => JSX.Element;
  customPrimaryBtnClass?: string;
  customSecondaryBtnClass?: string;
}

const CustomDialog: React.FC<ICustomDialog> = ({
  openDialog,
  handleClose,
  title,
  description,
  primaryBtnText,
  secondaryBtnText,
  primaryBtnCallback,
  secondaryBtnCallback,
  renderCustomChildren,
  customPrimaryBtnClass,
  customSecondaryBtnClass
}) => {
  return (
    <Dialog
      open={openDialog}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" className="text-base">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" className="text-[13px]">
          {description ?? <></>}
        </DialogContentText>
        {renderCustomChildren?.()}
      </DialogContent>
      <DialogActions className="px-5 pb-4">
        {/* <Button size="small" className="text-[13px] normal-case" onClick={handleClose} autoFocus>
          {cancelBtnText}
        </Button> */}
        <CustomButton
          autoFocus
          primary
          onClick={primaryBtnCallback}
          disablePadding
          className={cn("px-4 py-1", customPrimaryBtnClass ?? "")}
        >
          <p className="text-secondary text-[13px] normal-case leading-6 text-white">
            {primaryBtnText}
          </p>
        </CustomButton>
        <Button
          size="small"
          className={cn("text-[13px] normal-case text-red-400", customSecondaryBtnClass ?? "")}
          onClick={() => {
            secondaryBtnCallback();
            handleClose();
          }}
        >
          {secondaryBtnText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
