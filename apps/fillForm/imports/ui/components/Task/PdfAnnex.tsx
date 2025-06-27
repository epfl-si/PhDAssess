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

  const pdfName = decodeURI(
    task.variables.pdfAnnexPath?.split('/')?.pop()!
  ) ?? 'annex.pdf'

  if (hasError) {
    toastErrorClosable(
      toastId,
      "Sorry, something went wrong when trying to download the file. " +
      "Please try again later or contact 1234@epfl.ch"
    )
  }

  return <>
    <button
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

          const downloadLink = document.createElement('a');
          downloadLink.href = `data:application/pdf;base64,${ pdfAnnexBase64 }`;
          downloadLink.download = pdfName;
          setIsLoading(false);
          downloadLink.click();

          // wait some time before removing it
          setTimeout(() => {
            downloadLink.remove();
          }, 100);

        } catch (e) {
          setIsLoading(false);
          setHasError(true)
        }
      }
      }
    >
      { !isLoading ? <>
        <i className="fa fa-download mr-2"></i>
        Download the annex PDF
      </> : <>
        <span className={'loader mr-1'}></span>
        Downloading the annex file. Please wait...
      </>
      }
    </button>
  </>
}
