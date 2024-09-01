import { FC } from 'react';
import { Button, Modal, ModalProps } from 'react-bootstrap';

export interface BaseDialogProps extends ModalProps {
  dialogid: string;
  title?: string;
  onSubmit?: () => Promise<void>;
  onCancel?: () => Promise<void>;
}

export const BaseDialog: FC<BaseDialogProps> = ({ dialogid, title, onSubmit, onCancel, children, ...props }) => {
  const submit = async () => {
    if (onSubmit) {
      await onSubmit();
    }
  };

  const cancel = async () => {
    if (onCancel) {
      await onCancel();
    }
  };

  return (
    <div className={`dialog-${dialogid} d-none`}>
      <Modal {...props} centered onHide={cancel} animation={false}>
        <Modal.Header closeButton>{title && <Modal.Title>{title}</Modal.Title>}</Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
          {onCancel && (
            <Button variant="outline-secondary" onClick={cancel}>
              Cancel
            </Button>
          )}
          {onSubmit && <Button onClick={submit}>Submit</Button>}
        </Modal.Footer>
      </Modal>
    </div>
  );
};
