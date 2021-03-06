---
id: channel-api
title: Channel API
sidebar_label: Channel
---

The SocialHub Channel API allows creation and manipulation of Custom Channels.

We differentiate between "Custom" Channels that can be managed via the SocialHub APIs and Channels belonging to "official" Network Integrations maintained by the SocialHub Team.

## Creating Channels

Normally Custom Channels are created by the Customer using the [Channels Settings Page](https://socialhubio.zendesk.com/hc/en-us/articles/360015917114-Inbox-API-Einrichtung-und-technische-Dokumentation). But if a Manifest has been promoted to being [reusable](../integration#b-reusable-manifest) it will be [passed](manifest-api#channel-creation) a special temporary JWT allowing it to create Channels for the Customer using the `POST /channels` route.

This route may also be used to re-activate disabled Custom Channels (see [Manifest Channel reactivation callback](manifest-api#channel-reactivation)). For identifying an existing disabled Channel for reactivation, we first look for a Custom Channel with a matching `networkId`. If no Network ID is available for the Channel the `uniqueName` will be matched instead. If no matching Channel is found, a new one will be created instead. Also note that when re-activating a Channel, its previous access token will be overwritten and a new one will be returned.

### Example

Example Channel creation request made with the unix tool cURL:

```bash
curl -X POST "https://api.socialhub.io/channels?accesstoken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI1ZTczZjUyNDVhNDVkYTEwYjZlNjE0ZDgiLCJtYW5pZmVzdElkIjoiNWU3M2Y1NmM1YTQ1ZGExMGI2ZTYxNGRkIiwidXNlcklkIjoiNWU3M2Y1MjU1YTQ1ZGExMGI2ZTYxNGRhIiwib3JpZ2luIjoiaHR0cHM6Ly9hcHAuc29jaWFsaHViLmlvLyIsImlhdCI6MTU4ODg4NTcxOCwiZXhwIjoxNTg4ODg3NTE4fQ.-6I9tULlBouy9Rr0tlbbSkORMa8cAd70kl-KU1QdjfA" -d '
{
  "name": "Contact Form",
  "uniqueName": "Contact Form (at example.com)",
  "imageUrl": "https://example.com/logo.png",
  "networkId": "example.com-contact-form-1",
  "endpoint": {
    "expirationTime": "2020-05-07T21:05:17.861Z"
  }
}
' -H "Content-Type: application/json"
```

### Request

| Field           | Description                                                  |
|-----------------|--------------------------------------------------------------|
| `name`          | Human readable name of the Custom Channel. |
| `uniqueName`    | Human readable unique name of the Custom Channel. The value of this field must be unique for all Channels of the Customer. |
| `imageUrl`      | HTTPS URL to image displayed alongside the Channel name. |
| `networkId`     | Used to uniquely identify a Channel. Optional but recommended if possible. |
| `endpoint`      | Integration/Network specific data. |

#### `endpoint`

| Field            | Description                                                  |
|------------------|--------------------------------------------------------------|
| `expirationTime` | Optional future Date-Time when the Integration's access to the target Network will expire (if applicable). |
| `user`           | Optional information about the user on the target Network that granted access to the Integration (if applicable). |

#### `endpoint.user`

This information will be displayed on the Channels Settings page in your SocialHub Account. We encourage you to specify as much information as possible but none of the fields are required.

| Field            | Description                                                  |
|------------------|--------------------------------------------------------------|
| `id`             | Unique identifier of the user on the target Network. Example: If the Integration's target network was Facebook, this would be the Facebook User ID of the Facebook Account that was used to authenticate the Integration with. |
| `name`           | Human readable name of the user on the target Network. |
| `profileUrl`     | Link to the user on the target Network. |
| `profileImage`   | A HTTPS URL to the user's avatar photo on the target Network. |

### Responses

#### `HTTP 201 Created`

Represents the successful creation or reactivation of a Channel.

```
{
  "networkId": "example.com-contact-form-1",
  "endpoint": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI1ZTczZjUyNDVhNDVkYTEwYjZlNjE0ZDgiLCJjaGFubmVsSWQiOiI1ZWI0Nzk1NGE1NDViODJiNWI1MjJjY2UiLCJpYXQiOjE1ODg4ODU4NDR9.Dj8upq3l92nXMxkc_Z-BfOalgVJgOrxC0-Fns6upKaw",
    "expirationTime": "2021-05-07T21:05:17.861Z",
  },
  "name": "Contact Form",
  "uniqueName": "Contact Form (at example.com)",
  "imageUrl": "https://example.com/logo.png",
  "accountId": "5e73f5245a45da10b6e614d8",
  "_id": "5eb47954a545b82b5b522cce",
  "businessHours": null,
  "createdTime": "2020-05-07T21:10:44.509Z"
}
```

Any further requests regarding the created Channel should be made with the JWT returned in `endpoint.accessToken`.

The `_id` value is a unique identifier of a Channel within the SocialHub Platform. You might want to store it together with the access token.

#### `HTTP 403 Forbidden`

```
{
  "code": "ChannelLimitReached",
  "message": "Error: Account specific channel limit reached"
}
```

If a `ChannelLimitReached` error is returned, make sure to tell the Customer to get in touch with happy@socialhub.io in order to have their Channel limit raised.

#### `HTTP 409 Conflict`

```
{
  "code": "DuplicateChannel",
  "message": "Error: This channel has already been created in another SocialHub account"
}
```

If a `DuplicateChannel` error is returned, it means that there's already a Channel with the same `networkId` belonging to the same Manifest in another SocialHub Account. If your Manifest is reusable you should make sure to tell the user to contact support@socialhub.io to get help if this happens.

## Updating Channels

The `PATCH /channel` route allows partially updating the Channel belonging to the passed access token. When updating the Channel using this route its access token will stay the same.

### Example

Example Channel update request made with the unix tool cURL:

```bash
curl -X PATCH "https://api.socialhub.io/channel?accesstoken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI1ZTczZjUyNDVhNDVkYTEwYjZlNjE0ZDgiLCJjaGFubmVsSWQiOiI1ZWI0Nzk1NGE1NDViODJiNWI1MjJjY2UiLCJpYXQiOjE1ODg4ODU4NDR9.Dj8upq3l92nXMxkc_Z-BfOalgVJgOrxC0-Fns6upKaw" -d '
{
  "name": "Contact Form",
  "uniqueName": "Contact Form (at example.com)",
  "imageUrl": "https://example.com/new-logo.png",
  "endpoint": {
    "expirationTime": "2020-08-07T21:05:17.861Z"
  }
}
' -H "Content-Type: application/json"
```

### Request

Same parameters as during [Channel creation](#request).

Note that the `networkId` can't be changed in this route.

### Responses

#### `HTTP 200 OK`

Represents the successful update of the Channel.

```
{
  "_id": "5eb47954a545b82b5b522cce",
  "networkId": "example.com-contact-form-1",
  "endpoint": {
    "expirationTime": "2022-05-07T21:05:17.861Z",
  },
  "name": "Contact Form",
  "uniqueName": "Contact Form (at example.com)",
  "imageUrl": "https://example.com/new-logo.png",
  "accountId": "5e73f5245a45da10b6e614d8",
  "updatedTime": "2020-05-07T21:20:20.930Z",
  "businessHours": null,
  "createdTime": "2020-05-07T21:10:44.509Z"
}
```

Note that the JWT (`endpoint.accessToken`) will not be returned here.

## Disabling Channels

The `DELETE /channel` route can be used to deactivate the Channel belonging to the passed access token. After deactivation it's no longer possible to use the JWT and the Customer will be notified via mail that manual action is required in order to re-enable the Channel again (also see [Manifest Channel reactivation callback](manifest-api#channel-reactivation)).

A typical reason for disabling a Channel is the Integration loosing access to its target Network because a OAuth token has expired. In cases like these, the Customer must re-authenticate with the Network in order for the Integration to obtain a fresh access token.

To prevent data loss it's not possible for Integrations to trigger the actual deletion of Channels and their data. This can only be done by the Customer owning the Channel and its data.

### Example

Example Channel deactivation request made with the unix tool cURL:

```bash
curl -X DELETE "https://api.socialhub.io/channel?accesstoken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI1ZDUxZmE1NmIzMWM1Zjc5NWMwZGEzN2EiLCJtYW5pZmVzdElkIjoiNWQ1MWZhYTViMzFjNWY3OTVjMGRhMzdmIiwidXNlcklkIjoiNWQ1MWZhNTdiMzFjNWY3OTVjMGRhMzdjIiwiaWF0IjoxNTcwMDA5ODM0LCJleHAiOjE1NzAwMTE2MzR9.vT1c7Ni5tS87l1W8s-R_TOGozoFreQYMt2ZOPIAo4Nc"
```

### Responses

#### `HTTP 204 No Content`

If the Channel was successfully disabled, an empty response will be returned.

## WebHooks

### Channel Action: Disabled

If a Custom Channel was disabled via the SocialHub Channels Settings page and the Integration configured a [WebHook in the Manifest](../webhooks#registration), it will receive a channel_action event of type disabled:

```json
{
  "manifestId": "5cc1afd1d62ec72e8388cb45",
  "accountId": "5cb9003af1bb6808381d184d",
  "channelId": "5cc1afd1d62ec72e8388cb46",
  "events": {
    "channel_action": [
      {
        "channelId": "5cc1afd1d62ec72e8388cb46",
        "type": "disabled",
        "time": 1556201893268,
        "uuid": "4616f2f0-5069-4ee8-ad95-4c106c277eb3"
      }
    ]
  }
}
```
