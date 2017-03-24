# Docusign Reproduction

> Environment for reproducing Docusign errors

# Getting Started

1. Clone repo and enter folder
1. Install dependencies using `npm install`
1. Fill in config in `src/config.js` (docusignConfig, `contactsList[0].email`, and `resideAgentData.email` are required)
1. Run Script by running `npm start`

**NOTE:** If you would like the script to re-run every time the code is changed you can run `npm run watch`

# The Problem: Signature/Initial Field Misalignment Error

We have two visually nearly identical PDFs, however, the initial field is placed in a different spot for both of them even though the documents appear the same.

![The Problem](/static/theproblem.png)

**Files:**

* [PDF Document - Good](/static/Doc.pdf)
* [PDF Document - Strange Placement](/static/DocWithData.pdf)

The script places both files above into a single envelope (working document first) and sends to email provided in config.

## Expected Behavior
All inputs of any type are placed the same way regardless of what PDF is passed to Docusign API.

<!-- TODO: Add Image of good PDF -->
![Misaligned Signature](/static/AlignedWithNotes.png)


## Actual Behavior
Signature/Initial input is not placed where expected when PDFs are sent to Docusign API.

![Misaligned Signature](/static/MisalignedWithNotes.png)

## Things To Note
* We understand the dimensions of these PDFs are slightly different ([here is a picture comparing the meta data](/static/MetaCompare.png)), but this should not result in inconsistent offset of signature/initial fields
