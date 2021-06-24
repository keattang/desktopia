import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import ButtonBase from "@material-ui/core/ButtonBase";
import Tooltip from "@material-ui/core/Tooltip";
import { useState } from "react";
import { HandleRequestPassword } from "../types";

interface IProps {
  onRequestPassword: () => ReturnType<HandleRequestPassword>;
  onPasswordCopied?: () => void;
}

const HiddenPassword = ({ onRequestPassword, onPasswordCopied }: IProps) => {
  const [password, setPassword] = useState<undefined | string>(undefined);
  const [requesting, setRequesting] = useState(false);

  const handleRevealClick = async () => {
    setRequesting(true);
    const password = await onRequestPassword();
    setPassword(password);
    setRequesting(false);
  };

  const handleCopyClick = async () => {
    if (password) {
      navigator.clipboard.writeText(password);
      onPasswordCopied && onPasswordCopied();
    }
  };

  return password ? (
    <Tooltip title="Click to copy">
      <ButtonBase onClick={handleCopyClick}>{password}</ButtonBase>
    </Tooltip>
  ) : (
    <Button onClick={handleRevealClick}>
      {requesting ? <CircularProgress /> : "Reveal Password"}
    </Button>
  );
};

export default HiddenPassword;
