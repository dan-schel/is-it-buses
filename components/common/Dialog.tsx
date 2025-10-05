import React from "react";

type DialogProps = {
  children: React.ReactElement;
  open: boolean;
};

export function Dialog(props: DialogProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    if (dialogRef.current != null) {
      if (props.open) {
        dialogRef.current.showModal();
      } else {
        dialogRef.current.close();
      }
    }
  }, [props.open]);

  return (
    <dialog
      ref={dialogRef}
      className="text-foreground fixed top-0 left-0 flex h-full max-h-none w-full max-w-none items-center justify-center bg-transparent backdrop:bg-transparent"
    >
      <div className="bg-dialog-backdrop absolute top-0 right-0 bottom-0 left-0 -z-1" />
      <div className="bg-background relative z-0 max-h-[calc(100svh-2rem)] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-sm shadow-2xl">
        {props.children}
      </div>
    </dialog>
  );
}
