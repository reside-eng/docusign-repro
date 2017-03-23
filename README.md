# Docusign Reproduction

> Environment for reproducing Docusign errors

# Getting Started

1. Clone repo and enter folder
1. Install dependencies using `npm install`
1. Fill in config in `config.js` (docusignConfig, contactsList[0].email, and resideAgentData.email are required)
1. Run Script by running `npm start`

**NOTE:** If you would like the script to re-run every time the code is changed you can run `npm run watch`

## What we are doing

Initial fields are irregularly placed into PDFs that have been generated
<!-- TODO: Add link to PDF that does not work -->

<!-- TODO: Add Image of good PDF -->


<!-- TODO: Point to docusign-simple.js file -->

## Expected Behavior
All inputs of any type are placed the same way regardless of what PDF is passed to Docusign API.


## Actual Behavior
Signature input is not placed where expected when PDFs with data injected are sent to Docusign API.

![Misaligned Signature](https://storage.googleapis.com/top-agent-prue-dev.appspot.com/docusign-repro/MisalignedSignature.png)

## What Has Been Tried
* Placing a signature in place of initial field - signature is correctly placed
* Sending a PDF without data injected - seems that coordinates work correctly since all fields are placed where expected

## Things To Note
* Only with PDFs that contain content
* We understand the dimensions of these PDFs are slightly different, but not sure how this would cause misaligned only of initial fields
