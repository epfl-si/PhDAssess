import React, {useEffect, useState} from "react"
import {useTracker} from "meteor/react-meteor-data";
import {Meteor} from "meteor/meteor";
import {canEditAtLeastOneDoctoralSchool} from "/imports/policy/doctoralSchools";
import {Loader} from "@epfl/epfl-elements-react";
import {DoctoralSchool, DoctoralSchools} from "/imports/api/doctoralSchools/schema";
import {CreateForm} from './Create'
import {InlineEdit} from './Edit'
import {useAccountContext} from "/imports/ui/contexts/Account";


export function DoctoralSchoolsList() {
  const account = useAccountContext()

  const [showAdd, setShowAdd] = useState(false)
  const [isAllowedToEdit, setIsAllowedToEdit] = useState(false)

  const doctoralSchoolsLoading = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    const handle = Meteor.subscribe('doctoralSchools');
    return !handle.ready();
  }, []);

  const doctoralSchools = useTracker(
    () => DoctoralSchools.find({}, { sort: { 'acronym': 1 } }).fetch() as Array<DoctoralSchool & {readonly:boolean}>
  , [])

  useEffect(() => {
    const getUserAllowance = async (user: Meteor.User | null) => {
      try {
        setIsAllowedToEdit(await canEditAtLeastOneDoctoralSchool(user))
      } catch (error: any) {
        setIsAllowedToEdit(false)
      }
    }
    getUserAllowance(account?.user ?? null).then().catch(console.error);
  }, [account?.user]);

  if (!account || !account.isLoggedIn) return (<Loader message={'Loading your data...'}/>)

  if (account && account.user && isAllowedToEdit) return (
    <>
      {doctoralSchoolsLoading ? (
        <Loader message={'Loading doctoral schools...'}/>
      ) : (
        doctoralSchools.length === 0 ? (
          <>
            {
              !showAdd &&
              <button className="btn btn-secondary" onClick={ () => setShowAdd(showAdd => !showAdd) }>
                <i className="fa fa-plus"/>&nbsp;&nbsp;Add a new doctoral program
              </button>
            }
            <div>There is currently no doctoralSchoolsData</div>
          </>
        ) : (<>
            {
              !showAdd &&
              <button className="btn btn-secondary" onClick={ () => setShowAdd(showAdd => !showAdd) }>
                <i className="fa fa-plus"/>&nbsp;&nbsp;Add a new doctoral program
              </button>
            }
            {
              showAdd &&
              <CreateForm toggleCreateForm={ setShowAdd }/>
            }
            <div className={'container mt-3'}>
              {
                doctoralSchools.map((doctoralSchool) =>
                  <InlineEdit key={doctoralSchool._id} doctoralSchool={ doctoralSchool } readonly={ doctoralSchool.readonly} />
                )
              }
            </div>
          </>
        )
      )}
    </>
  )

  return (<div>Your permissions does not allow you to set the doctoral schools.</div>)
}
