# Docusign Reproduction

> Environment for reproducing Docusign errors

# Getting Started

1. Clone repo and enter folder
1. Install dependencies using `npm install`
1. Fill in config in `config.js` (docusignConfig, `contactsList[0].email`, and `resideAgentData.email` are required)
1. Run Script by running `npm start`

**NOTE:** If you would like the script to re-run every time the code is changed you can run `npm run watch`


# Initial Field Misalignment Error

We generate PDFs that have data within them (instead of using text tabs to insert data through Docusign).

PDFs that have data within them respond different than PDFs of just the document by itself (no data). Initial fields are irregularly placed into PDFs that have been generated, while normal Doc PDFs always respond as expected.

**Files:**

* [PDF Document](/static/Doc.pdf)
* [PDF Document With Data](/static/DocWithData.pdf)

The script places both files above into a single envelope (working document first) and sends to email provided in config.

## Expected Behavior
All inputs of any type are placed the same way regardless of what PDF is passed to Docusign API.

<!-- TODO: Add Image of good PDF -->
![Misaligned Signature](/static/AlignedWithNotes.png)


## Actual Behavior
Signature input is not placed where expected when PDFs with data injected are sent to Docusign API.

![Misaligned Signature](/static/MisalignedWithNotes.png)

## Things To Note
* Only with PDFs that contain content have alignment issue
* We understand the dimensions of these PDFs are slightly different ([here is a picture comparing the meta data](/static/MetaCompare.png)), but not sure how this would cause misaligned only of initial fields
