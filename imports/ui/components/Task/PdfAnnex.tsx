import { Meteor } from "meteor/meteor";
import { Task } from "/imports/model/tasks";


export const openAnnexPdf = async (task: Task) => {
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
};
