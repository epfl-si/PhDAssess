import React, {useState} from "react";
import { Meteor } from "meteor/meteor";

import toast from 'react-hot-toast';
import {toastErrorClosable} from "/imports/ui/components/Toasters";

import { Task } from "/imports/model/tasks";


export const PdfAnnexLink = (
  { task }:
  { task: Task }
) => {
  const toastId = `pdfAnnexToast-${task._id}`
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    toastErrorClosable(
      toastId,
      "Sorry, something went wrong when trying to download the file. " +
      "Please try again later or contact 1234@epfl.ch"
    )
  }

  return <>
    <button
      className={'mb-2'}
      disabled={ isLoading }
      onClick={ async () => {

        if (isLoading) return false;

        try {
          toast.dismiss(toastId);
          setHasError(false)
          setIsLoading(true);
          const pdfAnnexBase64 = await Meteor.callAsync(
            'fetchPdfAnnex',
            task._id
          )

          // Create a Blob from the base64 data
          const byteCharacters = atob(pdfAnnexBase64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });

          // Create an object URL for the Blob
          const url = window.URL.createObjectURL(blob);

          // Open the PDF in a new tab
          window.open(url, '_blank');

          setIsLoading(false);

        } catch (e) {
          setIsLoading(false);
          setHasError(true)
        }
      }
      }
    >
      { !isLoading ? <>
        Open the annex PDF
        <i className="fa fa-external-link ml-2"></i>
      </> : <>
        <span className={'loader mr-1'}></span>
        Preparing the annex PDF. Please wait...
      </>
      }
    </button>
  </>
}
