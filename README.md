# Temporal event and constraint modeler

This project uses [bpmn-js](https://github.com/bpmn-io/bpmn-js) to implement a modeler that includes temporal events and temporal constraints for BPMN 2.0 process diagrams. Temporal constraints allow to express durations (upper-bound, lower-bound) between temporal events. 
This is done by extending the BPMN standard, in particular events and associations. 

## Installing and building

You need a [NodeJS](http://nodejs.org) development stack with [npm](https://npmjs.org) installed to build the project.

First, clone this project. 

To install all project dependencies, execute

```
npm install
```

Build the application via

```
npm run build
```

Start the application on port 8080
```
npm start
```
