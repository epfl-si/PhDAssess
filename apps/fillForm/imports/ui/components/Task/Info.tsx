import React from "react";
import {useAccountContext} from "/imports/ui/contexts/Account";
import {ITaskList} from "/imports/policy/tasksList/type";


export const TaskInfo = ({ task, showPhDStudent=true }: { task: ITaskList, showPhDStudent?: boolean }) => {
  const account = useAccountContext()

  return <>
      <span className={'mr-auto'}>
        { showPhDStudent &&
          <div className={'mr-2'}>{ task.variables.phdStudentName } {task.variables.phdStudentSciper ? `( ${task.variables.phdStudentSciper} )` : '' }</div>
        }
        {task.created_at &&
          <span className={'mr-2 small'}>Created {task.created_at.toLocaleString('fr-CH')}</span>
        }
        {task.updated_at &&
          <span className={'small'}>Updated {task.updated_at.toLocaleString('fr-CH')}</span>
        }
        { account?.user?.isAdmin && task.isObsolete &&
          <span className={'small ml-2'}>Task is obsolete</span>
        }
      </span>
    </>
}