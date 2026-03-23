import React from "react";
import {Table} from "react-bootstrap";

export const ProcessInstanceLogs = () => {

  const logs = [
    {
      jobKey: "2251799863288757",
      step: "PhD fills the annual report",
      timestamp: "2026-03-20T10:00:00Z",
      user: "",
      action: "CREATED",
    },
    {
      jobKey: "2251799863288757",
      step: "PhD fills the annual report",
      timestamp: "2026-03-24T10:00:00Z",
      user: "184075",
      action: "REFRESHED",
    },
    {
      jobKey: "2251799863288757",
      step: "PhD fills the annual report",
      timestamp: "2026-03-24T10:00:00Z",
      user: "121453",
      action: "COMPLETED",
    },
    {
      jobKey: "7121799863288757",
      step: "Thesis director fills the annual report",
      timestamp: "2026-03-24T10:00:00Z",
      user: "",
      action: "CREATED",
    },
    {
      jobKey: "7121799863288757",
      step: "Thesis director fills the annual report",
      timestamp: "2026-03-24T10:00:00Z",
      user: "184075",
      action: "COMPLETED",
    },
  ];

  return <>
    <Table striped bordered hover>
      <thead>
      <tr>
        <th>Job</th>
        <th>Step</th>
        <th></th>
        <th>User</th>
        <th>Action</th>

      </tr>
      </thead>
      <tbody>
      { logs.map((log) => (
        <tr key={ log.id }>
          <td>{ log.jobKey }</td>
          <td>{ log.step }</td>
          <td>{ new Date(log.timestamp).toLocaleString('fr-CH') }</td>
          <td>{ log.user }</td>
          <td>{ log.action }</td>
        </tr>
      ))}
      </tbody>
    </Table>
  </>
}
