# Capital Planning Maps

An online resource for better, more collaborative planning through data and technology.

## Development Setup

### 1. Install prerequisite tools

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (with npm)
  - This installation was tested using Node v14.15.0
- [Netlify CLI](https://docs.netlify.com/cli/get-started/)

### 2. Install frontend and backend packages

```
> git clone git@github.com:NYCPlanning/labs-maps-capital-planning.git
> yarn
```

### 3. Set up environment file

- Create the `development.env` file using variables stored on 1Password.

## One-click startup

At the root of this project, run

```
netlify dev
```

### 4. CMS

Add new tabs to this by adding markdown files the content/maps folder. Look at the other markdown files for examples of the structure. If a folder is added, it will group those into a nested dropdown tab.

### 5. Other Services
This rebuild leverages Netlify functions (https://www.netlify.com/products/functions/) to rearrange some styling in the iframe that is controlled by Carto.

Those functions can be found here: https://github.com/NYCPlanning/labs-maps-capital-planning/tree/main/functions

The main function, "proxy", is used to run the Carto embed iframe through and fix up some styling. 

The second function, "get-viz-json," is used to help with generating downloads by grabbing the protected visJSON data from Carto and generating the downloads.


