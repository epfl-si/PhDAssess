import {faker} from "/tests/factories/faker";
import {Tasks} from "/imports/model/tasks";
import {ParticipantRoles} from "/imports/model/participants";
import {ParticipantsVariables} from "phd-assess-meta/types/participants";
import dayjs from "dayjs";
import {stepsDefinitionV2} from "/tests/factories/dashboard/dashboardDefinition";

const Factory = require("meteor/dburles:factory").Factory


const generateParticipants = (hasThesisCoDirector= true) => {
  const participants: Partial<ParticipantsVariables> = {}

  Object.values(ParticipantRoles).forEach((role) => {
    if (role === 'thesisCoDirector' && !hasThesisCoDirector) return

    const firstName = faker.helpers.maybe(
      () => faker.name.firstName() + ' ' + faker.name.firstName(), { probability: 0.7 }
    ) ?? faker.name.firstName()

    const lastName = faker.helpers.maybe(
      () => faker.name.lastName() + ' ' + faker.name.lastName(), { probability: 0.7 }
    ) ?? faker.name.lastName()

    if (role === 'phdStudent') {
      // we save student detail, has it used to build the final GED path
      participants[`${role}FirstName`] = firstName
      participants[`${role}LastName`] = lastName
    }

    participants[`${role}Name`] = `${firstName} ${lastName}`
    participants[`${role}Sciper`] = `${faker.sciper()}`
    participants[`${role}Email`] = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@epfl.ch`
  })

  return participants
}

export const generateAGenericTaskAttributes = (hasThesisCoDirector = true) => {
  const participant = generateParticipants(hasThesisCoDirector)

  return {
    "journal": {
      "lastSeen": () => dayjs().subtract(15, 'minutes').toDate(),
      "seenCount": faker.datatype.number(9999),
    },
    "bpmnProcessId": "phdAssessProcess",
    "customHeaders": {
      "formIO": "{   \"_id\": \"6094ea003614a90bb3112cc5\",   \"type\": \"form\",   \"tags\": [],   \"owner\": \"605a091e390b9fa6e626d355\",   \"revisions\": \"\",   \"_vid\": 0,   \"title\": \"Annual Progress Report\",   \"display\": \"form\",   \"access\": [     {       \"roles\": [         \"605a093a1964dcf6c669c8dd\",         \"605a093a1964dc7db769c8de\",         \"605a093a1964dcd89969c8df\"       ],       \"type\": \"read_all\"     }   ],   \"submissionAccess\": [],   \"controller\": \"\",   \"properties\": {},   \"settings\": {},   \"name\": \"annualProgressReport\",   \"path\": \"annualprogressreport\",   \"project\": \"605a093a1964dca89369c8dc\",   \"created\": \"2021-05-07T07:19:28.829Z\",   \"modified\": \"2021-05-11T15:57:35.231Z\",   \"machineName\": \"mcvvtebnveuvysz:annualProgressReport\",   \"components\": [     {       \"title\": \"<b>Annual Report</b>\",       \"collapsible\": false,       \"key\": \"panel1\",       \"type\": \"panel\",       \"label\": \"Panel\",       \"input\": false,       \"tableView\": false,       \"components\": [         {           \"label\": \"Doctoral Program:\",           \"disabled\": true,           \"tableView\": true,           \"validate\": {             \"required\": true           },           \"key\": \"doctoralProgramName\",           \"type\": \"textfield\",           \"input\": true         },         {           \"label\": \"Date of enrolment:\",           \"widget\": {             \"type\": \"calendar\",             \"altInput\": true,             \"allowInput\": true,             \"clickOpens\": true,             \"enableDate\": true,             \"enableTime\": false,             \"mode\": \"single\",             \"noCalendar\": false,             \"format\": \"dd.MM.yyyy\",             \"dateFormat\": \"yyyy-MM-dd\",             \"useLocaleSettings\": false,             \"hourIncrement\": 1,             \"minuteIncrement\": 5,             \"time_24hr\": false,             \"saveAs\": \"text\",             \"locale\": \"en\",             \"displayInTimezone\": \"viewer\"           },           \"tableView\": true,           \"validate\": {             \"required\": true,             \"custom\": \"let m = moment();\\nlet p = moment(input, \\\"DD.MM.YYYY\\\");\\nvalid = (m > p) ? true : \\\"date must not be in the future\\\";\"           },           \"key\": \"dateOfEnrolment\",           \"type\": \"textfield\",           \"input\": true         },         {           \"label\": \"Annual report of\",           \"optionsLabelPosition\": \"right\",           \"inline\": false,           \"tableView\": false,           \"values\": [             {               \"label\": \"1st year (tick only if candidacy exam not yet passed)\",               \"value\": \"1st year\",               \"shortcut\": \"\"             },             {               \"label\": \"2nd year\",               \"value\": \"2nd year\",               \"shortcut\": \"\"             },             {               \"label\": \"3rd year \",               \"value\": \"3rd year\",               \"shortcut\": \"\"             },             {               \"label\": \"4th year\",               \"value\": \"4th year\",               \"shortcut\": \"\"             },             {               \"label\": \"5th year\",               \"value\": \"5th year\",               \"shortcut\": \"\"             },             {               \"label\": \"6th year\",               \"value\": \"6th year\",               \"shortcut\": \"\"             }           ],           \"validate\": {             \"required\": true           },           \"key\": \"year\",           \"type\": \"radio\",           \"input\": true         }       ]     },     {       \"title\": \"<b>Basic information</b>\",       \"collapsible\": false,       \"key\": \"panel\",       \"type\": \"panel\",       \"label\": \"Section A: Basic information New title\",       \"input\": false,       \"tableView\": false,       \"components\": [         {           \"label\": \"Name of candidate:\",           \"disabled\": true,           \"tableView\": true,           \"customDefaultValue\": \"value = Meteor.user().tequila.displayname;\",           \"key\": \"phdStudentName\",           \"type\": \"textfield\",           \"input\": true         },         {           \"label\": \"Tentative thesis title:\",           \"tableView\": true,           \"validate\": {             \"required\": true           },           \"key\": \"tentativeThesisTitle\",           \"type\": \"textfield\",           \"input\": true         },         {           \"label\": \"Thesis director:\",           \"disabled\": true,           \"tableView\": true,           \"key\": \"thesisDirectorName\",           \"type\": \"textfield\",           \"input\": true         },         {           \"label\": \"Thesis co-director:\",           \"disabled\": true,           \"tableView\": true,           \"key\": \"thesisCoDirectorName\",           \"type\": \"textfield\",           \"input\": true         },         {           \"label\": \"Date of candidacy exam:\",           \"widget\": {             \"type\": \"calendar\",             \"altInput\": true,             \"allowInput\": true,             \"clickOpens\": true,             \"enableDate\": true,             \"enableTime\": false,             \"mode\": \"single\",             \"noCalendar\": false,             \"format\": \"dd.MM.yyyy\",             \"dateFormat\": \"yyyy-MM-dd\",             \"useLocaleSettings\": false,             \"hourIncrement\": 1,             \"minuteIncrement\": 5,             \"time_24hr\": false,             \"saveAs\": \"text\",             \"locale\": \"en\",             \"displayInTimezone\": \"viewer\"           },           \"tableView\": true,           \"validate\": {             \"required\": true           },           \"key\": \"dateOfCandidacyExam\",           \"type\": \"textfield\",           \"input\": true         },         {           \"label\": \"TA duties: Activities done: \",           \"placeholder\": \"Estimated hours and/or courses completed, supervision of projet ...\",           \"autoExpand\": false,           \"tableView\": true,           \"validate\": {             \"required\": true           },           \"key\": \"taDutiesHoursAndOrCoursesCompleted\",           \"type\": \"textarea\",           \"input\": true         },         {           \"label\": \"Credits needed for this program:\",           \"inputMask\": \"99\",           \"disabled\": true,           \"tableView\": true,           \"persistent\": false,           \"validate\": {             \"required\": true           },           \"key\": \"creditsNeeded\",           \"type\": \"textfield\",           \"input\": true         },         {           \"label\": \"Total credits obtained:\",           \"mask\": false,           \"tableView\": true,           \"delimiter\": false,           \"requireDecimal\": false,           \"inputFormat\": \"plain\",           \"truncateMultipleSpaces\": false,           \"calculateServer\": true,           \"validate\": {             \"required\": true           },           \"key\": \"totalCreditsObtained\",           \"type\": \"number\",           \"inputType\": \"number\",           \"input\": true         },         {           \"label\": \"Total credits planned:\",           \"mask\": false,           \"tableView\": true,           \"delimiter\": false,           \"requireDecimal\": false,           \"inputFormat\": \"plain\",           \"truncateMultipleSpaces\": false,           \"calculateServer\": true,           \"key\": \"totalCreditsPlanned\",           \"type\": \"number\",           \"inputType\": \"number\",           \"input\": true         }       ]     },     {       \"title\": \"<b>Research progress</b>\",       \"collapsible\": false,       \"key\": \"sectionBResearchProgress1\",       \"conditional\": {         \"show\": false,         \"when\": \"year\",         \"eq\": \"1st year\"       },       \"type\": \"panel\",       \"label\": \"Section B: Research progress\",       \"input\": false,       \"tableView\": false,       \"components\": [         {           \"label\": \"HTML\",           \"attrs\": [             {               \"attr\": \"\",               \"value\": \"\"             }           ],           \"content\": \"To be completed first by the doctoral student and then discussed with the thesis director (and co-director if applicable) during the Annual Report meeting. Future objectives are meant to provide guidance in the project and should thus be as realistic as possible. Achieved and planned objectives should be discussed and agreed upon by the doctoral student and thesis director by approving the Annual Report.\",           \"refreshOnChange\": false,           \"key\": \"html\",           \"type\": \"htmlelement\",           \"input\": false,           \"tableView\": false         },         {           \"label\": \"1. What are the overall goals of the thesis? \",           \"autoExpand\": false,           \"tableView\": true,           \"validate\": {             \"required\": true           },           \"key\": \"goalsOfTheThesis\",           \"type\": \"textarea\",           \"input\": true         },         {           \"label\": \"2. Research progress during the past year\",           \"placeholder\": \"(i.e. describe which objectives are completed and elaborate if any difficulties have been encountered since the last annual report)\",           \"autoExpand\": false,           \"tableView\": true,           \"validate\": {             \"required\": true           },           \"key\": \"researchProgressDuringThePastYear\",           \"type\": \"textarea\",           \"input\": true         },         {           \"label\": \"3. Have the objectives changed in the past year? If so, why and how? \",           \"autoExpand\": false,           \"tableView\": true,           \"validate\": {             \"required\": true           },           \"key\": \"haveTheObjectivesChangedInThePastYearIfSoWhyAndHow\",           \"type\": \"textarea\",           \"input\": true         },         {           \"label\": \"4. Research objectives for the next year\",           \"autoExpand\": false,           \"tableView\": true,           \"validate\": {             \"required\": true           },           \"key\": \"researchObjectivesForTheNextYear\",           \"type\": \"textarea\",           \"input\": true         },         {           \"label\": \"5. Timeline of the planned work for the next year\",           \"autoExpand\": false,           \"tableView\": true,           \"validate\": {             \"required\": true           },           \"key\": \"timelineOfThePlannedWorkForTheNextYear\",           \"type\": \"textarea\",           \"input\": true         },         {           \"label\": \"6. Scientific output\",           \"placeholder\": \"(Journal and conference papers, patents, software, etc. published, submitted or in preparation)\",           \"autoExpand\": false,           \"tableView\": true,           \"validate\": {             \"required\": true           },           \"key\": \"scientificOutput\",           \"type\": \"textarea\",           \"input\": true         },         {           \"label\": \"7. Educational activities\",           \"placeholder\": \"(Mention oral or poster presentations, outreach and any specific training)\",           \"autoExpand\": false,           \"tableView\": true,           \"validate\": {             \"required\": true           },           \"key\": \"educationalActivities\",           \"type\": \"textarea\",           \"input\": true         }       ]     },     {       \"title\": \"<b>Progress assessment</b>\",       \"collapsible\": false,       \"key\": \"sectionCProgressAssessment1\",       \"type\": \"panel\",       \"label\": \"Section C: Progress assessment\",       \"input\": false,       \"tableView\": false,       \"components\": [         {           \"label\": \"HTML\",           \"attrs\": [             {               \"attr\": \"\",               \"value\": \"\"             }           ],           \"content\": \"<p>To be completed independently by the doctoral student and thesis director (and co-director if applicable), then discussed and approved by both during the Annual Report meeting. Progress evaluation is not confidential. During completion you have access only to your comments. At the time of the collaborative review all comments will be visible. &nbsp;</p>\\n<p>Aims on the doctoral student side:</p>\\n<ul>\\n<li>to assess how the doctoral student views their own progress and skills</li>\\n</ul>\\n<ul>\\n<li>to identify and communicate to the thesis director in what areas the doctoral student seeks more input or help</li>\\n</ul>\\n<p>Aims on the thesis director (and co-director if applicable) side:</p>\\n<ul>\\n<li>to ensure that your doctoral student knows how they are performing overall according to you </li>\\n</ul>\\n<ul>\\n<li>to communicate what you think strengths and weaknesses are towards completing a PhD</li>\\n</ul>\\n<ul>\\n<li>to communicate what you think needs to be improved</li>\\n</ul>\\n<ul>\\n<li>to ensure that career issues are discussed at least once per year&nbsp;</li>\\n</ul>\\n<p>Please use the comments box to briefly assess the progress and further elaborate any specific issues.</p>\",           \"refreshOnChange\": false,           \"key\": \"html1\",           \"type\": \"htmlelement\",           \"input\": false,           \"tableView\": false         },         {           \"label\": \"HTML\",           \"attrs\": [             {               \"attr\": \"\",               \"value\": \"\"             }           ],           \"content\": \"<h4><b>Discussion topics</b></h4>\\n<p>1. Student&rsquo;s engagement in the project:<br>\\n<i>satisfaction, motivation, commitment, initiative, independence, ...</i></p>\",           \"refreshOnChange\": false,           \"key\": \"html2\",           \"type\": \"htmlelement\",           \"input\": false,           \"tableView\": false         },         {           \"label\": \"Comment\",           \"autoExpand\": false,           \"tableView\": true,           \"validate\": {             \"required\": true           },           \"key\": \"phdComment1\",           \"type\": \"textarea\",           \"input\": true         },         {           \"label\": \"HTML\",           \"attrs\": [             {               \"attr\": \"\",               \"value\": \"\"             }           ],           \"content\": \"<p>2. Thesis director’s (and co-director if applicable) supervision:<br>\\n<i>availability, coaching, support, resources, training and conferences, ...</i></p>\",           \"refreshOnChange\": false,           \"key\": \"html3\",           \"type\": \"htmlelement\",           \"input\": false,           \"tableView\": false         },         {           \"label\": \"Comment\",           \"autoExpand\": false,           \"tableView\": true,           \"validate\": {             \"required\": true           },           \"key\": \"phdComment2\",           \"type\": \"textarea\",           \"input\": true         },         {           \"label\": \"HTML\",           \"attrs\": [             {               \"attr\": \"\",               \"value\": \"\"             }           ],           \"content\": \"<p>3. Project’s progress:<br>\\n<i>quality of results, critical thinking, vision, timeline, organization, planning, ...</i></p>\",           \"refreshOnChange\": false,           \"key\": \"html4\",           \"type\": \"htmlelement\",           \"input\": false,           \"tableView\": false         },         {           \"label\": \"Comment\",           \"autoExpand\": false,           \"tableView\": true,           \"validate\": {             \"required\": true           },           \"key\": \"phdComment3\",           \"type\": \"textarea\",           \"input\": true         },         {           \"label\": \"HTML\",           \"attrs\": [             {               \"attr\": \"\",               \"value\": \"\"             }           ],           \"content\": \"<p>4. Student’s scientific and career development:<br>\\n<i>training, acquired skills (writing, presenting), teaching load, conferences and networking, after-PhD planning, ...</i></p>\",           \"refreshOnChange\": false,           \"key\": \"html5\",           \"type\": \"htmlelement\",           \"input\": false,           \"tableView\": false         },         {           \"label\": \"Comment\",           \"autoExpand\": false,           \"tableView\": true,           \"validate\": {             \"required\": true           },           \"key\": \"phdComment4\",           \"type\": \"textarea\",           \"input\": true         },         {           \"label\": \"HTML\",           \"attrs\": [             {               \"attr\": \"\",               \"value\": \"\"             }           ],           \"content\": \"<p>5. Laboratory situation:<br>\\n<i>support from colleagues and own collegiality, open communication and atmosphere, balance in collaborative projects, resource availability, ….</i></p>\",           \"refreshOnChange\": false,           \"key\": \"html6\",           \"type\": \"htmlelement\",           \"input\": false,           \"tableView\": false         },         {           \"label\": \"Comment\",           \"autoExpand\": false,           \"tableView\": true,           \"validate\": {             \"required\": true           },           \"key\": \"phdComment5\",           \"type\": \"textarea\",           \"input\": true         },         {           \"label\": \"HTML\",           \"attrs\": [             {               \"attr\": \"\",               \"value\": \"\"             }           ],           \"content\": \"<p>6. Any other specific points:<br>\",           \"refreshOnChange\": false,           \"key\": \"html7\",           \"type\": \"htmlelement\",           \"input\": false,           \"tableView\": false         },         {           \"label\": \"Comment\",           \"autoExpand\": false,           \"tableView\": true,           \"key\": \"phdComment6\",           \"type\": \"textarea\",           \"input\": true         }       ]     },     {       \"label\": \"Section C: Progress assessment\",       \"refreshOnChange\": false,       \"key\": \"sectionCProgressAssessment\",       \"type\": \"content\",       \"input\": false,       \"tableView\": false     },     {       \"label\": \"Section B: Research progress\",       \"refreshOnChange\": false,       \"key\": \"sectionBResearchProgress\",       \"type\": \"content\",       \"input\": false,       \"tableView\": false     },     {       \"type\": \"button\",       \"label\": \"Submit\",       \"key\": \"submit\",       \"disableOnInvalid\": true,       \"input\": true,       \"tableView\": false     },     {       \"label\": \"Cancel\",       \"action\": \"event\",       \"showValidations\": false,       \"theme\": \"secondary\",       \"tableView\": false,       \"key\": \"cancel\",       \"type\": \"button\",       \"input\": true,       \"event\": \"cancelClicked\"     }   ] }",
      "title": "Phd fills annual report - Test"
    },
    "deadline": "1670854641986",
    "elementId": faker.helpers.arrayElement([
      "Activity_PHD_fills_annual_report",
    ]),
    "elementInstanceKey": faker.datatype.number({
      min: 1000000000000000, max: 9999999999999999
    }),
    "key": faker.datatype.number({
      min: 1000000000000000, max: 9999999999999999
    }),
    "processDefinitionVersion": faker.datatype.number(50),
    "processInstanceKey": faker.datatype.number({
      min: 1000000000000000, max: 9999999999999999
    }),
    "processKey": faker.datatype.number({
      min: 1000000000000000, max: 9999999999999999
    }),
    "retries": 0,
    "type": "phdAssessFillForm",
    "variables": {
      ...participant,
      "assigneeSciper": participant.phdStudentSciper,
      "created_at": "2022-12-12T14:16:44.822Z",
      "created_by": () => faker.sciper(),
      "updated_at": "2022-12-12T14:17:01.951Z",
      "dueDate": () => faker.date.future(),
      "activityLogs": "[{\"pathName\":\"/tasks/9999999999999999\"}]",
      "creditsNeeded": "21",
      "docLinkAnnualReport": "www.epfl.ch",
      "doctoralProgramName": "EDEY",
      "doctoralProgramEmail": "edey@epfl.ch",
      "dashboardDefinition": faker.helpers.maybe(  // can be empty, can have V2
        () => stepsDefinitionV2, { probability: 0.4 }
      ),
    },
    "worker": faker.datatype.uuid(),
  }
}

Factory.define('task', Tasks, generateAGenericTaskAttributes() )
