import React, {useEffect, useState} from "react";
import DOMPurify from 'dompurify';
import {Editor} from "@tinymce/tinymce-react";
import {useFind, useSubscribe} from "meteor/react-meteor-data";

import {Loader} from "epfl-elements-react";

import {useAccountContext} from "/imports/ui/contexts/Account";
import {MaintenanceInfoData} from "/imports/ui/model/maintenance";


export const MaintenanceInfo = () => {
  const isLoading = useSubscribe("maintenanceNotice");
  const notices = useFind(() => MaintenanceInfoData.find());

  if (
    isLoading() ||
    notices?.length == 0 ||
    notices[0]?.message === ''
  ) return <></>

  return <div
    className={'alert alert-warning'}
    role={'alert'}
    dangerouslySetInnerHTML={{
      __html: DOMPurify.sanitize(notices[0].message)
    }}
  />
}

export const MaintenanceSetter = () => {
  const sampleMessage = `
    <strong>
      Scheduled Maintenance Notice
    </strong>
    <p>
      We will be performing a maintenance on [DATE] between [START TIME] and [END TIME].
    </p>
    <p>
      During this period, service interruptions may occur, and some users may experience temporary connection losses or brief outages.
      We apologize for any inconvenience and appreciate your understanding as we work to improve our services.
    </p>
  `

  const account = useAccountContext()

  const isLoading = useSubscribe("maintenanceNotice");
  const notices = useFind(() => MaintenanceInfoData.find());

  const defaultMessage = notices[0]?.message ?? ''

  useEffect(() => {
    setMessage(defaultMessage);
  }, [defaultMessage]);

  const [message, setMessage] = useState(defaultMessage);

  if (!account || !account.isLoggedIn || isLoading()) return (<Loader message={'Loading data...'}/>)

  if (!account.user?.isAdmin) return <>Check your permissions</>

  return <>
    <form>
      <div className="form-group">
        <label><strong>Notice content</strong></label>
        <Editor
          tinymceScriptSrc="/js/tinymce/tinymce.min.js"
          plugins={ 'link' }
          toolbar={ 'undo redo | styles | align | bold italic | link' }
          init={ {
            branding: false,
            convert_urls: false,  // don't show urls as relative urls, it is disturbing in this context
            height: 300,
            link_context_toolbar: true,
            menubar: true,
            promotion: false,
            statusbar: true,
          } }
          value={ message }
          onEditorChange={ (v: string) => setMessage(v) }
        />
      </div>
      <div className={'pb-2'}>
        <button
          className="btn btn-primary"
          onClick={
            async (e) => {
              e.preventDefault();
              try {
                await Meteor.callAsync('setMaintenanceNotice', message)
              } catch (e) {
                alert(`Something went wrong: ${e}`)
              }
            }
          }
        >Publish this content
        </button>
        <button
          className="btn btn-secondary float-right"
          onClick={
            (e) => {
              e.preventDefault();
              setMessage('')
            }
          }
        >Clear
        </button>
        <button
          className="btn btn-secondary mr-2 float-right"
          onClick={
            (e) => {
              e.preventDefault();
              setMessage(sampleMessage)
            }
          }
        >Load the default template
        </button>
      </div>
    </form>
  </>
}
