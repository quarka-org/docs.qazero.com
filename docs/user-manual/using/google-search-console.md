---
sidebar_position: 100
title: Google Search Console Integration
---

# Google Search Console Integration


This page explains how to connect QA ZERO with the Google Search Console API.  
After the connection is completed, Search Console data will be available in the **SEO Report** of AI Reports.

---

## Before you begin

Please check the following before starting:  

- Use **Google Chrome** (other browsers may not work correctly)  
- Sign in to Chrome with the same Google account used for Google Search Console  
- The connection cannot be completed with a different Google account  

You will also need the **Redirect URI** displayed in QA ZERO.  
Open **Settings** → **Google Integration** in advance.

---

## Setup steps

### 1. Create a Google Cloud project

1. Open https://console.cloud.google.com/cloud-resource-manager
2. Click **Create Project**
3. Enter a project name and create the project

Default settings can be used if needed.  

### 2. Enable the Google Search Console API

1. Open the menu in Google Cloud
2. Go to **APIs & Services** → **Library**
3. Search for **Google Search Console API**
4. Open the API page
5. Click **Enable**

### 3. Configure the OAuth consent screen

1. Open **OAuth consent screen**
2. Click **Get Started**
3. Enter the required information:
   - App name
   - User support email
4. Select **External**
5. Enter your contact email address
6. Complete the setup and create the consent screen

### 4. Create an OAuth 2.0 Client ID

1. Click **Create OAuth Client**
2. Select **Web Application**
3. Enter the following information:
   - Name
   - Authorized Redirect URI (use the Redirect URI from QA ZERO)
4. Create the client

Save the generated:  

- Client ID
- Client Secret

### 5. Publish the application

1. Open **Audience**
2. Click **Publish App**
3. Confirm the dialog

The application status will change to production.  

### 6. Configure QA ZERO

1. Open **Settings** → **Google Integration** in QA ZERO
2. Enter the **Client ID** and **Client Secret**
3. Click **Authenticate**

When Google prompts you:

1. Select the Google account associated with Search Console
2. Review the requested permissions
3. Click **Continue**

### 7. Complete the connection

When QA ZERO displays:

> Google API connection was successful.

the setup is complete.  
Search Console data will begin to be imported from the following day.  
You do not need to authenticate again unless the connection is removed or becomes invalid.  

---

## Troubleshooting

### "This app isn't verified"

This warning may appear because the application was created by you and has not been verified by Google.

Since the application is being used only to connect your own Google Search Console data to your own QA ZERO environment, this warning is expected.

1. Click **Advanced**
2. Continue to the application


### "Select what information you can access"

Choose only the required service:

- Google Search Console


### "Google API connection failed"

Possible causes include:

#### Expired access token

In some cases, the connection may succeed after some time even if an error message is displayed.  
Wait and check the QA ZERO admin screen again later.  
Do not refresh the authentication page during the process, as this may invalidate the authorization flow.  

#### Incorrect OAuth 2.0 settings

Review the OAuth 2.0 configuration in your Google Cloud project and verify that all settings are correct.
