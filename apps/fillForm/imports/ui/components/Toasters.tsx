import React from "react";
import toast, {Toaster} from "react-hot-toast";
import {ErrorIcon} from "react-hot-toast";
import {isNonspecificDdpError} from "/imports/api/errors";

export const ToasterConfig = () => {
  return (
    <Toaster
      toastOptions={{
        // Define default options
        duration: 5000,
        // Default options for specific types
        success: {
          duration: 4000,
        },
        error: {
          duration: 6000,
        },
      }}
    />
  )
}

export const toastClosable = (toastId: string, message: string) => (
  <div className="d-flex">
    <div className="flex items-start">
        {message}
    </div>
    <div className="flex items-end">
      <button className={'ml-2 small'} onClick={() => toast.dismiss(toastId)}> x </button>
    </div>
  </div>
)

export const toastErrorClosable = (toastId: string, message: string) => (
  toast(
    toastClosable(toastId, `${message}`),
    {
      id: toastId,
      duration: Infinity,
      icon: <ErrorIcon />,
    }
  )
)

export const toastExceptionClosable= (toastId: string, exception: Error) => {
  const message = ( isNonspecificDdpError( exception ) ) ?
    `${exception} - Please contact 1234@epfl.ch` :
    `${exception}`

  toastErrorClosable(toastId, message)
}
