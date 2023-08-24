import {StepsDefinition} from "phd-assess-meta/types/dashboards";


// this definition should be into the bpmn.
// To remove any confusion, it does not represent what is going on in the bpmn.
// It is kept here as a copy, for testing purposes only.
export const stepsDefinitionV2: StepsDefinition = [
  {
    id: 'Activity_PHD_fills_annual_report_1',
    label: 'Phd fills annual report',
    parents: [],  // first step
    // this step manage a second activity:
    alias: ['Activity_PHD_fills_annual_report_2'],
  },
  {
    id: 'Activity_Thesis_Co_Director_fills_annual_report',
    label: 'Co-Dir fills annual report',
    dependsOn: {
      field: 'thesisCoDirectorSciper',
      contentOnFail: 'N/A',
    },
    parents: ['Activity_PHD_fills_annual_report_1'],
  },
  {
    id: 'Activity_Thesis_Director_fills_annual_report',
    label: 'Thesis Dir fills annual report',
    parents: ['Activity_PHD_fills_annual_report_1'],
  },
  {
    id: 'Activity_Thesis_Director_Collaborative_Review_Signs',
    label: 'Collaborative review',
    parents: [
      'Activity_PHD_fills_annual_report_1',
      'Activity_Thesis_Co_Director_fills_annual_report',
      'Activity_Thesis_Director_fills_annual_report',
    ],
  },
  {
    id: 'Activity_Thesis_Co_Director_Signs',
    label: 'Co-Dir signature',
    content: 'N/A for V2',
  },
  {
    id: 'Activity_Thesis_Director_Signs',
    label: 'Thesis Dir signature',
    content: 'N/A for V2',
  },
  {
    id: 'Activity_PHD_Signs',
    label: 'PhD signature',
    parents: ['Activity_Thesis_Director_Collaborative_Review_Signs'],
  },
  {
    id: 'Activity_Post_Mentor_Meeting_Mentor_Signs',
    label: 'Mentor signature',
    dependsOn: {
      field: 'mentorDate',
    },
    parents: undefined,  // this one is floating all along the process, without parents
  },
  {
    id: 'Activity_Post_Mentor_Meeting_PHD_Signs',
    label: 'PhD signature after mentor',
    parents: ['Activity_PHD_Signs'],
    content: 'N/A for V2',
  },
  {
    id: 'Activity_Program_Director_Signs',
    label: 'Program Director signature',
    parents: [
      'Activity_Post_Mentor_Meeting_Mentor_Signs',
      'Activity_PHD_Signs',
    ],
  },
]

