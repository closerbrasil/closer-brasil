URL: https://docs.replit.com/cloud-services/storage-and-databases/object-storage/typescript-api-reference
---
[Replit home page![light logo](https://mintlify.s3.us-west-1.amazonaws.com/replit/logo/light.svg)![dark logo](https://mintlify.s3.us-west-1.amazonaws.com/replit/logo/dark.svg)](https://docs.replit.com/)

Search or ask...

Ctrl K

Search...

Navigation

TypeScript API Reference

Object Storage Typescript SDK

## [​](https://docs.replit.com/cloud-services/storage-and-databases/object-storage/typescript-api-reference\#overview)  Overview

The `@replit/object-storage` package offers a TypeScript client library to interact with Object Storage. It provides a quick and efficient way to integrate Object Storage into Node.js applications. While it’s feasible to utilize Object Storage via the [Google Node.js Client for Cloud Storage](https://cloud.google.com/nodejs/reference/storage/latest) or the [Google Cloud Storage JSON API](https://cloud.google.com/storage/json_api), the Replit client library streamlines application development with Object Storage by eliminating the need for custom authentication logic and Bucket configuration.

This package is intended for server-side applications only. It leverages Node.js features and native filesystem functionalities, making it incompatible with browser environments.

## [​](https://docs.replit.com/cloud-services/storage-and-databases/object-storage/typescript-api-reference\#installation)  Installation

The Object Storage Typescript SDK is available via the `@replit/object-storage` package in [NPM](https://www.npmjs.com/package/@replit/object-storage).

You can install the Object Storage package by using one of the following methods:

### [​](https://docs.replit.com/cloud-services/storage-and-databases/object-storage/typescript-api-reference\#one-click-setup)  One-click Setup

Navigate to your Workspace, select **+** to add a new tab, and search for **Object Storage**. In the Object Storage pane, use the one-click setup **Install @replit/object-storage package** button to install the package.

![Install @replit/object-storage package](https://mintlify.s3.us-west-1.amazonaws.com/replit/images/hosting/object-storage/install-javascript.png)

### [​](https://docs.replit.com/cloud-services/storage-and-databases/object-storage/typescript-api-reference\#using-npm)  Using npm

You can install the package via the shell using npm:

Copy

```
npm install @replit/object-storage

```

### [​](https://docs.replit.com/cloud-services/storage-and-databases/object-storage/typescript-api-reference\#using-yarn)  Using yarn

Copy

```
yarn add @replit/object-storage

```

The library is compatible with [Bun](https://replit.com/@replit/Bun?v=1), [Deno](https://replit.com/@replit/Deno?v=1), and [NodeJS](https://replit.com/@replit/Nodejs?v=1) (Node version 14+).

## [​](https://docs.replit.com/cloud-services/storage-and-databases/object-storage/typescript-api-reference\#quick-start)  Quick Start

Follow this guide to set up the Object Storage TypeScript SDK and perform basic operations like adding, retrieving, listing, and deleting Objects in your Bucket.

### [​](https://docs.replit.com/cloud-services/storage-and-databases/object-storage/typescript-api-reference\#setup-a-client)  Setup a Client

Create a new client instance without any parameters:

Copy

```typescript
import { Client } from '@replit/object-storage';
const client = new Client();

```

### [​](https://docs.replit.com/cloud-services/storage-and-databases/object-storage/typescript-api-reference\#add-an-object)  Add an Object

Upload an Object by providing its name and contents:

Copy

```typescript
const { ok, error } = await client.uploadFromText('file.txt', "Hello World!")
if (!ok) {
    // ... handle the error ...
}

```

### [​](https://docs.replit.com/cloud-services/storage-and-databases/object-storage/typescript-api-reference\#get-an-object)  Get an Object

Retrieve an Object’s contents as text:

Copy

```typescript
const { ok, value, error } = await client.downloadAsText('file.txt');
if (!ok) {
    // ... handle the error ...
}
console.log(value);
// > "Hello World!"

```

### [​](https://docs.replit.com/cloud-services/storage-and-databases/object-storage/typescript-api-reference\#list-the-objects-in-the-bucket)  List the Objects in the Bucket

List all Objects within the Bucket:

Copy

```typescript
const { ok, value, error } = await client.list();
if (!ok) {
    // ... handle the error ...
}
console.log(value);
// > [{ name: 'file.txt' }]

```

### [​](https://docs.replit.com/cloud-services/storage-and-databases/object-storage/typescript-api-reference\#delete-an-object)  Delete an Object

Delete an Object from the Bucket:

Copy

```typescript
const { ok, error } = await client.delete("file.txt");
if (!ok) {
    // ... handle the error ...
}

```

Was this page helpful?

YesNo

[Previous](https://docs.replit.com/cloud-services/storage-and-databases/object-storage/python-api-reference/object) [Classes\\
\\
Next](https://docs.replit.com/cloud-services/storage-and-databases/object-storage/typescript-api-reference/classes)

On this page

- [Overview](https://docs.replit.com/cloud-services/storage-and-databases/object-storage/typescript-api-reference#overview)
- [Installation](https://docs.replit.com/cloud-services/storage-and-databases/object-storage/typescript-api-reference#installation)
- [One-click Setup](https://docs.replit.com/cloud-services/storage-and-databases/object-storage/typescript-api-reference#one-click-setup)
- [Using npm](https://docs.replit.com/cloud-services/storage-and-databases/object-storage/typescript-api-reference#using-npm)
- [Using yarn](https://docs.replit.com/cloud-services/storage-and-databases/object-storage/typescript-api-reference#using-yarn)
- [Quick Start](https://docs.replit.com/cloud-services/storage-and-databases/object-storage/typescript-api-reference#quick-start)
- [Setup a Client](https://docs.replit.com/cloud-services/storage-and-databases/object-storage/typescript-api-reference#setup-a-client)
- [Add an Object](https://docs.replit.com/cloud-services/storage-and-databases/object-storage/typescript-api-reference#add-an-object)
- [Get an Object](https://docs.replit.com/cloud-services/storage-and-databases/object-storage/typescript-api-reference#get-an-object)
- [List the Objects in the Bucket](https://docs.replit.com/cloud-services/storage-and-databases/object-storage/typescript-api-reference#list-the-objects-in-the-bucket)
- [Delete an Object](https://docs.replit.com/cloud-services/storage-and-databases/object-storage/typescript-api-reference#delete-an-object)

![Install @replit/object-storage package](https://docs.replit.com/cloud-services/storage-and-databases/object-storage/typescript-api-reference)