// Sampled from https://www.npmjs.com/package/react-formio#event-props

export interface triggeringComponent {
  key: string;
}

export interface customEvent {
  type: string;  // event type
  component: triggeringComponent;  // triggering component
  data: object;  //data for component
  event: string;  // raw event
}
