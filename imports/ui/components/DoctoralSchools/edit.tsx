import React, {useState} from "react";
import {DoctoralSchool} from "/imports/api/doctoralSchools/schema";
import {updateDoctoralSchool} from "/imports/api/doctoralSchools/methods";


type DoctoralSchoolEditParameter = {
  doctoralSchool: DoctoralSchool;
};

export const InlineEdit = ({ doctoralSchool }: DoctoralSchoolEditParameter) => {
  const [editing, setEditing] = useState(false)
  const [acronym, setAcronym] = useState(doctoralSchool.acronym)
  const [label, setLabel] = useState(doctoralSchool.label)
  const [helpUrl, setHelpUrl] = useState(doctoralSchool.helpUrl)
  const [creditsNeeded, setCreditsNeeded] = useState(doctoralSchool.creditsNeeded?.toString())
  const [programDirectorSciper, setProgramDirectorSciper] = useState(doctoralSchool.programDirectorSciper)

  const openEditingMode = () => {
    // refresh state values and show the inputs
    setAcronym(doctoralSchool.acronym)
    setLabel(doctoralSchool.label)
    setHelpUrl(doctoralSchool.helpUrl)
    setCreditsNeeded(doctoralSchool.creditsNeeded?.toString())
    setProgramDirectorSciper(doctoralSchool.programDirectorSciper)
    setEditing(true)
  }

  const saveEdit = () => {
    updateDoctoralSchool.call({
        _id: doctoralSchool._id,
        acronym: acronym.trim(),
        label: label.trim(),
        helpUrl: helpUrl?.trim(),
        creditsNeeded: creditsNeeded?.trim() ? Number(creditsNeeded.trim()): undefined,
        programDirectorSciper: programDirectorSciper?.trim(),
      }, (err: any, res: any) => {
        if (err) {
          alert(err);
        } else {
          if (res == 1) {
            // success!
            alert('Successfully updated')
          } else {
            alert('Something went wrong, try again.')
          }

          setEditing(false)
        }
    })
  }

  return (
    <>
      <hr />
      <div className={'m-2'}>
        {editing &&
        <form className="doctoral-school-edit-form">
          <div className="form-group">
            <label className={"field-required"}
                   htmlFor={`doctoralSchool-acronym-edit-input-${doctoralSchool._id}`}>Acronym</label>
            <input
              value={acronym}
              type="text"
              className={'form-control'}
              name="doctoralSchool-acronym-edit-input"
              id={`doctoralSchool-acronym-edit-input-${doctoralSchool._id}`}
              placeholder="Type to here to enter the acronym"
              onChange={ (e) => setAcronym(e.target.value) }
            />
          </div>
          <div className="form-group">
            <label className={"field-required"}
                   htmlFor={`doctoralSchool-label-edit-input-${doctoralSchool._id}`}>Label</label>
            <input
              value={label}
              type="text"
              className={'form-control'}
              name="doctoralSchool-label-edit-input"
              id={`doctoralSchool-label-edit-input-${doctoralSchool._id}`}
              placeholder="Type to here to enter the label"
              onChange={ (e) => setLabel(e.target.value) }
            />
          </div>
          <div className="form-group">
            <label htmlFor={`doctoralSchool-helpUrl-edit-input-${doctoralSchool._id}`}>Help URL</label>
            <input
              value={helpUrl}
              type="url"
              className={'form-control'}
              name="doctoralSchool-helpUrl-edit-input"
              id={`doctoralSchool-helpUrl-edit-input-${doctoralSchool._id}`}
              placeholder="Type to here to enter the help URL"
              onChange={ (e) => setHelpUrl(e.target.value) }
            />
          </div>
          <div className="form-group">
            <label htmlFor={`doctoralSchool-creditsNeeded-edit-input-${doctoralSchool._id}`}>Credits needed</label>
            <input
              value={creditsNeeded}
              type="url"
              className={'form-control'}
              name="doctoralSchool-creditsNeeded-edit-input"
              id={`doctoralSchool-creditsNeeded-edit-input-${doctoralSchool._id}`}
              placeholder="Type to here to enter the credits needed"
              onChange={ (e) => setCreditsNeeded(e.target.value) }
            />
          </div>
          <div className="form-group">
            <label htmlFor={`doctoralSchool-programDirectorSciper-edit-input-${doctoralSchool._id}`}>Program director
              sciper</label>
            <input
              value={creditsNeeded}
              type="text"
              className={'form-control'}
              name="doctoralSchool-programDirectorSciper-edit-input"
              id={`doctoralSchool-programDirectorSciper-edit-input-${doctoralSchool._id}`}
              placeholder="Type to here to enter the program director sciper"
              onChange={ (e) => setProgramDirectorSciper(e.target.value) }
            />
          </div>
          <div>
            <button type="button" className={"btn btn-primary"} onClick={() => { saveEdit()}}>Save</button>
            <button type="button" className={"btn btn-secondary ml-2"} onClick={() => setEditing(false)}>Cancel</button>
            <button type="button" className={"btn float-right btn-primary"} onClick={() => setEditing(false)}>Delete</button>
          </div>
        </form>
        }
        {!editing &&
        <div className={'row'}>
          <div className={'col-1 font-weight-bold'}>{doctoralSchool.acronym}</div>
          <div className={'col-4'}>{doctoralSchool.label}</div>
          <div className={'col-3'}>{doctoralSchool.helpUrl}</div>
          <div className={'col-1'}>{doctoralSchool.creditsNeeded}</div>
          <div className={'col-2'}>{doctoralSchool.programDirectorSciper}</div>
          <div className={'col-1'}><button className={"btn btn-secondary"} onClick={() => openEditingMode()}>Edit</button></div>
        </div>
        }
      </div>
    </>
  )
}
