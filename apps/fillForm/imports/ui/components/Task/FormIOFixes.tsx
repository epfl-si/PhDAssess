/**
 * Utils to run on formIO definition recursively, looking for components
 */
const walkComponents = (
  formio: { components: any},
  cb : (formioNode: any) => any
) =>  {
  for (const c of formio.components) {
    cb(c)
    if (c.components) walkComponents(c, cb);
  }
}

/**
 * FormIO had a fix that changed the way it uses local on the calendar widget.
 * This fix should validate the update of FormIO from 4.14.8 to ^4.15.0,
 * for the old BPMNs still running.
 * Fix that triggered this workaround:
 * https://github.com/formio/formio.js/pull/4839/files
 */
const fixFormIOCustomValidations = (
  parsedFormIO: { components: any}
) => {
  // Find all calendars and rewrite their format valid only for
  // formIO <=4.14.8
  walkComponents(
    parsedFormIO,
    (component) => {
      if (
        component.widget?.type === "calendar" &&
        component.widget?.dateFormat === "yyyy-MM-dd"
      )
        component.widget.dateFormat = "dd.MM.yyyy";
    }
  )
}

/**
 * Find all htmlelement and set their root tag to "div".
 * This fix for the FormIO 4.21 version.
 * It should not be necessary for the 5.x family.
 * See https://github.com/formio/formio.js/issues/5775 and
 * https://github.com/formio/formio.js/pull/5792
 */
const fixFormIOHtmlElementDuplicated = (
  parsedFormIO: { components: any}
) => {
  walkComponents(
    parsedFormIO,
    (component) => {
      if (component.type === "htmlelement") {
        component.tag = 'div'
      }
    }
  )
};

export const applyFormIOFixes = (
  parsedFormIO: { components: any}
) => {
  fixFormIOCustomValidations(parsedFormIO)
  fixFormIOHtmlElementDuplicated(parsedFormIO)
}
